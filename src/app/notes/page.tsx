import type { Metadata } from "next"

import KnowledgeIndex from "@/components/KnowledgeIndex"
import { getPublishedBlogPosts } from "@/lib/blog-server"

export const revalidate = 300

export const metadata: Metadata = {
    title: "Notes",
    description: "Working notes by Guocheng Song: paper readings, source-code walkthroughs, and learning records on systems and AI infra.",
    alternates: {
        canonical: "/notes",
        types: { "application/rss+xml": "/rss.xml" },
    },
}

type NotesPageProps = {
    searchParams: Promise<{ topic?: string; tag?: string; project?: string }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
    const [params, posts] = await Promise.all([searchParams, getPublishedBlogPosts()])

    return (
        <KnowledgeIndex
            posts={posts}
            filters={{ view: "note", topic: params.topic, tag: params.tag, project: params.project }}
        />
    )
}
