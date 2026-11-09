"use client"

import { ReactNode, useEffect } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"

import { isKnowledgePath } from "@/lib/knowledge"

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    useEffect(() => {
        if (pathname.startsWith("/studio") || isKnowledgePath(pathname)) return

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const hasFinePointer = window.matchMedia("(pointer: fine)").matches
        if (prefersReduced || !hasFinePointer) return

        const lenis = new Lenis({
            duration: 0.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 1,
            touchMultiplier: 1.15,
            smoothWheel: true,
        })

        let rafId = 0
        const raf = (time: number) => {
            lenis.raf(time)
            rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(rafId)
            lenis.destroy()
        }
    }, [pathname])

    return <>{children}</>
}
