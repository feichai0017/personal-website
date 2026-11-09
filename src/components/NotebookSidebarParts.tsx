import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

export function SidebarHeader({ href, title = "Guocheng’s Notebook" }: { href: string; title?: string }) {
    return (
        <Link href={href} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-black/[0.04]">
            <Image src="/img/my.png" alt="" width={24} height={24} className="h-6 w-6 rounded-md border border-black/10" />
            <span className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-[-0.01em]">{title}</span>
        </Link>
    )
}

export function SidebarLink({
    href,
    icon,
    label,
    count,
    active,
    prefetch,
}: {
    href: string
    icon: ReactNode
    label: ReactNode
    count?: number
    active?: boolean
    prefetch?: boolean
}) {
    return (
        <Link
            href={href}
            prefetch={prefetch}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-[5px] text-[14px] transition-colors ${
                active ? "bg-black/[0.07] font-medium text-black" : "text-black/62 hover:bg-black/[0.04] hover:text-black"
            }`}
        >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-black/42">{icon}</span>
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {count !== undefined ? <span className="text-[11px] tabular-nums text-black/32">{count}</span> : null}
        </Link>
    )
}

export const sidebarButtonClass =
    "flex w-full items-center gap-2.5 rounded-lg px-2 py-[5px] text-left text-[14px] text-black/62 transition-colors hover:bg-black/[0.04] hover:text-black"

export function SectionLabel({ children }: { children: ReactNode }) {
    return <div className="mb-1 mt-5 px-2 text-[11px] font-medium text-black/38">{children}</div>
}
