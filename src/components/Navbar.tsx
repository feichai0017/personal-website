"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { BookOpenText, Calendar } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa6"
import MagneticButton from "@/components/MagneticButton"
import KnowledgeCommandPalette from "@/components/KnowledgeCommandPalette"
import { isKnowledgePath } from "@/lib/knowledge"
import { meetingHref, meetingIsExternal } from "@/lib/site-links"

const navLinks = [
    { id: "about", label: "About", href: "/#about" },
    { id: "projects", label: "Work", href: "/#projects" },
    { id: "techstack", label: "Stack", href: "/#techstack" },
    { id: "experience", label: "Experience", href: "/#experience" },
    { id: "contact", label: "Contact", href: "/#contact" },
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
    const pathname = usePathname()
    const hideNavbar = pathname.startsWith("/studio") || isKnowledgePath(pathname)
    const { scrollYProgress } = useScroll()
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 22, mass: 0.3 })
    const reduceMotion = useReducedMotion()
    const [activeSection, setActiveSection] = useState<string | null>(null)

    useEffect(() => {
        if (hideNavbar) return

        let frame = 0

        const updateActiveSection = () => {
            frame = 0
            if (window.scrollY < window.innerHeight * 0.48) {
                setActiveSection(null)
                return
            }

            const activationLine = window.innerHeight * 0.38
            let nextSection: string | null = null

            navLinks.forEach(({ id }) => {
                const section = document.getElementById(id)
                if (!section) return
                const rect = section.getBoundingClientRect()
                if (rect.top <= activationLine && rect.bottom >= activationLine) {
                    nextSection = id
                }
            })

            setActiveSection(nextSection)
        }

        const scheduleUpdate = () => {
            if (frame) return
            frame = window.requestAnimationFrame(updateActiveSection)
        }

        updateActiveSection()
        window.addEventListener("scroll", scheduleUpdate, { passive: true })
        window.addEventListener("resize", scheduleUpdate)

        return () => {
            if (frame) window.cancelAnimationFrame(frame)
            window.removeEventListener("scroll", scheduleUpdate)
            window.removeEventListener("resize", scheduleUpdate)
        }
    }, [hideNavbar])

    if (hideNavbar) return null

    return (
        <motion.header
            initial={false}
            className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-6"
        >
            <div className="relative mx-auto grid w-full max-w-[1800px] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full border border-black/15 bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(10,10,10,0.12)] backdrop-blur-xl md:px-5">
                <motion.div
                    aria-hidden
                    style={{ scaleX: progress }}
                    className="pointer-events-none absolute inset-x-5 bottom-1.5 h-px origin-left bg-black/55"
                />
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 text-left"
                >
                    <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-black">GS</span>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-medium tracking-[-0.02em] text-black">Guocheng Song</span>
                        <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.24em] text-black md:block">
                            systems builder
                        </span>
                    </div>
                </Link>

                <nav className="hidden items-center justify-center gap-2 lg:flex">
                    {navLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={activeSection === item.id ? "location" : undefined}
                            className="relative inline-flex h-10 items-center rounded-full border border-transparent px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#f7f5f1]"
                        >
                            <span className="relative z-10">{item.label}</span>
                            {activeSection === item.id ? (
                                <motion.span
                                    layoutId="navbar-active-section"
                                    className="absolute inset-x-3 bottom-1.5 h-px bg-black"
                                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
                                />
                            ) : null}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center justify-end gap-2 md:gap-3">
                    <KnowledgeCommandPalette />
                    <MagneticButton
                        href="/blog"
                        strength={0.35}
                        ariaLabel="Read blog"
                        className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7f5f1] shadow-[0_12px_28px_rgba(10,10,10,0.14)] md:px-4 md:text-[11px] md:tracking-[0.24em]"
                    >
                        <BookOpenText className="h-3.5 w-3.5" />
                        <span className="md:hidden">blog</span>
                        <span className="hidden md:inline">read blog</span>
                    </MagneticButton>

                    <MagneticButton
                        href={meetingHref}
                        target={meetingIsExternal ? "_blank" : undefined}
                        rel={meetingIsExternal ? "noopener noreferrer" : undefined}
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
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/14 bg-white/90 text-black transition-all hover:-translate-y-0.5"
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
