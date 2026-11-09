"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { geoEqualEarth, geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import worldAtlas from "world-atlas/countries-110m.json"
import type { FeatureCollection, Geometry, Point } from "geojson"
import type { GeometryCollection, Topology } from "topojson-specification"

import { locationNodes, orderedLocations, routeOrder, type LocationNode } from "@/lib/experience-data"

const DEFAULT_MAP_WIDTH = 1180
const MAP_VIEWPORT: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: [
        { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [-20, -46] } },
        { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [160, -46] } },
        { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [160, 64] } },
        { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [-20, 64] } },
    ],
}
const WORLD_TOPOLOGY = worldAtlas as unknown as Topology<{ land: GeometryCollection }>
const WORLD_LAND = feature(WORLD_TOPOLOGY, WORLD_TOPOLOGY.objects.land) as FeatureCollection<Geometry>
const chinaLocationIds = new Set(["loc-beijing", "loc-shanghai"])
const locationLabelOffsets: Record<string, { x: number; y: number; anchor: "start" | "end" }> = {
    "loc-beijing": { x: 26, y: -54, anchor: "start" },
    "loc-sydney": { x: 22, y: 22, anchor: "start" },
    "loc-shanghai": { x: 30, y: 20, anchor: "start" },
    "loc-london": { x: -24, y: -34, anchor: "end" },
}

