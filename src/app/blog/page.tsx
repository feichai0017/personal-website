import type { Metadata } from "next"

import KnowledgeIndex from "@/components/KnowledgeIndex"
import { getPublishedBlogPosts } from "@/lib/blog-server"

export const revalidate = 300

export const metadata: Metadata = {
    title: "Notebook",
    description: "Writing on AI infra, large models, storage engines, distributed systems, and agent interfaces by Guocheng Song.",
    alternates: {
        canonical: "/blog",
        types: { "application/rss+xml": "/rss.xml" },
    },
}

export default async function BlogPage() {
    const posts = await getPublishedBlogPosts()
    return <KnowledgeIndex posts={posts} />
}
