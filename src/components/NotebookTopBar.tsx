import Link from "next/link"
import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

export type NotebookCrumb = {
    label: string
    href?: string
}

export default function NotebookTopBar({
    leading,
    breadcrumbs,
    children,
}: {
    leading?: ReactNode
    breadcrumbs: NotebookCrumb[]
    children?: ReactNode
}) {
    return (
        <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-black/[0.06] bg-[#f7f5f1]/90 px-3 backdrop-blur-md md:px-5">
            {leading}
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
            {children}
        </header>
    )
}
