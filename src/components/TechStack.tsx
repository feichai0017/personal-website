"use client"

import { motion } from "framer-motion"
import RevealHeadline from "@/components/RevealHeadline"
import {
    SiDocker,
    SiGo,
    SiKubernetes,
    SiNextdotjs,
    SiPostgresql,
    SiRust,
    SiTypescript,
    SiApachekafka,
} from "react-icons/si"

type StackItem = {
    name: string
    note: string
    Icon: React.ComponentType<{ className?: string }>
}

const featuredStack: StackItem[] = [
    { name: "Go", note: "backend services", Icon: SiGo },
    { name: "Rust", note: "engine internals", Icon: SiRust },
    { name: "PostgreSQL", note: "data systems", Icon: SiPostgresql },
    { name: "TypeScript", note: "product surfaces", Icon: SiTypescript },
    { name: "Next.js", note: "editorial frontend", Icon: SiNextdotjs },
    { name: "Docker", note: "repeatable shipping", Icon: SiDocker },
    { name: "Kubernetes", note: "distributed runtime", Icon: SiKubernetes },
    { name: "Kafka", note: "async pipelines", Icon: SiApachekafka },
]

const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
    }),
}

const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 36, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
    },
}

export default function TechStack() {
    return (
        <section id="techstack" className="showcase-section px-4 py-24 text-[#0a0a0a]">
            <div className="mx-auto w-full max-w-[1800px] px-2 md:px-4 lg:px-6">
                <div className="grid gap-12 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.22 }}
                        variants={sectionVariants}
                    >
                        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36">/04 Stack</div>
                        <RevealHeadline
                            as="h2"
                            lines={[
                                "Tools I reach for,",
                                { text: "kept close to the work.", className: "text-black/48" },
                            ]}
                            className="mt-6 max-w-3xl text-5xl font-medium leading-[0.9] tracking-[-0.06em] text-black md:text-7xl"
                        />
                        <p className="mt-8 max-w-2xl text-lg leading-8 text-black/66">
                            Not an exhaustive inventory. Just the core set I keep coming back to when the job spans
                            systems, product surfaces, data paths, and deployment.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={gridVariants}
                        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    >
                        {featuredStack.map(({ name, note, Icon }, index) => (
                            <motion.div
                                key={name}
                                variants={cardVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                className="rounded-[28px] border border-black/10 bg-white/76 p-5 shadow-[0_16px_36px_rgba(10,10,10,0.05)]"
                            >
                                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/30">
                                    0{index + 1}
                                </div>
                                <motion.div
                                    whileHover={{ rotate: -6, scale: 1.06 }}
                                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                                    className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-[#f7f5f1] text-black/74"
                                >
                                    <Icon className="h-5 w-5" />
                                </motion.div>
                                <h3 className="mt-5 text-2xl font-medium tracking-[-0.04em] text-black/88">{name}</h3>
                                <p className="mt-2 text-sm leading-7 text-black/58">{note}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
