alter table public.blog_posts
    add column if not exists kind text not null default 'essay',
    add column if not exists series text,
    add column if not exists project text,
    add column if not exists related_ids uuid[] not null default '{}',
    add column if not exists search_document tsvector;

alter table public.blog_post_revisions
    add column if not exists kind text not null default 'essay',
    add column if not exists series text,
    add column if not exists project text,
    add column if not exists related_ids uuid[] not null default '{}';

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'blog_posts_kind_check'
            and conrelid = 'public.blog_posts'::regclass
    ) then
        alter table public.blog_posts
            add constraint blog_posts_kind_check
            check (kind in ('essay', 'note', 'lab'));
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'blog_post_revisions_kind_check'
            and conrelid = 'public.blog_post_revisions'::regclass
    ) then
        alter table public.blog_post_revisions
            add constraint blog_post_revisions_kind_check
            check (kind in ('essay', 'note', 'lab'));
    end if;
end;
$$;

create index if not exists blog_posts_status_kind_published_idx
    on public.blog_posts (status, kind, published_at desc);

create index if not exists blog_posts_related_ids_idx
    on public.blog_posts using gin (related_ids);

create index if not exists blog_posts_search_document_idx
    on public.blog_posts using gin (search_document);

create or replace function public.set_blog_post_search_document()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.search_document =
        setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(new.summary, '')), 'B') ||
        setweight(to_tsvector('simple', array_to_string(coalesce(new.tags, '{}'), ' ')), 'B') ||
        setweight(to_tsvector('simple', coalesce(new.series, '')), 'B') ||
        setweight(to_tsvector('simple', coalesce(new.project, '')), 'B') ||
        setweight(to_tsvector('simple', coalesce(new.kind, '')), 'C') ||
        setweight(to_tsvector('simple', coalesce(new.content, '')), 'C');

    return new;
end;
$$;

drop trigger if exists set_blog_post_search_document on public.blog_posts;

create trigger set_blog_post_search_document
before insert or update of title, summary, tags, series, project, kind, content
on public.blog_posts
for each row
execute function public.set_blog_post_search_document();

update public.blog_posts
set search_document =
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('simple', array_to_string(coalesce(tags, '{}'), ' ')), 'B') ||
    setweight(to_tsvector('simple', coalesce(series, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(project, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(kind, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'C')
where search_document is null;

create or replace function public.archive_blog_post_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if row(
        old.slug,
        old.title,
        old.summary,
        old.content,
        old.tags,
        old.status,
        old.cover_url,
        old.published_at,
        old.kind,
        old.series,
        old.project,
        old.related_ids
    ) is distinct from row(
        new.slug,
        new.title,
        new.summary,
        new.content,
        new.tags,
        new.status,
        new.cover_url,
        new.published_at,
        new.kind,
        new.series,
        new.project,
        new.related_ids
    ) then
        if old.status is distinct from new.status
            or not exists (
                select 1
                from public.blog_post_revisions
                where post_id = old.id
                    and created_at > now() - interval '5 minutes'
            )
        then
            insert into public.blog_post_revisions (
                post_id,
                version,
                slug,
                title,
                summary,
                content,
                tags,
                status,
                cover_url,
                published_at,
                created_by,
                kind,
                series,
                project,
                related_ids
            ) values (
                old.id,
                old.version,
                old.slug,
                old.title,
                old.summary,
                old.content,
                old.tags,
                old.status,
                old.cover_url,
                old.published_at,
                auth.uid(),
                old.kind,
                old.series,
                old.project,
                old.related_ids
            );
        end if;

        new.version = old.version + 1;
    end if;

    return new;
end;
$$;

create or replace function public.search_published_blog_posts(
    search_query text default '',
    content_kind text default null,
    result_limit integer default 12
)
returns table (
    id uuid,
    slug text,
    title text,
    summary text,
    tags text[],
    kind text,
    series text,
    project text,
    reading_minutes integer,
    published_at timestamptz,
    updated_at timestamptz,
    rank real,
    snippet text
)
language sql
stable
security definer
set search_path = public
as $$
    with parsed as (
        select case
            when btrim(coalesce(search_query, '')) = '' then null
            else websearch_to_tsquery('simple', search_query)
        end as query
    )
    select
        post.id,
        post.slug,
        post.title,
        post.summary,
        post.tags,
        post.kind,
        post.series,
        post.project,
        post.reading_minutes,
        post.published_at,
        post.updated_at,
        case
            when parsed.query is null then 0::real
            else ts_rank_cd(post.search_document, parsed.query)::real
        end as rank,
        case
            when parsed.query is null then post.summary
            else ts_headline(
                'simple',
                post.content,
                parsed.query,
                'MaxWords=24, MinWords=8, ShortWord=2, HighlightAll=false'
            )
        end as snippet
    from public.blog_posts as post
    cross join parsed
    where post.status = 'published'
        and (content_kind is null or post.kind = content_kind)
        and (parsed.query is null or post.search_document @@ parsed.query)
    order by
        case when parsed.query is null then 0 else ts_rank_cd(post.search_document, parsed.query) end desc,
        post.published_at desc nulls last,
        post.updated_at desc
    limit least(greatest(result_limit, 1), 30);
$$;

grant execute on function public.search_published_blog_posts(text, text, integer)
to anon, authenticated;
