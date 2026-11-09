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
                    revision.kind,
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
                    new.kind,
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
