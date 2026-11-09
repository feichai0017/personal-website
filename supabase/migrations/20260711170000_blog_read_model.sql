create or replace function public.calculate_blog_reading_minutes(value text)
returns integer
language sql
immutable
set search_path = ''
as $$
    select greatest(
        1,
        ceil(
            (
                case
                    when btrim(coalesce(value, '')) = '' then 0
                    else coalesce(
                        array_length(
                            regexp_split_to_array(btrim(value), E'\\s+'),
                            1
                        ),
                        0
                    )
                end
                + char_length(
                    regexp_replace(
                        coalesce(value, ''),
                        '[^一-鿿]',
                        '',
                        'g'
                    )
                )
            )::numeric / 220
        )::integer
    );
$$;

alter table public.blog_posts
    add column if not exists reading_minutes integer;

alter table public.blog_posts disable trigger set_blog_posts_updated_at;

update public.blog_posts
set reading_minutes = public.calculate_blog_reading_minutes(content)
where reading_minutes is null;

alter table public.blog_posts enable trigger set_blog_posts_updated_at;

alter table public.blog_posts
    alter column reading_minutes set default 1,
    alter column reading_minutes set not null;

alter table public.blog_posts
    drop constraint if exists blog_posts_reading_minutes_check;

alter table public.blog_posts
    add constraint blog_posts_reading_minutes_check
    check (reading_minutes between 1 and 1440);

create or replace function public.set_blog_post_reading_minutes()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.reading_minutes = public.calculate_blog_reading_minutes(new.content);
    return new;
end;
$$;

drop trigger if exists set_blog_post_reading_minutes on public.blog_posts;

create trigger set_blog_post_reading_minutes
before insert or update of content on public.blog_posts
for each row
execute function public.set_blog_post_reading_minutes();
