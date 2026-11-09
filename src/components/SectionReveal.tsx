"use client"

import { ReactNode, useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

export default function SectionReveal({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement | null>(null)
    const inView = useInView(ref, { once: true, margin: "-4% 0px -10% 0px" })
    const reduceMotion = useReducedMotion()

    return (
        <motion.div
            ref={ref}
            className="section-stage relative"
            initial={false}
            animate={
                inView && !reduceMotion
                    ? { opacity: [0.88, 1], y: [18, 0] }
                    : undefined
            }
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}
