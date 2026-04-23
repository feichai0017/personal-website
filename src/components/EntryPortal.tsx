"use client"

import { RefObject, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight, CornerDownLeft } from "lucide-react"

import MagneticButton from "@/components/MagneticButton"

const stackLines = ["SYSTEMS", "MOTION", "INTERFACE"]
const systemNotes = [
    "canvas field tuned for low-latency motion response",
    "pointer input bends links, energy, and node density",
    "handoff animation is routed into the portfolio hero",
]

type PortalPointerRef = RefObject<{
    x: number
    y: number
}>

type NodeSeed = {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    intensity: number
    depth: number
}

type PortalParticleSeed = {
    x: number
    y: number
    size: number
    depth: number
}

const seeds: NodeSeed[] = [
    { x: 0.12, y: 0.18, size: 1.4, speedX: 0.18, speedY: 0.07, intensity: 0.72, depth: 0.28 },
    { x: 0.22, y: 0.64, size: 1.1, speedX: 0.12, speedY: -0.05, intensity: 0.58, depth: 0.18 },
    { x: 0.28, y: 0.4, size: 1.8, speedX: 0.07, speedY: 0.12, intensity: 0.78, depth: 0.66 },
    { x: 0.34, y: 0.76, size: 1.35, speedX: -0.08, speedY: 0.06, intensity: 0.66, depth: 0.42 },
    { x: 0.42, y: 0.28, size: 1.15, speedX: 0.1, speedY: 0.09, intensity: 0.62, depth: 0.22 },
    { x: 0.46, y: 0.54, size: 2.1, speedX: -0.04, speedY: -0.08, intensity: 0.92, depth: 0.94 },
    { x: 0.58, y: 0.16, size: 1.26, speedX: -0.1, speedY: 0.05, intensity: 0.6, depth: 0.2 },
    { x: 0.62, y: 0.42, size: 1.5, speedX: 0.06, speedY: 0.07, intensity: 0.68, depth: 0.52 },
    { x: 0.7, y: 0.74, size: 1.32, speedX: 0.09, speedY: -0.11, intensity: 0.61, depth: 0.34 },
    { x: 0.78, y: 0.36, size: 1.7, speedX: -0.06, speedY: 0.08, intensity: 0.75, depth: 0.72 },
    { x: 0.84, y: 0.62, size: 1.18, speedX: 0.05, speedY: 0.13, intensity: 0.54, depth: 0.16 },
    { x: 0.88, y: 0.22, size: 1.4, speedX: -0.07, speedY: -0.06, intensity: 0.7, depth: 0.46 },
]

