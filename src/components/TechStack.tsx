"use client"

import React, { useMemo, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    SiPython, SiGo, SiJavascript, SiTypescript, SiGin, SiHtml5, SiCss3, SiReact,
    SiMysql, SiPostgresql, SiMongodb, SiRedis, SiElasticsearch, SiGit, SiLinux,
    SiDocker, SiRabbitmq, SiKubernetes, SiApachekafka, SiRust, SiC, SiCplusplus, SiNextdotjs
} from "react-icons/si"
import { FaAws } from "react-icons/fa"
import { TbServer } from "react-icons/tb"
import { Code2, Layers, Database, Globe, Terminal, Sparkles } from "lucide-react"

interface Tech {
    name: string
    Icon: React.ComponentType<any>
    color: string
    category: "language" | "framework" | "frontend" | "database" | "tool"
    description: string
}

const techStack: Tech[] = [
    { name: "Rust", Icon: SiRust, color: "#CE4A00", category: "language", description: "Memory-safe systems engineering" },
    { name: "C", Icon: SiC, color: "#00599C", category: "language", description: "Low-level runtime tuning" },
    { name: "C++", Icon: SiCplusplus, color: "#00599C", category: "language", description: "High-performance computing" },
    { name: "Python", Icon: SiPython, color: "#3776AB", category: "language", description: "Automation & data tooling" },
    { name: "Go", Icon: SiGo, color: "#00ADD8", category: "language", description: "Cloud-native services" },
    { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E", category: "language", description: "Interactive experiences" },
    { name: "TypeScript", Icon: SiTypescript, color: "#3178C6", category: "language", description: "Type-safe JS applications" },

    { name: "Next.js", Icon: SiNextdotjs, color: "#000000", category: "framework", description: "Hybrid web applications" },
    { name: "Gin", Icon: SiGin, color: "#00ADD8", category: "framework", description: "Go web framework" },

    { name: "HTML5", Icon: SiHtml5, color: "#E34F26", category: "frontend", description: "Semantic structure" },
    { name: "CSS3", Icon: SiCss3, color: "#1572B6", category: "frontend", description: "Responsive styling" },
    { name: "React", Icon: SiReact, color: "#61DAFB", category: "frontend", description: "Component-driven UI" },

    { name: "MySQL", Icon: SiMysql, color: "#4479A1", category: "database", description: "Relational backbone" },
    { name: "PostgreSQL", Icon: SiPostgresql, color: "#336791", category: "database", description: "Advanced SQL features" },
    { name: "MongoDB", Icon: SiMongodb, color: "#47A248", category: "database", description: "Document storage" },
    { name: "Redis", Icon: SiRedis, color: "#DC382D", category: "database", description: "Ultra-fast caching" },
    { name: "ElasticSearch", Icon: SiElasticsearch, color: "#005571", category: "database", description: "Text search engine" },
    { name: "etcd", Icon: TbServer, color: "#419EDA", category: "database", description: "Distributed coordination" },

    { name: "Git", Icon: SiGit, color: "#F05032", category: "tool", description: "Version control" },
    { name: "Linux", Icon: SiLinux, color: "#FCC624", category: "tool", description: "Production OS" },
    { name: "AWS", Icon: FaAws, color: "#232F3E", category: "tool", description: "Cloud primitives" },
    { name: "Docker", Icon: SiDocker, color: "#2496ED", category: "tool", description: "Containerization" },
    { name: "Kafka", Icon: SiApachekafka, color: "#231F20", category: "tool", description: "Streaming backbone" },
    { name: "RabbitMQ", Icon: SiRabbitmq, color: "#FF6600", category: "tool", description: "Message queue" },
    { name: "Kubernetes", Icon: SiKubernetes, color: "#326CE5", category: "tool", description: "Cluster orchestration" },
]

const categoryNames: Record<Tech["category"], string> = {
    language: "Languages",
    framework: "Frameworks",
    frontend: "Frontend",
    database: "Data & Storage",
    tool: "Tools & DevOps",
}

const categoryMeta: Record<Tech["category"], { icon: React.ComponentType<any>; accent: string; summary: string }> = {
    language: { icon: Code2, accent: "#CFA086", summary: "Crafting performant services with type-safe, memory-aware code." },
    framework: { icon: Layers, accent: "#7CA6B8", summary: "Full-stack frameworks for production-ready shipping." },
    frontend: { icon: Globe, accent: "#7D9FDB", summary: "Design systems and micro-interactions for web experiences." },
    database: { icon: Database, accent: "#9BB89F", summary: "Relational, document, and real-time storage expertise." },
    tool: { icon: Terminal, accent: "#B38BBE", summary: "Infrastructure, observability, and deployment workflows." },
}

const orbitLayers = [
    { id: "core", label: "Core Languages", categories: ["language"], radius: 115, duration: 60, glow: "rgba(207, 160, 134, 0.25)", xScale: 0.85, yScale: 0.65 },
    { id: "frontend", label: "Web Experience", categories: ["framework", "frontend"], radius: 180, duration: 70, glow: "rgba(125, 159, 219, 0.25)", xScale: 1.02, yScale: 0.8 },
    { id: "data", label: "Data Systems", categories: ["database"], radius: 235, duration: 80, glow: "rgba(155, 184, 159, 0.25)", xScale: 1.18, yScale: 0.94 },
    { id: "devops", label: "DevOps Orbit", categories: ["tool"], radius: 280, duration: 90, glow: "rgba(179, 139, 190, 0.25)", xScale: 1.28, yScale: 1.08 },
]

const categoryInsights: Record<Tech["category"], string[]> = {
    language: ["Systems-first mindset", "Control over performance", "Safety without sacrificing speed"],
    framework: ["Production-ready scaffolding", "Design systems & DX", "Progressive enhancement"],
    frontend: ["Motion storytelling", "Pixel-perfect detail", "Accessibility aware"],
    database: ["Query planner tuning", "Index/storage internals", "Consistency + throughput"],
    tool: ["Cloud-native delivery", "Infra as code", "Observability pipelines"],
}

const TechStack = () => {
    const { theme, resolvedTheme } = useTheme()
    const sectionRef = useRef<HTMLDivElement>(null)
    const inView = useInView(sectionRef, { once: true, amount: 0.2 })
    const [activeTech, setActiveTech] = useState<Tech>(techStack[0])
    const [activeIndex, setActiveIndex] = useState(0)
    const isDark = (resolvedTheme || theme || "light").includes("dark")
    const planetSize = 74

    const groupedTech = useMemo(() => {
        return techStack.reduce<Record<Tech["category"], Tech[]>>((acc, tech) => {
            if (!acc[tech.category]) acc[tech.category] = []
            acc[tech.category].push(tech)
            return acc
        }, {
            language: [],
            framework: [],
            frontend: [],
            database: [],
            tool: [],
        })
    }, [])

    const orbitData = useMemo(() => {
        return orbitLayers
            .map(layer => ({
                ...layer,
                items: layer.categories.flatMap(category => groupedTech[category as Tech["category"]] || []),
            }))
            .filter(layer => layer.items.length > 0)
    }, [groupedTech])

    const orbitRenderOrder = useMemo(() => [...orbitData].sort((a, b) => b.radius - a.radius), [orbitData])

    const planetPaths = useMemo(() => {
        const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min
        const config: Record<string, { x: number[]; y: number[]; duration: number }> = {}
        techStack.forEach(tech => {
            const steps = 4
            const xs: number[] = []
            const ys: number[] = []
            for (let i = 0; i < steps; i++) {
                xs.push(randomBetween(-18, 18))
                ys.push(randomBetween(-12, 12))
            }
            xs.push(xs[0])
            ys.push(ys[0])
            config[tech.name] = {
                x: xs,
                y: ys,
                duration: randomBetween(9, 13),
            }
        })
        return config
    }, [])

    const handleActivateTech = (tech: Tech) => {
        setActiveTech(tech)
        const idx = techStack.findIndex(t => t.name === tech.name)
        if (idx >= 0) {
            setActiveIndex(idx)
        }
    }

    return (
        <section
            id="techstack"
            ref={sectionRef}
            className="relative overflow-hidden py-20 px-4 bg-morandi-bg dark:bg-[#03040a] transition-colors duration-500"
        >
            <motion.div
                className="absolute inset-0 -z-10"
                initial={false}
                animate={{
                    background: isDark
                        ? "radial-gradient(circle at 20% 20%, rgba(20, 17, 24, 0.95), transparent 65%), radial-gradient(circle at 80% 70%, rgba(18, 30, 40, 0.85), transparent 65%)"
                        : "radial-gradient(circle at 20% 20%, rgba(247, 242, 236, 0.95), transparent 65%), radial-gradient(circle at 80% 70%, rgba(233, 223, 214, 0.9), transparent 65%)",
                }}
                transition={{ duration: 0.8 }}
            />

            <div className="max-w-6xl mx-auto relative z-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm text-morandi-text/70 dark:text-morandi-light/70">
                            <Sparkles className="w-4 h-4" />
                            <span>System + Product Engineering Stack</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-morandi-dark dark:text-morandi-light">
                            Technologies that orbit my workflow
                        </h2>
                        <p className="text-lg text-morandi-text dark:text-morandi-light/80 max-w-2xl">
                            A curated toolkit that moves between low-level systems, database internals,
                            and delightful front-end experiences—always tuned for performance and stability.
                        </p>
                    </motion.div>

                    <Card className="relative overflow-hidden border-0 bg-white/85 dark:bg-white/5 backdrop-blur-xl p-6">
                        <motion.div
                            key={activeTech.name}
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 0.2, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                background: `radial-gradient(circle at 10% 10%, ${activeTech.color}45, transparent 60%)`,
                            }}
                        />
                        <div className="relative flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-morandi-accent/15 text-morandi-accent border-morandi-accent/30">
                                    {categoryNames[activeTech.category]}
                                </Badge>
                                <motion.span
                                    key={`${activeTech.name}-hint`}
                                    className="text-sm text-morandi-text/70 dark:text-morandi-light/70 flex items-center gap-1"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                >
                                    Hover planets to switch focus
                                </motion.span>
                            </div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-morandi-text/50 dark:text-morandi-light/50">
                                <span>Focused</span>
                                <motion.span
                                    key={`index-${activeIndex}`}
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    className="text-morandi-dark dark:text-morandi-light"
                                >
                                    #{String(activeIndex + 1).padStart(2, "0")}
                                </motion.span>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTech.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex items-center gap-4"
                                >
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                                        style={{ borderColor: `${activeTech.color}50`, background: `${activeTech.color}10` }}
                                    >
                                        <activeTech.Icon size={32} color={activeTech.color} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-morandi-dark dark:text-morandi-light">
                                            {activeTech.name}
                                        </h3>
                                        <p className="text-morandi-text dark:text-morandi-light/80">
                                            {activeTech.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`${activeTech.category}-summary`}
                                    className="text-sm text-morandi-text/80 dark:text-morandi-light/70 leading-relaxed"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {categoryMeta[activeTech.category].summary}
                                </motion.p>
                            </AnimatePresence>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {categoryInsights[activeTech.category].map(point => (
                                    <motion.div
                                        key={point}
                                        className="rounded-2xl border px-3 py-2 text-xs tracking-wide uppercase text-morandi-text/70 dark:text-morandi-light/70"
                                        style={{ borderColor: `${activeTech.color}30` }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {point}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(categoryNames).map(([key, label]) => {
                            const meta = categoryMeta[key as Tech["category"]]
                            const Icon = meta.icon
                            const count = groupedTech[key as Tech["category"]]?.length ?? 0
                            return (
                                <motion.div
                                    key={key}
                                    className="relative rounded-2xl border border-white/10 bg-morandi-light/70 dark:bg-white/5 backdrop-blur-xl p-4 overflow-hidden"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl"
                                        style={{ background: `${meta.accent}15` }}
                                        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.03, 1] }}
                                        transition={{ duration: 5, repeat: Infinity, delay: Math.random() * 2 }}
                                    />
                                    <div className="relative flex items-center gap-3">
                                        <motion.div
                                            className="p-3 rounded-xl"
                                            style={{
                                                background: `${meta.accent}20`,
                                                border: `1px solid ${meta.accent}40`,
                                            }}
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <Icon className="w-4 h-4" style={{ color: meta.accent }} />
                                        </motion.div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-morandi-text/60 dark:text-morandi-light/60">
                                                {label}
                                            </p>
                                            <motion.p
                                                className="text-lg font-semibold text-morandi-dark dark:text-morandi-light"
                                                animate={{ letterSpacing: ["0.1em", "0.2em", "0.1em"] }}
                                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <motion.span
                                                    className="inline-block"
                                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                                    transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                                                >
                                                    {count}
                                                </motion.span>{" "}
                                                tools
                                            </motion.p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="relative h-[580px] flex items-center justify-center overflow-visible"
                >
                    <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-morandi-hover/30 via-transparent to-morandi-accent/20 blur-3xl pointer-events-none" />
                    <motion.div
                        className="absolute w-28 h-28 rounded-full border border-morandi-accent/40 flex items-center justify-center pointer-events-none"
                        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.25, 0.4, 0.25] }}
                        transition={{ duration: 6, repeat: Infinity }}
                    >
                        <div className="w-16 h-16 rounded-full bg-morandi-accent/20 blur-xl" />
                    </motion.div>

                    {orbitRenderOrder.map((layer, layerIndex) => (
                        <div
                            key={layer.id}
                            className="absolute"
                            style={{
                                width: layer.radius * 2 * layer.xScale,
                                height: layer.radius * 2 * layer.yScale,
                                left: "50%",
                                top: "50%",
                                marginLeft: -layer.radius * layer.xScale,
                                marginTop: -layer.radius * layer.yScale,
                                zIndex: layerIndex + 1,
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-full pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle, transparent 45%, ${layer.glow})`,
                                    filter: "blur(35px)",
                                }}
                                animate={{ opacity: [0.12, 0.3, 0.12] }}
                                transition={{ duration: 8, repeat: Infinity, delay: layerIndex * 0.4 }}
                            />
                            <div className="absolute inset-0">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        border: `1px dashed ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                                        opacity: 0.25,
                                        maskImage: "radial-gradient(circle, rgba(0,0,0,0.9) 45%, transparent 75%)",
                                    }}
                                />
                            </div>
                            {layer.items.map((tech, index) => {
                                const angle = layer.items.length ? (index / layer.items.length) * 360 : 0
                                const radian = (angle * Math.PI) / 180
                                const baseX = Math.cos(radian) * layer.radius * layer.xScale
                                const baseY = Math.sin(radian) * layer.radius * layer.yScale
                                const isActive = activeTech.name === tech.name
                                const path = planetPaths[tech.name]
                                const xKeyframes = path.x.map(offset => baseX + offset)
                                const yKeyframes = path.y.map(offset => baseY + offset)

                                return (
                                    <motion.div
                                        key={`${layer.id}-${tech.name}`}
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                        initial={{ x: baseX, y: baseY }}
                                        animate={{ x: xKeyframes, y: yKeyframes }}
                                        transition={{
                                            duration: path.duration,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        style={{ zIndex: isActive ? 50 : 10 }}
                                    >
                                        <motion.button
                                            type="button"
                                            className="relative flex flex-col items-center justify-center gap-2 rounded-3xl border backdrop-blur-xl focus:outline-none"
                                            style={{
                                                width: planetSize,
                                                height: planetSize,
                                                borderColor: isActive ? `${tech.color}` : `${tech.color}35`,
                                                background: isActive ? `${tech.color}22` : `${tech.color}12`,
                                                boxShadow: isActive ? `0 18px 40px ${tech.color}40` : "0 8px 20px rgba(0,0,0,0.08)",
                                            }}
                                            onMouseEnter={() => handleActivateTech(tech)}
                                            onFocus={() => handleActivateTech(tech)}
                                            onClick={() => handleActivateTech(tech)}
                                            whileHover={{ scale: 1.08 }}
                                            transition={{ type: "spring", stiffness: 280, damping: 18 }}
                                        >
                                            <div className="flex items-center justify-center rounded-2xl p-2" style={{ background: `${tech.color}18` }}>
                                                <tech.Icon size={24} color={tech.color} />
                                            </div>
                                            <motion.span
                                                className="text-[11px] font-semibold text-center px-2 text-morandi-dark dark:text-morandi-light truncate w-full"
                                                animate={{ opacity: isActive ? 1 : 0.75 }}
                                                title={tech.name}
                                            >
                                                {tech.name}
                                            </motion.span>
                                        </motion.button>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default TechStack
