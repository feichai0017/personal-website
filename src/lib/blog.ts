export type BlogStatus = "published" | "draft"
export type BlogKind = "essay" | "note" | "lab"

export const BLOG_KIND_META: Record<BlogKind, { label: string; plural: string; zh: string; href: string; blurb: string }> = {
    essay: {
        label: "Essay",
        plural: "Essays",
        zh: "文章",
        href: "/blog?kind=essay",
        blurb: "Long-form writing: arguments, designs, and postmortems worth reading start to finish.",
    },
    note: {
        label: "Note",
        plural: "Notes",
        zh: "笔记",
        href: "/notes",
        blurb: "Working notes: paper readings, source-code walkthroughs, and things I want to remember.",
    },
    lab: {
        label: "Lab",
        plural: "Lab",
        zh: "实验",
        href: "/blog?kind=lab",
        blurb: "Experiments and benchmarks.",
    },
}

export const EDITABLE_BLOG_KINDS = ["essay", "note"] as const satisfies readonly BlogKind[]

export function isBlogKind(value: unknown): value is BlogKind {
    return value === "essay" || value === "note" || value === "lab"
}

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

export type BlogRevisionSummary = {
    id: string
    version: number
    title: string
    kind: BlogKind
    createdAt: string
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

export type BlogPostInput = {
    title?: unknown
    slug?: unknown
    summary?: unknown
    content?: unknown
    tags?: unknown
    status?: unknown
    kind?: unknown
    series?: unknown
    project?: unknown
    relatedIds?: unknown
    coverUrl?: unknown
    publishedAt?: unknown
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

export function normalizeBlogPostInput(input: BlogPostInput, fallbackSlug = "untitled-post") {
    const title = typeof input.title === "string" && input.title.trim()
        ? input.title.trim()
        : "Untitled Post"
    const slugSource =
        typeof input.slug === "string" && input.slug.trim()
            ? input.slug
            : title || fallbackSlug
    const slug = slugify(slugSource) || fallbackSlug
    const summary = typeof input.summary === "string" ? input.summary.trim() : ""
    const content = typeof input.content === "string" ? input.content : ""
    const tags = Array.isArray(input.tags)
        ? input.tags
            .filter((tag): tag is string => typeof tag === "string")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []
    const status = input.status === "published" ? "published" : "draft"
    const kind: BlogKind = isBlogKind(input.kind) ? input.kind : "essay"
    const series = typeof input.series === "string" && input.series.trim()
        ? input.series.trim().slice(0, 120)
        : null
    const project = typeof input.project === "string" && input.project.trim()
        ? input.project.trim().slice(0, 120)
        : null
    const relatedIds = Array.isArray(input.relatedIds)
        ? Array.from(new Set(
            input.relatedIds.filter((value): value is string => typeof value === "string" && value.length > 0),
        )).slice(0, 12)
        : []
    const coverUrl = typeof input.coverUrl === "string" && input.coverUrl.trim()
        ? input.coverUrl.trim()
        : null
    const publishedAt = typeof input.publishedAt === "string" && input.publishedAt.trim()
        ? input.publishedAt.trim()
        : null

    return {
        title,
        slug,
        summary,
        content,
        tags,
        status,
        kind,
        series,
        project,
        related_ids: relatedIds,
        cover_url: coverUrl,
        published_at: status === "published" ? publishedAt : null,
    }
}
