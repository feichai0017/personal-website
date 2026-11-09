import Link from "next/link"
import { ArrowLeft, ChevronRight, FileText, House, Rss, Search } from "lucide-react"

import { KnowledgeSearchButton } from "@/components/KnowledgeCommandPalette"
import { SectionLabel, SidebarHeader, SidebarLink } from "@/components/NotebookSidebarParts"
import { OwnerAccountLink, OwnerDrafts, OwnerNewPageButton } from "@/components/owner/OwnerSidebar"
import type { BlogPostSummary } from "@/lib/blog"
import type { KnowledgeTopic } from "@/lib/knowledge"

function PostLink({ post, active }: { post: BlogPostSummary; active: boolean }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            aria-current={active ? "page" : undefined}
            title={post.title}
            className={`flex items-center gap-2 rounded-md px-2 py-[4px] text-[13px] transition-colors ${
                active ? "bg-black/[0.07] font-medium text-black" : "text-black/56 hover:bg-black/[0.04] hover:text-black"
            }`}
        >
            <FileText className="h-3.5 w-3.5 shrink-0 text-black/34" />
            <span className="truncate">{post.title}</span>
        </Link>
    )
}

export default function KnowledgeSidebar({
    topics,
    postCount,
    activeSlug,
    onIndex,
}: {
    topics: KnowledgeTopic[]
    postCount: number
    activeSlug?: string
    onIndex?: boolean
}) {
    const expandAll = topics.length <= 5

    return (
        <nav aria-label="Notebook" className="flex h-full flex-col">
            <div className="space-y-px px-3 pt-3">
                <SidebarHeader href="/blog" />
                <KnowledgeSearchButton className="flex w-full items-center gap-2.5 rounded-lg px-2 py-[5px] text-[14px] text-black/56 transition-colors hover:bg-black/[0.04] hover:text-black">
                    <Search className="h-4 w-4 text-black/42" />
                    <span className="flex-1 text-left">Search</span>
                    <kbd className="font-mono text-[10px] text-black/32">⌘K</kbd>
                </KnowledgeSearchButton>
                <SidebarLink href="/blog" icon={<House className="h-4 w-4" />} label="Home" count={postCount} active={onIndex} />
                <OwnerNewPageButton />
            </div>

            <div data-lenis-prevent className="mt-1 min-h-0 flex-1 overflow-y-auto px-3 pb-6">
                <OwnerDrafts />

                {topics.length ? <SectionLabel>Pages</SectionLabel> : null}
                <div className="space-y-px">
                    {topics.map((topic) => {
                        const containsActive = topic.posts.some((post) => post.slug === activeSlug)
                        return (
                            <details key={topic.name} open={expandAll || containsActive} className="group/topic">
                                <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg py-[5px] pl-1 pr-2 text-[14px] text-black/66 transition-colors hover:bg-black/[0.04] hover:text-black [&::-webkit-details-marker]:hidden">
                                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-black/34 transition-transform group-open/topic:rotate-90" />
                                    <span className="min-w-0 flex-1 truncate pl-1">{topic.name}</span>
                                    <span className="text-[11px] tabular-nums text-black/32">{topic.posts.length}</span>
                                </summary>
                                <div className="ml-[13px] space-y-px border-l border-black/[0.08] py-0.5 pl-2">
                                    {topic.posts.map((post) => (
                                        <PostLink key={post.id} post={post} active={post.slug === activeSlug} />
                                    ))}
                                </div>
                            </details>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-px border-t border-black/[0.07] px-3 py-3">
                <SidebarLink href="/" icon={<ArrowLeft className="h-4 w-4" />} label="Back to portfolio" />
                <a
                    href="/rss.xml"
                    className="flex items-center gap-2.5 rounded-lg px-2 py-[5px] text-[14px] text-black/62 transition-colors hover:bg-black/[0.04] hover:text-black"
                >
                    <Rss className="h-4 w-4 text-black/42" />
                    RSS feed
                </a>
                <OwnerAccountLink />
            </div>
        </nav>
    )
}
