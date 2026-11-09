import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"

import KnowledgeCommandPalette from "@/components/KnowledgeCommandPalette"
import KnowledgeMobileNav from "@/components/KnowledgeMobileNav"
import KnowledgeSidebar from "@/components/KnowledgeSidebar"
import NotebookTopBar, { type NotebookCrumb } from "@/components/NotebookTopBar"
import type { BlogPostSummary } from "@/lib/blog"
import { buildKnowledgeIndex, type KnowledgeLocation } from "@/lib/knowledge"

export default function KnowledgeShell({
    posts,
    location,
    breadcrumbs,
    children,
}: {
    posts: BlogPostSummary[]
    location: KnowledgeLocation
    breadcrumbs: NotebookCrumb[]
    children: ReactNode
}) {
    const index = buildKnowledgeIndex(posts)
    const sidebar = <KnowledgeSidebar index={index} location={location} />

    return (
        <div className="min-h-screen bg-[#f7f5f1] text-[#0a0a0a] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
            <aside className="sticky top-0 hidden h-screen border-r border-black/[0.07] bg-[#f1eee8] lg:block">
                {sidebar}
            </aside>

            <div className="flex min-h-screen min-w-0 flex-col">
                <NotebookTopBar leading={<KnowledgeMobileNav>{sidebar}</KnowledgeMobileNav>} breadcrumbs={breadcrumbs}>
                    <KnowledgeCommandPalette variant="topbar" />
                    <Link
                        href="/"
                        className="hidden h-8 items-center gap-1 rounded-lg px-2.5 text-[13px] text-black/56 transition hover:bg-black/[0.05] hover:text-black md:inline-flex"
                    >
                        Portfolio
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </NotebookTopBar>

                <div className="flex-1">{children}</div>

                <footer className="border-t border-black/[0.06] px-5 py-6 text-[12px] text-black/40 md:px-10">
                    <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3">
                        <span>© {new Date().getFullYear()} Guocheng Song · Writing on systems, infra, and models.</span>
                        <span className="flex items-center gap-4">
                            <a href="/rss.xml" className="hover:text-black">RSS</a>
                            <Link href="/" className="hover:text-black">Portfolio</Link>
                            <a href="https://github.com/feichai0017" target="_blank" rel="noopener noreferrer" className="hover:text-black">GitHub</a>
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    )
}
