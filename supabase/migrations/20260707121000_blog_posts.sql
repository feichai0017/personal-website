create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    summary text not null default '',
    content text not null default '',
    tags text[] not null default '{}',
    status text not null default 'draft' check (status in ('draft', 'published')),
    cover_url text,
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_updated_idx
    on public.blog_posts (status, updated_at desc);

create index if not exists blog_posts_slug_idx
    on public.blog_posts (slug);

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();

    if new.status = 'published' and new.published_at is null then
        new.published_at = now();
    end if;

    if new.status = 'draft' then
        new.published_at = null;
    end if;

    return new;
end;
$$;

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;

create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Published blog posts are readable" on public.blog_posts;

create policy "Published blog posts are readable"
on public.blog_posts
for select
using (status = 'published');
