import { NextRequest } from "next/server"

import type { BlogSearchResult } from "@/lib/blog"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

type SearchRow = {
    id: string
    slug: string
    title: string
    summary: string
    tags: string[] | null
    series: string | null
    project: string | null
    reading_minutes: number
    published_at: string | null
    updated_at: string
    rank: number
    snippet: string | null
}

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 160) ?? ""
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.rpc("search_published_blog_posts", {
        search_query: query,
        result_limit: 12,
    })

    if (error) {
        return Response.json({ error: error.message, results: [] }, { status: 500 })
    }

    const results: BlogSearchResult[] = ((data ?? []) as SearchRow[]).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        tags: row.tags ?? [],
        series: row.series,
        project: row.project,
        readingMinutes: Math.max(1, Number(row.reading_minutes) || 1),
        publishedAt: row.published_at,
        updatedAt: row.updated_at,
        rank: Number(row.rank) || 0,
        snippet: (row.snippet || row.summary).replace(/<\/?b>/g, ""),
    }))

    return Response.json({ query, results }, {
        headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
    })
}
