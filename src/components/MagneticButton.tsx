"use client"

import { ReactNode, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

type Props = {
    children: ReactNode
    className?: string
    href?: string
    target?: string
    rel?: string
    download?: boolean
    onClick?: () => void
    strength?: number
    as?: "a" | "button"
    ariaLabel?: string
}

export default function MagneticButton({
    children,
    className = "",
    href,
    target,
    rel,
    download,
    onClick,
    strength = 0.28,
    as,
    ariaLabel,
}: Props) {
    const ref = useRef<HTMLElement | null>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
    const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

    const handleMove = (e: React.MouseEvent<HTMLElement>) => {
        const node = ref.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        x.set((e.clientX - cx) * strength)
        y.set((e.clientY - cy) * strength)
    }

    const handleLeave = () => {
        x.set(0)
        y.set(0)
    }

    const Comp = (as ?? (href ? "a" : "button")) as "a" | "button"
    const MotionComp = Comp === "a" ? motion.a : motion.button

    return (
        <MotionComp
            ref={ref as unknown as React.RefObject<HTMLAnchorElement & HTMLButtonElement>}
            href={href}
            target={target}
            rel={rel}
            download={download}
            onClick={onClick}
            aria-label={ariaLabel}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ x: sx, y: sy }}
            className={className}
        >
            {children}
        </MotionComp>
    )
}
