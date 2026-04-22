"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function IntroCurtain() {
    const [active, setActive] = useState(true)

    useEffect(() => {
        const timer = window.setTimeout(() => setActive(false), 1350)
        return () => window.clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    key="intro-curtain"
                    className="pointer-events-none fixed inset-0 z-[200] flex flex-col"
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="flex-1 bg-[#0a0a0a]"
                        initial={{ y: 0 }}
                        animate={{ y: "-100%" }}
                        transition={{ duration: 0.85, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    />
                    <motion.div
                        className="flex-1 bg-[#0a0a0a]"
                        initial={{ y: 0 }}
                        animate={{ y: "100%" }}
                        transition={{ duration: 0.85, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    />
                    <motion.div
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                    >
                        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.38em] text-white/72">
                            <span className="h-px w-10 bg-white/40" />
                            <span>guocheng song</span>
                            <span className="h-px w-10 bg-white/40" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
