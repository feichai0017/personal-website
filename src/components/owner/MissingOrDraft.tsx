"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { lazy, Suspense, useState } from "react"

import { useOwner } from "@/components/owner/OwnerProvider"

const InlineEditor = lazy(() => import("@/components/owner/InlineEditor"))

function EditorSkeleton() {
    return (
        <div aria-label="Loading page" className="mx-auto w-full max-w-[720px] space-y-6 px-5 pt-14">
            <div className="h-10 w-3/5 animate-pulse rounded-lg bg-black/[0.055]" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-black/[0.045]" />
            <div className="space-y-3 pt-6">
                <div className="h-3 w-full animate-pulse rounded-full bg-black/[0.04]" />
                <div className="h-3 w-[92%] animate-pulse rounded-full bg-black/[0.04]" />
                <div className="h-3 w-[78%] animate-pulse rounded-full bg-black/[0.04]" />
            </div>
        </div>
    )
}

function PageNotFound() {
    return (
        <main className="mx-auto flex min-h-[60vh] w-full max-w-[720px] flex-col items-start justify-center px-5">
            <div className="text-[13px] font-medium text-black/40">404</div>
            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.02em] text-black">This page doesn’t exist</h1>
            <p className="mt-3 text-[16px] leading-8 text-black/54">It may have been moved, renamed, or unpublished.</p>
            <Link href="/blog" className="mt-6 rounded-lg bg-black px-3.5 py-2 text-[14px] font-medium text-[#f7f5f1] hover:bg-black/80">
                Back to the notebook
            </Link>
        </main>
    )
}

export default function MissingOrDraft() {
    const { status } = useOwner()
    const pathname = usePathname()
    // Captured once: saving a renamed draft rewrites the URL without remounting the editor.
    const [slug] = useState(() => decodeURIComponent(pathname.split("/")[2] ?? ""))

    if (status === "owner") {
        return (
            <Suspense fallback={<EditorSkeleton />}>
                <InlineEditor slug={slug} fallback={<EditorSkeleton />} missing={<PageNotFound />} />
            </Suspense>
        )
    }
    if (status === "checking") return <EditorSkeleton />
    return <PageNotFound />
}
