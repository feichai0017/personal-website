"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, LoaderCircle, LockKeyhole, LogOut, Plus } from "lucide-react"

import { useOwner } from "@/components/owner/OwnerProvider"
import { SectionLabel, sidebarButtonClass } from "@/components/NotebookSidebarParts"

export function OwnerNewPageButton() {
    const { status, creating, createPage } = useOwner()
    if (status !== "owner") return null
    return (
        <button type="button" data-close-drawer onClick={() => void createPage()} disabled={creating} className={sidebarButtonClass}>
            {creating ? <LoaderCircle className="h-4 w-4 animate-spin text-black/42" /> : <Plus className="h-4 w-4 text-black/42" />}
            New page
        </button>
    )
}

export function OwnerDrafts() {
    const { status, drafts } = useOwner()
    const pathname = usePathname()
    if (status !== "owner" || drafts.length === 0) return null

    return (
        <>
            <SectionLabel>Drafts · only you</SectionLabel>
            <div className="space-y-px">
                {drafts.map((draft) => {
                    const href = `/blog/${draft.slug}`
                    const active = pathname === href
                    return (
                        <Link
                            key={draft.id}
                            href={href}
                            prefetch={false}
                            aria-current={active ? "page" : undefined}
                            title={draft.title}
                            className={`flex items-center gap-2 rounded-md px-2 py-[4px] text-[13px] transition-colors ${
                                active ? "bg-black/[0.07] font-medium text-black" : "text-black/56 hover:bg-black/[0.04] hover:text-black"
                            }`}
                        >
                            <FileText className="h-3.5 w-3.5 shrink-0 text-black/34" />
                            <span className="min-w-0 flex-1 truncate">{draft.title || "Untitled"}</span>
                            <span aria-label="Draft" className="h-1.5 w-1.5 shrink-0 rounded-full border border-black/35" />
                        </Link>
                    )
                })}
            </div>
        </>
    )
}

export function OwnerAccountLink() {
    const { status, email, signOut } = useOwner()
    if (status === "owner") {
        return (
            <button type="button" onClick={() => void signOut()} className={sidebarButtonClass} title={email ?? undefined}>
                <LogOut className="h-4 w-4 text-black/42" />
                <span className="min-w-0 flex-1 truncate">Sign out</span>
                {email ? <span className="max-w-[110px] truncate text-[11px] text-black/32">{email}</span> : null}
            </button>
        )
    }
    return (
        <Link href="/studio/login" prefetch={false} className={sidebarButtonClass}>
            <LockKeyhole className="h-4 w-4 text-black/42" />
            Sign in to write
        </Link>
    )
}

export function OwnerToolbarSlot() {
    const { setToolbarSlot } = useOwner()
    return <div ref={setToolbarSlot} className="flex items-center gap-1" />
}
