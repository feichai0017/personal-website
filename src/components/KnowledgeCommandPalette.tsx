"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ArrowUpRight, CornerDownLeft, FileText, LoaderCircle, Search, X } from "lucide-react"

import { getBlogTopic, type BlogSearchResult } from "@/lib/blog"

const OPEN_SEARCH_EVENT = "knowledge:open-search"

export function KnowledgeSearchButton({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <button type="button" data-knowledge-search onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))} className={className}>
            {children}
        </button>
    )
}

export default function KnowledgeCommandPalette({ variant = "navbar" }: { variant?: "navbar" | "topbar" }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<BlogSearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const listRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault()
                setOpen((value) => !value)
            }
            if (event.key === "Escape") setOpen(false)
        }
        const onOpenRequest = () => setOpen(true)

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener(OPEN_SEARCH_EVENT, onOpenRequest)
        return () => {
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener(OPEN_SEARCH_EVENT, onOpenRequest)
        }
    }, [])

    useEffect(() => {
        if (!open) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.requestAnimationFrame(() => inputRef.current?.focus())

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [open])

    useEffect(() => {
        if (!open) return
        const controller = new AbortController()
        const timer = window.setTimeout(async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
                    signal: controller.signal,
                })
                const payload = await response.json() as { results?: BlogSearchResult[] }
                setResults(payload.results ?? [])
                setActiveIndex(0)
            } catch (error) {
                if (!(error instanceof DOMException && error.name === "AbortError")) setResults([])
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }, query ? 180 : 0)

        return () => {
            window.clearTimeout(timer)
            controller.abort()
        }
    }, [open, query])

    useEffect(() => {
        listRef.current
            ?.querySelector<HTMLElement>(`[data-result-index="${activeIndex}"]`)
            ?.scrollIntoView({ block: "nearest" })
    }, [activeIndex])

    const close = () => setOpen(false)

    const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!results.length) return
        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActiveIndex((index) => (index + 1) % results.length)
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((index) => (index - 1 + results.length) % results.length)
        } else if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            const target = results[activeIndex]
            if (!target) return
            event.preventDefault()
            close()
            router.push(`/blog/${target.slug}`)
        }
    }

    return (
        <>
            {variant === "navbar" ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Search writing"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-black/14 bg-white/90 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5 hover:border-black md:px-4"
                >
                    <Search className="h-3.5 w-3.5" />
                    <span className="hidden xl:inline">search</span>
                    <span className="hidden rounded-md border border-black/10 px-1.5 py-0.5 text-[8px] text-black/44 xl:inline">⌘K</span>
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Search writing"
                    className="inline-flex h-8 items-center gap-2 rounded-lg px-2 text-[13px] text-black/56 transition hover:bg-black/[0.05] hover:text-black md:border md:border-black/10 md:bg-white/60 md:pl-2.5 md:pr-1.5"
                >
                    <Search className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Search</span>
                    <kbd className="hidden rounded border border-black/10 bg-white px-1.5 font-mono text-[10px] text-black/40 md:inline">⌘K</kbd>
                </button>
            )}

            {open ? createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center bg-black/20 px-3 pt-[8vh] backdrop-blur-[2px] md:px-6 md:pt-[12vh]"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) close()
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search writing"
                        className="relative flex max-h-[76vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-black/12 bg-[#fbfaf7] shadow-[0_36px_110px_rgba(10,10,10,0.22)]"
                    >
                        <div className="flex items-center gap-3 border-b border-black/[0.08] px-4 py-3.5">
                            {loading ? <LoaderCircle className="h-4 w-4 animate-spin text-black/50" /> : <Search className="h-4 w-4 text-black/50" />}
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={onInputKeyDown}
                                placeholder="Search the notebook… 搜索文章"
                                aria-label="Search query"
                                className="min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-black/32"
                            />
                            <button
                                type="button"
                                onClick={close}
                                aria-label="Close search"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-black/45 hover:bg-black/[0.05] hover:text-black"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div ref={listRef} data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto p-2">

                            <div className="px-2 pb-1 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-black/36">
                                {query ? `${results.length} matches` : "Recent"}
                            </div>
                            <div role="listbox" aria-label="Search results">
                                {results.map((result, index) => {
                                    const active = index === activeIndex
                                    return (
                                        <Link
                                            key={result.id}
                                            href={`/blog/${result.slug}`}
                                            onClick={close}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            role="option"
                                            aria-selected={active}
                                            data-result-index={index}
                                            className={`group grid grid-cols-[20px_minmax(0,1fr)_auto] items-start gap-3 rounded-xl px-3 py-2.5 transition ${active ? "bg-black/[0.055]" : ""}`}
                                        >
                                            <FileText className="mt-0.5 h-4 w-4 text-black/40" />
                                            <span className="min-w-0">
                                                <span className="block truncate text-[15px] font-medium text-black">{result.title}</span>
                                                <span className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-black/48">{result.snippet}</span>
                                                <span className="mt-1 block text-[11px] text-black/36">
                                                    {[getBlogTopic(result), result.project].filter(Boolean).join(" · ")}
                                                </span>
                                            </span>
                                            {active ? (
                                                <CornerDownLeft className="mt-1 h-3.5 w-3.5 text-black/40" />
                                            ) : (
                                                <ArrowUpRight className="mt-1 h-3.5 w-3.5 text-black/24" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                            {!loading && query && !results.length ? (
                                <div className="px-3 py-10 text-center text-sm text-black/42">
                                    Nothing matches “{query}” yet.
                                </div>
                            ) : null}
                        </div>

                        <div className="hidden items-center gap-4 border-t border-black/[0.06] px-4 py-2 text-[11px] text-black/38 md:flex">
                            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                            <span><kbd className="font-mono">↵</kbd> open</span>
                            <span><kbd className="font-mono">esc</kbd> close</span>
                        </div>
                    </div>
                </div>,
                document.body,
            ) : null}
        </>
    )
}
