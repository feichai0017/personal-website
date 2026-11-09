import Link from "next/link"
import { ArrowUpRight, Download, FilePlus2, LogOut, NotebookPen, PencilLine } from "lucide-react"

import { createPostAction, logoutAction } from "@/app/studio/actions"
import { requireBlogAdmin } from "@/lib/blog-admin"
import { BLOG_KIND_META, getBlogTopic, type BlogPostSummaryRow, toBlogPostSummary } from "@/lib/blog"

const STUDIO_POST_SUMMARY_COLUMNS = [
    "id",
    "version",
    "title",
    "slug",
    "summary",
    "tags",
    "status",
    "kind",
    "series",
    "project",
    "related_ids",
    "reading_minutes",
    "cover_url",
    "published_at",
    "created_at",
    "updated_at",
].join(",")

function formatDate(value?: string | null) {
    if (!value) return "not published"
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value))
}

export default async function StudioPage() {
    const { supabase, email } = await requireBlogAdmin()
    const { data, error } = await supabase
        .from("blog_posts")
        .select(STUDIO_POST_SUMMARY_COLUMNS)
        .order("updated_at", { ascending: false })

    if (error) throw new Error(error.message)
    const posts = ((data ?? []) as unknown as BlogPostSummaryRow[]).map(toBlogPostSummary)
    const publishedCount = posts.filter((post) => post.status === "published").length

    return (
        <main className="min-h-screen px-4 pb-20 pt-4 md:px-6">
            <header className="sticky top-4 z-30 mx-auto flex w-full max-w-[1520px] flex-wrap items-center justify-between gap-4 rounded-full border border-black/10 bg-[#fbfaf7]/92 px-5 py-3 shadow-[0_12px_38px_rgba(10,10,10,0.07)] backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em]">GS / Studio</span>
                    <span className="hidden h-4 w-px bg-black/15 sm:block" />
                    <span className="hidden text-xs text-black/42 sm:block">{email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/studio/export"
                        prefetch={false}
                        className="hidden items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:border-black/30 md:inline-flex"
                    >
                        Export <Download className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                        href="/blog"
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:border-black/30"
                    >
                        Public blog <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            aria-label="Sign out"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:border-black/30"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                        </button>
                    </form>
                </div>
            </header>

            <section className="mx-auto mt-10 w-full max-w-[1520px]">
                <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">
                            Private publishing surface
                        </div>
                        <h1 className="mt-5 max-w-4xl text-6xl font-medium leading-[0.88] tracking-[-0.065em] md:text-8xl">
                            Drafts waiting to become public.
                        </h1>
                    </div>
                    <div className="rounded-[32px] border border-black/10 bg-[#fbfaf7] p-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-black/10 bg-white p-4">
                                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-black/38">Documents</div>
                                <div className="mt-3 text-4xl tracking-[-0.06em]">{String(posts.length).padStart(2, "0")}</div>
                            </div>
                            <div className="rounded-2xl border border-black/10 bg-white p-4">
                                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-black/38">Published</div>
                                <div className="mt-3 text-4xl tracking-[-0.06em]">{String(publishedCount).padStart(2, "0")}</div>
                            </div>
                        </div>
                        <form action={createPostAction} className="mt-3 grid grid-cols-2 gap-2">
                            <button
                                type="submit"
                                name="kind"
                                value="essay"
                                className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-black px-4 py-3.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white transition hover:bg-black/80"
                            >
                                <FilePlus2 className="h-4 w-4" />
                                New essay
                            </button>
                            <button
                                type="submit"
                                name="kind"
                                value="note"
                                className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-black/14 bg-white px-4 py-3.5 font-mono text-[9px] uppercase tracking-[0.2em] text-black transition hover:border-black/40"
                            >
                                <NotebookPen className="h-4 w-4" />
                                New note
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-14 border-y border-black/10">
                    <div className="grid grid-cols-[70px_minmax(0,1fr)_150px] gap-4 border-b border-black/10 px-3 py-4 font-mono text-[9px] uppercase tracking-[0.22em] text-black/38">
                        <span>Index</span>
                        <span>Document</span>
                        <span className="text-right">State</span>
                    </div>
                    {posts.map((post, index) => (
                        <Link
                            key={post.id}
                            href={`/studio/${post.id}`}
                            className="group grid gap-5 border-b border-black/10 px-3 py-7 transition-colors last:border-b-0 hover:bg-[#fbfaf7] md:grid-cols-[70px_minmax(0,1fr)_150px]"
                        >
                            <span className="font-mono text-[10px] tracking-[0.22em] text-black/32">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <PencilLine className="h-4 w-4 shrink-0 text-black/30" />
                                    <h2 className="truncate text-3xl font-medium tracking-[-0.045em] md:text-4xl">
                                        {post.title}
                                    </h2>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-black/36">
                                    <span className="rounded-full border border-black/12 px-2 py-0.5 text-black/56">{BLOG_KIND_META[post.kind]?.label ?? post.kind}</span>
                                    <span>topic · {getBlogTopic(post)}</span>
                                    {post.project ? <span>project · {post.project}</span> : null}
                                </div>
                                <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-7 text-black/48">
                                    {post.summary || "No summary yet."}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {post.tags.slice(0, 5).map((tag) => (
                                        <span key={tag} className="rounded-full border border-black/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-black/44">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="md:text-right">
                                <span className={`inline-flex rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] ${post.status === "published" ? "bg-black text-white" : "border border-black/12 text-black/50"}`}>
                                    {post.status}
                                </span>
                                <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-black/32">
                                    {formatDate(post.updatedAt)}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    )
}
