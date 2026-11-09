import { BLOG_KIND_META, getBlogTopic, type BlogKind, type BlogPostSummary } from "@/lib/blog"

export type KnowledgeView = "all" | BlogKind

export type KnowledgeFilters = {
    view: KnowledgeView
    topic?: string
    tag?: string
    project?: string
}

export type KnowledgeLocation = KnowledgeFilters & {
    slug?: string
}

export type KnowledgeTopic = {
    name: string
    posts: BlogPostSummary[]
}

export type KnowledgeIndexData = {
    counts: Record<KnowledgeView, number>
    topics: KnowledgeTopic[]
    projects: Array<{ name: string; count: number }>
}

export function isKnowledgePath(pathname: string) {
    return pathname === "/blog" || pathname.startsWith("/blog/") || pathname === "/notes" || pathname.startsWith("/notes/")
}

export function buildKnowledgeIndex(posts: BlogPostSummary[]): KnowledgeIndexData {
    const topicMap = new Map<string, BlogPostSummary[]>()
    const projectMap = new Map<string, number>()

    for (const post of posts) {
        const topic = getBlogTopic(post)
        topicMap.set(topic, [...(topicMap.get(topic) ?? []), post])
        if (post.project) projectMap.set(post.project, (projectMap.get(post.project) ?? 0) + 1)
    }

    return {
        counts: {
            all: posts.length,
            essay: posts.filter((post) => post.kind === "essay").length,
            note: posts.filter((post) => post.kind === "note").length,
            lab: posts.filter((post) => post.kind === "lab").length,
        },
        topics: Array.from(topicMap, ([name, topicPosts]) => ({ name, posts: topicPosts }))
            .sort((left, right) => right.posts.length - left.posts.length || left.name.localeCompare(right.name)),
        projects: Array.from(projectMap, ([name, count]) => ({ name, count }))
            .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name)),
    }
}

export function filterKnowledgePosts(posts: BlogPostSummary[], filters: KnowledgeFilters) {
    return posts.filter((post) => {
        if (filters.view !== "all" && post.kind !== filters.view) return false
        if (filters.topic && getBlogTopic(post) !== filters.topic) return false
        if (filters.tag && !post.tags.includes(filters.tag)) return false
        if (filters.project && post.project !== filters.project) return false
        return true
    })
}

export function knowledgeHref(filters: Partial<KnowledgeFilters>) {
    const view = filters.view ?? "all"
    const params = new URLSearchParams()
    if (view !== "all" && view !== "note") params.set("kind", view)
    if (filters.topic) params.set("topic", filters.topic)
    if (filters.tag) params.set("tag", filters.tag)
    if (filters.project) params.set("project", filters.project)
    const query = params.toString()
    const base = view === "note" ? "/notes" : "/blog"
    return query ? `${base}?${query}` : base
}

export function knowledgeViewLabel(view: KnowledgeView) {
    return view === "all" ? "Everything" : BLOG_KIND_META[view].plural
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

export function parseKnowledgeView(value: string | undefined): KnowledgeView {
    return value === "essay" || value === "note" || value === "lab" ? value : "all"
}
