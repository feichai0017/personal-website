"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa6"
import ShaderPortrait from "@/components/ShaderPortrait"
import RevealHeadline from "@/components/RevealHeadline"
import MagneticButton from "@/components/MagneticButton"

const rotatingSuffixes = ["Builder", "Architect", "Engineer", "Debugger"]

type HandoffParticle = {
    id: string
    startX: number
    startY: number
    endX: number
    endY: number
    size: number
    delay: number
}

export default function Home() {
    const [mounted, setMounted] = useState(false)
    const [suffixIndex, setSuffixIndex] = useState(0)
    const [handoffKey, setHandoffKey] = useState(0)
    const [handoffParticles, setHandoffParticles] = useState<HandoffParticle[]>([])
    const clearParticlesRef = useRef<number | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return
        const handleHandoff = (event: Event) => {
            setHandoffKey((current) => current + 1)
            const target = document.getElementById("hero-visual-target")
            const detail = (event as CustomEvent<{ particles?: Array<{ x: number; y: number; size: number; delay?: number }> }>).detail
            if (!target || !detail?.particles?.length) return
            const rect = target.getBoundingClientRect()
            const nextParticles = detail.particles.map((particle, index) => ({
                id: `${index}-${particle.x}-${particle.y}`,
                startX: particle.x,
                startY: particle.y,
                endX: rect.left + rect.width * (0.18 + ((index * 17) % 56) / 100),
                endY: rect.top + rect.height * (0.16 + ((index * 13) % 58) / 100),
                size: particle.size,
                delay: particle.delay ?? index * 0.02,
            }))
            setHandoffParticles(nextParticles)
            if (clearParticlesRef.current) window.clearTimeout(clearParticlesRef.current)
            clearParticlesRef.current = window.setTimeout(() => {
                setHandoffParticles([])
                clearParticlesRef.current = null
            }, 1200)
        }
        window.addEventListener("entry-portal-handoff", handleHandoff)
        return () => {
            window.removeEventListener("entry-portal-handoff", handleHandoff)
            if (clearParticlesRef.current) window.clearTimeout(clearParticlesRef.current)
        }
    }, [])

    useEffect(() => {
        const timer = window.setInterval(() => {
            setSuffixIndex((current) => (current + 1) % rotatingSuffixes.length)
        }, 2600)
        return () => window.clearInterval(timer)
    }, [])

    const handlePortalOpen = () => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("entry-portal-open"))
        }
    }

    return (
        <section id="home" className="showcase-section relative overflow-y-hidden px-4 pb-20 pt-32 text-[#0a0a0a]">
            <AnimatePresence>
                {handoffParticles.map((particle) => (
                    <motion.span
                        key={particle.id}
                        initial={{
                            x: particle.startX,
                            y: particle.startY,
                            opacity: 0,
                            scale: 0.4,
                        }}
                        animate={{
                            x: particle.endX,
                            y: particle.endY,
                            opacity: [0, 0.95, 0],
                            scale: [0.4, 1, 0.22],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 1.05,
                            delay: particle.delay,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="pointer-events-none fixed left-0 top-0 z-[240] rounded-full bg-black"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            boxShadow: "0 0 24px rgba(10,10,10,0.22)",
                        }}
                    />
                ))}
            </AnimatePresence>
            <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[1800px] flex-col justify-between px-2 md:px-4 lg:px-6">
                <div className="grid items-center gap-12 xl:grid-cols-[1.02fr_0.98fr]">
                    <div key={`hero-copy-${handoffKey}`} className="order-2 pr-3 xl:order-1 xl:pr-8">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.08 }}
                            className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36"
                        >
                            01 / available for select work
                        </motion.div>

                        <div className="mt-8 text-[17vw] font-medium leading-[0.84] tracking-[-0.045em] text-[#0a0a0a] sm:text-[6.4rem] lg:text-[8.35rem] xl:text-[9.65rem]">
                            <RevealHeadline
                                as="h1"
                                lines={["Distributed", "Systems"]}
                                stagger={0.06}
                                duration={0.95}
                                delay={0.16}
                                once={false}
                                className="block"
                            />
                            <span className="relative block overflow-hidden pb-[0.3em] -mb-[0.3em] text-black/78">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={rotatingSuffixes[suffixIndex]}
                                        initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
                                        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                                        exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
                                        transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                        className="inline-block"
                                    >
                                        {rotatingSuffixes[suffixIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.72, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
                            className="mt-8 max-w-2xl text-lg leading-8 text-black/66 md:text-xl"
                        >
                            Building storage engines, distributed backends, and product-facing systems with the same
                            bias: understand the contract first, then make it fast.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.72, delay: 0.98 }}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <MagneticButton
                                as="button"
                                onClick={handlePortalOpen}
                                strength={0.32}
                                className="inline-flex h-14 items-center gap-3 rounded-full bg-black px-7 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f7f5f1] shadow-[0_16px_36px_rgba(10,10,10,0.14)]"
                            >
                                portal
                            </MagneticButton>
                            <MagneticButton
                                href="/Resume.pdf"
                                download
                                strength={0.3}
                                className="inline-flex h-14 items-center gap-3 rounded-full border border-black/10 bg-white/85 px-7 font-mono text-[11px] uppercase tracking-[0.24em] text-black/76 shadow-[0_14px_28px_rgba(10,10,10,0.05)]"
                            >
                                download resume
                                <ArrowUpRight className="h-4 w-4" />
                            </MagneticButton>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.72, delay: 1.08 }}
                            className="mt-10 flex items-center gap-3"
                        >
                            <MagneticButton
                                href="https://github.com/feichai0017"
                                target="_blank"
                                rel="noopener noreferrer"
                                strength={0.45}
                                ariaLabel="GitHub"
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/66 shadow-[0_12px_24px_rgba(10,10,10,0.05)] hover:text-black"
                            >
                                <FaGithub className="h-4 w-4" />
                            </MagneticButton>
                            <MagneticButton
                                href="https://www.linkedin.com/in/guocheng-song-728580318/"
                                target="_blank"
                                rel="noopener noreferrer"
                                strength={0.45}
                                ariaLabel="LinkedIn"
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/66 shadow-[0_12px_24px_rgba(10,10,10,0.05)] hover:text-black"
                            >
                                <FaLinkedinIn className="h-4 w-4" />
                            </MagneticButton>
                        </motion.div>
                    </div>

                    <motion.div
                        id="hero-visual-target"
                        key={`hero-visual-${handoffKey}`}
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        className="order-1 xl:order-2 xl:pl-10"
                    >
                        <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-black/36">
                            <span>composite render</span>
                            <span>creative engineer profile</span>
                        </div>
                        {mounted ? (
                            <ShaderPortrait />
                        ) : (
                            <div className="aspect-[0.92] w-full rounded-[36px] border border-black/10 bg-[#ece8df]" />
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
