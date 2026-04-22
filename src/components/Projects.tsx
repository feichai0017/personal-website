"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useMotionValue } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight, MoveHorizontal, X } from "lucide-react"
import { FaGithub } from "react-icons/fa6"

type Project = {
    id: string
    title: string
    category: string
    year: string
    status: string
    description: string
    summary: string
    stack: string[]
    features: string[]
    image: string
    githubLink: string
}

const projects: Project[] = [
    {
        id: "01",
        title: "QuillSQL",
        category: "Database Engine",
        year: "2025",
        status: "Shipped",
        description: "A relational database in Rust focused on heap storage, B+Tree indexing, and MVCC concurrency control.",
        summary: "Built to explore storage layout, indexing, concurrency semantics, and query execution as one coherent engine story.",
        stack: ["Rust", "SQL", "MVCC", "B+Tree"],
        features: [
            "heap and index storage paths designed together",
            "concurrency semantics treated as first-order design constraints",
            "query execution shaped by engine invariants rather than toy assumptions",
        ],
        image: "/projects/quillsql-logo.png",
        githubLink: "https://github.com/feichai0017/QuillSQL",
    },
    {
        id: "02",
        title: "NoKV",
        category: "Distributed Storage",
        year: "2024",
        status: "Active",
        description: "A high-performance key-value engine built around LSM trees, lock-free structures, and distributed control paths.",
        summary: "This is the clearest expression of my interest in storage semantics, distributed behavior, and research-oriented systems engineering.",
        stack: ["Go", "LSM", "MVCC", "Raft"],
        features: [
            "lock-free data structures in the hot path",
            "consensus-aware distributed behavior instead of single-node benchmarking only",
            "engine design shaped by maintainability and experimental iteration",
        ],
        image: "/projects/nokv-logo.svg",
        githubLink: "https://github.com/feichai0017/NoKV",
    },
    {
        id: "03",
        title: "Plato IM",
        category: "Realtime System",
        year: "2024-now",
        status: "In Progress",
        description: "A distributed instant messaging system shaped around scale, reliability, and observability.",
        summary: "Designed as a system exercise in fan-out, asynchronous delivery, state coordination, and production-style monitoring loops.",
        stack: ["Go", "Kafka", "Redis", "Kubernetes"],
        features: [
            "message routing and queue-driven workflow design",
            "operability treated as part of the product",
            "large-scale concurrency constraints surfaced directly in the architecture",
        ],
        image: "/projects/IM-system.png",
        githubLink: "https://github.com/feichai0017/plato_distributed-IM-system",
    },
    {
        id: "04",
        title: "Financial AI",
        category: "Applied AI System",
        year: "2024",
        status: "Shipped",
        description: "A multi-agent financial system for transaction analysis, anti-fraud signals, and operational workflows.",
        summary: "A product-facing system where application logic, AI components, and service reliability had to coexist cleanly.",
        stack: ["React", "Java", "Python", "MySQL"],
        features: [
            "agent-style orchestration aligned with business workflows",
            "fraud-analysis features tied to real interface and service paths",
            "full-stack delivery across frontend, backend, and deployment concerns",
        ],
        image: "/projects/fin-care.png",
        githubLink: "https://github.com/CSUYSD/Anti-Scam-Financial-Management-Assistant",
    },
    {
        id: "05",
        title: "NoteLab",
        category: "Collaborative Product",
        year: "2024",
        status: "Shipped",
        description: "A Notion-style collaborative application with document editing, auth, and storage workflows.",
        summary: "Useful proof that I can still ship polished product surfaces without losing implementation discipline underneath.",
        stack: ["Next.js", "TypeScript", "Convex", "Clerk"],
        features: [
            "realtime collaboration in a user-facing product",
            "auth, storage, and editing flows designed as one system",
            "frontend polish anchored to clear application behavior",
        ],
        image: "/projects/notion-like.png",
        githubLink: "https://github.com/feichai0017/NoteLab",
    },
    {
        id: "06",
        title: "Personal Website",
        category: "Interactive Portfolio",
        year: "2026",
        status: "Active",
        description: "This site itself, treated as a designed artifact instead of a template with content dropped into it.",
        summary: "A running experiment in turning a technical portfolio into a more authored, editorial, and interactive engineering surface.",
        stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
        features: [
            "editorial layout instead of generic portfolio sections",
            "motion used to structure the reading flow, not distract from it",
            "design language tuned around systems-builder positioning",
        ],
        image: "/projects/portfolio.png",
        githubLink: "https://github.com/feichai0017/personal-website",
    },
]

