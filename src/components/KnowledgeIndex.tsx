import Image from "next/image"
import Link from "next/link"
import { FileText, NotebookPen, Rss, X } from "lucide-react"

import KindBadge from "@/components/KindBadge"
import KnowledgeShell, { type KnowledgeCrumb } from "@/components/KnowledgeShell"
import { BLOG_KIND_META, getBlogTopic, type BlogPostSummary } from "@/lib/blog"
import {
    buildKnowledgeIndex,
    filterKnowledgePosts,
    formatPostDate,
    groupPostsByYear,
    knowledgeHref,
    postDate,
    type KnowledgeFilters,
    type KnowledgeView,
} from "@/lib/knowledge"

function plural(count: number, noun: string) {
    return `${count} ${count === 1 ? noun : `${noun}s`}`
}

function describeIndex(filters: KnowledgeFilters, matching: number) {
    if (filters.topic) {
        return { kicker: "Topic", title: filters.topic, zh: null, description: `${plural(matching, "piece")} filed under ${filters.topic}.` }
    }
    if (filters.project) {
        return { kicker: "Project", title: filters.project, zh: null, description: `Design notes and write-ups from building ${filters.project}.` }
    }
    if (filters.tag) {
        return { kicker: "Tag", title: `#${filters.tag}`, zh: null, description: `${plural(matching, "piece")} tagged ${filters.tag}.` }
    }
    if (filters.view === "all") {
        return {
            kicker: "Notebook",
            title: "Writing & Notes",
            zh: "文章与笔记",
            description:
                "Essays and working notes on AI infra, large models, storage engines, databases, and distributed systems — written to make complex systems debuggable.",
        }
    }
    const meta = BLOG_KIND_META[filters.view]
    return { kicker: "Notebook", title: meta.plural, zh: meta.zh, description: meta.blurb }
}

function ViewTabs({ filters, counts }: { filters: KnowledgeFilters; counts: Record<KnowledgeView, number> }) {
    const tabs: Array<{ view: KnowledgeView; label: string }> = [
        { view: "all", label: "All" },
        { view: "essay", label: "Essays" },
        { view: "note", label: "Notes" },
    ]
    const scoped = Boolean(filters.topic || filters.tag || filters.project)

    return (
        <div role="tablist" aria-label="Filter by type" className="flex items-center gap-1 border-b border-black/[0.08]">
            {tabs.map((tab) => {
                const active = filters.view === tab.view
                return (
                    <Link
                        key={tab.view}
                        role="tab"
                        aria-selected={active}
                        href={knowledgeHref({ ...filters, view: tab.view })}
                        className={`relative -mb-px flex items-center gap-1.5 border-b-2 px-2.5 pb-2.5 pt-1 text-[14px] transition-colors ${
                            active ? "border-black font-medium text-black" : "border-transparent text-black/48 hover:text-black/80"
                        }`}
                    >
                        {tab.label}
                        {!scoped ? <span className="text-[11px] tabular-nums text-black/34">{counts[tab.view]}</span> : null}
                    </Link>
                )
            })}
        </div>
    )
}

function TopicChips({ filters, topics }: { filters: KnowledgeFilters; topics: Array<{ name: string; count: number }> }) {
    if (!topics.length) return null
    return (
        <div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 pt-4 [scrollbar-width:none] lg:hidden">
            {topics.map((topic) => {
                const active = filters.topic === topic.name
                return (
                    <Link
                        key={topic.name}
                        href={knowledgeHref({ view: filters.view, topic: active ? undefined : topic.name })}
                        className={`shrink-0 rounded-full border px-3 py-1 text-[13px] transition-colors ${
                            active ? "border-black bg-black text-[#f7f5f1]" : "border-black/10 bg-white/60 text-black/62 hover:border-black/24"
                        }`}
                    >
                        {topic.name} <span className={active ? "text-white/60" : "text-black/34"}>{topic.count}</span>
                    </Link>
                )
            })}
        </div>
    )
}

function ActiveFilter({ filters }: { filters: KnowledgeFilters }) {
    const label = filters.topic ? `Topic: ${filters.topic}` : filters.project ? `Project: ${filters.project}` : filters.tag ? `Tag: ${filters.tag}` : null
    if (!label) return null
    return (
        <Link
            href={knowledgeHref({ view: filters.view })}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-black/[0.06] px-2 py-1 text-[12px] text-black/66 transition-colors hover:bg-black/[0.1] hover:text-black"
        >
            {label}
            <X className="h-3 w-3" aria-label="Clear filter" />
        </Link>
    )
}

