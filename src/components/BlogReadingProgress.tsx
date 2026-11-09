"use client"

import { useEffect, useRef } from "react"

export default function BlogReadingProgress() {
    const barRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let frame = 0
        const update = () => {
            frame = 0
            const bar = barRef.current
            if (!bar) return
            const scrollable = document.documentElement.scrollHeight - window.innerHeight
            bar.style.transform = `scaleX(${scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0})`
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
    }, [])

    return <div ref={barRef} aria-hidden className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left scale-x-0 bg-black/75" />
}
