create or replace function public.is_blog_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
    select coalesce(
        (auth.jwt() -> 'app_metadata' ->> 'blog_role') = 'admin',
        false
    );
$$;

grant execute on function public.is_blog_admin() to anon, authenticated;

alter table public.blog_posts
    add column if not exists version bigint not null default 1;

create table if not exists public.blog_post_revisions (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null references public.blog_posts(id) on delete cascade,
    version bigint not null,
    slug text not null,
    title text not null,
    summary text not null default '',
    content text not null default '',
    tags text[] not null default '{}',
    status text not null check (status in ('draft', 'published')),
    cover_url text,
    published_at timestamptz,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now()
);

create index if not exists blog_post_revisions_post_created_idx
    on public.blog_post_revisions (post_id, created_at desc);

alter table public.blog_post_revisions enable row level security;

drop policy if exists "Blog admins can read revisions" on public.blog_post_revisions;
create policy "Blog admins can read revisions"
on public.blog_post_revisions
for select
to authenticated
using ((select public.is_blog_admin()));

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
        old.published_at
    ) is distinct from row(
        new.slug,
        new.title,
        new.summary,
        new.content,
        new.tags,
        new.status,
        new.cover_url,
        new.published_at
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
                created_by
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
                auth.uid()
            );
        end if;

        new.version = old.version + 1;
    end if;

    return new;
end;
$$;

drop trigger if exists archive_blog_post_revision on public.blog_posts;
create trigger archive_blog_post_revision
before update on public.blog_posts
for each row
execute function public.archive_blog_post_revision();

drop policy if exists "Published blog posts are readable" on public.blog_posts;
create policy "Published blog posts are readable"
on public.blog_posts
for select
to anon, authenticated
using (status = 'published' or (select public.is_blog_admin()));

drop policy if exists "Blog admins can create posts" on public.blog_posts;
create policy "Blog admins can create posts"
on public.blog_posts
for insert
to authenticated
with check ((select public.is_blog_admin()));

drop policy if exists "Blog admins can update posts" on public.blog_posts;
create policy "Blog admins can update posts"
on public.blog_posts
for update
to authenticated
using ((select public.is_blog_admin()))
with check ((select public.is_blog_admin()));

drop policy if exists "Blog admins can delete posts" on public.blog_posts;
create policy "Blog admins can delete posts"
on public.blog_posts
for delete
to authenticated
using ((select public.is_blog_admin()));

insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
) values (
    'blog-assets',
    'blog-assets',
    true,
    10485760,
    array[
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/webp'
    ]
)
on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Blog assets are publicly readable" on storage.objects;
create policy "Blog assets are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'blog-assets');

drop policy if exists "Blog admins can upload assets" on storage.objects;
create policy "Blog admins can upload assets"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'blog-assets'
    and (select public.is_blog_admin())
);

drop policy if exists "Blog admins can update assets" on storage.objects;
create policy "Blog admins can update assets"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'blog-assets'
    and (select public.is_blog_admin())
)
with check (
    bucket_id = 'blog-assets'
    and (select public.is_blog_admin())
);

drop policy if exists "Blog admins can delete assets" on storage.objects;
create policy "Blog admins can delete assets"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'blog-assets'
    and (select public.is_blog_admin())
);