function createRoutePath(from: [number, number], to: [number, number]) {
    const [x1, y1] = from
    const [x2, y2] = to
    const curveHeight = Math.min(110, Math.abs(x2 - x1) * 0.16 + 48)
    return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - curveHeight} ${x2} ${y2}`
}

function formatCoordinate(value: number, axis: "lat" | "lon") {
    const suffix = axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W"
    return `${Math.abs(value).toFixed(2)} ${suffix}`
}

function createProjectedLinePath(
    coordinates: [number, number][],
    projection: ReturnType<typeof geoEqualEarth>
) {
    return coordinates
        .map((coordinate, index) => {
            const point = projection(coordinate)
            if (!point) return ""
            return `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`
        })
        .filter(Boolean)
        .join(" ")
}

export default function ExperienceMap({
    activeLocationId,
    onSelectLocation,
}: {
    activeLocationId: string
    onSelectLocation: (locationId: string) => void
}) {
    const mapFrameRef = useRef<HTMLDivElement | null>(null)
    const mapInView = useInView(mapFrameRef, { margin: "180px 0px" })
    const reduceMotion = useReducedMotion()
    const [mapWidth, setMapWidth] = useState(DEFAULT_MAP_WIDTH)
    const activeLocation = locationNodes.find((item) => item.id === activeLocationId) ?? locationNodes[0]
    const activeRouteIndex = routeOrder.findIndex((locationId) => locationId === activeLocation.id)
    const mapHeight = mapWidth < 640 ? Math.round(mapWidth * 1.08) : 620
    const projection = useMemo(
        () =>
            geoEqualEarth().fitExtent(
                [
                    [46, 68],
                    [mapWidth - 46, mapHeight - 56],
                ],
                MAP_VIEWPORT
            ),
        [mapHeight, mapWidth]
    )
    const pathGenerator = useMemo(() => geoPath(projection), [projection])
    const graticulePaths = useMemo(() => {
        const longitudeLines = Array.from({ length: 13 }, (_, index) => -180 + index * 30).map((longitude) =>
            createProjectedLinePath(
                Array.from({ length: 25 }, (_, index) => [longitude, -60 + index * 5] as [number, number]),
                projection
            )
        )
        const latitudeLines = Array.from({ length: 7 }, (_, index) => -60 + index * 20).map((latitude) =>
            createProjectedLinePath(
                Array.from({ length: 73 }, (_, index) => [-180 + index * 5, latitude] as [number, number]),
                projection
            )
        )
        return [...longitudeLines, ...latitudeLines]
    }, [projection])
    const landMassPaths = useMemo(
        () => WORLD_LAND.features.map((land) => pathGenerator(land)).filter((path): path is string => Boolean(path)),
        [pathGenerator]
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
                    index,
                    fromPoint: projectedNodes[locationId],
                    toPoint: projectedNodes[nextLocationId],
                }
            }),
        [projectedNodes]
    )
    const chinaInset = useMemo(() => {
        const width = 276
        const height = 176
        const insetProjection = geoMercator()
            .center([118.6, 35.5])
            .scale(520)
            .translate([width / 2, height / 2])
        const insetPath = geoPath(insetProjection)

        return {
            width,
            height,
            landPaths: WORLD_LAND.features
                .map((land) => insetPath(land))
                .filter((path): path is string => Boolean(path)),
            nodes: locationNodes
                .filter((location) => chinaLocationIds.has(location.id))
                .map((location) => ({
                    location,
                    point: insetProjection(location.coordinates) as [number, number],
                })),
        }
    }, [])

    useEffect(() => {
        const node = mapFrameRef.current
        if (!node || typeof ResizeObserver === "undefined") return

        const updateWidth = () => {
            const nextWidth = Math.max(320, Math.round(node.clientWidth))
            setMapWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth))
        }

        updateWidth()
        const observer = new ResizeObserver(updateWidth)
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    const selectLocation = (location: LocationNode) => onSelectLocation(location.id)

    return (
        <div className="rounded-[34px] border border-black/10 bg-white/76 p-4 shadow-[0_22px_50px_rgba(10,10,10,0.06)] md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/34">
                    <div>global footprint</div>
                    <div className="mt-2 text-black/24">route progression / click a city to inspect</div>
                </div>
                <div className="flex flex-wrap gap-2" aria-label="Experience locations">
                    {orderedLocations.map((location, index) => {
                        const active = activeLocation.id === location.id
                        return (
                            <button
                                key={location.id}
                                type="button"
                                onClick={() => selectLocation(location)}
                                aria-pressed={active}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-all ${
                                    active
                                        ? "border-black bg-black text-[#f7f5f1] shadow-[0_10px_24px_rgba(10,10,10,0.12)]"
                                        : "border-black/10 bg-[#f7f5f1] text-black/52 hover:-translate-y-0.5 hover:border-black/18 hover:bg-white"
                                }`}
                            >
                                <span>{location.city}</span>
                                <span className={active ? "text-[#f7f5f1]/60" : "text-black/28"}>0{index + 1}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div
                ref={mapFrameRef}
                className="relative mt-6 aspect-[0.92] overflow-hidden rounded-[30px] border border-black/10 bg-[#f7f5f1] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72),0_20px_54px_rgba(10,10,10,0.045)] sm:aspect-[1.08] lg:h-[620px] lg:aspect-auto"
            >
                <div className="pointer-events-none absolute left-5 top-5 z-10 h-10 w-10 border-l border-t border-black/18" />
                <div className="pointer-events-none absolute right-5 top-5 z-10 h-10 w-10 border-r border-t border-black/18" />
                <div className="pointer-events-none absolute bottom-5 left-5 z-10 h-10 w-10 border-b border-l border-black/18" />
                <div className="pointer-events-none absolute bottom-5 right-5 z-10 h-10 w-10 border-b border-r border-black/18" />

                <svg
                    width={mapWidth}
                    height={mapHeight}
                    viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                    className="h-full w-full"
                    role="img"
                    aria-label={`Experience route through London, Shanghai, Sydney, and Beijing. ${activeLocation.city} selected.`}
                >
                    <defs>
                        <pattern id="experience-atlas-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(10,10,10,0.035)" strokeWidth="1" />
                        </pattern>
                        <clipPath id="experience-map-viewport">
                            <rect x="20" y="54" width={mapWidth - 40} height={mapHeight - 108} rx="20" />
                        </clipPath>
                    </defs>
                    <rect width={mapWidth} height={mapHeight} fill="#f7f5f1" />
                    <rect width={mapWidth} height={mapHeight} fill="url(#experience-atlas-grid)" />
                    <rect
                        x={18}
                        y={18}
                        width={mapWidth - 36}
                        height={mapHeight - 36}
                        rx={22}
                        fill="none"
                        stroke="rgba(10,10,10,0.08)"
                    />
                    <text
                        x={24}
                        y={34}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", letterSpacing: "0.24em", fill: "rgba(10,10,10,0.32)" }}
                    >
                        ROUTE ATLAS / LIVE NODE INSPECT
                    </text>
                    <text
                        x={24}
                        y={mapHeight - 26}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", letterSpacing: "0.22em", fill: "rgba(10,10,10,0.24)" }}
                    >
                        REGIONAL EQUAL-EARTH VIEWPORT / TRUE LAND GEOMETRY
                    </text>

                    {mapWidth >= 640 ? (
                        <g transform={`translate(${mapWidth - 260} 72)`}>
                            <rect width="224" height="78" rx="22" fill="rgba(251,250,247,0.9)" stroke="rgba(10,10,10,0.1)" />
                            <text x="18" y="24" style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", letterSpacing: "0.22em", fill: "rgba(10,10,10,0.34)" }}>
                                ACTIVE NODE
                            </text>
                            <text x="18" y="48" style={{ fontFamily: "var(--font-geist-sans)", fontSize: "24px", fontWeight: 500, letterSpacing: "-0.05em", fill: "#0a0a0a" }}>
                                {activeLocation.city}
                            </text>
                            <text x="18" y="66" style={{ fontFamily: "var(--font-geist-mono)", fontSize: "8px", letterSpacing: "0.14em", fill: "rgba(10,10,10,0.42)" }}>
                                {formatCoordinate(activeLocation.coordinates[1], "lat")} / {formatCoordinate(activeLocation.coordinates[0], "lon")}
                            </text>
                        </g>
                    ) : null}

                    <g clipPath="url(#experience-map-viewport)">
                        {landMassPaths.map((path, index) => (
                            <path
                                key={`land-${index}`}
                                d={path}
                                fill="rgba(10,10,10,0.07)"
                                stroke="rgba(10,10,10,0.13)"
                                strokeWidth="0.85"
                            />
                        ))}
                        {graticulePaths.map((path, index) => (
                            <path key={index} d={path} fill="none" stroke="rgba(10,10,10,0.05)" strokeWidth="0.65" />
                        ))}

                        {routeSegments.map((segment) => {
                            const traversed = segment.index < activeRouteIndex
                            const current = segment.to === activeLocation.id
                            const routePath = createRoutePath(segment.fromPoint, segment.toPoint)
                            return (
                                <g key={segment.id} pointerEvents="none">
                                    <path
                                        d={routePath}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.8)"
                                        strokeWidth={traversed ? 7 : 5}
                                        strokeLinecap="round"
                                    />
                                    <motion.path
                                        d={routePath}
                                        fill="none"
                                        stroke={traversed ? "rgba(10,10,10,0.74)" : "rgba(10,10,10,0.17)"}
                                        strokeWidth={current ? 2.2 : traversed ? 1.6 : 1.1}
                                        strokeDasharray={traversed ? "8 9" : "4 10"}
                                        strokeLinecap="round"
                                        initial={false}
                                        animate={mapInView && traversed && !reduceMotion ? { strokeDashoffset: [-24, 0] } : { strokeDashoffset: 0 }}
                                        transition={{ duration: current ? 1.65 : 2.4, ease: "linear", repeat: mapInView && traversed && !reduceMotion ? Infinity : 0 }}
                                    />
                                    {current && mapInView && !reduceMotion ? (
                                        <>
                                            <circle r="3.4" fill="#0a0a0a">
                                                <animateMotion dur="2.2s" repeatCount="indefinite" path={routePath} />
                                            </circle>
                                            <circle r="2.1" fill="rgba(10,10,10,0.46)">
                                                <animateMotion begin="0.62s" dur="2.2s" repeatCount="indefinite" path={routePath} />
                                            </circle>
                                        </>
                                    ) : null}
                                </g>
                            )
                        })}

                        {locationNodes.map((location) => {
                            const point = projectedNodes[location.id]
                            const isActive = activeLocation.id === location.id
                            const isChinaCluster = chinaLocationIds.has(location.id)
                            const label = locationLabelOffsets[location.id]
                            const labelWidth = 104
                            const labelX = label.anchor === "start" ? label.x : label.x - labelWidth
                            const routeIndex = orderedLocations.findIndex((item) => item.id === location.id) + 1

                            return (
                                <g
                                    key={location.id}
                                    transform={`translate(${point[0]} ${point[1]})`}
                                    className="cursor-pointer"
                                    onClick={() => selectLocation(location)}
                                >
                                    {isActive && mapInView && !reduceMotion ? (
                                        <motion.circle
                                            r="18"
                                            fill="none"
                                            stroke="rgba(10,10,10,0.2)"
                                            strokeWidth="1"
                                            animate={{ r: [16, 36], opacity: [0.34, 0] }}
                                            transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
                                        />
                                    ) : null}
                                    <motion.circle
                                        initial={false}
                                        r={isActive ? 30 : 18}
                                        animate={{ r: isActive ? 30 : 18, opacity: isActive ? 0.16 : 0.07 }}
                                        fill="#0a0a0a"
                                    />
                                    <motion.circle
                                        initial={false}
                                        r={isActive ? 8.5 : 6.5}
                                        animate={{ r: isActive ? 8.5 : 6.5 }}
                                        fill={isActive ? "#0a0a0a" : "#f7f5f1"}
                                        stroke="#0a0a0a"
                                        strokeWidth={isActive ? 0 : 1.4}
                                    />
                                    <circle r={2.7} fill={isActive ? "#f7f5f1" : "#0a0a0a"} />
                                    {!isChinaCluster ? (
                                        <g transform={`translate(${labelX} ${label.y})`}>
                                            <rect
                                                width={labelWidth}
                                                height={30}
                                                rx={15}
                                                fill={isActive ? "#0a0a0a" : "rgba(251,250,247,0.9)"}
                                                stroke={isActive ? "#0a0a0a" : "rgba(10,10,10,0.12)"}
                                            />
                                            <text x={14} y={19} style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", letterSpacing: "0.18em", fill: isActive ? "#f7f5f1" : "rgba(10,10,10,0.58)" }}>
                                                {location.city.toUpperCase()} 0{routeIndex}
                                            </text>
                                        </g>
                                    ) : null}
                                </g>
                            )
                        })}
                    </g>
                </svg>

                <div className="absolute bottom-6 left-6 z-10 hidden w-[292px] overflow-hidden rounded-[24px] border border-black/12 bg-[#fbfaf7]/95 p-2 shadow-[0_18px_44px_rgba(10,10,10,0.08)] lg:block">
                    <div className="flex items-center justify-between px-3 pb-2 pt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-black/42">
                        <span>China cluster</span>
                        <span>02 nodes</span>
                    </div>
                    <svg
                        viewBox={`0 0 ${chinaInset.width} ${chinaInset.height}`}
                        className="h-[176px] w-full overflow-hidden rounded-[18px] border border-black/8 bg-[#f7f5f1]"
                        role="img"
                        aria-label="Beijing and Shanghai detail map"
                    >
                        <defs>
                            <clipPath id="experience-china-inset-clip">
                                <rect width={chinaInset.width} height={chinaInset.height} rx="18" />
                            </clipPath>
                        </defs>
                        <g clipPath="url(#experience-china-inset-clip)">
                            {chinaInset.landPaths.map((path, index) => (
                                <path key={`china-land-${index}`} d={path} fill="rgba(10,10,10,0.07)" stroke="rgba(10,10,10,0.13)" strokeWidth="0.8" />
                            ))}
                            <line
                                x1={chinaInset.nodes[0]?.point[0]}
                                y1={chinaInset.nodes[0]?.point[1]}
                                x2={chinaInset.nodes[1]?.point[0]}
                                y2={chinaInset.nodes[1]?.point[1]}
                                stroke="rgba(10,10,10,0.28)"
                                strokeWidth="1.2"
                                strokeDasharray="4 6"
                            />
                            {chinaInset.nodes.map(({ location, point }) => {
                                const active = location.id === activeLocation.id
                                const isBeijing = location.id === "loc-beijing"
                                return (
                                    <g
                                        key={location.id}
                                        transform={`translate(${point[0]} ${point[1]})`}
                                        className="cursor-pointer"
                                        onClick={() => selectLocation(location)}
                                    >
                                        <circle r={active ? 13 : 9} fill={active ? "rgba(10,10,10,0.14)" : "rgba(10,10,10,0.05)"} />
                                        <circle r={active ? 5.5 : 4.5} fill={active ? "#0a0a0a" : "#f7f5f1"} stroke="#0a0a0a" strokeWidth="1.2" />
                                        <text
                                            x={isBeijing ? 12 : -12}
                                            y={isBeijing ? -11 : 22}
                                            textAnchor={isBeijing ? "start" : "end"}
                                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: "9px", letterSpacing: "0.14em", fill: active ? "#0a0a0a" : "rgba(10,10,10,0.52)" }}
                                        >
                                            {location.city.toUpperCase()}
                                        </text>
                                    </g>
                                )
                            })}
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}
