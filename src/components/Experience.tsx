"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { geoEqualEarth } from "d3-geo"
import { motion } from "framer-motion"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import { Briefcase, GraduationCap, Minus, Plus, RotateCcw } from "lucide-react"

type Experience = {
    id: string
    title: string
    organization: string
    location: string
    period: string
    description: string
    achievements: string[]
    type: "education" | "work"
    skills: string[]
    region: "anz" | "china" | "uk"
}

type LocationNode = {
    id: string
    city: string
    country: string
    coordinates: [number, number]
    region: Experience["region"]
    entries: Experience[]
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const DEFAULT_MAP_WIDTH = 980
const INITIAL_CENTER: [number, number] = [78, 8]
const INITIAL_ZOOM = 1.28
const MIN_ZOOM = 1
const MAX_ZOOM = 3.4

const experiences: Experience[] = [
    {
        id: "exp-01",
        title: "Research Assistant",
        organization: "UNSW",
        location: "Sydney, Australia",
        period: "Feb 2025 - Present",
        description: "Researching database optimization techniques with a focus on SQL query optimization and low-level performance behavior.",
        achievements: [
            "developed novel database indexing ideas",
            "improved query performance by 40% in targeted workloads",
            "published research work around data systems and optimization",
        ],
        type: "work",
        skills: ["Database Systems", "SQL Optimization", "Research", "Performance Tuning"],
        region: "anz",
    },
    {
        id: "exp-02",
        title: "Full Stack Developer",
        organization: "Datap.ai",
        location: "Sydney, Australia",
        period: "Jul 2024",
        description: "Built product-facing web systems with React, Node.js, and TypeScript while driving code quality and delivery improvements.",
        achievements: [
            "led a team of 5 developers",
            "reduced load time by 60%",
            "implemented CI/CD workflows and stronger delivery discipline",
        ],
        type: "work",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        region: "anz",
    },
    {
        id: "exp-03",
        title: "Master of Computer Science",
        organization: "University of Sydney",
        location: "Sydney, Australia",
        period: "Feb 2024",
        description: "Advanced study focused on software systems, databases, and distributed computing.",
        achievements: [
            "GPA: 4.0 / 4.0",
            "deep coursework in advanced database systems",
            "stronger academic grounding in distributed computing",
        ],
        type: "education",
        skills: ["Algorithms", "System Design", "Data Science", "Cloud Computing"],
        region: "anz",
    },
    {
        id: "exp-04",
        title: "AI Developer Engineer",
        organization: "Seetrum",
        location: "Shanghai, China",
        period: "Mar 2023 - Nov 2023",
        description: "Built full-stack web portals and applied ML systems for spectroscopy-chip products with frontend, backend, and model-inference integration.",
        achievements: [
            "trained CNN and Transformer models for spectral recognition",
            "automated retraining and deployment workflows to ARM edge devices",
            "achieved real-time classification under 150 ms latency",
        ],
        type: "work",
        skills: ["React", "TypeScript", "Python", "Transformer", "GitHub Actions", "Edge Computing"],
        region: "china",
    },
    {
        id: "exp-05",
        title: "Laboratory Assistant (Intern)",
        organization: "WuXi AppTec",
        location: "Shanghai, China",
        period: "Jun 2022 - Jan 2023",
        description: "Worked across AI-driven drug discovery pipelines, reaction datasets, and computational chemistry workflows.",
        achievements: [
            "built predictive chemistry pipelines on 100k+ curated reactions",
            "validated in-silico predictions with bench-scale experiments",
            "automated data capture and reporting for 30% faster turnaround",
        ],
        type: "work",
        skills: ["PyTorch Geometric", "QSAR", "Computational Chemistry", "Deep Learning"],
        region: "china",
    },
    {
        id: "exp-06",
        title: "Bachelor's in Chemistry",
        organization: "University College London",
        location: "London, UK",
        period: "Sep 2020",
        description: "Built a research-first foundation in chemistry with strong analytical and technical writing habits.",
        achievements: [
            "graduated with First Class Honours",
            "received a research project award",
            "published undergraduate thesis work",
        ],
        type: "education",
        skills: ["Research Methods", "Data Analysis", "Problem Solving", "Technical Writing"],
        region: "uk",
    },
]

const regionAccent: Record<Experience["region"], string> = {
    anz: "#1e3a8a",
    china: "#b45309",
    uk: "#4c1d95",
}

const locationNodes: LocationNode[] = [
    {
        id: "loc-sydney",
        city: "Sydney",
        country: "Australia",
        coordinates: [151.2093, -33.8688],
        region: "anz",
        entries: experiences.filter((item) => item.location.includes("Sydney")),
    },
    {
        id: "loc-shanghai",
        city: "Shanghai",
        country: "China",
        coordinates: [121.4737, 31.2304],
        region: "china",
        entries: experiences.filter((item) => item.location.includes("Shanghai")),
    },
    {
        id: "loc-london",
        city: "London",
        country: "United Kingdom",
        coordinates: [-0.1276, 51.5072],
        region: "uk",
        entries: experiences.filter((item) => item.location.includes("London")),
    },
]

const routeOrder = ["loc-london", "loc-shanghai", "loc-sydney"] as const

function createRoutePath(from: [number, number], to: [number, number]) {
    const [x1, y1] = from
    const [x2, y2] = to
    const curveHeight = Math.min(110, Math.abs(x2 - x1) * 0.16 + 48)
    const controlX = (x1 + x2) / 2
    const controlY = Math.min(y1, y2) - curveHeight

    return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`
}

export default function Experience() {
    const [activeLocationId, setActiveLocationId] = useState(locationNodes[0].id)
    const mapFrameRef = useRef<HTMLDivElement | null>(null)
    const [mapWidth, setMapWidth] = useState(DEFAULT_MAP_WIDTH)
    const [mapCenter, setMapCenter] = useState<[number, number]>(INITIAL_CENTER)
    const [mapZoom, setMapZoom] = useState(INITIAL_ZOOM)
    const activeLocation = useMemo(
        () => locationNodes.find((item) => item.id === activeLocationId) ?? locationNodes[0],
        [activeLocationId]
    )
    const orderedLocations = useMemo(
        () => routeOrder.map((locationId) => locationNodes.find((item) => item.id === locationId)).filter(Boolean) as LocationNode[],
        []
    )
    const mapHeight = 520
    const projection = useMemo(
        () =>
            geoEqualEarth().fitExtent(
                [
                    [32, 32],
                    [mapWidth - 32, mapHeight - 32],
                ],
                { type: "Sphere" }
            ),
        [mapHeight, mapWidth]
    )
    const projectionConfig = useMemo(
        () => ({
            scale: projection.scale(),
            translate: projection.translate() as [number, number],
        }),
        [projection]
    )
    const projectedNodes = useMemo(
        () =>
            Object.fromEntries(
                locationNodes.map((location) => [location.id, projection(location.coordinates) as [number, number]])
            ) as Record<string, [number, number]>,
        [projection]
    )
    const routeSegments = useMemo(
        () =>
            routeOrder.slice(0, -1).map((locationId, index) => {
                const nextLocationId = routeOrder[index + 1]
                return {
                    id: `${locationId}-${nextLocationId}`,
                    from: locationId,
                    to: nextLocationId,
                    fromPoint: projectedNodes[locationId],
                    toPoint: projectedNodes[nextLocationId],
                }
            }),
        [projectedNodes]
    )

    useEffect(() => {
        const node = mapFrameRef.current

        if (!node || typeof ResizeObserver === "undefined") {
            return
        }

        const updateWidth = () => {
            const nextWidth = Math.max(520, Math.round(node.clientWidth))
            setMapWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth))
        }

        updateWidth()

        const observer = new ResizeObserver(() => {
            updateWidth()
        })

        observer.observe(node)

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <section id="experience" className="showcase-section bg-[#f7f5f1] px-4 py-24 text-[#0a0a0a]">
            <div className="mx-auto w-full max-w-[1800px] px-2 md:px-4 lg:px-6">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36">
                            /05 Experience
                        </div>
                        <h2 className="mt-6 max-w-5xl text-5xl font-medium leading-[0.9] tracking-[-0.06em] text-black md:text-7xl">
                            Three cities.
                            <span className="block text-black/48">One build pipeline.</span>
                        </h2>
                    </div>

                    <p className="max-w-md text-sm leading-7 text-black/58">
                        Education, work, and research routed through London, Shanghai, and Sydney. The map stays as a
                        signature, the timeline stays as the main content.
                    </p>
                </div>

                <div className="mt-16 space-y-8">
                    <div className="rounded-[34px] border border-black/10 bg-white/76 p-4 shadow-[0_22px_50px_rgba(10,10,10,0.06)] md:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                                <div>global footprint</div>
                                <div className="mt-2 text-black/24">dashed travel line / inspect nodes</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {orderedLocations.map((location, index) => {
                                    const active = activeLocation.id === location.id
                                    return (
                                        <button
                                            key={location.id}
                                            type="button"
                                            onClick={() => setActiveLocationId(location.id)}
                                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-all ${
                                                active
                                                    ? "border-black bg-black text-[#f7f5f1] shadow-[0_10px_24px_rgba(10,10,10,0.12)]"
                                                    : "border-black/10 bg-[#f7f5f1] text-black/52 hover:-translate-y-0.5 hover:border-black/18 hover:bg-white hover:shadow-[0_10px_22px_rgba(10,10,10,0.04)]"
                                            }`}
                                        >
                                            <span>{location.city}</span>
                                            <span className={active ? "text-[#f7f5f1]/60" : "text-black/28"}>
                                                0{index + 1}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div
                            ref={mapFrameRef}
                            className="relative mt-6 h-[520px] overflow-hidden rounded-[28px] border border-black/8 bg-[#f4efe6]"
                        >
                            <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMapZoom((zoom) => Math.max(MIN_ZOOM, Number((zoom - 0.18).toFixed(2))))}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/88 text-black/66 transition-transform hover:-translate-y-0.5 hover:text-black"
                                    aria-label="Zoom out"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMapZoom((zoom) => Math.min(MAX_ZOOM, Number((zoom + 0.18).toFixed(2))))}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/88 text-black/66 transition-transform hover:-translate-y-0.5 hover:text-black"
                                    aria-label="Zoom in"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMapCenter(INITIAL_CENTER)
                                        setMapZoom(INITIAL_ZOOM)
                                    }}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/88 text-black/66 transition-transform hover:-translate-y-0.5 hover:text-black"
                                    aria-label="Reset map"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            </div>

                            <ComposableMap
                                width={mapWidth}
                                height={mapHeight}
                                projection="geoEqualEarth"
                                projectionConfig={projectionConfig}
                                style={{ width: "100%", height: "100%" }}
                            >
                                <ZoomableGroup
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    minZoom={MIN_ZOOM}
                                    maxZoom={MAX_ZOOM}
                                    onMoveEnd={({ coordinates, zoom }) => {
                                        setMapCenter(coordinates as [number, number])
                                        setMapZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(zoom.toFixed(2)))))
                                    }}
                                >
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    style={{
                                                        default: {
                                                            fill: "#f5f1ea",
                                                            stroke: "rgba(10,10,10,0.12)",
                                                            strokeWidth: 0.7,
                                                            outline: "none",
                                                        },
                                                        hover: {
                                                            fill: "#f2ede5",
                                                            stroke: "rgba(10,10,10,0.14)",
                                                            strokeWidth: 0.7,
                                                            outline: "none",
                                                        },
                                                        pressed: {
                                                            fill: "#f2ede5",
                                                            stroke: "rgba(10,10,10,0.14)",
                                                            strokeWidth: 0.7,
                                                            outline: "none",
                                                        },
                                                    }}
                                                />
                                            ))
                                        }
                                    </Geographies>

                                    {routeSegments.map((segment) => {
                                        const isActive =
                                            segment.from === activeLocation.id || segment.to === activeLocation.id
                                        const accent = regionAccent[activeLocation.region]

                                        return (
                                            <g key={segment.id} pointerEvents="none">
                                                <motion.path
                                                    d={createRoutePath(segment.fromPoint, segment.toPoint)}
                                                    fill="none"
                                                    stroke={isActive ? accent : "rgba(10,10,10,0.26)"}
                                                    strokeWidth={isActive ? 2.4 : 1.6}
                                                    strokeDasharray="6 10"
                                                    strokeLinecap="round"
                                                    animate={{ strokeDashoffset: isActive ? [-24, 0] : [-32, 0] }}
                                                    transition={{
                                                        duration: isActive ? 1.8 : 2.8,
                                                        ease: "linear",
                                                        repeat: Infinity,
                                                    }}
                                                />
                                            </g>
                                        )
                                    })}

                                    {locationNodes.map((location) => {
                                        const accent = regionAccent[location.region]
                                        const isActive = activeLocation.id === location.id

                                        return (
                                            <Marker
                                                key={location.id}
                                                coordinates={location.coordinates}
                                                onMouseEnter={() => setActiveLocationId(location.id)}
                                                onFocus={() => setActiveLocationId(location.id)}
                                                onClick={() => setActiveLocationId(location.id)}
                                            >
                                                <g>
                                                    <motion.circle
                                                        animate={{ r: isActive ? 34 : 21, opacity: isActive ? 0.2 : 0.1 }}
                                                        transition={{ duration: 0.28 }}
                                                        fill={accent}
                                                    />
                                                    <motion.circle
                                                        animate={{ r: isActive ? 10 : 7.5 }}
                                                        transition={{ duration: 0.28 }}
                                                        fill={accent}
                                                    />
                                                    <circle r={3.3} fill="#ffffff" />
                                                    <text
                                                        textAnchor="middle"
                                                        y={-28}
                                                        style={{
                                                            fontFamily: "var(--font-geist-mono)",
                                                            fontSize: "10px",
                                                            letterSpacing: "0.22em",
                                                            textTransform: "uppercase",
                                                            fill: "rgba(10,10,10,0.68)",
                                                        }}
                                                    >
                                                        {location.city}
                                                    </text>
                                                </g>
                                            </Marker>
                                        )
                                    })}
                                </ZoomableGroup>
                            </ComposableMap>
                        </div>
                    </div>

                    <div className="rounded-[34px] border border-black/10 bg-[#ece8df] p-7 shadow-[0_22px_50px_rgba(10,10,10,0.05)]">
                        <motion.div
                            key={activeLocation.id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                                selected city
                            </div>
                            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h3 className="text-4xl font-medium tracking-[-0.05em] text-black md:text-5xl">
                                        {activeLocation.city}
                                    </h3>
                                    <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-black/46">
                                        {activeLocation.country} · {String(activeLocation.entries.length).padStart(2, "0")} entries ·{" "}
                                        {String(
                                            orderedLocations.findIndex((location) => location.id === activeLocation.id) + 1
                                        ).padStart(2, "0")}
                                        /03
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-5">
                                {activeLocation.entries.map((entry, index) => {
                                    const Icon = entry.type === "education" ? GraduationCap : Briefcase
                                    const accent = regionAccent[entry.region]

                                    return (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ y: -6 }}
                                            transition={{ duration: 0.4, delay: 0.06 * index, ease: [0.22, 1, 0.36, 1] }}
                                            className="rounded-[26px] border border-black/10 bg-white/72 p-5 shadow-[0_14px_30px_rgba(10,10,10,0.03)] md:p-6"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border"
                                                    style={{
                                                        borderColor: `${accent}33`,
                                                        background: `${accent}14`,
                                                        color: accent,
                                                    }}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                                        <div>
                                                            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/34">
                                                                0{index + 1}
                                                            </div>
                                                            <h4 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-black/86">
                                                                {entry.title}
                                                            </h4>
                                                            <p className="mt-2 text-sm text-black/58">{entry.organization}</p>
                                                        </div>
                                                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/34">
                                                            {entry.period}
                                                        </div>
                                                    </div>

                                                    <p className="mt-4 text-sm leading-7 text-black/64">{entry.description}</p>

                                                    <div className="mt-4 space-y-3">
                                                        {entry.achievements.map((item) => (
                                                            <div key={item} className="flex gap-3 text-sm leading-7 text-black/62">
                                                                <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/28" />
                                                                <span>{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="mt-5 flex flex-wrap gap-2">
                                                        {entry.skills.map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="rounded-full border border-black/10 bg-[#f7f5f1] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-black/52 transition-transform duration-300 hover:-translate-y-0.5"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