function CoverArt({ post }: { post: BlogPostSummary }) {
    if (post.coverUrl) {
        return (
            <div className="relative aspect-[2.6/1] overflow-hidden border-b border-black/[0.06] bg-[#ece8df]">
                <Image src={post.coverUrl} alt="" fill sizes="(min-width: 1024px) 860px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.015]" unoptimized />
            </div>
        )
    }
    return (
        <div className="relative aspect-[3.4/1] overflow-hidden border-b border-black/[0.06] bg-[#ece8df]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,10,10,0.05)_1px,transparent_1px)] bg-[length:16px_16px]" />
            <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border border-black/[0.08]" />
            <div className="absolute -right-2 -top-6 h-32 w-32 rounded-full border border-black/[0.08]" />
            <div className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.28em] text-black/40 md:left-7">
                {getBlogTopic(post)}
                {post.project ? ` · ${post.project}` : ""}
            </div>
        </div>
    )
}

function FeaturedPost({ post }: { post: BlogPostSummary }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group mt-8 block overflow-hidden rounded-2xl border border-black/[0.08] bg-[#fbfaf7] transition-[border-color,box-shadow] hover:border-black/[0.16] hover:shadow-[0_18px_50px_rgba(10,10,10,0.06)]"
        >
            <CoverArt post={post} />
            <div className="p-5 md:p-7">
                <div className="flex flex-wrap items-center gap-2 text-[13px] text-black/44">
                    <KindBadge kind={post.kind} />
                    <span>Latest</span>
                    <span aria-hidden>·</span>
                    <time dateTime={postDate(post)}>{formatPostDate(postDate(post))}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingMinutes} min read</span>
                </div>
                <h2 className="mt-3 text-[26px] font-semibold leading-[1.25] tracking-[-0.02em] text-black md:text-[32px]">
                    {post.title}
                </h2>
                {post.summary ? (
                    <p className="mt-3 line-clamp-3 max-w-3xl text-[15px] leading-7 text-black/58 md:text-base md:leading-8">{post.summary}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-md bg-black/[0.045] px-2 py-0.5 text-[12px] text-black/52">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}

function PostRow({ post }: { post: BlogPostSummary }) {
    return (
        <li>
            <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-x-6 gap-y-1.5 border-b border-black/[0.06] py-5 md:grid-cols-[84px_minmax(0,1fr)]"
            >
                <time dateTime={postDate(post)} className="text-[13px] tabular-nums text-black/38 md:pt-[3px]">
                    {formatPostDate(postDate(post), "day")}
                </time>
                <div className="min-w-0">
                    <h3 className="text-[18px] font-semibold leading-[1.45] tracking-[-0.012em] text-black decoration-black/25 underline-offset-4 group-hover:underline md:text-[20px]">
                        {post.title}
                    </h3>
                    {post.summary ? (
                        <p className="mt-1 line-clamp-2 text-[15px] leading-7 text-black/56">{post.summary}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-black/42">
                        <KindBadge kind={post.kind} />
                        <span>{getBlogTopic(post)}</span>
                        <span aria-hidden>·</span>
                        <span>{post.readingMinutes} min read</span>
                        {post.project ? (
                            <>
                                <span aria-hidden>·</span>
                                <span>{post.project}</span>
                            </>
                        ) : null}
                    </div>
                </div>
            </Link>
        </li>
    )
}

function PostTimeline({ posts }: { posts: BlogPostSummary[] }) {
    return (
        <div className="mt-6">
            {groupPostsByYear(posts).map((group) => (
                <section key={group.year} aria-label={`Published in ${group.year}`}>
                    <h2 className="sticky top-12 z-10 -mx-1 flex items-baseline gap-2 bg-[#f7f5f1]/95 px-1 pb-1 pt-5 backdrop-blur-sm">
                        <span className="text-[15px] font-semibold tabular-nums text-black/80">{group.year}</span>
                        <span className="text-[12px] text-black/34">{group.posts.length}</span>
                    </h2>
                    <ul>
                        {group.posts.map((post) => (
                            <PostRow key={post.id} post={post} />
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    )
}

function NoteGallery({ posts }: { posts: BlogPostSummary[] }) {
    return (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
                <li key={post.id}>
                    <Link
                        href={`/blog/${post.slug}`}
                        className="group flex h-full min-h-[190px] flex-col rounded-xl border border-black/[0.08] bg-[#fbfaf7] p-4 transition-colors hover:border-black/[0.18] hover:bg-white"
                    >
                        <div className="flex items-center justify-between gap-3 text-[12px] text-black/40">
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                                <NotebookPen className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                <span className="truncate">{getBlogTopic(post)}</span>
                            </span>
                            <time dateTime={post.updatedAt} className="shrink-0 tabular-nums">
                                {formatPostDate(post.updatedAt, "short")}
                            </time>
                        </div>
                        <h3 className="mt-3 line-clamp-3 text-[17px] font-semibold leading-[1.45] tracking-[-0.01em] text-black">
                            {post.title}
                        </h3>
                        {post.summary ? (
                            <p className="mt-1.5 line-clamp-3 text-[14px] leading-6 text-black/52">{post.summary}</p>
                        ) : null}
                        {post.tags.length ? (
                            <div className="mt-auto flex flex-wrap gap-1 pt-4">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="rounded bg-black/[0.045] px-1.5 py-0.5 text-[11px] text-black/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

function EmptyState({ filters }: { filters: KnowledgeFilters }) {
    const isNotes = filters.view === "note"
    return (
        <div className="mt-8 rounded-2xl border border-dashed border-black/[0.14] px-6 py-14 text-center">
            {isNotes ? <NotebookPen className="mx-auto h-6 w-6 text-black/30" /> : <FileText className="mx-auto h-6 w-6 text-black/30" />}
            <p className="mt-4 text-[15px] font-medium text-black/70">
                {isNotes ? "No notes published yet." : "Nothing here yet."}
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-[14px] leading-6 text-black/44">
                {isNotes
                    ? "Notes are shorter working records — paper readings, source-code walkthroughs, and things worth remembering. They will show up here as they are published."
                    : "Try another filter, or browse everything."}
            </p>
            {!isNotes || filters.topic || filters.tag || filters.project ? (
                <Link href="/blog" className="mt-5 inline-flex rounded-lg border border-black/12 bg-white px-3 py-1.5 text-[13px] text-black/70 hover:border-black/30 hover:text-black">
                    Browse everything
                </Link>
            ) : null}
        </div>
    )
}

export default function KnowledgeIndex({ posts, filters }: { posts: BlogPostSummary[]; filters: KnowledgeFilters }) {
    const index = buildKnowledgeIndex(posts)
    const matching = filterKnowledgePosts(posts, filters)
    const scoped = Boolean(filters.topic || filters.tag || filters.project)
    const header = describeIndex(filters, matching.length)
    const featured = !scoped && filters.view !== "note" ? matching.find((post) => post.kind === "essay") ?? null : null
    const stream = featured ? matching.filter((post) => post.id !== featured.id) : matching
    const lastUpdated = posts.reduce<string | null>((latest, post) => (!latest || post.updatedAt > latest ? post.updatedAt : latest), null)
    const topicCounts = filterKnowledgePosts(posts, { view: filters.view }).reduce<Map<string, number>>((counts, post) => {
        const topic = getBlogTopic(post)
        counts.set(topic, (counts.get(topic) ?? 0) + 1)
        return counts
    }, new Map())

    const breadcrumbs: KnowledgeCrumb[] = [{ label: "Notebook", href: "/blog" }]
    if (filters.view !== "all") breadcrumbs.push({ label: BLOG_KIND_META[filters.view].plural, href: knowledgeHref({ view: filters.view }) })
    if (scoped) breadcrumbs.push({ label: header.title })

    return (
        <KnowledgeShell posts={posts} location={filters} breadcrumbs={breadcrumbs}>
            <main className="mx-auto w-full max-w-[880px] px-5 pb-24 pt-10 md:px-10 md:pt-16">
                <header>
                    <div className="text-[13px] font-medium text-black/40">{header.kicker}</div>
                    <h1 className="mt-2 text-[34px] font-semibold leading-[1.15] tracking-[-0.025em] text-black md:text-[44px]">
                        {header.title}
                        {header.zh ? <span className="ml-3 align-middle text-[0.5em] font-normal tracking-normal text-black/34">{header.zh}</span> : null}
                    </h1>
                    <p className="mt-3 max-w-2xl text-[16px] leading-8 text-black/56">{header.description}</p>
                    {!scoped ? (
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-black/40">
                            <span>{plural(index.counts.essay, "essay")}</span>
                            <span aria-hidden>·</span>
                            <span>{plural(index.counts.note, "note")}</span>
                            <span aria-hidden>·</span>
                            <span>{plural(index.topics.length, "topic")}</span>
                            {lastUpdated ? (
                                <>
                                    <span aria-hidden>·</span>
                                    <span>Updated {formatPostDate(lastUpdated, "short")}</span>
                                </>
                            ) : null}
                            <a href="/rss.xml" className="inline-flex items-center gap-1 text-black/48 hover:text-black">
                                <Rss className="h-3 w-3" /> RSS
                            </a>
                        </div>
                    ) : null}
                    <ActiveFilter filters={filters} />
                </header>

                <div className="mt-8">
                    <ViewTabs filters={filters} counts={index.counts} />
                    <TopicChips filters={filters} topics={Array.from(topicCounts, ([name, count]) => ({ name, count }))} />
                </div>

                {matching.length === 0 ? (
                    <EmptyState filters={filters} />
                ) : filters.view === "note" ? (
                    <NoteGallery posts={matching} />
                ) : (
                    <>
                        {featured ? <FeaturedPost post={featured} /> : null}
                        {stream.length ? <PostTimeline posts={stream} /> : null}
                    </>
                )}
            </main>
        </KnowledgeShell>
    )
}