function ProjectOverlay({
    project,
    onClose,
}: {
    project: Project | null
    onClose: () => void
}) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!project) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [project])

    if (!mounted || !project) return null

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(10,10,10,0.22)] p-4 backdrop-blur-[10px]"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-6xl overflow-hidden rounded-[34px] border border-black/10 bg-[#f7f5f1] text-[#0a0a0a] shadow-[0_30px_90px_rgba(10,10,10,0.12)]"
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        data-cursor="jump"
                        className="absolute right-5 top-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/88 text-black/68 transition-colors hover:text-black"
                        aria-label="Close project details"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="relative min-h-[320px] border-b border-black/8 bg-[#ece8df] lg:min-h-[640px] lg:border-b-0 lg:border-r">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 42vw"
                            />
                        </div>

                        <div className="p-7 md:p-10">
                            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/34">
                                {project.id} / 06
                            </div>
                            <h3 className="mt-5 text-4xl font-medium tracking-[-0.05em] text-black md:text-5xl">
                                {project.title}
                            </h3>
                            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-black/42">
                                <span>{project.category}</span>
                                <span className="text-black/20">/</span>
                                <span>{project.year}</span>
                                <span className="text-black/20">/</span>
                                <span>{project.status}</span>
                            </div>

                            <p className="mt-8 max-w-2xl text-base leading-8 text-black/68">
                                {project.summary}
                            </p>

                            <div className="mt-8">
                                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                                    Stack
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {project.stack.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-black/10 bg-white/78 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-black/56"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10">
                                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                                    What mattered
                                </div>
                                <div className="mt-5 space-y-4">
                                    {project.features.map((item, index) => (
                                        <div
                                            key={item}
                                            className="grid gap-3 border-t border-dashed border-black/10 pt-4 md:grid-cols-[44px_1fr]"
                                        >
                                            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/34">
                                                0{index + 1}
                                            </div>
                                            <p className="text-sm leading-7 text-black/68">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-cursor="open"
                                    className="inline-flex h-12 items-center gap-3 rounded-full bg-black px-6 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f7f5f1] transition-transform hover:-translate-y-0.5"
                                >
                                    <FaGithub className="h-4 w-4" />
                                    open repo
                                </a>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    data-cursor="jump"
                                    className="inline-flex h-12 items-center gap-3 rounded-full border border-black/10 bg-white/82 px-6 font-mono text-[11px] uppercase tracking-[0.24em] text-black/68 transition-transform hover:-translate-y-0.5 hover:text-black"
                                >
                                    close
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    )
}

function ProjectCard({
    project,
    onOpen,
}: {
    project: Project
    onOpen: () => void
}) {
    return (
        <button
            type="button"
            onClick={onOpen}
            data-cursor="open"
            className="group relative h-[450px] w-[86vw] max-w-[520px] shrink-0 overflow-hidden rounded-[30px] border border-black/10 bg-[#f7f5f1] text-left transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-2 hover:border-black/16 hover:shadow-[0_20px_44px_rgba(10,10,10,0.06)]"
        >
            <div className="relative h-[58%] overflow-hidden border-b border-black/8 bg-[#f7f5f1]">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    sizes="(max-width: 768px) 86vw, 520px"
                />
            </div>

            <div className="flex h-[42%] flex-col p-6 transition-transform duration-500 group-hover:-translate-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.24em] text-black/34">
                    <span>
                        {project.id} / 06
                    </span>
                    <span className="inline-flex items-center gap-2 text-black/54">
                        open
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                </div>

                <div className="mt-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/34">
                        {project.category}
                    </div>
                    <h3 className="mt-2 text-3xl font-medium tracking-[-0.05em] text-black">
                        {project.title}
                    </h3>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/66">
                    {project.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {project.stack.slice(0, 4).map((item) => (
                        <span
                            key={item}
                            className="rounded-full border border-black/10 bg-[#f7f5f1] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-black/52 transition-transform duration-500 group-hover:-translate-y-0.5"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </button>
    )
}

function DragLane({
    items,
    lane,
    initialEdge,
    direction,
    onOpen,
}: {
    items: Project[]
    lane: string
    initialEdge: "start" | "end"
    direction: "left" | "right"
    onOpen: (project: Project) => void
}) {
    const viewportRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const dragX = useMotionValue(0)
    const hasDraggedRef = useRef(false)
    const singleWidthRef = useRef(0)
    const [dragBounds, setDragBounds] = useState({ left: 0, right: 0 })
    const [isPaused, setIsPaused] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const duplicated = useMemo(() => [...items, ...items], [items])

    useEffect(() => {
        const measure = () => {
            if (!viewportRef.current || !trackRef.current) return

            const viewportWidth = viewportRef.current.offsetWidth
            const singleWidth = trackRef.current.scrollWidth / 2
            const overflow = Math.max(singleWidth, viewportWidth)
            const startX = initialEdge === "end" ? -singleWidth : 0

            singleWidthRef.current = singleWidth
            setDragBounds({ left: -overflow, right: overflow })
            dragX.set(startX)
        }

        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [dragX, duplicated, initialEdge])

    useEffect(() => {
        let frameId = 0
        let lastTime = performance.now()

        const step = (time: number) => {
            const elapsed = time - lastTime
            lastTime = time

            if (!isPaused && !isDragging && singleWidthRef.current > 0) {
                const speed = direction === "left" ? -0.05 : 0.05
                const next = dragX.get() + elapsed * speed
                const wrapWidth = singleWidthRef.current

                if (direction === "left") {
                    dragX.set(next <= -wrapWidth ? next + wrapWidth : next)
                } else {
                    dragX.set(next >= 0 ? next - wrapWidth : next)
                }
            }

            frameId = requestAnimationFrame(step)
        }

        frameId = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frameId)
    }, [direction, dragX, isDragging, isPaused])

    const handleCardOpen = (project: Project) => {
        if (hasDraggedRef.current) return
        onOpen(project)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                <span>{lane}</span>
                <span className="inline-flex items-center gap-2 text-black/50 transition-transform duration-300 hover:translate-x-1">
                    <MoveHorizontal className="h-4 w-4" />
                    drag to explore
                </span>
            </div>

            <div
                ref={viewportRef}
                className="overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <motion.div
                    ref={trackRef}
                    drag="x"
                    dragConstraints={dragBounds}
                    dragElastic={0.08}
                    dragTransition={{ bounceStiffness: 180, bounceDamping: 26 }}
                    style={{ x: dragX }}
                    data-cursor="drag"
                    onDragStart={() => {
                        hasDraggedRef.current = true
                        setIsDragging(true)
                    }}
                    onDragEnd={() => {
                        setIsDragging(false)
                        const wrapWidth = singleWidthRef.current
                        if (wrapWidth > 0) {
                            let next = dragX.get()
                            while (next <= -wrapWidth) next += wrapWidth
                            while (next > 0) next -= wrapWidth
                            dragX.set(next)
                        }
                        window.setTimeout(() => {
                            hasDraggedRef.current = false
                        }, 80)
                    }}
                    className="flex w-max gap-6 active:cursor-grabbing"
                >
                    {duplicated.map((project, index) => (
                        <ProjectCard
                            key={`${project.id}-${index}`}
                            project={project}
                            onOpen={() => handleCardOpen(project)}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default function Projects() {
    const [activeProject, setActiveProject] = useState<Project | null>(null)
    const topRow = useMemo(() => projects.slice(0, 3), [])
    const bottomRow = useMemo(() => projects.slice(3), [])

    return (
        <>
            <section id="projects" className="showcase-section bg-[#f7f5f1] px-4 py-24 text-[#0a0a0a]">
                <div className="mx-auto w-full max-w-[1800px] px-2 md:px-4 lg:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
                    >
                        <div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36">
                                /03 Selected Work
                            </div>
                            <h2 className="mt-6 max-w-5xl text-5xl font-medium leading-[0.9] tracking-[-0.06em] text-black md:text-7xl">
                                Six case studies,
                                <span className="block text-black/48">stacked into two lanes,</span>
                                <span className="block text-black/72">meant to be dragged through.</span>
                            </h2>
                        </div>

                        <p className="max-w-md text-sm leading-7 text-black/58">
                            Each row keeps moving on its own. Hover to pause, drag to inspect, and open any card for
                            the full system story behind it.
                        </p>
                    </motion.div>

                    <div className="mt-16 space-y-10">
                        <DragLane
                            items={topRow}
                            lane="row 1 / 2"
                            direction="right"
                            initialEdge="start"
                            onOpen={setActiveProject}
                        />
                        <DragLane
                            items={bottomRow}
                            lane="row 2 / 2"
                            direction="left"
                            initialEdge="end"
                            onOpen={setActiveProject}
                        />
                    </div>
                </div>
            </section>

            <ProjectOverlay project={activeProject} onClose={() => setActiveProject(null)} />
        </>
    )
}
