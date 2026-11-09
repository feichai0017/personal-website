"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export default function BlogReadingProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 })

    return (
        <motion.div
            aria-hidden
            style={{ scaleX }}
            className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-black/75"
        />
    )
}
