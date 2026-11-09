import Link from "next/link"
import {
    ArrowLeft,
    Boxes,
    ChevronRight,
    FileText,
    LayoutList,
    LockKeyhole,
    NotebookPen,
    Rss,
    Search,
} from "lucide-react"

import { KnowledgeSearchButton } from "@/components/KnowledgeCommandPalette"
import { SectionLabel, SidebarHeader, SidebarLink } from "@/components/NotebookSidebarParts"
import { BLOG_KIND_META, type BlogPostSummary } from "@/lib/blog"
import { knowledgeHref, type KnowledgeIndexData, type KnowledgeLocation } from "@/lib/knowledge"

function PostLink({ post, active }: { post: BlogPostSummary; active: boolean }) {
    const Icon = post.kind === "note" ? NotebookPen : FileText
    return (
        <Link
            href={`/blog/${post.slug}`}
            aria-current={active ? "page" : undefined}
            title={post.title}
            className={`flex items-center gap-2 rounded-md px-2 py-[4px] text-[13px] transition-colors ${
                active ? "bg-black/[0.07] font-medium text-black" : "text-black/56 hover:bg-black/[0.04] hover:text-black"
            }`}
        >
            <Icon className="h-3.5 w-3.5 shrink-0 text-black/34" />
            <span className="truncate">{post.title}</span>
        </Link>
    )
}

export default function KnowledgeSidebar({
    index,
    location,
}: {
    index: KnowledgeIndexData
    location: KnowledgeLocation
}) {
    const onIndex = !location.slug
    const hasFilter = Boolean(location.topic || location.tag || location.project)
    const expandAll = index.topics.length <= 4

    return (
        <nav aria-label="Notebook" className="flex h-full flex-col">
            <div className="px-3 pt-3">
                <SidebarHeader href="/blog" />
                <KnowledgeSearchButton className="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-2 py-[5px] text-[14px] text-black/56 transition-colors hover:bg-black/[0.04] hover:text-black">
                    <Search className="h-4 w-4 text-black/42" />
                    <span className="flex-1 text-left">Search</span>
                    <kbd className="font-mono text-[10px] text-black/32">⌘K</kbd>
                </KnowledgeSearchButton>
            </div>

            <div data-lenis-prevent className="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-6">
                <div className="space-y-px">
                    <SidebarLink
                        href="/blog"
                        icon={<LayoutList className="h-4 w-4" />}
                        label="Everything"
                        count={index.counts.all}
                        active={onIndex && !hasFilter && location.view === "all"}
                    />
                    <SidebarLink
                        href={BLOG_KIND_META.essay.href}
                        icon={<FileText className="h-4 w-4" />}
                        label={<>Essays <span className="text-black/34">文章</span></>}
                        count={index.counts.essay}
                        active={onIndex && !hasFilter && location.view === "essay"}
                    />
                    <SidebarLink
                        href={BLOG_KIND_META.note.href}
                        icon={<NotebookPen className="h-4 w-4" />}
                        label={<>Notes <span className="text-black/34">笔记</span></>}
                        count={index.counts.note}
                        active={onIndex && !hasFilter && location.view === "note"}
                    />
                </div>

                {index.topics.length ? <SectionLabel>Topics</SectionLabel> : null}
                <div className="space-y-px">
                    {index.topics.map((topic) => {
                        const containsActive = topic.posts.some((post) => post.slug === location.slug)
                        const topicActive = onIndex && location.topic === topic.name
                        return (
                            <details key={topic.name} open={expandAll || containsActive || topicActive} className="group/topic">
                                <summary
                                    className={`flex cursor-pointer list-none items-center gap-1 rounded-lg py-[5px] pl-1 pr-2 text-[14px] transition-colors [&::-webkit-details-marker]:hidden ${
                                        topicActive ? "bg-black/[0.07]" : "hover:bg-black/[0.04]"
                                    }`}
                                >
                                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-black/34 transition-transform group-open/topic:rotate-90" />
                                    <Link
                                        href={knowledgeHref({ topic: topic.name })}
                                        className={`min-w-0 flex-1 truncate pl-1 ${topicActive ? "font-medium text-black" : "text-black/66 hover:text-black"}`}
                                    >
                                        {topic.name}
                                    </Link>
                                    <span className="text-[11px] tabular-nums text-black/32">{topic.posts.length}</span>
                                </summary>
                                <div className="ml-[13px] space-y-px border-l border-black/[0.08] py-0.5 pl-2">
                                    {topic.posts.map((post) => (
                                        <PostLink key={post.id} post={post} active={post.slug === location.slug} />
                                    ))}
                                </div>
                            </details>
                        )
                    })}
                </div>

                {index.projects.length ? (
                    <>
                        <SectionLabel>Projects</SectionLabel>
                        <div className="space-y-px">
                            {index.projects.map((project) => (
                                <SidebarLink
                                    key={project.name}
                                    href={knowledgeHref({ project: project.name })}
                                    icon={<Boxes className="h-4 w-4" />}
                                    label={project.name}
                                    count={project.count}
                                    active={onIndex && location.project === project.name}
                                />
                            ))}
                        </div>
                    </>
                ) : null}
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
                <SidebarLink href="/studio" icon={<LockKeyhole className="h-4 w-4" />} label="Studio" />
            </div>
        </nav>
    )
}
