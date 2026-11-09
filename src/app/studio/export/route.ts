import { requireBlogAdmin } from "@/lib/blog-admin"

export const dynamic = "force-dynamic"

function yamlValue(value: string | null) {
    return value ? JSON.stringify(value) : "null"
}

export async function GET() {
    const { supabase } = await requireBlogAdmin()
    const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, summary, content, tags, status, kind, series, project, related_ids, cover_url, published_at, created_at, updated_at, version")
        .order("updated_at", { ascending: false })

    if (error) throw new Error(error.message)

    const exportedAt = new Date()
    const sections = (data ?? []).map((post) => `<!-- file: ${post.slug}.md -->
---
id: ${post.id}
title: ${yamlValue(post.title)}
slug: ${yamlValue(post.slug)}
summary: ${yamlValue(post.summary)}
status: ${post.status}
topic: ${yamlValue(post.series)}
project: ${yamlValue(post.project)}
tags: ${JSON.stringify(post.tags ?? [])}
related_ids: ${JSON.stringify(post.related_ids ?? [])}
cover_url: ${yamlValue(post.cover_url)}
published_at: ${yamlValue(post.published_at)}
created_at: ${yamlValue(post.created_at)}
updated_at: ${yamlValue(post.updated_at)}
version: ${post.version}
---

${post.content.trim()}
`)

    const body = `# Guocheng Song blog export

Exported at ${exportedAt.toISOString()}.
Each document starts with a \`file\` marker and portable frontmatter. Asset URLs remain absolute so the bundle can be imported without rewriting content.

${sections.join("\n\n---\n\n")}`
    const date = exportedAt.toISOString().slice(0, 10)

    return new Response(body, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Content-Disposition": `attachment; filename="guocheng-song-knowledge-${date}.md"`,
            "Cache-Control": "private, no-store",
        },
    })
}
