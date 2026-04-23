"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { Calendar } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa6"
import MagneticButton from "@/components/MagneticButton"

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Work", href: "#projects" },
    { label: "Stack", href: "#techstack" },
    { label: "Contact", href: "#contact" },
]

const socialLinks = [
    {
        label: "GitHub",
        href: "https://github.com/feichai0017",
        icon: FaGithub,
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/guocheng-song-728580318/",
        icon: FaLinkedinIn,
    },
]

export default function Navbar() {
    const { scrollYProgress } = useScroll()
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 22, mass: 0.3 })

    return (
        <motion.header
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.42, delay: 1.6 }}
            className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-6"
        >
            <div className="relative mx-auto grid w-full max-w-[1800px] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full border border-black/15 bg-white/88 px-4 py-3 shadow-[0_10px_30px_rgba(10,10,10,0.12)] backdrop-blur-xl md:px-5">
                <motion.div
                    aria-hidden
                    style={{ scaleX: progress }}
                    className="pointer-events-none absolute inset-x-5 bottom-1.5 h-px origin-left bg-gradient-to-r from-black/40 via-black/60 to-black/30"
                />
                <button
                    type="button"
                    onClick={() => document.querySelector("#home")?.scrollIntoView()}
                    className="inline-flex items-center gap-3 text-left"
                >
                    <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-black">GS</span>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-medium tracking-[-0.02em] text-black">Guocheng Song</span>
                        <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.24em] text-black md:block">
                            systems builder
                        </span>
                    </div>
                </button>

                <nav className="hidden items-center justify-center gap-2 lg:flex">
                    {navLinks.map((item) => (
                        <button
                            key={item.href}
                            type="button"
                            onClick={() => document.querySelector(item.href)?.scrollIntoView()}
                            className="inline-flex h-10 items-center rounded-full border border-transparent px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-black transition-all hover:-translate-y-0.5 hover:border-black/10 hover:bg-[#f7f5f1]"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center justify-end gap-2 md:gap-3">
                    <MagneticButton
                        href="https://calendly.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        strength={0.35}
                        className="hidden items-center gap-2 rounded-full border border-black/14 bg-[#f7f5f1] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-black transition-colors hover:border-black hover:bg-white md:inline-flex"
                    >
                        <Calendar className="h-3.5 w-3.5 text-black" />
                        book 15 mins
                    </MagneticButton>

                    {socialLinks.map((item) => {
                        const Icon = item.icon
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={item.label}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/14 bg-white/85 text-black transition-all hover:-translate-y-0.5"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        )
                    })}
                </div>
            </div>
        </motion.header>
    )
}
