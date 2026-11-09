"use client"

import { lazy, Suspense, type ReactNode } from "react"

import { useOwner } from "@/components/owner/OwnerProvider"

const InlineEditor = lazy(() => import("@/components/owner/InlineEditor"))

export default function OwnerArticle({ slug, children }: { slug: string; children: ReactNode }) {
    const { status } = useOwner()
    if (status !== "owner") return <>{children}</>

    return (
        <Suspense fallback={children}>
            <InlineEditor slug={slug} fallback={children} />
        </Suspense>
    )
}
