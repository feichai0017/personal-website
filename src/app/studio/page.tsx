import StudioDocuments from "@/components/StudioDocuments"
import { requireBlogAdmin } from "@/lib/blog-admin"
import { isBlogKind, type BlogPostSummaryRow, toBlogPostSummary } from "@/lib/blog"

const STUDIO_POST_SUMMARY_COLUMNS = [
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

type StudioPageProps = {
    searchParams: Promise<{ status?: string; kind?: string }>
}

export default async function StudioPage({ searchParams }: StudioPageProps) {
    const [{ supabase, email }, params] = await Promise.all([requireBlogAdmin(), searchParams])
    const { data, error } = await supabase
        .from("blog_posts")
        .select(STUDIO_POST_SUMMARY_COLUMNS)
        .order("updated_at", { ascending: false })

    if (error) throw new Error(error.message)
    const posts = ((data ?? []) as unknown as BlogPostSummaryRow[]).map(toBlogPostSummary)

    return (
        <StudioDocuments
            posts={posts}
            email={email}
            filters={{
                status: params.status === "draft" || params.status === "published" ? params.status : undefined,
                kind: isBlogKind(params.kind) ? params.kind : undefined,
            }}
        />
    )
}
