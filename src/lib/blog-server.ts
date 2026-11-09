import "server-only"

import { cache } from "react"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"

import {
    type BlogPostRow,
    type BlogPostSummaryRow,
    toBlogPost,
    toBlogPostSummary,
} from "@/lib/blog"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

const BLOG_POST_SUMMARY_COLUMNS = [
    "id",
    "version",
    "title",
    "slug",
    "summary",
    "tags",
    "status",
    "kind",
    "series",
    "project",
    "related_ids",
    "reading_minutes",
    "cover_url",
    "published_at",
    "created_at",
    "updated_at",
].join(",")

const queryPublishedBlogPosts = unstable_cache(async () => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
        .from("blog_posts")
        .select(BLOG_POST_SUMMARY_COLUMNS)
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("updated_at", { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return ((data ?? []) as unknown as BlogPostSummaryRow[]).map(toBlogPostSummary)
}, ["published-blog-posts"], { revalidate: 300, tags: ["blog-posts"] })

const queryLatestPublishedBlogPost = unstable_cache(async () => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
        .from("blog_posts")
        .select(BLOG_POST_SUMMARY_COLUMNS)
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        throw new Error(error.message)
    }

    return data ? toBlogPostSummary(data as unknown as BlogPostSummaryRow) : null
}, ["latest-published-blog-post"], { revalidate: 300, tags: ["blog-posts"] })

const queryPublishedBlogPostBySlug = unstable_cache(async (slug: string) => {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .eq("slug", slug)
        .maybeSingle()

    if (error) {
        throw new Error(error.message)
    }

    return data ? toBlogPost(data as BlogPostRow) : null
}, ["published-blog-post-by-slug"], { revalidate: 300, tags: ["blog-posts"] })

export const getPublishedBlogPosts = cache(queryPublishedBlogPosts)
export const getLatestPublishedBlogPost = cache(queryLatestPublishedBlogPost)

export const getPublishedBlogPostBySlug = cache(async (slug: string) => {
    const post = await queryPublishedBlogPostBySlug(slug)
    if (!post) {
        notFound()
    }
    return post
})

export const getRelatedPublishedBlogPosts = cache(async (post: { id: string; relatedIds?: string[]; series?: string | null; project?: string | null; tags: string[] }, limit = 3) => {
    const posts = await queryPublishedBlogPosts()
    const explicitOrder = new Map((post.relatedIds ?? []).map((id, index) => [id, index]))

    return posts
        .filter((candidate) => candidate.id !== post.id)
        .map((candidate) => {
            const explicit = explicitOrder.has(candidate.id)
            const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length
            const sameSeries = Boolean(post.series && candidate.series === post.series)
            const sameProject = Boolean(post.project && candidate.project === post.project)
            const score = (explicit ? 100 - (explicitOrder.get(candidate.id) ?? 0) : 0)
                + (sameSeries ? 20 : 0)
                + (sameProject ? 12 : 0)
                + sharedTags * 3

            return { candidate, score }
        })
        .filter(({ score }) => score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, limit)
        .map(({ candidate }) => candidate)
})

export const getAdjacentPublishedBlogPosts = cache(async (postId: string, series?: string | null) => {
    const posts = (await queryPublishedBlogPosts()).filter((post) => {
        if (series) return post.series === series
        return true
    })
    const index = posts.findIndex((post) => post.id === postId)

    return {
        newer: index > 0 ? posts[index - 1] : null,
        older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
    }
})
