"use client"

import Image from "next/image"
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import FabricLanyard from "@/components/FabricLanyard"

const CARD_TOP = 184
const CARD_ASPECT = 0.82

const badgeHash = [
    1, 1, 1, 0, 1,
    1, 0, 1, 1, 0,
    1, 1, 1, 0, 1,
    0, 1, 0, 1, 1,
    1, 0, 1, 1, 1,
]

export default function HangingBadge() {
    const stageRef = useRef<HTMLDivElement | null>(null)
    const reduceMotion = useReducedMotion()
    const [dragging, setDragging] = useState(false)
    const [flipped, setFlipped] = useState(false)
    const [dragBounds, setDragBounds] = useState({ left: -24, right: 24, top: -76, bottom: 42 })
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const pointerX = useMotionValue(0)
    const pointerY = useMotionValue(0)
    const rotate = useTransform(x, [-180, 0, 180], [-8, 0, 8])
    const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), { stiffness: 190, damping: 20 })
    const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), { stiffness: 190, damping: 20 })
    const photoOffsetX = useTransform(pointerX, [-0.5, 0.5], [-3, 3])
    const photoOffsetY = useTransform(pointerY, [-0.5, 0.5], [-3, 3])
    const hashOffsetX = useTransform(pointerX, [-0.5, 0.5], [3, -3])
    const hashOffsetY = useTransform(pointerY, [-0.5, 0.5], [3, -3])
    const tension = useTransform([x, y] as never, (values: number[]) => {
        const distance = Math.hypot(values[0] ?? 0, values[1] ?? 0)
        return 0.22 + Math.min(1, distance / 180) * 0.78
    })
    const dynamicShadow = useTransform([x, y] as never, (values: number[]) => {
        const offsetX = values[0] ?? 0
        const offsetY = values[1] ?? 0
        return `${-offsetX * 0.07}px ${28 + Math.max(-5, offsetY * 0.08)}px 68px rgba(10,10,10,0.16)`
    })
    useEffect(() => {
        const stage = stageRef.current
        if (!stage) return

        const updateBounds = () => {
            const { width, height } = stage.getBoundingClientRect()
            const cardWidth = Math.min(360, width - 40)
            const cardHeight = cardWidth / CARD_ASPECT
            const horizontal = Math.max(10, Math.min(120, (width - cardWidth) / 2 - 14))
            const bottom = Math.max(18, Math.min(64, height - CARD_TOP - cardHeight - 18))

            setDragBounds({ left: -horizontal, right: horizontal, top: -76, bottom })
        }

        updateBounds()
        const observer = new ResizeObserver(updateBounds)
        observer.observe(stage)
        return () => observer.disconnect()
    }, [])

    const returnToRest = () => {
        const spring = { type: "spring" as const, stiffness: 150, damping: 16, mass: 0.72 }
        animate(x, 0, spring)
        animate(y, 0, spring)
        setDragging(false)
    }

    const resetPointer = () => {
        pointerX.set(0)
        pointerY.set(0)
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragging || reduceMotion) return
        const rect = event.currentTarget.getBoundingClientRect()
        pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
        pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
    }

    const resetRig = () => {
        setFlipped(false)
        resetPointer()
        const spring = { type: "spring" as const, stiffness: 170, damping: 18, mass: 0.7 }
        animate(x, 0, spring)
        animate(y, 0, spring)
    }

    return (
        <div
            ref={stageRef}
            data-testid="hanging-badge-stage"
            className="relative h-[640px] overflow-hidden rounded-[38px] border border-black/10 bg-[#ece8df] sm:h-[660px]"
        >
            <div className="pointer-events-none absolute left-5 top-5 z-20 font-mono text-[9px] uppercase tracking-[0.24em] text-black/38">
                <span>identity rig / 01</span>
            </div>

            <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setFlipped((current) => !current)}
                    className={`rounded-full border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.2em] transition-colors ${
                        flipped
                            ? "border-black bg-black text-[#f7f5f1]"
                            : "border-black/12 bg-[#f7f5f1] text-black/58 hover:border-black/24 hover:text-black"
                    }`}
                >
                    {flipped ? "show id" : "flip card"}
                </button>
                <button
                    type="button"
                    onClick={resetRig}
                    className="rounded-full border border-black/12 bg-[#f7f5f1] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.2em] text-black/44 transition-colors hover:border-black/24 hover:text-black"
                >
                    reset
                </button>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-[18px] z-10 h-3 w-24 -translate-x-1/2 rounded-full border border-black/12 bg-[#f7f5f1]" />

            <FabricLanyard offsetX={x} offsetY={y} cardTop={CARD_TOP} reducedMotion={Boolean(reduceMotion)} />

            <div className="pointer-events-none absolute left-5 top-16 max-w-[210px] font-mono text-[9px] uppercase leading-5 tracking-[0.2em] text-black/28">
                {dragging ? "tension active" : "constrained motion"}
                <br />
                drag · tilt · flip
            </div>

            <div className="pointer-events-none absolute right-5 top-16 w-28 font-mono text-[8px] uppercase tracking-[0.2em] text-black/28">
                <div className="flex items-center justify-between">
                    <span>tension</span>
                    <span>{dragging ? "live" : "idle"}</span>
                </div>
                <div className="mt-2 h-px overflow-hidden bg-black/10">
                    <motion.div className="h-full origin-left bg-black/55" style={{ scaleX: tension }} />
                </div>
            </div>

            <div className="absolute left-1/2 top-[184px] w-[calc(100%-40px)] max-w-[360px] -translate-x-1/2">
                <motion.div
                    drag
                    dragConstraints={dragBounds}
                    dragElastic={0.08}
                    dragMomentum={false}
                    onDragStart={() => {
                        resetPointer()
                        setDragging(true)
                    }}
                    onDragEnd={returnToRest}
                    style={{ x, y, touchAction: "none" }}
                    className="relative cursor-grab select-none will-change-transform active:cursor-grabbing"
                    role="group"
                    aria-label="Draggable identity badge for Guocheng Song"
                >
                    <div
                        aria-hidden
                        className="absolute left-1/2 top-[-5px] z-20 -translate-x-1/2"
                    >
                        <div className="flex flex-col items-center">
                            <div className="h-2 w-2 rounded-[3px] border border-black/25 bg-[#cbc5ba] shadow-[0_2px_4px_rgba(10,10,10,0.1)]" />
                            <div className="-mt-1 h-4 w-10 rounded-b-[11px] rounded-t-[5px] border border-black/20 bg-[#d9d4ca] shadow-[0_3px_8px_rgba(10,10,10,0.12)]" />
                        </div>
                    </div>

                    <motion.div
                        aria-hidden
                        animate={reduceMotion || dragging ? { rotate: 0 } : { rotate: [-0.7, 0.7, -0.35, -0.7] }}
                        transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
                        className="relative"
                        style={{ transformOrigin: "50% 0%" }}
                    >
                        <motion.div
                            onPointerMove={handlePointerMove}
                            onPointerLeave={resetPointer}
                            onDoubleClick={() => setFlipped((current) => !current)}
                            animate={{ scale: dragging ? 1.012 : 1 }}
                            transition={{ type: "spring", stiffness: 220, damping: 22 }}
                            style={{
                                rotateX: reduceMotion ? 0 : tiltX,
                                rotateY: reduceMotion ? 0 : tiltY,
                                rotateZ: rotate,
                                boxShadow: dynamicShadow,
                                transformPerspective: 1200,
                                transformStyle: "preserve-3d",
                                transformOrigin: "50% 0%",
                            }}
                            className="relative aspect-[0.82] rounded-[36px] border border-white/80 bg-white/28 p-2"
                            title="Drag to move · double click to flip"
                        >
                            <motion.div
                                animate={{ rotateY: flipped ? 180 : 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.75 }}
                                className="relative h-full w-full"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div
                                    className="absolute inset-0 overflow-hidden rounded-[28px] border border-black/12 bg-[#fbfaf7]"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    <div className="flex h-11 items-center justify-between border-b border-black/10 px-5 font-mono text-[9px] uppercase tracking-[0.22em] text-black/46">
                                        <span>engineer access</span>
                                        <span>aml / systems</span>
                                    </div>

                                    <div className="p-5">
                                        <div className="grid grid-cols-[92px_1fr] gap-4">
                                            <motion.div
                                                className="relative aspect-square overflow-hidden rounded-[20px] border border-black/12 bg-[#ece8df]"
                                                style={{ x: photoOffsetX, y: photoOffsetY }}
                                            >
                                                <Image
                                                    src="/img/my.png"
                                                    alt="Guocheng Song"
                                                    fill
                                                    draggable={false}
                                                    className="object-cover object-top grayscale"
                                                    sizes="92px"
                                                />
                                            </motion.div>
                                            <div className="min-w-0 pt-1">
                                                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-black/38">identity</div>
                                                <div className="mt-2 text-[2rem] font-medium leading-none tracking-[-0.055em] text-black">Eric Song</div>
                                                <div className="mt-3 text-xs leading-5 text-black/58">ML systems engineer</div>
                                                <div className="text-xs leading-5 text-black/58">AI infra · storage</div>
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-3 border-y border-black/10 py-4 font-mono text-[9px] uppercase tracking-[0.18em] text-black/52">
                                            <div className="flex justify-between gap-3">
                                                <span>station</span>
                                                <span className="text-right text-black/76">ByteDance AML · Beijing</span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span>systems</span>
                                                <span className="text-right text-black/76">NoKV · Holt · OrbitKV</span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span>open source</span>
                                                <span className="text-right text-black/76">DuckDB · Mooncake</span>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-end justify-between gap-5">
                                            <div>
                                                <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-black/32">clearance</div>
                                                <div className="mt-2 font-mono text-sm tracking-[0.18em] text-black">SYS-042</div>
                                                <div className="mt-2 h-px w-24 bg-black/16" />
                                            </div>
                                            <motion.div
                                                className="grid h-[62px] w-[62px] grid-cols-5 gap-1 rounded-[14px] border border-black/10 bg-[#f7f5f1] p-2"
                                                style={{ x: hashOffsetX, y: hashOffsetY }}
                                            >
                                                {badgeHash.map((filled, index) => (
                                                    <span key={index} className={filled ? "bg-black" : "bg-black/8"} />
                                                ))}
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-between bg-black px-5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#f7f5f1]/76">
                                        <span>distributed systems</span>
                                        <span>active</span>
                                    </div>
                                </div>

                                <div
                                    className="absolute inset-0 overflow-hidden rounded-[28px] border border-black/60 bg-[#171715] text-[#f7f5f1]"
                                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                >
                                    <div className="flex h-11 items-center justify-between border-b border-white/12 px-5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/52">
                                        <span>systems surface</span>
                                        <span>route / 03</span>
                                    </div>

                                    <div className="p-5">
                                        <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/38">live control path</div>
                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            {["AI control", "KV cache", "storage"].map((node, index) => (
                                                <motion.div
                                                    key={node}
                                                    animate={flipped && !reduceMotion ? { y: [0, -3, 0] } : { y: 0 }}
                                                    transition={{ duration: 2.4, delay: index * 0.24, repeat: Infinity, ease: "easeInOut" }}
                                                    className="rounded-[14px] border border-white/14 px-2 py-3 text-center font-mono text-[7px] uppercase tracking-[0.16em] text-white/66"
                                                >
                                                    <span className="mx-auto mb-2 block h-1.5 w-1.5 rounded-full bg-white/70" />
                                                    {node}
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="relative mt-3 h-16 overflow-hidden rounded-[16px] border border-white/12">
                                            <div className="absolute left-[17%] top-1/2 h-px w-[66%] bg-white/16" />
                                            <motion.span
                                                className="absolute left-[16%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white"
                                                animate={flipped && !reduceMotion ? { x: [0, 170, 0], opacity: [0.25, 1, 0.25] } : { x: 0, opacity: 0.45 }}
                                                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                            <div className="absolute inset-x-4 bottom-3 flex justify-between font-mono text-[7px] uppercase tracking-[0.16em] text-white/28">
                                                <span>request</span>
                                                <span>route</span>
                                                <span>durable</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/48">
                                            <div className="flex justify-between border-t border-white/10 pt-2.5">
                                                <span>current</span>
                                                <span className="text-white/78">ByteDance AML</span>
                                            </div>
                                            <div className="flex justify-between border-t border-white/10 pt-2.5">
                                                <span>contributor</span>
                                                <span className="text-white/78">DuckDB / Mooncake</span>
                                            </div>
                                            <div className="flex justify-between border-t border-white/10 pt-2.5">
                                                <span>builds</span>
                                                <span className="text-white/78">NoKV / Holt / OrbitKV</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-between border-t border-white/12 px-5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/44">
                                        <span>double click / flip</span>
                                        <span>authenticated</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="pointer-events-none absolute bottom-5 left-5 font-mono text-[8px] uppercase tracking-[0.2em] text-black/26">
                pull · inspect · flip · release
            </div>
        </div>
    )
}
