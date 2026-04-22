"use client"

import { motion, useScroll, useTransform } from "framer-motion"

const palette = ["#f7f5f1", "#f3ede3", "#efe7d7", "#ebe1cb", "#e7dcc0", "#e3d7b5"]

export default function ScrollBackdrop() {
    const { scrollYProgress } = useScroll()

    const background = useTransform(
        scrollYProgress,
        palette.map((_, i) => i / (palette.length - 1)),
        palette
    )

    return (
        <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[-2]"
            style={{ backgroundColor: background }}
        />
    )
}
