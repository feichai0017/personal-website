"use client"

import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { PanelLeft, X } from "lucide-react"

export default function KnowledgeMobileNav({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open notebook navigation"
                aria-expanded={open}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/56 transition hover:bg-black/[0.05] hover:text-black lg:hidden"
            >
                <PanelLeft className="h-4 w-4" />
            </button>

            {open ? createPortal(
                <div className="fixed inset-0 z-[90] lg:hidden">
                    <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} aria-hidden />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Notebook navigation"
                        className="absolute inset-y-0 left-0 flex w-[86vw] max-w-[300px] flex-col bg-[#f1eee8] shadow-[0_20px_60px_rgba(10,10,10,0.2)]"
                        onClick={(event) => {
                            if ((event.target as HTMLElement).closest("a, [data-knowledge-search], [data-close-drawer]")) setOpen(false)
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close navigation"
                            className="absolute right-2 top-2.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/50 hover:bg-black/[0.05] hover:text-black"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        {children}
                    </div>
                </div>,
                document.body,
            ) : null}
        </>
    )
}