function CanvasNodeField({
    pointerRef,
    particleRef,
}: {
    pointerRef: PortalPointerRef
    particleRef: RefObject<PortalParticleSeed[]>
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d")
        if (!context) return

        let width = 0
        let height = 0
        let dpr = 1
        let frame = 0
        let raf = 0
        const resize = () => {
            const rect = canvas.getBoundingClientRect()
            width = rect.width
            height = rect.height
            dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            context.setTransform(dpr, 0, 0, dpr, 0, 0)
            context.clearRect(0, 0, width, height)
        }

        const drawGrid = (ctx: CanvasRenderingContext2D) => {
            ctx.save()
            ctx.strokeStyle = "rgba(247,245,241,0.035)"
            ctx.lineWidth = 1
            for (let x = 0; x <= width; x += 36) {
                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, height)
                ctx.stroke()
            }
            for (let y = 0; y <= height; y += 36) {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(width, y)
                ctx.stroke()
            }
            ctx.restore()
        }

        const draw = () => {
            frame += 1
            const time = frame / 60
            const pointer = pointerRef.current ?? { x: 0, y: 0 }

            context.fillStyle = "rgba(5,5,5,0.18)"
            context.fillRect(0, 0, width, height)
            drawGrid(context)

            const nodes = seeds.map((seed, index) => {
                const orbit = 14 + index * 2.4
                const depthShiftX = 10 + seed.depth * 26
                const depthShiftY = 8 + seed.depth * 22
                const px =
                    seed.x * width +
                    Math.sin(time * seed.speedX * 6 + index) * orbit +
                    pointer.x * depthShiftX
                const py =
                    seed.y * height +
                    Math.cos(time * seed.speedY * 6 + index * 0.7) * (orbit * 0.82) +
                    pointer.y * depthShiftY
                return {
                    x: px,
                    y: py,
                    size: seed.size,
                    intensity: seed.intensity,
                    pulse: 0.7 + 0.3 * Math.sin(time * 2.1 + index),
                    depth: seed.depth,
                }
            })
            particleRef.current = nodes.map((node) => ({
                x: node.x,
                y: node.y,
                size: node.size,
                depth: node.depth,
            }))

            context.save()
            for (let index = 0; index < nodes.length; index += 1) {
                for (let next = index + 1; next < nodes.length; next += 1) {
                    const a = nodes[index]
                    const b = nodes[next]
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const depthGap = Math.abs(a.depth - b.depth)
                    if (distance > 196 || depthGap > 0.58) continue
                    const alpha = (1 - distance / 196) * (0.1 + ((a.depth + b.depth) / 2) * 0.18)
                    context.strokeStyle = `rgba(247,245,241,${alpha})`
                    context.lineWidth = distance < 92 ? 1.15 + ((a.depth + b.depth) / 2) * 0.7 : 0.7
                    context.setLineDash(distance < 92 ? [] : [7, 10])
                    context.beginPath()
                    context.moveTo(a.x, a.y)
                    context.lineTo(b.x, b.y)
                    context.stroke()
                }
            }
            context.restore()

            nodes.forEach((node, index) => {
                const glowRadius = 18 + node.size * 8 + node.pulse * 6 + node.depth * 8
                const gradient = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius)
                gradient.addColorStop(0, `rgba(247,245,241,${(0.16 + node.depth * 0.08) * node.intensity})`)
                gradient.addColorStop(0.5, `rgba(247,245,241,${0.06 * node.intensity})`)
                gradient.addColorStop(1, "rgba(247,245,241,0)")
                context.fillStyle = gradient
                context.beginPath()
                context.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
                context.fill()

                context.strokeStyle = `rgba(247,245,241,${0.24 + node.intensity * 0.16 + node.depth * 0.18})`
                context.lineWidth = 0.8 + node.depth * 0.7
                context.beginPath()
                context.arc(node.x, node.y, 3.2 + node.size * 2.5 + node.depth * 3.4, 0, Math.PI * 2)
                context.stroke()

                context.fillStyle = "rgba(247,245,241,0.96)"
                context.beginPath()
                context.arc(node.x, node.y, 1.1 + node.size * 0.95 + node.depth * 1.1, 0, Math.PI * 2)
                context.fill()

                if (index % 3 === 0) {
                    context.fillStyle = "rgba(247,245,241,0.44)"
                    context.font = '10px var(--font-geist-mono)'
                    context.fillText(`0${index + 1}`, node.x + 11, node.y - 11)
                }
            })

            context.strokeStyle = "rgba(247,245,241,0.06)"
            context.lineWidth = 1
            context.strokeRect(24, 24, width - 48, height - 48)

            raf = window.requestAnimationFrame(draw)
        }

        resize()
        draw()

        const observer = new ResizeObserver(() => resize())
        observer.observe(canvas)

        return () => {
            window.cancelAnimationFrame(raf)
            observer.disconnect()
        }
    }, [particleRef, pointerRef])

    return <canvas ref={canvasRef} className="block h-[24rem] w-full rounded-[28px]" />
}

