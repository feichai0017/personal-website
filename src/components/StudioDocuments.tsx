import Link from "next/link"
import { ArrowUpRight, FilePlus2, FileText, NotebookPen } from "lucide-react"

import { createPostAction } from "@/app/studio/actions"
import KindBadge from "@/components/KindBadge"
import KnowledgeMobileNav from "@/components/KnowledgeMobileNav"
import NotebookTopBar, { type NotebookCrumb } from "@/components/NotebookTopBar"
import StudioShell from "@/components/StudioShell"
import StudioSidebar, { studioHref, type StudioFilters } from "@/components/StudioSidebar"
import StudioStatusBadge from "@/components/StudioStatusBadge"
import { BLOG_KIND_META, getBlogTopic, type BlogPostSummary } from "@/lib/blog"
import { formatPostDate } from "@/lib/knowledge"

function formatEdited(value: string) {
    const date = new Date(value)
    const sameYear = date.getFullYear() === new Date().getFullYear()
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: sameYear ? undefined : "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

function describe(filters: StudioFilters) {
    if (filters.status === "draft") return { title: "Drafts", description: "Private until you publish them to the notebook." }
    if (filters.status === "published") return { title: "Published", description: "Live on the public notebook. Edits save straight through." }
    if (filters.kind) {
        const meta = BLOG_KIND_META[filters.kind]
        return { title: meta.plural, description: meta.blurb }
    }
    return { title: "All documents", description: "Every essay and note, drafts included. Only you can see this workspace." }
}

function StatusTabs({ filters, posts }: { filters: StudioFilters; posts: BlogPostSummary[] }) {
    const scoped = posts.filter((post) => !filters.kind || post.kind === filters.kind)
    const tabs: Array<{ status?: StudioFilters["status"]; label: string; count: number }> = [
        { label: "All", count: scoped.length },
        { status: "draft", label: "Drafts", count: scoped.filter((post) => post.status === "draft").length },
        { status: "published", label: "Published", count: scoped.filter((post) => post.status === "published").length },
    ]

    return (
        <div role="tablist" aria-label="Filter by status" className="flex items-center gap-1 border-b border-black/[0.08]">
            {tabs.map((tab) => {
                const active = filters.status === tab.status
                return (
                    <Link
                        key={tab.label}
                        role="tab"
                        aria-selected={active}
                        href={studioHref({ kind: filters.kind, status: tab.status })}
                        className={`relative -mb-px flex items-center gap-1.5 border-b-2 px-2.5 pb-2.5 pt-1 text-[14px] transition-colors ${
                            active ? "border-black font-medium text-black" : "border-transparent text-black/48 hover:text-black/80"
                        }`}
                    >
                        {tab.label}
                        <span className="text-[11px] tabular-nums text-black/34">{tab.count}</span>
                    </Link>
                )
            })}
        </div>
    )
}

function DocumentRow({ post }: { post: BlogPostSummary }) {
    const Icon = post.kind === "note" ? NotebookPen : FileText
    return (
        <li>
            <Link
                href={`/studio/${post.id}`}
                className="group grid gap-x-4 gap-y-1.5 border-b border-black/[0.06] px-2 py-3 transition-colors hover:bg-black/[0.025] md:grid-cols-[minmax(0,1fr)_84px_96px_150px_132px] md:items-center"
            >
                <span className="flex min-w-0 items-start gap-2.5">
                    <Icon className="mt-[3px] h-4 w-4 shrink-0 text-black/34" />
                    <span className="min-w-0">
                        <span className="block truncate text-[15px] font-medium text-black">{post.title || "Untitled"}</span>
                        <span className="mt-0.5 block truncate text-[13px] text-black/44">
                            {post.summary || "No summary yet"}
                        </span>
                    </span>
                </span>
                <span className="flex flex-wrap items-center gap-2 pl-[26px] md:contents md:pl-0">
                    <span><KindBadge kind={post.kind} /></span>
                    <span><StudioStatusBadge status={post.status} /></span>
                    <span className="truncate text-[13px] text-black/52">{getBlogTopic(post)}</span>
                    <span className="text-[12px] tabular-nums text-black/40 md:text-right md:text-[13px]">{formatEdited(post.updatedAt)}</span>
                </span>
            </Link>
        </li>
    )
}

export default function StudioDocuments({
    posts,
    filters,
    email,
}: {
    posts: BlogPostSummary[]
    filters: StudioFilters
    email: string
}) {
    const header = describe(filters)
    const visible = posts.filter((post) => {
        if (filters.status && post.status !== filters.status) return false
        if (filters.kind && post.kind !== filters.kind) return false
        return true
    })
    const drafts = posts.filter((post) => post.status === "draft").length
    const lastEdited = posts.reduce<string | null>((latest, post) => (!latest || post.updatedAt > latest ? post.updatedAt : latest), null)
    const sidebar = <StudioSidebar posts={posts} email={email} filters={filters} />
    const breadcrumbs: NotebookCrumb[] = [{ label: "Studio", href: "/studio" }]
    if (filters.kind) breadcrumbs.push({ label: BLOG_KIND_META[filters.kind].plural, href: studioHref({ kind: filters.kind }) })
    if (filters.status || !filters.kind) breadcrumbs.push({ label: header.title })

    return (
        <StudioShell sidebar={sidebar}>
            <NotebookTopBar leading={<KnowledgeMobileNav>{sidebar}</KnowledgeMobileNav>} breadcrumbs={breadcrumbs}>
                <Link
                    href="/blog"
                    target="_blank"
                    className="hidden h-8 items-center gap-1 rounded-lg px-2.5 text-[13px] text-black/56 transition hover:bg-black/[0.05] hover:text-black md:inline-flex"
                >
                    Public notebook
                    <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
            </NotebookTopBar>

            <main className="mx-auto w-full max-w-[1080px] px-5 pb-24 pt-10 md:px-10 md:pt-14">
                <header className="flex flex-wrap items-end justify-between gap-6">
                    <div className="min-w-0">
                        <div className="text-[13px] font-medium text-black/40">Studio</div>
                        <h1 className="mt-2 text-[34px] font-semibold leading-[1.15] tracking-[-0.025em] text-black md:text-[40px]">
                            {header.title}
                        </h1>
                        <p className="mt-2 max-w-xl text-[15px] leading-7 text-black/54">{header.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-black/40">
                            <span>{posts.length} documents</span>
                            <span aria-hidden>·</span>
                            <span>{drafts} {drafts === 1 ? "draft" : "drafts"}</span>
                            {lastEdited ? (
                                <>
                                    <span aria-hidden>·</span>
                                    <span>Last edited {formatPostDate(lastEdited, "short")}</span>
                                </>
                            ) : null}
                        </div>
                    </div>
                    <form action={createPostAction} className="flex gap-2">
                        <button
                            type="submit"
                            name="kind"
                            value="essay"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-[13px] font-medium text-[#f7f5f1] transition-colors hover:bg-black/80"
                        >
                            <FilePlus2 className="h-3.5 w-3.5" />
                            New essay
                        </button>
                        <button
                            type="submit"
                            name="kind"
                            value="note"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/12 bg-white px-3 py-2 text-[13px] font-medium text-black/72 transition-colors hover:border-black/30 hover:text-black"
                        >
                            <NotebookPen className="h-3.5 w-3.5" />
                            New note
                        </button>
                    </form>
                </header>

                <div className="mt-8">
                    <StatusTabs filters={filters} posts={posts} />
                </div>

                {visible.length ? (
                    <div className="mt-2">
                        <div className="hidden grid-cols-[minmax(0,1fr)_84px_96px_150px_132px] gap-x-4 border-b border-black/[0.08] px-2 py-2 text-[12px] text-black/40 md:grid">
                            <span className="pl-[26px]">Title</span>
                            <span>Type</span>
                            <span>Status</span>
                            <span>Topic</span>
                            <span className="text-right">Last edited</span>
                        </div>
                        <ul>
                            {visible.map((post) => (
                                <DocumentRow key={post.id} post={post} />
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-black/[0.14] px-6 py-14 text-center">
                        <FileText className="mx-auto h-6 w-6 text-black/30" />
                        <p className="mt-4 text-[15px] font-medium text-black/70">Nothing here yet.</p>
                        <p className="mx-auto mt-1.5 max-w-sm text-[14px] leading-6 text-black/44">
                            Start a new essay or note — it stays a private draft until you publish it.
                        </p>
                    </div>
                )}
            </main>
        </StudioShell>
    )
}
