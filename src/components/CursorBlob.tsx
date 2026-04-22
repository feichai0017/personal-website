"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CursorBlob() {
    const [enabled, setEnabled] = useState(false)
    const x = useMotionValue(-400)
    const y = useMotionValue(-400)
    const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 1.1 })
    const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 1.1 })

    useEffect(() => {
        if (typeof window === "undefined") return
        const mq = window.matchMedia("(pointer: fine)")
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setEnabled(mq.matches && !reduced.matches)
        update()
        mq.addEventListener("change", update)
        reduced.addEventListener("change", update)
        return () => {
            mq.removeEventListener("change", update)
            reduced.removeEventListener("change", update)
        }
    }, [])

    useEffect(() => {
        if (!enabled) return
        const handle = (e: MouseEvent) => {
            x.set(e.clientX - 300)
            y.set(e.clientY - 300)
        }
        window.addEventListener("mousemove", handle)
        return () => window.removeEventListener("mousemove", handle)
    }, [enabled, x, y])

    if (!enabled) return null

    return (
        <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full"
            style={{
                x: sx,
                y: sy,
                background:
                    "radial-gradient(circle at 50% 50%, rgba(180, 83, 9, 0.18), rgba(30, 58, 138, 0.10) 42%, transparent 70%)",
                filter: "blur(80px)",
                mixBlendMode: "multiply",
            }}
        />
    )
}
