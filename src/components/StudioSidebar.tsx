import Link from "next/link"
import {
    BookOpenText,
    CircleDashed,
    Download,
    FileText,
    Files,
    LogOut,
    NotebookPen,
    Plus,
    Send,
} from "lucide-react"

import { createPostAction, logoutAction } from "@/app/studio/actions"
import { SectionLabel, SidebarHeader, SidebarLink, sidebarButtonClass } from "@/components/NotebookSidebarParts"
import type { BlogKind, BlogPostSummary, BlogStatus } from "@/lib/blog"

export type StudioFilters = {
    status?: BlogStatus
    kind?: BlogKind
}

export function studioHref(filters: StudioFilters) {
    const params = new URLSearchParams()
    if (filters.status) params.set("status", filters.status)
    if (filters.kind) params.set("kind", filters.kind)
    const query = params.toString()
    return query ? `/studio?${query}` : "/studio"
}

function DocumentLink({ post, active }: { post: BlogPostSummary; active: boolean }) {
    const Icon = post.kind === "note" ? NotebookPen : FileText
    return (
        <Link
            href={`/studio/${post.id}`}
            aria-current={active ? "page" : undefined}
            title={post.title}
            className={`flex items-center gap-2 rounded-md px-2 py-[4px] text-[13px] transition-colors ${
                active ? "bg-black/[0.07] font-medium text-black" : "text-black/56 hover:bg-black/[0.04] hover:text-black"
            }`}
        >
            <Icon className="h-3.5 w-3.5 shrink-0 text-black/34" />
            <span className="min-w-0 flex-1 truncate">{post.title || "Untitled"}</span>
            {post.status === "draft" ? (
                <span aria-label="Draft" className="h-1.5 w-1.5 shrink-0 rounded-full border border-black/35" />
            ) : null}
        </Link>
    )
}

export default function StudioSidebar({
    posts,
    email,
    activeId,
    filters,
}: {
    posts: BlogPostSummary[]
    email: string
    activeId?: string
    filters?: StudioFilters
}) {
    const onList = !activeId && Boolean(filters)
    const recent = [...posts].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, 15)
    const count = (predicate: (post: BlogPostSummary) => boolean) => posts.filter(predicate).length
    const isActive = (target: StudioFilters) =>
        onList && filters?.status === target.status && filters?.kind === target.kind

    return (
        <nav aria-label="Studio" className="flex h-full flex-col">
            <div className="px-3 pt-3">
                <SidebarHeader href="/studio" title="Notebook Studio" />
                <form action={createPostAction} className="mt-0.5 space-y-px">
                    <button type="submit" name="kind" value="essay" className={sidebarButtonClass}>
                        <Plus className="h-4 w-4 text-black/42" />
                        New essay
                    </button>
                    <button type="submit" name="kind" value="note" className={sidebarButtonClass}>
                        <Plus className="h-4 w-4 text-black/42" />
                        New note
                    </button>
                </form>
            </div>

            <div data-lenis-prevent className="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-6">
                <div className="space-y-px">
                    <SidebarLink href="/studio" icon={<Files className="h-4 w-4" />} label="All documents" count={posts.length} active={isActive({})} />
                    <SidebarLink
                        href={studioHref({ status: "draft" })}
                        icon={<CircleDashed className="h-4 w-4" />}
                        label="Drafts"
                        count={count((post) => post.status === "draft")}
                        active={isActive({ status: "draft" })}
                    />
                    <SidebarLink
                        href={studioHref({ status: "published" })}
                        icon={<Send className="h-4 w-4" />}
                        label="Published"
                        count={count((post) => post.status === "published")}
                        active={isActive({ status: "published" })}
                    />
                </div>

                <SectionLabel>Type</SectionLabel>
                <div className="space-y-px">
                    <SidebarLink
                        href={studioHref({ kind: "essay" })}
                        icon={<FileText className="h-4 w-4" />}
                        label={<>Essays <span className="text-black/34">文章</span></>}
                        count={count((post) => post.kind === "essay")}
                        active={isActive({ kind: "essay" })}
                    />
                    <SidebarLink
                        href={studioHref({ kind: "note" })}
                        icon={<NotebookPen className="h-4 w-4" />}
                        label={<>Notes <span className="text-black/34">笔记</span></>}
                        count={count((post) => post.kind === "note")}
                        active={isActive({ kind: "note" })}
                    />
                </div>

                {recent.length ? (
                    <>
                        <SectionLabel>Recently edited</SectionLabel>
                        <div className="space-y-px">
                            {recent.map((post) => (
                                <DocumentLink key={post.id} post={post} active={post.id === activeId} />
                            ))}
                        </div>
                    </>
                ) : null}
            </div>

            <div className="space-y-px border-t border-black/[0.07] px-3 py-3">
                <SidebarLink href="/blog" icon={<BookOpenText className="h-4 w-4" />} label="View public notebook" />
                <SidebarLink href="/studio/export" prefetch={false} icon={<Download className="h-4 w-4" />} label="Export Markdown" />
                <form action={logoutAction}>
                    <button type="submit" className={sidebarButtonClass} title={email}>
                        <LogOut className="h-4 w-4 text-black/42" />
                        <span className="min-w-0 flex-1 truncate">Sign out</span>
                        <span className="max-w-[110px] truncate text-[11px] text-black/32">{email}</span>
                    </button>
                </form>
            </div>
        </nav>
    )
}
