-- The notebook has a single post type, so `kind` is removed everywhere it was referenced.

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
        setweight(to_tsvector('simple', coalesce(new.content, '')), 'C');

    return new;
end;
$$;

drop trigger if exists set_blog_post_search_document on public.blog_posts;

create trigger set_blog_post_search_document
before insert or update of title, summary, tags, series, project, content
on public.blog_posts
for each row
execute function public.set_blog_post_search_document();

create or replace function public.archive_blog_post_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    restoring_existing_revision boolean;
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
        new.series,
        new.project,
        new.related_ids
    ) then
        select exists (
            select 1
            from public.blog_post_revisions as revision
            where revision.post_id = old.id
                and row(
                    revision.slug,
                    revision.title,
                    revision.summary,
                    revision.content,
                    revision.tags,
                    revision.cover_url,
                    revision.series,
                    revision.project,
                    revision.related_ids
                ) is not distinct from row(
                    new.slug,
                    new.title,
                    new.summary,
                    new.content,
                    new.tags,
                    new.cover_url,
                    new.series,
                    new.project,
                    new.related_ids
                )
        ) into restoring_existing_revision;

        if old.status is distinct from new.status
            or restoring_existing_revision
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

drop function if exists public.search_published_blog_posts(text, text, integer);

create function public.search_published_blog_posts(
    search_query text default '',
    result_limit integer default 12
)
returns table (
    id uuid,
    slug text,
    title text,
    summary text,
    tags text[],
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
        select
            btrim(coalesce(search_query, '')) as needle,
            case
                when btrim(coalesce(search_query, '')) = '' then null
                else websearch_to_tsquery('simple', search_query)
            end as query
    ), ranked as (
        select
            post.*,
            case
                when parsed.query is null then 0::real
                else (
                    ts_rank_cd(post.search_document, parsed.query)
                    + case when strpos(lower(post.title), lower(parsed.needle)) > 0 then 0.8 else 0 end
                    + case when strpos(lower(post.summary), lower(parsed.needle)) > 0 then 0.35 else 0 end
                    + case when strpos(lower(post.content), lower(parsed.needle)) > 0 then 0.15 else 0 end
                )::real
            end as result_rank,
            case
                when parsed.query is null then post.summary
                when post.search_document @@ parsed.query then ts_headline(
                    'simple',
                    post.content,
                    parsed.query,
                    'MaxWords=24, MinWords=8, ShortWord=2, HighlightAll=false'
                )
                else left(post.content, 220)
            end as result_snippet
        from public.blog_posts as post
        cross join parsed
        where post.status = 'published'
            and (
                parsed.query is null
                or post.search_document @@ parsed.query
                or strpos(lower(post.title), lower(parsed.needle)) > 0
                or strpos(lower(post.summary), lower(parsed.needle)) > 0
                or strpos(lower(post.content), lower(parsed.needle)) > 0
                or strpos(lower(array_to_string(post.tags, ' ')), lower(parsed.needle)) > 0
                or strpos(lower(coalesce(post.series, '')), lower(parsed.needle)) > 0
                or strpos(lower(coalesce(post.project, '')), lower(parsed.needle)) > 0
            )
    )
    select
        ranked.id,
        ranked.slug,
        ranked.title,
        ranked.summary,
        ranked.tags,
        ranked.series,
        ranked.project,
        ranked.reading_minutes,
        ranked.published_at,
        ranked.updated_at,
        ranked.result_rank as rank,
        ranked.result_snippet as snippet
    from ranked
    order by ranked.result_rank desc, ranked.published_at desc nulls last, ranked.updated_at desc
    limit least(greatest(result_limit, 1), 30);
$$;

grant execute on function public.search_published_blog_posts(text, integer)
to anon, authenticated;

drop index if exists public.blog_posts_status_kind_published_idx;

create index if not exists blog_posts_status_published_idx
    on public.blog_posts (status, published_at desc);

alter table public.blog_posts drop constraint if exists blog_posts_kind_check;
alter table public.blog_posts drop column if exists kind;

alter table public.blog_post_revisions drop constraint if exists blog_post_revisions_kind_check;
alter table public.blog_post_revisions drop column if exists kind;

-- Rebuild search documents without the old kind token; keep updated_at untouched.
alter table public.blog_posts disable trigger set_blog_posts_updated_at;

update public.blog_posts
set search_document =
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('simple', array_to_string(coalesce(tags, '{}'), ' ')), 'B') ||
    setweight(to_tsvector('simple', coalesce(series, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(project, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'C');

alter table public.blog_posts enable trigger set_blog_posts_updated_at;
