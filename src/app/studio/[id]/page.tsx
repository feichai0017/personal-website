import { notFound } from "next/navigation"

import StudioEditor from "@/components/StudioEditor"
import StudioSidebar from "@/components/StudioSidebar"
import { requireBlogAdmin } from "@/lib/blog-admin"
import {
    type BlogPostRow,
    type BlogPostSummaryRow,
    type BlogRevisionSummary,
    toBlogPost,
    toBlogPostSummary,
} from "@/lib/blog"

type StudioEditorPageProps = {
    params: Promise<{ id: string }>
}

export default async function StudioEditorPage({ params }: StudioEditorPageProps) {
    const { id } = await params
    const { supabase, email } = await requireBlogAdmin()
    const [{ data, error }, { data: relatedRows, error: relatedError }, { data: revisionRows, error: revisionError }] = await Promise.all([
        supabase
            .from("blog_posts")
            .select("*")
            .eq("id", id)
            .maybeSingle(),
        supabase
            .from("blog_posts")
            .select("id, version, title, slug, summary, tags, status, kind, series, project, related_ids, reading_minutes, cover_url, published_at, created_at, updated_at")
            .neq("id", id)
            .order("updated_at", { ascending: false }),
        supabase
            .from("blog_post_revisions")
            .select("id, version, title, kind, created_at")
            .eq("post_id", id)
            .order("created_at", { ascending: false })
            .limit(12),
    ])

    if (error) throw new Error(error.message)
    if (relatedError) throw new Error(relatedError.message)
    if (revisionError) throw new Error(revisionError.message)
    if (!data) notFound()

    const relatedPosts = ((relatedRows ?? []) as unknown as BlogPostSummaryRow[]).map(toBlogPostSummary)
    const revisions = ((revisionRows ?? []) as Array<{ id: string; version: number; title: string; kind: BlogRevisionSummary["kind"]; created_at: string }>).map((revision) => ({
        id: revision.id,
        version: Number(revision.version),
        title: revision.title,
        kind: revision.kind,
        createdAt: revision.created_at,
    }))

    const post = toBlogPost(data as BlogPostRow)
    const sidebar = <StudioSidebar posts={[post, ...relatedPosts]} email={email} activeId={post.id} />

    return <StudioEditor post={post} relatedPosts={relatedPosts} revisions={revisions} sidebar={sidebar} />
}
