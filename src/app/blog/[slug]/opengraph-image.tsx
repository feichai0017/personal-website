import { ImageResponse } from "next/og"

import { getBlogTopic } from "@/lib/blog"
import { getPublishedBlogPostBySlug } from "@/lib/blog-server"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPublishedBlogPostBySlug(slug)
    const topic = getBlogTopic(post)

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#f7f5f1",
                color: "#0a0a0a",
                padding: "54px 62px",
                fontFamily: "Arial, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{ position: "absolute", inset: 0, display: "flex", opacity: 0.12 }}>
                {Array.from({ length: 12 }, (_, index) => (
                    <div key={index} style={{ width: 100, height: "100%", borderRight: "1px solid #0a0a0a" }} />
                ))}
            </div>
            <div style={{ position: "absolute", right: -80, top: -80, width: 320, height: 320, border: "2px solid #0a0a0a", borderRadius: 320, opacity: 0.12 }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 18, letterSpacing: 5, textTransform: "uppercase" }}>
                <span>Guocheng Song / Blog</span>
                <span>AI Infra · Systems</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", maxWidth: 1010 }}>
                {(topic || post.project) ? (
                    <div style={{ display: "flex", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", marginBottom: 22, opacity: 0.56 }}>
                        {[topic, post.project].filter(Boolean).join(" / ")}
                    </div>
                ) : null}
                <div style={{ display: "flex", fontSize: post.title.length > 72 ? 58 : 72, lineHeight: 0.96, letterSpacing: -4, fontWeight: 600 }}>
                    {post.title}
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(10,10,10,0.25)", paddingTop: 24 }}>
                <div style={{ display: "flex", gap: 12 }}>
                    {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} style={{ border: "1px solid rgba(10,10,10,0.24)", borderRadius: 999, padding: "10px 16px", fontSize: 15, letterSpacing: 2, textTransform: "uppercase" }}>{tag}</span>
                    ))}
                </div>
                <span style={{ fontSize: 16, letterSpacing: 3, textTransform: "uppercase" }}>{post.readingMinutes} min read</span>
            </div>
        </div>,
        size,
    )
}
