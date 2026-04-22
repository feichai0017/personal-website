"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Calendar, Coffee, Mail } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa6"

const contactLinks = [
    {
        label: "Email",
        value: "Ericsgc@outlook.com",
        href: "mailto:Ericsgc@outlook.com",
        icon: Mail,
    },
    {
        label: "Calendly",
        value: "Book 15 mins",
        href: "https://calendly.com/",
        icon: Calendar,
    },
]

const socials = [
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

const supportLink = {
    label: "Support",
    value: "Buy me a coffee",
    href: "https://buymeacoffee.com/eric.sgc",
}

export default function ContactMe() {
    return (
        <section id="contact" className="showcase-section bg-[#f7f5f1] px-4 py-24 text-[#0a0a0a]">
            <div className="mx-auto w-full max-w-[1800px] px-2 md:px-4 lg:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.55 }}
                    className="rounded-[40px] border border-black/8 bg-[#ece8df] p-8 md:p-12"
                >
                    <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36">/06 Contact</div>
                    <div className="mt-8 grid gap-10 xl:grid-cols-[1.06fr_0.94fr] xl:items-end">
                        <div>
                            <h2 className="text-5xl font-medium leading-[0.9] tracking-[-0.06em] text-black md:text-7xl">
                                Let&apos;s chat.
                                <span className="block text-black/48">Keep it direct.</span>
                            </h2>
                            <p className="mt-8 max-w-2xl text-lg leading-8 text-black/66">
                                If you&apos;re building something around systems, backend infrastructure, databases, or a
                                product that needs stronger technical taste, send me a note or book a short call.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {contactLinks.map((item) => {
                                const Icon = item.icon
                                return (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        target={item.href.startsWith("http") ? "_blank" : undefined}
                                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                        whileHover={{ y: -6, x: 3 }}
                                        whileTap={{ scale: 0.992 }}
                                        transition={{ type: "spring", stiffness: 280, damping: 24 }}
                                        className="flex items-center justify-between rounded-[28px] border border-black/8 bg-white/76 px-5 py-5 shadow-[0_14px_32px_rgba(10,10,10,0.04)]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                whileHover={{ scale: 1.08, rotate: -6 }}
                                                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-[#f7f5f1] text-black/64"
                                            >
                                                <Icon className="h-4 w-4" />
                                            </motion.div>
                                            <div>
                                                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/34">
                                                    {item.label}
                                                </div>
                                                <div className="mt-2 text-lg font-medium tracking-[-0.03em] text-black/82">
                                                    {item.value}
                                                </div>
                                            </div>
                                        </div>
                                        <motion.div whileHover={{ x: 2, y: -2 }} transition={{ duration: 0.18 }}>
                                            <ArrowUpRight className="h-4 w-4 text-black/42" />
                                        </motion.div>
                                    </motion.a>
                                )
                            })}

                            <motion.a
                                href={supportLink.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -6, x: 3 }}
                                whileTap={{ scale: 0.992 }}
                                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                                className="mt-1 flex items-center justify-between rounded-[28px] border border-black/8 bg-white/76 px-5 py-5 shadow-[0_14px_32px_rgba(10,10,10,0.04)]"
                            >
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.08, rotate: -6 }}
                                        transition={{ type: "spring", stiffness: 320, damping: 18 }}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-[#f7f5f1] text-black/64"
                                    >
                                        <Coffee className="h-4 w-4" />
                                    </motion.div>
                                    <div>
                                        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/34">
                                            {supportLink.label}
                                        </div>
                                        <div className="mt-2 text-lg font-medium tracking-[-0.03em] text-black/82">
                                            {supportLink.value}
                                        </div>
                                    </div>
                                </div>
                                <motion.div whileHover={{ x: 2, y: -2 }} transition={{ duration: 0.18 }}>
                                    <ArrowUpRight className="h-4 w-4 text-black/42" />
                                </motion.div>
                            </motion.a>

                            <div className="mt-4 flex gap-3">
                                {socials.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <motion.a
                                            key={item.label}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -5, scale: 1.07 }}
                                            whileTap={{ scale: 0.96 }}
                                            transition={{ type: "spring", stiffness: 340, damping: 22 }}
                                            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-white/76 text-black/66 shadow-[0_12px_24px_rgba(10,10,10,0.04)] hover:text-black"
                                        >
                                            <Icon className="h-4 w-4" />
                                        </motion.a>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
