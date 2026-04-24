"use client"

import { ReactNode, useEffect } from "react"
import Lenis from "lenis"

export default function SmoothScroll({ children }: { children: ReactNode }) {
    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReduced) return

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 1,
            touchMultiplier: 1.4,
            smoothWheel: true,
        })

        let rafId = 0
        const raf = (time: number) => {
            lenis.raf(time)
            rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)

        const handlePortalVisibility = (event: Event) => {
            const detail = (event as CustomEvent<{ visible?: boolean }>).detail
            if (detail?.visible) {
                lenis.stop()
            } else {
                lenis.start()
            }
        }
        window.addEventListener("entry-portal-visibility", handlePortalVisibility)

        return () => {
            window.removeEventListener("entry-portal-visibility", handlePortalVisibility)
            cancelAnimationFrame(rafId)
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}
