import type { MetadataRoute } from "next"

import { getPublishedBlogPosts } from "@/lib/blog-server"
import { absoluteUrl } from "@/lib/site"

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getPublishedBlogPosts()
    const notes = posts.filter((post) => post.kind === "note")

    return [
        {
            url: absoluteUrl("/"),
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: absoluteUrl("/blog"),
            lastModified: posts[0]?.updatedAt ? new Date(posts[0].updatedAt) : new Date(),
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: absoluteUrl("/notes"),
            lastModified: notes[0]?.updatedAt ? new Date(notes[0].updatedAt) : new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...posts.map((post) => ({
            url: absoluteUrl(`/blog/${post.slug}`),
            lastModified: new Date(post.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.72,
        })),
    ]
}
