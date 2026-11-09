import { getBlogTopic, type BlogPostSummary } from "@/lib/blog"

export type KnowledgeTopic = {
    name: string
    posts: BlogPostSummary[]
}

export function groupPostsByTopic(posts: BlogPostSummary[]): KnowledgeTopic[] {
    const topics = new Map<string, BlogPostSummary[]>()
    for (const post of posts) {
        const topic = getBlogTopic(post)
        topics.set(topic, [...(topics.get(topic) ?? []), post])
    }
    return Array.from(topics, ([name, topicPosts]) => ({ name, posts: topicPosts }))
        .sort((left, right) => right.posts.length - left.posts.length || left.name.localeCompare(right.name))
}

export function postDate(post: Pick<BlogPostSummary, "publishedAt" | "updatedAt">) {
    return post.publishedAt ?? post.updatedAt
}

export function formatPostDate(value: string | null | undefined, style: "long" | "short" | "day" = "long") {
    if (!value) return "Draft"
    const date = new Date(value)
    if (style === "day") {
        return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(date)
    }
    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: style === "long" ? "long" : "short",
        day: "numeric",
    }).format(date)
}

export function groupPostsByYear(posts: BlogPostSummary[]) {
    const groups = new Map<string, BlogPostSummary[]>()
    for (const post of posts) {
        const year = String(new Date(postDate(post)).getFullYear())
        groups.set(year, [...(groups.get(year) ?? []), post])
    }
    return Array.from(groups, ([year, yearPosts]) => ({ year, posts: yearPosts }))
}