export default function EntryPortal() {
    const [visible, setVisible] = useState(false)
    const [leaving, setLeaving] = useState(false)
    const [tick, setTick] = useState(0)
    const [flight, setFlight] = useState<{ x: number; y: number; scaleX: number; scaleY: number } | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const pointerRef = useRef({ x: 0, y: 0 })
    const particleRef = useRef<PortalParticleSeed[]>([])
    const pointerX = useMotionValue(0)
    const pointerY = useMotionValue(0)
    const springX = useSpring(pointerX, { stiffness: 140, damping: 24, mass: 0.8 })
    const springY = useSpring(pointerY, { stiffness: 140, damping: 24, mass: 0.8 })
    const cardRotateX = useTransform(springY, [-0.5, 0.5], [7, -7])
    const cardRotateY = useTransform(springX, [-0.5, 0.5], [-9, 9])
    const graphShiftX = useTransform(springX, [-0.5, 0.5], [-20, 20])
    const graphShiftY = useTransform(springY, [-0.5, 0.5], [-16, 16])
    const glowX = useTransform(springX, [-0.5, 0.5], ["35%", "65%"])
    const glowY = useTransform(springY, [-0.5, 0.5], ["35%", "65%"])

    useEffect(() => {
        if (typeof window === "undefined") return
        const alreadyEntered = window.sessionStorage.getItem("entry-portal-dismissed") === "1"
        setVisible(!alreadyEntered)
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return
        const handleOpen = () => {
            setLeaving(false)
            setFlight(null)
            setVisible(true)
        }
        window.addEventListener("entry-portal-open", handleOpen)
        return () => window.removeEventListener("entry-portal-open", handleOpen)
    }, [])

    useEffect(() => {
        if (!visible || leaving) return
        const timer = window.setInterval(() => {
            setTick((value) => (value + 1) % 1000)
        }, 1400)
        return () => window.clearInterval(timer)
    }, [visible, leaving])

    const runtime = useMemo(() => String(128 + tick).padStart(3, "0"), [tick])

    const closePortal = () => {
        if (typeof window !== "undefined") {
            const target = document.getElementById("hero-visual-target")
            const panel = panelRef.current
            const canvas = panel?.querySelector("canvas")
            if (target && panel) {
                const targetRect = target.getBoundingClientRect()
                const panelRect = panel.getBoundingClientRect()
                setFlight({
                    x: targetRect.left - panelRect.left,
                    y: targetRect.top - panelRect.top,
                    scaleX: targetRect.width / panelRect.width,
                    scaleY: targetRect.height / panelRect.height,
                })
            }
            if (target && canvas && particleRef.current.length > 0) {
                const canvasRect = canvas.getBoundingClientRect()
                const particles = particleRef.current.slice(0, 10).map((node, index) => ({
                    x: canvasRect.left + node.x,
                    y: canvasRect.top + node.y,
                    size: 4 + node.size * 2.8 + node.depth * 4,
                    delay: index * 0.018,
                }))
                window.dispatchEvent(new CustomEvent("entry-portal-handoff", { detail: { particles } }))
            } else {
                window.dispatchEvent(new CustomEvent("entry-portal-handoff"))
            }
            window.sessionStorage.setItem("entry-portal-dismissed", "1")
        }
        setLeaving(true)
        window.setTimeout(() => {
            setVisible(false)
            setLeaving(false)
        }, 960)
    }

    const handlePanelMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = panelRef.current?.getBoundingClientRect()
        if (!rect) return
        const nextX = (event.clientX - rect.left) / rect.width - 0.5
        const nextY = (event.clientY - rect.top) / rect.height - 0.5
        pointerRef.current = { x: nextX, y: nextY }
        pointerX.set(nextX)
        pointerY.set(nextY)
    }

    const resetPanelPointer = () => {
        pointerRef.current = { x: 0, y: 0 }
        pointerX.set(0)
        pointerY.set(0)
    }

    return (
        <>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        key="entry-portal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        className="fixed inset-0 z-[220] overflow-hidden bg-[#090909] text-[#f7f5f1]"
                    >
                    <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(247,245,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(247,245,241,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
                    <motion.div
                        className="pointer-events-none absolute inset-x-[-10%] top-[18%] h-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(247,245,241,0.18),rgba(247,245,241,0.04)_32%,transparent_62%)]"
                        animate={{ x: ["-2%", "2%", "-2%"], scale: [1, 1.03, 1] }}
                        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
                    />
                    <motion.div
                        className="pointer-events-none absolute inset-0 opacity-70"
                        style={{
                            background:
                                "radial-gradient(circle at var(--entry-glow-x) var(--entry-glow-y), rgba(247,245,241,0.14), transparent 22%)",
                            ["--entry-glow-x" as string]: glowX,
                            ["--entry-glow-y" as string]: glowY,
                        }}
                    />

                    <motion.div
                        initial={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
                        animate={
                            leaving
                                ? { clipPath: "inset(0% 0% 100% 0% round 0px)" }
                                : { clipPath: "inset(0% 0% 0% 0% round 0px)" }
                        }
                        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                        className="relative flex min-h-screen flex-col px-5 py-6 md:px-8 md:py-8"
                    >
                        <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/62">
                            <div className="space-y-2">
                                <div>guocheng song / interface boot</div>
                                <div className="text-white/34">runtime {runtime} / online</div>
                            </div>
                            <button
                                type="button"
                                onClick={closePortal}
                                className="text-white/48 transition-colors hover:text-white"
                            >
                                skip
                            </button>
                        </div>

                        <div className="grid flex-1 items-end gap-10 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
                            <motion.div
                                animate={
                                    leaving
                                        ? { opacity: 0, y: -24, filter: "blur(8px)" }
                                        : { opacity: 1, y: 0, filter: "blur(0px)" }
                                }
                                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col justify-end"
                            >
                                <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-white/42">
                                    entry / crafted for motion
                                </div>
                                <div className="mt-8 text-[17vw] font-medium leading-[0.84] tracking-[-0.08em] sm:text-[6.2rem] lg:text-[8.8rem] xl:text-[10.8rem]">
                                    {stackLines.map((line, index) => (
                                        <div key={line} className="block overflow-hidden">
                                            <motion.span
                                                initial={{ y: "110%" }}
                                                animate={{ y: 0 }}
                                                transition={{
                                                    duration: 0.95,
                                                    delay: 0.12 + index * 0.08,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className={`inline-block ${index === 1 ? "text-white/76" : ""}`}
                                            >
                                                {line}
                                            </motion.span>
                                        </div>
                                    ))}
                                </div>

                                <motion.p
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
                                    className="mt-8 max-w-2xl text-base leading-8 text-white/64 md:text-lg"
                                >
                                    A front door built to show control over timing, composition, and interaction
                                    before the actual portfolio starts.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 22 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.72, delay: 0.74 }}
                                    className="mt-10 flex flex-wrap items-center gap-4"
                                >
                                    <MagneticButton
                                        as="button"
                                        onClick={closePortal}
                                        strength={0.24}
                                        className="inline-flex h-14 items-center gap-3 rounded-full border border-white/18 bg-white px-7 font-mono text-[11px] uppercase tracking-[0.26em] text-black"
                                    >
                                        enter portfolio
                                        <ArrowRight className="h-4 w-4" />
                                    </MagneticButton>
                                    <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/46">
                                        <CornerDownLeft className="h-3.5 w-3.5" />
                                        click to continue
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    leaving && flight
                                        ? {
                                            opacity: 1,
                                            x: flight.x,
                                            y: flight.y,
                                            scaleX: flight.scaleX,
                                            scaleY: flight.scaleY,
                                            borderRadius: "36px",
                                        }
                                        : { opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: "34px" }
                                }
                                transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                ref={panelRef}
                                onMouseMove={handlePanelMove}
                                onMouseLeave={resetPanelPointer}
                                style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformPerspective: 1400 }}
                                className="relative rounded-[34px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-[18px]"
                            >
                                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-white/44">
                                    <span>canvas field</span>
                                    <span>build 24.04</span>
                                </div>

                                <motion.div
                                    style={{ x: graphShiftX, y: graphShiftY }}
                                    className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-black/30 p-3"
                                >
                                    <CanvasNodeField pointerRef={pointerRef} particleRef={particleRef} />
                                </motion.div>

                                <div className="mt-6 grid gap-3 md:grid-cols-3">
                                    {systemNotes.map((item, index) => (
                                        <motion.div
                                            key={item}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.55, delay: 0.72 + index * 0.06 }}
                                            className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                                        >
                                            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/34">
                                                0{index + 1}
                                            </div>
                                            <p className="mt-3 text-sm leading-6 text-white/66">{item}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.96 }}
                                    className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]"
                                >
                                    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/42">
                                        pointer-reactive interface graph / latency under 12ms
                                    </div>
                                    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/42">
                                        mode / experimental
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
