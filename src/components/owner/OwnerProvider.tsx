"use client"

import { useRouter } from "next/navigation"
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"

import { toBlogPostSummary, type BlogPostSummary, type BlogPostSummaryRow } from "@/lib/blog"

const POST_SUMMARY_COLUMNS =
    "id,version,title,slug,summary,tags,status,kind,series,project,related_ids,reading_minutes,cover_url,published_at,created_at,updated_at"

export type OwnerStatus = "unknown" | "checking" | "visitor" | "owner"

export type OwnerContextValue = {
    status: OwnerStatus
    email: string | null
    supabase: SupabaseClient | null
    drafts: BlogPostSummary[]
    creating: boolean
    toolbarSlot: HTMLElement | null
    setToolbarSlot: (element: HTMLElement | null) => void
    refreshDrafts: () => Promise<void>
    patchDraft: (id: string, patch: Partial<BlogPostSummary>) => void
    createPage: () => Promise<void>
    signOut: () => Promise<void>
}

export const OwnerContext = createContext<OwnerContextValue | null>(null)

function hasSupabaseAuthCookie() {
    return document.cookie.split(";").some((cookie) => /^\s*sb-[^=]+-auth-token/.test(cookie))
}

export default function OwnerProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [status, setStatus] = useState<OwnerStatus>("unknown")
    const [email, setEmail] = useState<string | null>(null)
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
    const [drafts, setDrafts] = useState<BlogPostSummary[]>([])
    const [creating, setCreating] = useState(false)
    const [toolbarSlot, setToolbarSlot] = useState<HTMLElement | null>(null)

    useEffect(() => {
        // Visitors never carry a Supabase session cookie, so they skip loading the client entirely.
        if (!hasSupabaseAuthCookie()) {
            setStatus("visitor")
            return
        }

        let cancelled = false
        setStatus("checking")
        import("@/lib/supabase/client")
            .then(async ({ createSupabaseBrowserClient }) => {
                const client = createSupabaseBrowserClient()
                const { data } = await client.auth.getSession()
                const user = data.session?.user
                if (cancelled) return
                if (user?.app_metadata?.blog_role === "admin") {
                    setSupabase(client)
                    setEmail(user.email ?? null)
                    setStatus("owner")
                } else {
                    setStatus("visitor")
                }
            })
            .catch(() => {
                if (!cancelled) setStatus("visitor")
            })

        return () => {
            cancelled = true
        }
    }, [])

    const refreshDrafts = useCallback(async () => {
        if (!supabase) return
        const { data, error } = await supabase
            .from("blog_posts")
            .select(POST_SUMMARY_COLUMNS)
            .eq("status", "draft")
            .order("updated_at", { ascending: false })
        if (!error) setDrafts(((data ?? []) as unknown as BlogPostSummaryRow[]).map(toBlogPostSummary))
    }, [supabase])

    useEffect(() => {
        if (status === "owner") void refreshDrafts()
    }, [status, refreshDrafts])

    const patchDraft = useCallback((id: string, patch: Partial<BlogPostSummary>) => {
        setDrafts((list) => list.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft)))
    }, [])

    const createPage = useCallback(async () => {
        if (!supabase || creating) return
        setCreating(true)
        const slug = `untitled-${Date.now().toString(36)}`
        const { error } = await supabase
            .from("blog_posts")
            .insert({ title: "Untitled", slug, summary: "", content: "", tags: [], status: "draft" })
        setCreating(false)
        if (error) {
            window.alert(`Could not create a page: ${error.message}`)
            return
        }
        void refreshDrafts()
        router.push(`/blog/${slug}`)
    }, [creating, refreshDrafts, router, supabase])

    const signOut = useCallback(async () => {
        await supabase?.auth.signOut()
        window.location.reload()
    }, [supabase])

    const value = useMemo<OwnerContextValue>(
        () => ({
            status,
            email,
            supabase,
            drafts,
            creating,
            toolbarSlot,
            setToolbarSlot,
            refreshDrafts,
            patchDraft,
            createPage,
            signOut,
        }),
        [status, email, supabase, drafts, creating, toolbarSlot, refreshDrafts, patchDraft, createPage, signOut],
    )

    return <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>
}

export function useOwner() {
    const context = useContext(OwnerContext)
    if (!context) throw new Error("useOwner must be used inside OwnerProvider")
    return context
}
