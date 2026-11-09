"use client"

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight, MoveHorizontal, Pause, Play, X } from "lucide-react"
import { FaGithub } from "react-icons/fa6"
import RevealHeadline from "@/components/RevealHeadline"
import MagneticButton from "@/components/MagneticButton"

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
    imageFit?: "cover" | "contain"
    githubLink: string
}

const projects: Project[] = [
    {
        id: "01",
        title: "QuillCache",
        category: "AI Cache Infra",
        year: "2026",
        status: "Active",
        description: "A Mooncake-faithful distributed KV cache system in Rust, extended with identity-safe reuse, a durable tier, and cache-aware routing.",
        summary: "QuillCache treats KV cache as first-class infra: transfer engine, store, residency index, and routing logic all shaped for real inference systems rather than toy demos.",
        stack: ["Rust", "KV Cache", "Mooncake", "HBM", "SSD"],
        features: [
            "faithful port of Mooncake's distributed KV cache store and transfer-engine decomposition",
            "identity-governed safe reuse so cache hits stay correct across models, tenants, and adapters",
            "persistent residency index and durable disk tier added for cache systems that survive restarts",
        ],
        image: "/projects/quillcache-repo-logo.svg",
        imageFit: "contain",
        githubLink: "https://github.com/feichai0017/quillcache",
    },
    {
        id: "02",
        title: "NoKV",
        category: "AI Native Filesystem",
        year: "2026",
        status: "Active",
        description: "An AI-native distributed filesystem and metadata control plane for object-backed agent artifacts, namespaces, and checkpoint-style workloads.",
        summary: "NoKV turns artifact-heavy AI workflows into a filesystem-shaped namespace with snapshots, watches, object-backed bodies, and a built-in metadata engine instead of a bolted-on external database.",
        stack: ["Rust", "Filesystem", "Object Storage", "FUSE", "Holt"],
        features: [
            "metadata control plane for object-backed artifacts, logs, checkpoints, and citable evidence",
            "path-native Holt metadata engine plus immutable object blocks in S3-compatible storage",
            "AI-native workflow primitives such as atomic publish, snapshots, watches, and generation-aware cleanup",
        ],
        image: "/projects/nokv-official-logo.svg",
        imageFit: "contain",
        githubLink: "https://github.com/feichai0017/NoKV",
    },
    {
        id: "03",
        title: "Holt",
        category: "Storage Engine",
        year: "2026",
        status: "Active",
        description: "A persistent Adaptive Radix Tree engine in Rust for path-shaped metadata workloads, prefix scans, and crash-safe persistence.",
        summary: "Holt is the storage-core expression of my systems bias: path-native keys, low read amplification, WAL-backed durability, and metadata operations designed around real namespace workloads.",
        stack: ["Rust", "ART", "WAL", "Prefix Scan"],
        features: [
            "persistent ART tuned for metadata paths rather than generic opaque-key workloads",
            "cheap prefix listing, delimiter rollup, and conditional metadata updates as first-class operations",
            "crash-safe WAL, checkpointing, and reopen recovery without LSM compaction drag",
        ],
        image: "/projects/holt-logo.png",
        imageFit: "contain",
        githubLink: "https://github.com/feichai0017/holt",
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
    const dialogRef = useRef<HTMLDivElement | null>(null)
    const closeButtonRef = useRef<HTMLButtonElement | null>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)
    const closeOverlay = useEffectEvent(onClose)

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

    useEffect(() => {
        if (!project) return

        previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault()
                closeOverlay()
                return
            }

            if (event.key !== "Tab" || !dialogRef.current) return
            const focusable = Array.from(
                dialogRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            )
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.cancelAnimationFrame(focusFrame)
            window.removeEventListener("keydown", handleKeyDown)
            previousFocusRef.current?.focus()
        }
    }, [project])

    if (!mounted) return null
    const imageObjectClass = project?.imageFit === "contain" ? "object-contain p-10 md:p-14" : "object-cover"

    return createPortal(
        <AnimatePresence>
            {project ? (
            <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(10,10,10,0.22)] p-4 backdrop-blur-[10px]"
                onClick={onClose}
            >
                <motion.div
                    ref={dialogRef}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="relative max-h-[calc(100dvh-2rem)] w-full max-w-6xl overflow-y-auto overscroll-contain rounded-[34px] border border-black/10 bg-[#f7f5f1] text-[#0a0a0a] shadow-[0_30px_90px_rgba(10,10,10,0.12)]"
                    onClick={(event) => event.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-dialog-title"
                    aria-describedby="project-dialog-summary"
                >
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        data-cursor="jump"
                        className="absolute right-5 top-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/88 text-black/68 transition-colors hover:text-black"
                        aria-label="Close project details"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                        <motion.div
                            layoutId={`project-visual-${project.id}`}
                            className="relative min-h-[320px] border-b border-black/8 bg-[#ece8df] lg:min-h-[640px] lg:border-b-0 lg:border-r"
                            transition={{ type: "spring", stiffness: 210, damping: 26 }}
                        >
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className={imageObjectClass}
                                sizes="(max-width: 1024px) 100vw, 42vw"
                            />
                        </motion.div>

                        <div className="p-7 md:p-10">
                            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/34">
                                {project.id} / 06
                            </div>
                            <h3 id="project-dialog-title" className="mt-5 text-4xl font-medium tracking-[-0.05em] text-black md:text-5xl">
                                {project.title}
                            </h3>
                            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-black/42">
                                <span>{project.category}</span>
                                <span className="text-black/20">/</span>
                                <span>{project.year}</span>
                                <span className="text-black/20">/</span>
                                <span>{project.status}</span>
                            </div>

                            <p id="project-dialog-summary" className="mt-8 max-w-2xl text-base leading-8 text-black/68">
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
                                <MagneticButton
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    strength={0.32}
                                    className="inline-flex h-12 items-center gap-3 rounded-full bg-black px-6 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f7f5f1] shadow-[0_14px_28px_rgba(10,10,10,0.14)]"
                                >
                                    <FaGithub className="h-4 w-4" />
                                    open repo
                                </MagneticButton>
                                <MagneticButton
                                    as="button"
                                    onClick={onClose}
                                    strength={0.28}
                                    className="inline-flex h-12 items-center gap-3 rounded-full border border-black/10 bg-white/85 px-6 font-mono text-[11px] uppercase tracking-[0.24em] text-black/68 hover:text-black"
                                >
                                    close
                                </MagneticButton>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            ) : null}
        </AnimatePresence>,
        document.body
    )
}

