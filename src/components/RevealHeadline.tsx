"use client"

import { ReactNode, useMemo, useRef } from "react"
import { motion, useInView } from "framer-motion"

type LineInput = string | { text: string; className?: string }

export default function RevealHeadline({
    lines,
    className = "",
    stagger = 0.05,
    duration = 0.85,
    once = true,
    delay = 0,
    as: Tag = "h2",
}: {
    lines: LineInput[]
    className?: string
    stagger?: number
    duration?: number
    once?: boolean
    delay?: number
    as?: "h1" | "h2" | "h3" | "span" | "div"
}) {
    const ref = useRef<HTMLElement | null>(null)
    const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" })

    const tokens = useMemo(
        () =>
            lines.map((line, lineIndex) => {
                const raw = typeof line === "string" ? line : line.text
                const lineClass = typeof line === "string" ? "" : line.className ?? ""
                const words = raw.split(" ").filter(Boolean)
                return { words, lineClass, lineIndex }
            }),
        [lines]
    )

    let globalIndex = 0
    const wordNodes: ReactNode[] = tokens.map((line) => (
        <span key={`line-${line.lineIndex}`} className={`block ${line.lineClass}`}>
            {line.words.map((word, i) => {
                const idx = globalIndex++
                return (
                    <span
                        key={`${line.lineIndex}-${i}`}
                        className="relative inline-block overflow-hidden pb-[0.3em] -mb-[0.3em] align-baseline leading-[0.95]"
                    >
                        <motion.span
                            className="inline-block will-change-transform"
                            initial={{ y: "110%" }}
                            animate={inView ? { y: "0%" } : { y: "110%" }}
                            transition={{
                                duration,
                                ease: [0.22, 1, 0.36, 1],
                                delay: delay + idx * stagger,
                            }}
                        >
                            {word}
                            {i < line.words.length - 1 ? "\u00A0" : ""}
                        </motion.span>
                    </span>
                )
            })}
        </span>
    ))

    const Comp = motion[Tag] as typeof motion.h2
    return (
        <Comp ref={ref as unknown as React.RefObject<HTMLHeadingElement>} className={className}>
            {wordNodes}
        </Comp>
    )
}
