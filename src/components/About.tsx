"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import HangingBadge from "@/components/HangingBadge"
import RevealHeadline from "@/components/RevealHeadline"

const smoothEase = [0.22, 1, 0.36, 1] as const

const principles = [
    "The interesting part is usually not the patch, but the control path or invariant that produced the bug.",
    "AI infra only stays honest when storage, cache, and serving semantics are treated as one system.",
    "Open-source work matters most when the code is real, the contract is clear, and the tradeoff is explicit.",
]

const timeline = [
    {
        index: "01",
        meta: "Now",
        title: "ByteDance AML",
        body: "Current work sits in AI infra: machine learning systems, distributed control paths, cache and storage surfaces, and the tooling around them.",
    },
    {
        index: "02",
        meta: "OSS",
        title: "Core contributor",
        body: "I contribute to DuckDB and Mooncake while building my own systems, so research-grade internals and production constraints stay in the same frame.",
    },
    {
        index: "03",
        meta: "Focus",
        title: "Storage + cache bias",
        body: "My strongest work sits around metadata engines, distributed filesystems, KV cache infra, and the product surfaces that expose them cleanly.",
    },
]

const blockVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay, ease: smoothEase },
    }),
}

export default function About() {
    return (
        <section id="about" className="showcase-section px-4 py-20 text-[#0a0a0a]">
            <div className="mx-auto w-full max-w-[1800px] px-2 md:px-4 lg:px-6">
                <div className="grid gap-10 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
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
                                "AI infra, storage,",
                                { text: "and systems that still read clearly", className: "text-black/50" },
                            ]}
                            className="mt-6 max-w-3xl text-5xl font-medium leading-[0.9] tracking-[-0.06em] md:text-7xl"
                        />
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                        custom={0.05}
                        variants={blockVariants}
                        className="border-t border-black/12 pt-6"
                    >
                        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-black/36">
                            <span>Current surface</span>
                            <span>Beijing / 2026</span>
                        </div>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-black/66">
                            I work at the boundary between AI infra and systems engineering: model-serving control
                            planes, cache and storage engines, distributed workflows, and the interfaces that make
                            complex internals legible.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[8px] uppercase tracking-[0.2em]">
                            <Link
                                href="/#projects"
                                className="rounded-full border border-black/12 px-4 py-2.5 text-black/54 transition-colors hover:border-black/28 hover:text-black"
                            >
                                selected work ↗
                            </Link>
                            <Link
                                href="/blog"
                                className="rounded-full border border-black/12 px-4 py-2.5 text-black/54 transition-colors hover:border-black/28 hover:text-black"
                            >
                                field notes ↗
                            </Link>
                            <a
                                href="https://github.com/feichai0017"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-black/12 px-4 py-2.5 text-black/54 transition-colors hover:border-black/28 hover:text-black"
                            >
                                github ↗
                            </a>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-14 grid items-stretch gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.12 }}
                        custom={0.06}
                        variants={blockVariants}
                    >
                        <HangingBadge />
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.12 }}
                        custom={0.1}
                        variants={blockVariants}
                        data-testid="about-timeline"
                        className="flex h-full flex-col rounded-[38px] border border-black/10 bg-[#ece8df] p-7 xl:h-[660px]"
                    >
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-black/36">
                            <span>Timeline</span>
                            <span>03 nodes</span>
                        </div>

                        <div className="mt-6 grid flex-1 xl:grid-rows-3">
                            {timeline.map((item) => (
                                <motion.div
                                    key={item.index}
                                    whileHover={{ x: 6 }}
                                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                                    className="grid content-center gap-4 border-t border-dashed border-black/12 py-6 md:grid-cols-[56px_minmax(0,1fr)_auto]"
                                >
                                    <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-black/34">
                                        {item.index}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-medium tracking-[-0.04em] text-black/86">{item.title}</h3>
                                        <p className="mt-3 max-w-2xl text-sm leading-7 text-black/66">{item.body}</p>
                                    </div>
                                    <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/30 md:pt-1">
                                        {item.meta}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 border-t border-black/12 pt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-black/34">
                            <div>
                                <div>Location</div>
                                <div className="mt-2 text-black/72">Beijing</div>
                            </div>
                            <div className="border-l border-black/10 pl-4">
                                <div>Focus</div>
                                <div className="mt-2 text-black/72">AI Infra</div>
                            </div>
                            <div className="border-l border-black/10 pl-4">
                                <div>Mode</div>
                                <div className="mt-2 text-black/72">Building</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    custom={0.14}
                    variants={blockVariants}
                    className="mt-6 overflow-hidden rounded-[38px] border border-black/10 bg-white/68 p-7"
                >
                    <div className="flex items-center justify-between border-b border-black/10 pb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-black/36">
                        <span>Principles</span>
                        <span>Operating rules / 03</span>
                    </div>
                    <div className="grid md:grid-cols-3">
                        {principles.map((item, index) => (
                            <motion.div
                                key={item}
                                whileHover={{ y: -4 }}
                                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                className="border-t border-dashed border-black/10 py-6 md:border-l md:border-t-0 md:px-6 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
                            >
                                <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-black/28">
                                    0{index + 1}
                                </div>
                                <p className="mt-4 max-w-md text-sm leading-7 text-black/68">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