function ProjectCard({
    project,
    onOpen,
    accessible,
}: {
    project: Project
    onOpen: () => void
    accessible: boolean
}) {
    const cardRef = useRef<HTMLButtonElement | null>(null)
    const reduceMotion = useReducedMotion()
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 20 })
    const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 20 })
    const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        mx.set((e.clientX - rect.left) / rect.width - 0.5)
        my.set((e.clientY - rect.top) / rect.height - 0.5)
    }
    const handleLeave = () => {
        mx.set(0)
        my.set(0)
    }
    const imageObjectClass = project.imageFit === "contain"
        ? "object-contain p-8 md:p-10"
        : "object-cover"

    return (
        <motion.button
            ref={cardRef}
            type="button"
            onClick={onOpen}
            onMouseMove={reduceMotion ? undefined : handleMove}
            onMouseLeave={handleLeave}
            data-cursor="open"
            style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
            whileHover={reduceMotion ? undefined : { y: -8 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            aria-hidden={accessible ? undefined : true}
            tabIndex={accessible ? 0 : -1}
            className="group relative h-[450px] w-[86vw] max-w-[520px] shrink-0 overflow-hidden rounded-[30px] border border-black/10 bg-[#f7f5f1] text-left will-change-transform hover:border-black/14"
        >
            <motion.div
                layoutId={accessible ? `project-visual-${project.id}` : undefined}
                className="relative h-[58%] overflow-hidden border-b border-black/8 bg-[#f7f5f1]"
                transition={{ type: "spring", stiffness: 210, damping: 26 }}
            >
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`${imageObjectClass} transition-transform duration-700 group-hover:scale-[1.04]`}
                    sizes="(max-width: 768px) 86vw, 520px"
                />
            </motion.div>

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
        </motion.button>
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
    const settleTimerRef = useRef<number | null>(null)
    const laneInView = useInView(viewportRef, { margin: "240px 0px" })
    const reduceMotion = useReducedMotion()
    const [manualPaused, setManualPaused] = useState(false)
    const [hoverPaused, setHoverPaused] = useState(false)
    const [focusPaused, setFocusPaused] = useState(false)
    const [settling, setSettling] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [activeProjectId, setActiveProjectId] = useState(items[0]?.id ?? "01")
    const duplicated = useMemo(() => [...items, ...items, ...items], [items])
    const isPaused = manualPaused || hoverPaused || focusPaused || settling

    const normalizePosition = (value: number) => {
        const wrapWidth = singleWidthRef.current
        if (wrapWidth <= 0) return value

        let next = value
        while (next <= -2 * wrapWidth) next += wrapWidth
        while (next >= 0) next -= wrapWidth
        return next
    }

    useEffect(() => {
        const measure = () => {
            if (!viewportRef.current || !trackRef.current) return

            const singleWidth = trackRef.current.scrollWidth / 3
            const startX = initialEdge === "end" ? -singleWidth * 1.24 : -singleWidth

            singleWidthRef.current = singleWidth
            dragX.set(startX)
        }

        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [dragX, duplicated, initialEdge])

    useEffect(() => {
        return () => {
            if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current)
        }
    }, [])

    useMotionValueEvent(dragX, "change", (latest) => {
        const wrapWidth = singleWidthRef.current
        if (wrapWidth <= 0 || items.length === 0) return
        const itemWidth = wrapWidth / items.length
        const normalized = ((-latest % wrapWidth) + wrapWidth) % wrapWidth
        const index = Math.floor(normalized / itemWidth) % items.length
        const nextId = items[index]?.id
        if (nextId) setActiveProjectId((current) => (current === nextId ? current : nextId))
    })

    useEffect(() => {
        if (!laneInView || reduceMotion) return

        let frameId = 0
        let lastTime = performance.now()

        const step = (time: number) => {
            const elapsed = time - lastTime
            lastTime = time

            if (!isPaused && !isDragging && !document.hidden && singleWidthRef.current > 0) {
                const speed = direction === "left" ? -0.065 : 0.065
                const next = dragX.get() + elapsed * speed
                dragX.set(normalizePosition(next))
            }

            frameId = requestAnimationFrame(step)
        }

        frameId = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frameId)
    }, [direction, dragX, isDragging, isPaused, laneInView, reduceMotion])

    const handleCardOpen = (project: Project) => {
        if (hasDraggedRef.current) return
        onOpen(project)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                <span>{lane}</span>
                <div className="flex items-center gap-3">
                    <span className="text-black/44">{activeProjectId} / 06</span>
                    <button
                        type="button"
                        onClick={() => setManualPaused((paused) => !paused)}
                        aria-label={manualPaused ? `Play ${lane} project carousel` : `Pause ${lane} project carousel`}
                        aria-pressed={manualPaused}
                        className="inline-flex h-8 items-center gap-2 rounded-full border border-black/10 bg-[#f7f5f1] px-3 text-[9px] tracking-[0.2em] text-black/54 transition-colors hover:border-black/22 hover:text-black"
                    >
                        {manualPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                        {manualPaused ? "play" : "pause"}
                    </button>
                    <span className="hidden items-center gap-2 text-black/50 md:inline-flex">
                        <MoveHorizontal className="h-4 w-4" />
                        drag to explore
                    </span>
                </div>
            </div>

            <div
                ref={viewportRef}
                className="overflow-hidden touch-pan-y"
                onMouseEnter={() => setHoverPaused(true)}
                onMouseLeave={() => setHoverPaused(false)}
                onFocusCapture={() => setFocusPaused(true)}
                onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusPaused(false)
                }}
                role="region"
                aria-label={`${lane} project carousel`}
            >
                <motion.div
                    ref={trackRef}
                    drag="x"
                    dragMomentum={!reduceMotion}
                    dragElastic={0.02}
                    dragTransition={{ power: 0.12, timeConstant: 220, bounceStiffness: 120, bounceDamping: 20 }}
                    style={{ x: dragX }}
                    data-cursor="drag"
                    onDrag={(_, info) => {
                        const next = normalizePosition(dragX.get())
                        if (next !== dragX.get()) dragX.set(next)
                        if (Math.abs(info.offset.x) > 8) hasDraggedRef.current = true
                    }}
                    onDragStart={() => {
                        hasDraggedRef.current = true
                        setIsDragging(true)
                    }}
                    onDragEnd={() => {
                        setIsDragging(false)
                        dragX.set(normalizePosition(dragX.get()))
                        setSettling(true)
                        if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current)
                        settleTimerRef.current = window.setTimeout(() => setSettling(false), 1200)
                        window.setTimeout(() => {
                            hasDraggedRef.current = false
                        }, 80)
                    }}
                    className="flex w-max gap-6 active:cursor-grabbing"
                >
                    {duplicated.map((project, index) => {
                        const accessible = index >= items.length && index < items.length * 2
                        return (
                            <ProjectCard
                                key={`${project.id}-${index}`}
                                project={project}
                                accessible={accessible}
                                onOpen={() => handleCardOpen(project)}
                            />
                        )
                    })}
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
            <section id="projects" className="showcase-section px-4 py-20 text-[#0a0a0a]">
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
                            <RevealHeadline
                                as="h2"
                                lines={[
                                    "Six case studies,",
                                    { text: "stacked into two lanes,", className: "text-black/48" },
                                    { text: "meant to be dragged through.", className: "text-black/72" },
                                ]}
                                className="mt-6 max-w-5xl text-5xl font-medium leading-[0.9] tracking-[-0.06em] text-black md:text-7xl"
                            />
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
