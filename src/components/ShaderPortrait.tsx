"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function ShaderPortrait() {
    const [hovered, setHovered] = useState(false)
    const [fps, setFps] = useState(60)

    useEffect(() => {
        let frameId = 0
        let lastSample = performance.now()
        let lastFrame = performance.now()
        let frames = 0

        const loop = (time: number) => {
            frames += 1
            lastFrame = time

            if (time - lastSample >= 500) {
                const measured = Math.round((frames * 1000) / (time - lastSample))
                setFps(measured)
                frames = 0
                lastSample = time
            }

            frameId = requestAnimationFrame(loop)
        }

        frameId = requestAnimationFrame(loop)
        return () => {
            cancelAnimationFrame(frameId)
            void lastFrame
        }
    }, [])

    return (
        <div
            className="group relative aspect-[0.92] w-full overflow-hidden rounded-[36px] border border-black/10 bg-[#ece8df]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),transparent_18%),radial-gradient(circle_at_50%_40%,rgba(10,10,10,0.08),transparent_52%)]" />

            <div
                className="absolute inset-0 overflow-hidden rounded-[36px]"
            >
                <motion.div
                    animate={{
                        x: hovered ? 4 : 0,
                        y: hovered ? -2 : 0,
                        opacity: hovered ? 0.42 : 0.22,
                    }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 mix-blend-screen"
                >
                    <Image
                        src="/img/my.png"
                        alt="Portrait texture"
                        fill
                        className="object-cover object-center saturate-[0.95]"
                        sizes="(max-width: 1280px) 100vw, 50vw"
                    />
                </motion.div>

                <motion.div
                    animate={{
                        x: hovered ? -6 : -2,
                        y: hovered ? 3 : 0,
                        opacity: hovered ? 0.26 : 0.18,
                    }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 mix-blend-multiply"
                    style={{ filter: "sepia(0.1) hue-rotate(184deg) saturate(1.2)" }}
                >
                    <Image
                        src="/img/my.png"
                        alt=""
                        fill
                        aria-hidden
                        className="object-cover object-center"
                        sizes="(max-width: 1280px) 100vw, 50vw"
                    />
                </motion.div>

                <motion.div
                    animate={{
                        scale: hovered ? 1.18 : 1.14,
                        y: hovered ? -10 : -18,
                        filter: hovered
                            ? "contrast(1.08) saturate(0.95) brightness(1.01)"
                            : "contrast(1.03) saturate(0.92) brightness(1.0)",
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/img/my.png"
                        alt="Guocheng Song portrait"
                        fill
                        priority
                        className="object-cover object-top"
                        sizes="(max-width: 1280px) 100vw, 50vw"
                    />
                </motion.div>

                <motion.div
                    animate={{ opacity: hovered ? 0.3 : 0.18, backgroundPositionX: hovered ? "8px" : "0px" }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 45%, rgba(10,10,10,0.08) 50%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.08))",
                        backgroundSize: "100% 5px",
                    }}
                />
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-black/8" />
            <div className="pointer-events-none absolute bottom-5 right-5 rounded-full border border-black/10 bg-[#f7f5f1]/92 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-black/50">
                Rendering at: {fps}fps
            </div>
        </div>
    )
}
