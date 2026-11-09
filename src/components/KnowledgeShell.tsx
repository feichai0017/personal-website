import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import KnowledgeCommandPalette from "@/components/KnowledgeCommandPalette"
import KnowledgeMobileNav from "@/components/KnowledgeMobileNav"
import KnowledgeSidebar from "@/components/KnowledgeSidebar"
import type { BlogPostSummary } from "@/lib/blog"
import { buildKnowledgeIndex, type KnowledgeLocation } from "@/lib/knowledge"

export type KnowledgeCrumb = {
    label: string
    href?: string
}

export default function KnowledgeShell({
    posts,
    location,
    breadcrumbs,
    children,
}: {
    posts: BlogPostSummary[]
    location: KnowledgeLocation
    breadcrumbs: KnowledgeCrumb[]
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
                <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-black/[0.06] bg-[#f7f5f1]/90 px-3 backdrop-blur-md md:px-5">
                    <KnowledgeMobileNav>{sidebar}</KnowledgeMobileNav>
                    <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
                        <ol className="flex min-w-0 items-center gap-1 text-[13px] text-black/48">
                            {breadcrumbs.map((crumb, position) => {
                                const last = position === breadcrumbs.length - 1
                                return (
                                    <li key={`${crumb.label}-${position}`} className={`items-center gap-1 ${last ? "flex min-w-0" : "hidden shrink-0 sm:flex"}`}>
                                        {position > 0 ? <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-black/24 sm:block" /> : null}
                                        {crumb.href && !last ? (
                                            <Link href={crumb.href} className="truncate rounded-md px-1.5 py-0.5 transition-colors hover:bg-black/[0.05] hover:text-black">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span aria-current={last ? "page" : undefined} className="truncate px-1.5 py-0.5 text-black/78">
                                                {crumb.label}
                                            </span>
                                        )}
                                    </li>
                                )
                            })}
                        </ol>
                    </nav>
                    <KnowledgeCommandPalette variant="topbar" />
                    <Link
                        href="/"
                        className="hidden h-8 items-center gap-1 rounded-lg px-2.5 text-[13px] text-black/56 transition hover:bg-black/[0.05] hover:text-black md:inline-flex"
                    >
                        Portfolio
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </header>

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
