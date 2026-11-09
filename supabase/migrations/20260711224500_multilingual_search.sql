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
            and (content_kind is null or post.kind = content_kind)
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
        ranked.kind,
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

grant execute on function public.search_published_blog_posts(text, text, integer)
to anon, authenticated;
