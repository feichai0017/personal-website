"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, Check, Link2 } from "lucide-react"

import type { BlogHeading } from "@/lib/blog-content"
import { copyText } from "@/lib/copy-text"

const ACTIVATION_OFFSET = 96

export default function BlogTableOfContents({ headings }: { headings: BlogHeading[] }) {
    const [activeId, setActiveId] = useState(headings[0]?.id ?? "")
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle")
    const resetTimerRef = useRef<number | null>(null)

    useEffect(() => {
        if (!headings.length) return

        let frame = 0
        const update = () => {
            frame = 0
            let current = headings[0].id
            for (const heading of headings) {
                const element = document.getElementById(heading.id)
                if (!element) continue
                if (element.getBoundingClientRect().top > ACTIVATION_OFFSET) break
                current = heading.id
            }
            setActiveId(current)
        }
        const schedule = () => {
            if (!frame) frame = window.requestAnimationFrame(update)
        }

        schedule()
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        return () => {
            if (frame) window.cancelAnimationFrame(frame)
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
        }
    }, [headings])

    useEffect(() => {
        return () => {
            if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current)
        }
    }, [])

    const copyArticleLink = async () => {
        const succeeded = await copyText(window.location.href.split("#")[0])
        setCopyStatus(succeeded ? "copied" : "failed")
        if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current)
        resetTimerRef.current = window.setTimeout(() => setCopyStatus("idle"), 1800)
    }

    return (
        <div className="sticky top-20">
            <div className="text-[12px] font-medium text-black/44">On this page</div>
            <nav aria-label="Table of contents" data-lenis-prevent className="mt-3 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1">
                <ol className="border-l border-black/[0.08]">
                    {headings.map((heading) => {
                        const active = heading.id === activeId
                        return (
                            <li key={heading.id}>
                                <a
                                    href={`#${heading.id}`}
                                    aria-current={active ? "location" : undefined}
                                    className={`-ml-px block border-l py-[5px] text-[13px] leading-5 transition-colors ${
                                        heading.level === 3 ? "pl-6" : "pl-3"
                                    } ${active ? "border-black font-medium text-black" : "border-transparent text-black/44 hover:text-black/80"}`}
                                >
                                    {heading.text}
                                </a>
                            </li>
                        )
                    })}
                </ol>
            </nav>

            <div className="mt-5 flex flex-col items-start gap-0.5 border-t border-black/[0.07] pt-4">
                <button
                    type="button"
                    onClick={copyArticleLink}
                    className="-ml-1.5 inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-black/48 transition-colors hover:bg-black/[0.04] hover:text-black"
                >
                    {copyStatus === "copied" ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                    {copyStatus === "copied" ? "Link copied" : copyStatus === "failed" ? "Copy failed" : "Copy link"}
                </button>
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="-ml-1.5 inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-black/48 transition-colors hover:bg-black/[0.04] hover:text-black"
                >
                    <ArrowUp className="h-3.5 w-3.5" />
                    Back to top
                </button>
            </div>
        </div>
    )
}
