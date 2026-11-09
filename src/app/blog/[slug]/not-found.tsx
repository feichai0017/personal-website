import KnowledgeShell from "@/components/KnowledgeShell"
import MissingOrDraft from "@/components/owner/MissingOrDraft"
import { getPublishedBlogPosts } from "@/lib/blog-server"

export default async function BlogPostNotFound() {
    const posts = await getPublishedBlogPosts()

    return (
        <KnowledgeShell posts={posts} breadcrumbs={[{ label: "Notebook", href: "/blog" }, { label: "Page" }]}>
            <MissingOrDraft />
        </KnowledgeShell>
    )
}
