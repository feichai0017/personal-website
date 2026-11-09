"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { Briefcase, GraduationCap } from "lucide-react"

import { locationNodes, orderedLocations, regionAccent } from "@/lib/experience-data"

function MapLoadingCard() {
    return (
        <div className="rounded-[34px] border border-black/10 bg-white/76 p-4 shadow-[0_22px_50px_rgba(10,10,10,0.05)] md:p-6" aria-hidden>
            <div className="flex items-center justify-between gap-5">
                <div className="space-y-2">
                    <div className="h-2 w-28 rounded-full bg-black/10" />
                    <div className="h-2 w-52 rounded-full bg-black/6" />
                </div>
                <div className="hidden gap-2 md:flex">
                    {[0, 1, 2, 3].map((item) => <div key={item} className="h-9 w-24 rounded-full border border-black/8 bg-[#f7f5f1]" />)}
                </div>
            </div>
            <div className="mt-6 aspect-[0.92] rounded-[30px] border border-black/8 bg-[#f7f5f1] sm:aspect-[1.08] lg:h-[620px] lg:aspect-auto" />
        </div>
    )
}

const LazyExperienceMap = dynamic(() => import("@/components/ExperienceMap"), {
    ssr: false,
    loading: MapLoadingCard,
})

export default function ExperienceInteractive() {
    const [activeLocationId, setActiveLocationId] = useState("loc-beijing")
    const mapLoadRef = useRef<HTMLDivElement | null>(null)
    const shouldLoadMap = useInView(mapLoadRef, { once: true, margin: "520px 0px" })
    const activeLocation = locationNodes.find((item) => item.id === activeLocationId) ?? locationNodes[0]
    const routePosition = orderedLocations.findIndex((location) => location.id === activeLocation.id) + 1

    return (
        <div className="mt-16 space-y-8">
            <div ref={mapLoadRef}>
                {shouldLoadMap ? (
                    <LazyExperienceMap
                        activeLocationId={activeLocation.id}
                        onSelectLocation={setActiveLocationId}
                    />
                ) : (
                    <MapLoadingCard />
                )}
            </div>

            <motion.div
                layout
                transition={{ layout: { duration: 0.46, ease: [0.22, 1, 0.36, 1] } }}
                className="overflow-hidden rounded-[34px] border border-black/10 bg-[#fbfaf7] p-7 shadow-[0_22px_50px_rgba(10,10,10,0.05)]"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={activeLocation.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                            selected city
                        </div>
                        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div aria-live="polite">
                                <h3 className="text-4xl font-medium tracking-[-0.05em] text-black md:text-5xl">
                                    {activeLocation.city}
                                </h3>
                                <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-black/46">
                                    {activeLocation.country} · {String(activeLocation.entries.length).padStart(2, "0")} entries · {String(routePosition).padStart(2, "0")}/{String(orderedLocations.length).padStart(2, "0")}
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
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.34, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
                                        className="rounded-[26px] border border-black/10 bg-white/72 p-5 shadow-[0_14px_30px_rgba(10,10,10,0.03)] md:p-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
                                                style={{ borderColor: "rgba(10,10,10,0.12)", background: "rgba(10,10,10,0.035)", color: accent }}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                                    <div>
                                                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/34">0{index + 1}</div>
                                                        <h4 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-black/86">{entry.title}</h4>
                                                        <p className="mt-2 text-sm text-black/58">{entry.organization}</p>
                                                    </div>
                                                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/34">{entry.period}</div>
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
                                                        <span key={skill} className="rounded-full border border-black/10 bg-[#f7f5f1] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-black/52">
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
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
