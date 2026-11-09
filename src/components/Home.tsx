"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa6"
import ShaderPortrait from "@/components/ShaderPortrait"
import RevealHeadline from "@/components/RevealHeadline"
import MagneticButton from "@/components/MagneticButton"

const rotatingSuffixes = ["Engineer", "Infra", "Contributor", "Builder"]

export default function Home() {
    const [mounted, setMounted] = useState(false)
    const [suffixIndex, setSuffixIndex] = useState(0)
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (reduceMotion) return

        let timer: number | null = null
        const start = () => {
            if (timer !== null) return
            timer = window.setInterval(() => {
                setSuffixIndex((current) => (current + 1) % rotatingSuffixes.length)
            }, 2600)
        }
        const stop = () => {
            if (timer === null) return
            window.clearInterval(timer)
            timer = null
        }
        // Hidden tabs throttle rAF but not intervals, so exits would pile up.
        const onVisibilityChange = () => (document.hidden ? stop() : start())

        if (!document.hidden) start()
        document.addEventListener("visibilitychange", onVisibilityChange)
        return () => {
            stop()
            document.removeEventListener("visibilitychange", onVisibilityChange)
        }
    }, [reduceMotion])

    return (
        <section id="home" className="showcase-section relative overflow-hidden px-4 pb-20 pt-28 text-[#0a0a0a] md:pt-32">
            <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[1800px] flex-col justify-between px-2 md:px-4 lg:px-6">
                <div className="grid items-center gap-12 xl:grid-cols-[1.02fr_0.98fr]">
                    <div className="order-1 pr-1 sm:pr-3 xl:pr-8">
                        <motion.div
                            initial={false}
                            className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36"
                        >
                            01 / available for select work
                        </motion.div>

                        <h1 className="mt-7 text-[16.5vw] font-medium leading-[0.84] tracking-[-0.045em] text-[#0a0a0a] sm:mt-8 sm:text-[6.4rem] lg:text-[8.35rem] xl:text-[9.65rem]">
                            <RevealHeadline
                                as="span"
                                lines={["Distributed", "Systems"]}
                                stagger={0.06}
                                duration={0.95}
                                delay={0.16}
                                once={false}
                                className="block"
                            />
                            <span aria-hidden className="relative grid overflow-hidden pb-[0.3em] -mb-[0.3em] text-black/78">
                                <AnimatePresence initial={false}>
                                    <motion.span
                                        key={rotatingSuffixes[suffixIndex]}
                                        initial={mounted ? { y: "110%" } : false}
                                        animate={{ y: "0%" }}
                                        exit={{ y: "-110%" }}
                                        transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                                        className="col-start-1 row-start-1 inline-block whitespace-nowrap"
                                    >
                                        {rotatingSuffixes[suffixIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                            <span className="sr-only">Engineer</span>
                        </h1>

                        <motion.p
                            initial={false}
                            className="mt-8 max-w-2xl text-lg leading-8 text-black/66 md:text-xl"
                        >
                            Machine learning systems engineer working on AI infra at ByteDance AML in Beijing. I
                            build storage, cache, and systems software, and I am also a core contributor to DuckDB
                            and Mooncake.
                        </motion.p>

                        <motion.div
                            initial={false}
                            className="mt-10 flex flex-wrap gap-4"
                        >
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
                            initial={false}
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
                        initial={false}
                        className="order-2 mx-auto w-full max-w-[430px] xl:max-w-none xl:pl-10"
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
