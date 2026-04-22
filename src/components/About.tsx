"use client"

import { motion } from "framer-motion"
import RevealHeadline from "@/components/RevealHeadline"

const principles = [
    "The interesting part is usually not the patch, but the boundary that produced the bug.",
    "Systems semantics matter just as much as the interface sitting on top of them.",
    "A portfolio should feel authored and intentional, not like a terminal theme with content stuffed into it.",
]

const timeline = [
    {
        index: "01",
        title: "Research + systems work",
        body: "Current work sits around databases, storage engines, distributed systems, and query internals.",
    },
    {
        index: "02",
        title: "Full-stack delivery",
        body: "I still ship product surfaces, but I prefer work where frontend and backend are part of the same coherent system.",
    },
    {
        index: "03",
        title: "Engineering bias",
        body: "I optimize for structure, constraints, and root causes before polish and velocity theater.",
    },
]

const blockVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
    }),
}

export default function About() {
    return (
        <section id="about" className="showcase-section px-4 py-24 text-[#0a0a0a]">
            <div className="mx-auto w-full max-w-[1800px] px-2 md:px-4 lg:px-6">
                <div className="grid gap-14 xl:grid-cols-[0.92fr_1.08fr]">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={blockVariants}
                    >
                        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36">/02 About</div>
                        <RevealHeadline
                            as="h2"
                            lines={[
                                "Engineering systems",
                                { text: "that still read clearly", className: "text-black/50" },
                            ]}
                            className="mt-6 max-w-3xl text-5xl font-medium leading-[0.9] tracking-[-0.06em] md:text-7xl"
                        />
                        <p className="mt-8 max-w-2xl text-lg leading-8 text-black/66">
                            I work best on products where the interface and the internals are both first-class:
                            storage engines, backend platforms, distributed workflows, and the surfaces that make them
                            understandable.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            custom={0.04}
                            variants={blockVariants}
                            className="rounded-[34px] border border-black/8 bg-white/70 p-7"
                        >
                            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/36">
                                Principles
                            </div>
                            <div className="mt-6 space-y-5">
                                {principles.map((item, index) => (
                                    <motion.div
                                        key={item}
                                        whileHover={{ x: 6, y: -2 }}
                                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                        className="border-t border-dashed border-black/10 pt-5"
                                    >
                                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/30">
                                            0{index + 1}
                                        </div>
                                        <p className="mt-3 text-sm leading-7 text-black/70">{item}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            custom={0.08}
                            variants={blockVariants}
                            className="rounded-[34px] border border-black/8 bg-[#ece8df] p-7"
                        >
                            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/36">
                                Timeline
                            </div>
                            <div className="mt-6 space-y-6">
                                {timeline.map((item) => (
                                    <motion.div
                                        key={item.index}
                                        whileHover={{ x: 8, y: -2 }}
                                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                        className="grid gap-3 border-t border-dashed border-black/10 pt-5 md:grid-cols-[56px_1fr]"
                                    >
                                        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                                            {item.index}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-medium tracking-[-0.04em] text-black/86">{item.title}</h3>
                                            <p className="mt-3 text-sm leading-7 text-black/66">{item.body}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
