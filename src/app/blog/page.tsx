import type { Metadata } from "next"

import KnowledgeIndex from "@/components/KnowledgeIndex"
import { getPublishedBlogPosts } from "@/lib/blog-server"
import { parseKnowledgeView } from "@/lib/knowledge"

export const revalidate = 300

export const metadata: Metadata = {
    title: "Writing & Notes",
    description: "Essays and working notes on AI infra, large models, storage engines, distributed systems, and agent interfaces by Guocheng Song.",
    alternates: {
        canonical: "/blog",
        types: { "application/rss+xml": "/rss.xml" },
    },
}

type BlogPageProps = {
    searchParams: Promise<{ kind?: string; topic?: string; tag?: string; project?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const [params, posts] = await Promise.all([searchParams, getPublishedBlogPosts()])

    return (
        <KnowledgeIndex
            posts={posts}
            filters={{
                view: parseKnowledgeView(params.kind),
                topic: params.topic,
                tag: params.tag,
                project: params.project,
            }}
        />
    )
}
