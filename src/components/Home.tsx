"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa6"
import ShaderPortrait from "@/components/ShaderPortrait"

const heroLines = ["Distributed", "Systems", "Builder"]

const heroCopyVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.06,
        },
    },
}

const heroItemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
    },
}

export default function Home() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <section id="home" className="showcase-section relative overflow-hidden bg-[#f7f5f1] px-4 pb-20 pt-32 text-[#0a0a0a]">
            <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[1800px] flex-col justify-between px-2 md:px-4 lg:px-6">
                <div className="grid items-center gap-12 xl:grid-cols-[1.02fr_0.98fr]">
                    <motion.div
                        variants={heroCopyVariants}
                        initial="hidden"
                        animate="visible"
                        className="order-2 xl:order-1"
                    >
                        <motion.div
                            variants={heroItemVariants}
                            className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36"
                        >
                            01 / available for select work
                        </motion.div>

                        <div className="mt-8 text-[18vw] font-medium leading-[0.84] tracking-[-0.075em] text-[#0a0a0a] sm:text-[6.8rem] lg:text-[8.9rem] xl:text-[10.5rem]">
                            {heroLines.map((line, index) => (
                                <motion.span
                                    key={line}
                                    variants={heroItemVariants}
                                    className={`block ${index === heroLines.length - 1 ? "text-black/78" : ""}`}
                                >
                                    {line}
                                </motion.span>
                            ))}
                        </div>

                        <motion.p
                            variants={heroItemVariants}
                            className="mt-8 max-w-2xl text-lg leading-8 text-black/66 md:text-xl"
                        >
                            Building storage engines, distributed backends, and product-facing systems with the same
                            bias: understand the contract first, then make it fast.
                        </motion.p>

                        <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap gap-4">
                            <motion.a
                                href="https://calendly.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -5, scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                                className="inline-flex h-14 items-center gap-3 rounded-full bg-black px-7 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f7f5f1] shadow-[0_16px_36px_rgba(10,10,10,0.12)]"
                            >
                                book 15 mins
                            </motion.a>
                            <motion.a
                                href="/Resume.pdf"
                                download
                                whileHover={{ y: -5, scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                                className="inline-flex h-14 items-center gap-3 rounded-full border border-black/10 bg-white px-7 font-mono text-[11px] uppercase tracking-[0.24em] text-black/76 shadow-[0_14px_28px_rgba(10,10,10,0.05)]"
                            >
                                download resume
                                <motion.span whileHover={{ x: 1.5, y: -1.5 }} transition={{ duration: 0.18 }}>
                                    <ArrowUpRight className="h-4 w-4" />
                                </motion.span>
                            </motion.a>
                        </motion.div>

                        <motion.div variants={heroItemVariants} className="mt-10 flex items-center gap-3">
                            <motion.a
                                href="https://github.com/feichai0017"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -4, scale: 1.06 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 360, damping: 22 }}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/66 shadow-[0_12px_24px_rgba(10,10,10,0.05)] hover:text-black"
                            >
                                <FaGithub className="h-4 w-4" />
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/guocheng-song-728580318/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -4, scale: 1.06 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 360, damping: 22 }}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/66 shadow-[0_12px_24px_rgba(10,10,10,0.05)] hover:text-black"
                            >
                                <FaLinkedinIn className="h-4 w-4" />
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="order-1 xl:order-2 xl:pl-10"
                        whileHover={{ y: -4 }}
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
