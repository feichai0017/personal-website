export type BlogStatus = "published" | "draft"
export type BlogKind = "essay" | "note" | "lab"

export const BLOG_TOPICS = [
    "AI Infra",
    "Large Models",
    "Distributed Systems",
    "Storage Engines",
    "Databases",
    "Agent Systems",
    "Engineering",
] as const

export function getBlogTopic(post: { series?: string | null; tags: string[] }) {
    if (post.series?.trim()) return post.series.trim()

    const topicRules: Array<[string, string[]]> = [
        ["AI Infra", ["AI Infra", "Inference", "KV Cache", "ML Systems"]],
        ["Large Models", ["LLM", "Large Models", "Transformer", "Training"]],
        ["Distributed Systems", ["Distributed Systems", "Consensus", "Raft", "Paxos"]],
        ["Storage Engines", ["Storage Engine", "Storage", "ART", "Holt"]],
        ["Databases", ["Database", "DuckDB", "SQL", "Query Engine"]],
        ["Agent Systems", ["Agent Interface", "Agent", "Filesystem"]],
    ]

    return topicRules.find(([, tags]) => tags.some((tag) => post.tags.includes(tag)))?.[0] ?? "Engineering"
}

export type BlogPostSummary = {
    id: string
    version: number
    title: string
    slug: string
    summary: string
    tags: string[]
    status: BlogStatus
    kind: BlogKind
    series?: string | null
    project?: string | null
    relatedIds: string[]
    readingMinutes: number
    updatedAt: string
    createdAt?: string
    publishedAt?: string | null
    coverUrl?: string | null
}

export type BlogPost = BlogPostSummary & {
    content: string
}

export type BlogSearchResult = Pick<
    BlogPostSummary,
    "id" | "slug" | "title" | "summary" | "tags" | "kind" | "series" | "project" | "readingMinutes" | "publishedAt" | "updatedAt"
> & {
    rank: number
    snippet: string
}

export type BlogPostRow = {
    id: string
    version: number
    title: string
    slug: string
    summary: string
    content: string
    tags: string[]
    status: BlogStatus
    kind: BlogKind
    series: string | null
    project: string | null
    related_ids: string[]
    reading_minutes: number
    cover_url: string | null
    published_at: string | null
    created_at: string
    updated_at: string
}

export type BlogPostSummaryRow = Omit<BlogPostRow, "content">

export type EditablePostFields = {
    title: string
    slug: string
    summary: string
    content: string
    tags: string[]
    topic: string
    coverUrl: string | null
}

export function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)
}

export function toBlogPost(row: BlogPostRow): BlogPost {
    return {
        id: row.id,
        version: row.version,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        content: row.content,
        tags: row.tags ?? [],
        status: row.status,
        kind: row.kind ?? "essay",
        series: row.series,
        project: row.project,
        relatedIds: row.related_ids ?? [],
        readingMinutes: Math.max(1, Number(row.reading_minutes) || 1),
        coverUrl: row.cover_url,
        publishedAt: row.published_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export function toBlogPostSummary(row: BlogPostSummaryRow): BlogPostSummary {
    return {
        id: row.id,
        version: row.version,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        tags: row.tags ?? [],
        status: row.status,
        kind: row.kind ?? "essay",
        series: row.series,
        project: row.project,
        relatedIds: row.related_ids ?? [],
        readingMinutes: Math.max(1, Number(row.reading_minutes) || 1),
        coverUrl: row.cover_url,
        publishedAt: row.published_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}

export function buildPostUpdate(fields: EditablePostFields, fallbackSlug: string) {
    const title = fields.title.trim().slice(0, 240) || "Untitled"
    return {
        title,
        slug: slugify(fields.slug) || slugify(title) || fallbackSlug,
        summary: fields.summary.trim().slice(0, 800),
        content: fields.content,
        tags: Array.from(new Set(fields.tags.map((tag) => tag.trim()).filter(Boolean))).slice(0, 12),
        series: fields.topic.trim().slice(0, 120) || null,
        cover_url: fields.coverUrl?.trim() || null,
    }
}
