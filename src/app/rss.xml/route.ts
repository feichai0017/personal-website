import { getPublishedBlogPosts } from "@/lib/blog-server"
import { getBlogTopic } from "@/lib/blog"
import { absoluteUrl } from "@/lib/site"

export const revalidate = 300

function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
}

export async function GET() {
    const posts = await getPublishedBlogPosts()
    const items = posts.map((post) => {
        const url = absoluteUrl(`/blog/${post.slug}`)
        const publishedAt = post.publishedAt ?? post.createdAt ?? post.updatedAt

        return `
            <item>
                <title>${escapeXml(post.title)}</title>
                <link>${url}</link>
                <guid isPermaLink="true">${url}</guid>
                <pubDate>${new Date(publishedAt).toUTCString()}</pubDate>
                <description>${escapeXml(post.summary)}</description>
                <category>${escapeXml(getBlogTopic(post))}</category>
                ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
            </item>`
    }).join("")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
                <title>Guocheng Song — Blog</title>
                <link>${absoluteUrl("/blog")}</link>
                <description>Writing on large models, AI infra, storage engines, databases, and distributed systems.</description>
                <language>en</language>
                <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
                ${items}
            </channel>
        </rss>`

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
    })
}
