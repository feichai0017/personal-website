"use client"

import { RefObject, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

import MagneticButton from "@/components/MagneticButton"

type ProtocolMode = "raft" | "paxos" | "chain"

type ProtocolNode = {
    id: string
    label: string
    role: string
    detail: string
    x: number
    y: number
}

type ProtocolPacket = {
    path: string
    activeSteps: number[]
    reverse?: boolean
}

type ProtocolStep = {
    title: string
    detail: string
}

type ProtocolScene = {
    title: string
    blurb: string
    accent: string
    steps: ProtocolStep[]
    nodes: ProtocolNode[]
    packets: ProtocolPacket[]
}

const protocolScenes: Record<ProtocolMode, ProtocolScene> = {
    raft: {
        title: "Raft",
        blurb: "One leader, a quorum, a moving commit index.",
        accent: "#a3b1c6",
        steps: [
            { title: "election", detail: "Followers grant votes; one candidate becomes leader for the new term." },
            { title: "append", detail: "Leader streams a new log suffix to followers in parallel." },
            { title: "ack quorum", detail: "Once a majority acknowledges, the entry is safe to commit." },
            { title: "commit", detail: "Commit index advances; the cluster exposes the new durable state." },
        ],
        nodes: [
            { id: "leader", label: "primary", role: "leader", detail: "Owns the current term and replicates the ordered log suffix.", x: 50, y: 22 },
            { id: "f1", label: "replica a", role: "follower", detail: "Votes during election and appends entries from the leader.", x: 20, y: 54 },
            { id: "f2", label: "replica b", role: "follower", detail: "Forms the majority with the leader.", x: 40, y: 72 },
            { id: "f3", label: "replica c", role: "follower", detail: "Adds quorum redundancy for safety.", x: 60, y: 72 },
            { id: "f4", label: "replica d", role: "follower", detail: "Lagging follower — majority, not all, is enough.", x: 80, y: 54 },
        ],
        packets: [
            { path: "M 50 22 C 44 32, 30 40, 20 52", activeSteps: [1] },
            { path: "M 50 22 C 47 34, 43 42, 40 58", activeSteps: [1] },
            { path: "M 50 22 C 53 34, 58 42, 60 58", activeSteps: [1] },
            { path: "M 50 22 C 57 32, 70 40, 80 52", activeSteps: [1] },
            { path: "M 50 22 C 44 32, 30 40, 20 52", activeSteps: [2, 3], reverse: true },
            { path: "M 50 22 C 47 34, 43 42, 40 58", activeSteps: [2, 3], reverse: true },
            { path: "M 50 22 C 53 34, 58 42, 60 58", activeSteps: [2, 3], reverse: true },
        ],
    },
    paxos: {
        title: "Paxos",
        blurb: "Ballots and quorums — authority emerges, not assigned.",
        accent: "#ffb86b",
        steps: [
            { title: "prepare", detail: "Proposer asks acceptors to reserve a higher ballot number." },
            { title: "promise", detail: "A quorum returns promises and reveals any prior accepts." },
            { title: "accept", detail: "Proposer sends the chosen value back under the same ballot." },
            { title: "learn", detail: "Learners observe the accepted quorum and publish the outcome." },
        ],
        nodes: [
            { id: "proposer", label: "coordinator", role: "proposer", detail: "Starts a ballot and collects a valid majority response.", x: 18, y: 50 },
            { id: "a1", label: "acceptor a", role: "acceptor", detail: "Stores the highest ballot seen, never goes backwards.", x: 40, y: 26 },
            { id: "a2", label: "acceptor b", role: "acceptor", detail: "Participates in both the promise and accept quorums.", x: 60, y: 26 },
            { id: "a3", label: "acceptor c", role: "acceptor", detail: "Helps form the minimum majority.", x: 40, y: 74 },
            { id: "a4", label: "acceptor d", role: "acceptor", detail: "Can miss the chosen value while quorum still succeeds.", x: 60, y: 74 },
            { id: "learner", label: "learner", role: "learner", detail: "Observes the accepted quorum and publishes the chosen value.", x: 82, y: 50 },
        ],
        packets: [
            { path: "M 18 50 C 28 44, 30 28, 40 26", activeSteps: [0, 2] },
            { path: "M 18 50 C 30 46, 34 34, 60 26", activeSteps: [0, 2] },
            { path: "M 18 50 C 28 56, 30 64, 40 74", activeSteps: [0, 2] },
            { path: "M 18 50 C 30 54, 34 66, 60 74", activeSteps: [0, 2] },
            { path: "M 18 50 C 28 44, 30 28, 40 26", activeSteps: [1], reverse: true },
            { path: "M 18 50 C 30 46, 34 34, 60 26", activeSteps: [1], reverse: true },
            { path: "M 18 50 C 28 56, 30 64, 40 74", activeSteps: [1], reverse: true },
            { path: "M 40 26 C 58 30, 66 40, 82 50", activeSteps: [3] },
            { path: "M 60 26 C 68 32, 72 40, 82 50", activeSteps: [3] },
            { path: "M 40 74 C 58 70, 66 60, 82 50", activeSteps: [3] },
        ],
    },
    chain: {
        title: "Chain",
        blurb: "Write on the head, ack from the tail, read the durable edge.",
        accent: "#7ce7d0",
        steps: [
            { title: "ingest", detail: "Client submits the write to the chain head — the only write authority." },
            { title: "forward", detail: "Update streams hop by hop down the replica chain." },
            { title: "tail ack", detail: "Tail applies the write; acknowledgement walks back upstream." },
            { title: "read stable", detail: "Reads land on the tail because it has the full ordered history." },
        ],
        nodes: [
            { id: "client", label: "client", role: "ingress", detail: "Submits the write request into the chain's ordered pipeline.", x: 12, y: 50 },
            { id: "head", label: "head", role: "write authority", detail: "The only node that accepts new writes at the front of the chain.", x: 30, y: 50 },
            { id: "m1", label: "middle a", role: "pipeline", detail: "Forwards the write downstream while preserving order.", x: 50, y: 50 },
            { id: "m2", label: "middle b", role: "pipeline", detail: "Keeps the ordered write stream moving toward the tail.", x: 70, y: 50 },
            { id: "tail", label: "tail", role: "durable edge", detail: "Acknowledges only after the full chain sees the update.", x: 88, y: 50 },
            { id: "reader", label: "reader", role: "read path", detail: "Reads from the tail — the most stable committed state.", x: 74, y: 80 },
        ],
        packets: [
            { path: "M 14 50 C 20 50, 22 50, 28 50", activeSteps: [0, 1] },
            { path: "M 30 50 C 38 50, 40 50, 48 50", activeSteps: [0, 1] },
            { path: "M 50 50 C 58 50, 60 50, 68 50", activeSteps: [0, 1] },
            { path: "M 70 50 C 76 50, 78 50, 86 50", activeSteps: [0, 1] },
            { path: "M 70 50 C 76 50, 78 50, 86 50", activeSteps: [2], reverse: true },
            { path: "M 50 50 C 58 50, 60 50, 68 50", activeSteps: [2], reverse: true },
            { path: "M 30 50 C 38 50, 40 50, 48 50", activeSteps: [2], reverse: true },
            { path: "M 86 50 C 86 70, 84 76, 74 78", activeSteps: [3] },
        ],
    },
}

const storageStages = [
    { label: "client → coord", detail: "Client asks any coord for the region route. GetRegionByKey is stateless — any coord answers. GetTSO is only served by the coord that holds the lease." },
    { label: "coord ↔ meta", detail: "Behind the scenes the lease-holder talks to the 3-node meta cluster to renew its TSO lease and commit metadata updates. Meta's internal Raft makes the write durable before the lease extends." },
    { label: "coord → client", detail: "Coord returns the region route. The lease holder also returns the next timestamp." },
    { label: "client → region leader", detail: "With route in hand, the client writes directly to the store that owns the target region's leader. Coord is off the data path." },
    { label: "raft replicate", detail: "The region leader replicates the log entry to its two followers on other stores. Quorum = 2 of 3." },
    { label: "engine persist", detail: "WAL appends first, the MemTable absorbs the write, background compaction produces SST levels." },
    { label: "ack → client", detail: "Once quorum is durable, the store acknowledges the client directly — no coord hop on the return path." },
]

type PortalPointerRef = RefObject<{ x: number; y: number }>

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

function NodeField({
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
        const ctx = canvas.getContext("2d")
        if (!ctx) return

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
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        const draw = () => {
            frame += 1
            const time = frame / 60
            const pointer = pointerRef.current ?? { x: 0, y: 0 }

            ctx.fillStyle = "rgba(9,9,9,0.22)"
            ctx.fillRect(0, 0, width, height)

            const nodes = seeds.map((seed, index) => {
                const orbit = 18 + index * 2.6
                const depthShiftX = 14 + seed.depth * 36
                const depthShiftY = 12 + seed.depth * 30
                return {
                    x: seed.x * width + Math.sin(time * seed.speedX * 6 + index) * orbit + pointer.x * depthShiftX,
                    y: seed.y * height + Math.cos(time * seed.speedY * 6 + index * 0.7) * (orbit * 0.82) + pointer.y * depthShiftY,
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

            ctx.save()
            for (let i = 0; i < nodes.length; i += 1) {
                for (let j = i + 1; j < nodes.length; j += 1) {
                    const a = nodes[i]
                    const b = nodes[j]
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const depthGap = Math.abs(a.depth - b.depth)
                    if (distance > 260 || depthGap > 0.58) continue
                    const alpha = (1 - distance / 260) * (0.06 + ((a.depth + b.depth) / 2) * 0.1)
                    ctx.strokeStyle = `rgba(247,245,241,${alpha})`
                    ctx.lineWidth = distance < 120 ? 0.9 : 0.5
                    ctx.setLineDash(distance < 120 ? [] : [6, 10])
                    ctx.beginPath()
                    ctx.moveTo(a.x, a.y)
                    ctx.lineTo(b.x, b.y)
                    ctx.stroke()
                }
            }
            ctx.restore()

            nodes.forEach((node) => {
                const glow = 16 + node.size * 8 + node.pulse * 6 + node.depth * 8
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glow)
                gradient.addColorStop(0, `rgba(247,245,241,${(0.12 + node.depth * 0.06) * node.intensity})`)
                gradient.addColorStop(0.5, `rgba(247,245,241,${0.04 * node.intensity})`)
                gradient.addColorStop(1, "rgba(247,245,241,0)")
                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(node.x, node.y, glow, 0, Math.PI * 2)
                ctx.fill()

                ctx.fillStyle = `rgba(247,245,241,${0.7 + node.depth * 0.2})`
                ctx.beginPath()
                ctx.arc(node.x, node.y, 1 + node.size * 0.8 + node.depth * 0.8, 0, Math.PI * 2)
                ctx.fill()
            })

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

    return <canvas ref={canvasRef} aria-hidden className="block h-full w-full" />
}

function ProtocolStage({
    scene,
    step,
    selectedId,
    onSelect,
}: {
    scene: ProtocolScene
    step: number
    selectedId: string
    onSelect: (id: string) => void
}) {
    const accent = scene.accent
    const orbId = `orb-${accent.slice(1)}`

    return (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-white/10 bg-black/35">
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(247,245,241,0.08) 1px, transparent 1px),linear-gradient(90deg,rgba(247,245,241,0.08) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <defs>
                    <radialGradient id={orbId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="18%" stopColor={accent} stopOpacity="0.95" />
                        <stop offset="45%" stopColor={accent} stopOpacity="0.28" />
                        <stop offset="100%" stopColor={accent} stopOpacity="0" />
                    </radialGradient>
                </defs>
                {scene.packets.map((packet, index) => {
                    const active = packet.activeSteps.includes(step)
                    return (
                        <g key={`${packet.path}-${index}`}>
                            <path
                                d={packet.path}
                                stroke={active ? `${accent}66` : "rgba(247,245,241,0.14)"}
                                strokeWidth="0.45"
                                strokeDasharray="3 5"
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                            />
                            {active && (
                                <motion.ellipse
                                    rx={1.6}
                                    ry={1.6 * (16 / 9)}
                                    fill={`url(#${orbId})`}
                                    animate={{
                                        offsetDistance: packet.reverse ? ["100%", "0%"] : ["0%", "100%"],
                                        opacity: [0, 1, 1, 0],
                                    }}
                                    transition={{
                                        duration: 1.25,
                                        delay: index * 0.07,
                                        repeat: Infinity,
                                        ease: "linear",
                                        repeatDelay: 0.18,
                                    }}
                                    style={{
                                        offsetPath: `path("${packet.path}")`,
                                        offsetRotate: "0deg",
                                    }}
                                />
                            )}
                        </g>
                    )
                })}
            </svg>
            {scene.nodes.map((node) => {
                const active = node.id === selectedId
                return (
                    <button
                        key={node.id}
                        type="button"
                        onMouseEnter={() => onSelect(node.id)}
                        onFocus={() => onSelect(node.id)}
                        onClick={() => onSelect(node.id)}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <motion.span
                                animate={{
                                    backgroundColor: active ? accent : "rgba(247,245,241,0.82)",
                                    boxShadow: active
                                        ? `0 0 0 4px ${accent}22, 0 0 18px ${accent}`
                                        : "0 0 8px rgba(247,245,241,0.25)",
                                    scale: active ? 1.25 : 1,
                                }}
                                transition={{ duration: 0.22 }}
                                className="h-2.5 w-2.5 rounded-full"
                            />
                            <span
                                className="font-mono text-[9px] uppercase tracking-[0.22em] transition-colors"
                                style={{ color: active ? accent : "rgba(247,245,241,0.52)" }}
                            >
                                {node.label}
                            </span>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

function ConsensusSection({
    mode,
    onModeChange,
    step,
    onStepChange,
    autoPlay,
    onAutoPlayChange,
}: {
    mode: ProtocolMode
    onModeChange: (mode: ProtocolMode) => void
    step: number
    onStepChange: (step: number) => void
    autoPlay: boolean
    onAutoPlayChange: (value: boolean) => void
}) {
    const scene = protocolScenes[mode]
    const [selectedId, setSelectedId] = useState(scene.nodes[0]?.id ?? "")

    useEffect(() => {
        setSelectedId(protocolScenes[mode].nodes[0]?.id ?? "")
    }, [mode])

    const selectedNode = scene.nodes.find((node) => node.id === selectedId) ?? scene.nodes[0]
    const activeStep = scene.steps[step] ?? scene.steps[0]

    const handleStep = (next: number) => {
        onAutoPlayChange(false)
        onStepChange(((next % scene.steps.length) + scene.steps.length) % scene.steps.length)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(protocolScenes) as ProtocolMode[]).map((key) => {
                        const active = key === mode
                        const keyScene = protocolScenes[key]
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onModeChange(key)}
                                className="rounded-full border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors"
                                style={{
                                    borderColor: active ? keyScene.accent : "rgba(247,245,241,0.14)",
                                    color: active ? "#0a0a0a" : "rgba(247,245,241,0.64)",
                                    backgroundColor: active ? keyScene.accent : "transparent",
                                }}
                            >
                                {keyScene.title}
                            </button>
                        )
                    })}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleStep(step - 1)}
                        aria-label="previous step"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/72 transition-colors hover:border-white/30 hover:text-white"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onAutoPlayChange(!autoPlay)}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/72 transition-colors hover:border-white/30 hover:text-white"
                    >
                        {autoPlay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        {autoPlay ? "pause" : "play"}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleStep(step + 1)}
                        aria-label="next step"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/72 transition-colors hover:border-white/30 hover:text-white"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ProtocolStage scene={scene} step={step} selectedId={selectedId} onSelect={setSelectedId} />
                    </motion.div>
                </AnimatePresence>

                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${mode}-${step}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-[24px] border border-white/10 p-6"
                            style={{ backgroundColor: `${scene.accent}0D` }}
                        >
                            <div
                                className="font-mono text-[10px] uppercase tracking-[0.24em]"
                                style={{ color: scene.accent }}
                            >
                                step 0{step + 1} · {activeStep.title}
                            </div>
                            <p className="mt-4 text-base leading-7 text-white/78">{activeStep.detail}</p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex-1 rounded-[24px] border border-white/10 p-6">
                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                            node · {selectedNode?.role}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedNode?.id ?? "none"}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="mt-3 text-xl font-medium tracking-[-0.02em] text-white">
                                    {selectedNode?.label}
                                </div>
                                <p className="mt-3 text-sm leading-7 text-white/60">{selectedNode?.detail}</p>
                            </motion.div>
                        </AnimatePresence>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {scene.nodes.map((node) => {
                                const active = node.id === selectedId
                                return (
                                    <button
                                        key={node.id}
                                        type="button"
                                        onClick={() => setSelectedId(node.id)}
                                        className="rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] transition-colors"
                                        style={{
                                            borderColor: active ? scene.accent : "rgba(247,245,241,0.14)",
                                            color: active ? scene.accent : "rgba(247,245,241,0.5)",
                                        }}
                                    >
                                        {node.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-2 md:grid-cols-4">
                {scene.steps.map((stepItem, index) => {
                    const active = index === step
                    return (
                        <button
                            key={stepItem.title}
                            type="button"
                            onClick={() => handleStep(index)}
                            className="rounded-[14px] border px-4 py-3 text-left transition-colors"
                            style={{
                                borderColor: active ? scene.accent : "rgba(247,245,241,0.12)",
                                backgroundColor: active ? `${scene.accent}14` : "transparent",
                            }}
                        >
                            <div
                                className="font-mono text-[9px] uppercase tracking-[0.22em]"
                                style={{ color: active ? scene.accent : "rgba(247,245,241,0.4)" }}
                            >
                                0{index + 1} · {stepItem.title}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

type StoreRegion = { id: "r1" | "r2"; role: "L" | "F" }
type StoreNode = {
    id: "s1" | "s2" | "s3"
    label: string
    x: number
    regions: StoreRegion[]
}

const coordinators = [
    { id: "c1", x: 22 },
    { id: "c2", x: 50 },
    { id: "c3", x: 78 },
] as const

const metaNodes = [
    { id: "m1", x: 28 },
    { id: "m2", x: 50 },
    { id: "m3", x: 72 },
] as const

const storeNodes: StoreNode[] = [
    { id: "s1", label: "store · 01", x: 18, regions: [{ id: "r1", role: "L" }, { id: "r2", role: "F" }] },
    { id: "s2", label: "store · 02", x: 50, regions: [{ id: "r1", role: "F" }, { id: "r2", role: "L" }] },
    { id: "s3", label: "store · 03", x: 82, regions: [{ id: "r1", role: "F" }, { id: "r2", role: "F" }] },
]

const CLIENT_X = 8
const CLIENT_Y = 6
const COORD_Y = 18
const META_Y = 34
const STORE_TOP_Y = 56
const LEASE_COORD_ID = "c2"

const storeX = (id: string) => storeNodes.find((s) => s.id === id)?.x ?? 50

function StorageFabric({ step }: { step: number }) {
    const active = step % storageStages.length
    const stage = storageStages[active]
    const accent = "#ffb86b"

    // Each full 6-step cycle, the write targets a different region.
    // Cycle 0: write to R1 (leader on s1). Cycle 1: write to R2 (leader on s2).
    const cycle = Math.floor(step / storageStages.length) % 2
    const targetRegion: "r1" | "r2" = cycle === 0 ? "r1" : "r2"
    const leaderStoreId: StoreNode["id"] = targetRegion === "r1" ? "s1" : "s2"
    const followerStoreIds: StoreNode["id"][] = storeNodes
        .filter((s) => s.id !== leaderStoreId)
        .map((s) => s.id)
    const leaderX = storeX(leaderStoreId)

    type Packet = { path: string; activeSteps: number[]; reverse?: boolean }
    const clientToStore = `M ${CLIENT_X + 2} ${CLIENT_Y + 3} C ${CLIENT_X + 6} ${STORE_TOP_Y - 20}, ${leaderX - 6} ${STORE_TOP_Y - 4}, ${leaderX} ${STORE_TOP_Y}`
    const leaseCoord = coordinators.find((c) => c.id === LEASE_COORD_ID) ?? coordinators[1]
    const coordToMetaPath = (mx: number) =>
        `M ${leaseCoord.x} ${COORD_Y + 3} C ${(leaseCoord.x + mx) / 2} ${(COORD_Y + META_Y) / 2 - 2}, ${mx} ${META_Y - 5}, ${mx} ${META_Y - 1}`
    const packets: Packet[] = [
        // step 0: client → all coords (GetRegionByKey + GetTSO — only lease holder serves TSO)
        ...coordinators.map((c) => ({
            path: `M ${CLIENT_X + 2} ${CLIENT_Y + 3} C ${(CLIENT_X + c.x) / 2} ${COORD_Y - 8}, ${c.x - 4} ${COORD_Y - 3}, ${c.x} ${COORD_Y - 2}`,
            activeSteps: [0],
        })),
        // step 1: lease coord ↔ meta cluster (lease renewal + metadata commit)
        ...metaNodes.map((m) => ({
            path: coordToMetaPath(m.x),
            activeSteps: [1],
        })),
        ...metaNodes.map((m) => ({
            path: coordToMetaPath(m.x),
            activeSteps: [1],
            reverse: true,
        })),
        // step 2: coords → client (return route / tso)
        ...coordinators.map((c) => ({
            path: `M ${CLIENT_X + 2} ${CLIENT_Y + 3} C ${(CLIENT_X + c.x) / 2} ${COORD_Y - 8}, ${c.x - 4} ${COORD_Y - 3}, ${c.x} ${COORD_Y - 2}`,
            activeSteps: [2],
            reverse: true,
        })),
        // step 3: client → region leader directly (bypass coord)
        { path: clientToStore, activeSteps: [3] },
        // step 4: leader → followers (replicate)
        ...followerStoreIds.map((id) => ({
            path: `M ${leaderX + 3} ${STORE_TOP_Y + 4} C ${(leaderX + storeX(id)) / 2} ${STORE_TOP_Y + 0}, ${(leaderX + storeX(id)) / 2} ${STORE_TOP_Y + 2}, ${storeX(id)} ${STORE_TOP_Y + 4}`,
            activeSteps: [4],
        })),
        // step 6: store → client ack direct
        { path: clientToStore, activeSteps: [6], reverse: true },
    ]

    // Meta cluster internal Raft ring (always visible)
    const metaRing = [
        `M ${metaNodes[0].x} ${META_Y} L ${metaNodes[1].x} ${META_Y}`,
        `M ${metaNodes[1].x} ${META_Y} L ${metaNodes[2].x} ${META_Y}`,
        `M ${metaNodes[0].x} ${META_Y} C ${metaNodes[0].x + 8} ${META_Y + 5}, ${metaNodes[2].x - 8} ${META_Y + 5}, ${metaNodes[2].x} ${META_Y}`,
    ]
    // Coord watches meta (always-on, backdrop only — not part of request path)
    const coordToMeta = [
        `M ${coordinators[0].x} ${COORD_Y + 3} L ${metaNodes[0].x} ${META_Y - 2}`,
        `M ${coordinators[1].x} ${COORD_Y + 3} L ${metaNodes[1].x} ${META_Y - 2}`,
        `M ${coordinators[2].x} ${COORD_Y + 3} L ${metaNodes[2].x} ${META_Y - 2}`,
    ]

    const clientLit = active === 0 || active === 2 || active === 3 || active === 6
    const anyCoordLit = active === 0 || active === 2
    const leaseCoordLit = active === 1
    const metaLit = active === 1
    const storeLeaderLit = active === 3 || active === 4 || active === 5 || active === 6
    const storeFollowerLit = active === 4
    const engineLit = active === 5

    return (
        <div className="space-y-6">
            <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[24px] border border-white/10 bg-black/35">
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(247,245,241,0.08) 1px, transparent 1px),linear-gradient(90deg,rgba(247,245,241,0.08) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <defs>
                        <radialGradient id="orb-storage" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                            <stop offset="18%" stopColor={accent} stopOpacity="0.95" />
                            <stop offset="45%" stopColor={accent} stopOpacity="0.28" />
                            <stop offset="100%" stopColor={accent} stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    {/* Always-on: coord watches meta (background sync, not request path) */}
                    {coordToMeta.map((d, i) => (
                        <path
                            key={`coord-meta-${i}`}
                            d={d}
                            stroke="rgba(247,245,241,0.09)"
                            strokeWidth="0.3"
                            strokeDasharray="1 3"
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                    {/* Meta internal Raft ring */}
                    {metaRing.map((d, i) => (
                        <path
                            key={`ring-${i}`}
                            d={d}
                            stroke="rgba(247,245,241,0.22)"
                            strokeWidth="0.4"
                            strokeDasharray="1.5 2.5"
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                    {packets.map((packet, index) => {
                        const isActive = packet.activeSteps.includes(active)
                        return (
                            <g key={`${packet.path}-${index}`}>
                                <path
                                    d={packet.path}
                                    stroke={isActive ? `${accent}66` : "rgba(247,245,241,0.1)"}
                                    strokeWidth="0.4"
                                    strokeDasharray="3 5"
                                    fill="none"
                                    vectorEffect="non-scaling-stroke"
                                />
                                {isActive && (
                                    <motion.ellipse
                                        rx={1.6}
                                        ry={1.6 * (5 / 3)}
                                        fill="url(#orb-storage)"
                                        animate={{
                                            offsetDistance: packet.reverse ? ["100%", "0%"] : ["0%", "100%"],
                                            opacity: [0, 1, 1, 0],
                                        }}
                                        transition={{
                                            duration: 1.25,
                                            delay: (index % 6) * 0.1,
                                            repeat: Infinity,
                                            ease: "linear",
                                            repeatDelay: 0.25,
                                        }}
                                        style={{
                                            offsetPath: `path("${packet.path}")`,
                                            offsetRotate: "0deg",
                                        }}
                                    />
                                )}
                            </g>
                        )
                    })}
                </svg>

                {/* Client */}
                <div
                    className="absolute -translate-y-1/2 flex items-center gap-2"
                    style={{ left: `${CLIENT_X}%`, top: `${CLIENT_Y + 2}%` }}
                >
                    <motion.span
                        animate={{
                            backgroundColor: clientLit ? accent : "rgba(247,245,241,0.82)",
                            scale: clientLit ? 1.3 : 1,
                            boxShadow: clientLit ? `0 0 12px ${accent}` : "0 0 0 rgba(0,0,0,0)",
                        }}
                        transition={{ duration: 0.22 }}
                        className="h-2.5 w-2.5 rounded-full"
                    />
                    <span
                        className="font-mono text-[9px] uppercase tracking-[0.22em]"
                        style={{ color: clientLit ? accent : "rgba(247,245,241,0.6)" }}
                    >
                        client
                    </span>
                </div>

                {/* Tier label · coordinators */}
                <div className="absolute left-[2%] top-[16%] font-mono text-[8px] uppercase tracking-[0.24em] text-white/32">
                    coord · stateless
                </div>
                {coordinators.map((c) => {
                    const isLease = c.id === LEASE_COORD_ID
                    const lit = anyCoordLit || (isLease && leaseCoordLit)
                    return (
                        <div
                            key={c.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${c.x}%`, top: `${COORD_Y}%`, width: "14%" }}
                        >
                            <motion.div
                                animate={{
                                    borderColor: lit || isLease ? accent : "rgba(247,245,241,0.14)",
                                    backgroundColor: lit ? `${accent}1f` : isLease ? `${accent}0f` : "rgba(247,245,241,0.02)",
                                }}
                                transition={{ duration: 0.22 }}
                                className="rounded-[12px] border px-3 py-2"
                            >
                                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-white/48">
                                    <span>coord {c.id.replace("c", "")}</span>
                                    {isLease && (
                                        <motion.span
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="h-1.5 w-1.5 rounded-full"
                                            style={{ backgroundColor: accent }}
                                        />
                                    )}
                                </div>
                                <div
                                    className="mt-0.5 text-[11px] font-medium"
                                    style={{ color: isLease ? accent : "rgba(247,245,241,0.86)" }}
                                >
                                    {isLease ? "lease · tso" : "route"}
                                </div>
                            </motion.div>
                        </div>
                    )
                })}

                {/* Tier label · meta */}
                <div className="absolute left-[2%] top-[32%] font-mono text-[8px] uppercase tracking-[0.24em] text-white/32">
                    meta · raft 3/3
                </div>
                {metaNodes.map((m) => (
                    <div
                        key={m.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${m.x}%`, top: `${META_Y}%`, width: "12%" }}
                    >
                        <motion.div
                            animate={{
                                borderColor: metaLit ? accent : "rgba(247,245,241,0.14)",
                                backgroundColor: metaLit ? `${accent}1f` : "rgba(247,245,241,0.02)",
                            }}
                            transition={{ duration: 0.22 }}
                            className="rounded-[10px] border px-2.5 py-1.5"
                        >
                            <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/48">
                                meta {m.id.replace("m", "")}
                            </div>
                            <div className="mt-0.5 text-[10px] font-medium text-white/72">catalog</div>
                        </motion.div>
                    </div>
                ))}

                {/* Tier label · stores */}
                <div className="absolute left-[2%] top-[54%] font-mono text-[8px] uppercase tracking-[0.24em] text-white/32">
                    stores · regions
                </div>
                {storeNodes.map((s) => {
                    const isLeaderStore = s.id === leaderStoreId
                    const lit = (isLeaderStore && storeLeaderLit) || (!isLeaderStore && storeFollowerLit)
                    return (
                        <div
                            key={s.id}
                            className="absolute -translate-x-1/2"
                            style={{ left: `${s.x}%`, top: `${STORE_TOP_Y}%`, width: "22%" }}
                        >
                            <motion.div
                                animate={{
                                    borderColor: lit ? accent : "rgba(247,245,241,0.14)",
                                    backgroundColor: lit ? `${accent}10` : "rgba(247,245,241,0.02)",
                                }}
                                transition={{ duration: 0.24 }}
                                className="rounded-[14px] border p-2.5"
                            >
                                <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.22em] text-white/48">
                                    <span>{s.label}</span>
                                    {isLeaderStore && storeLeaderLit && (
                                        <span style={{ color: accent }}>active</span>
                                    )}
                                </div>
                                <div className="mt-2 flex flex-col gap-1">
                                    {s.regions.map((region) => {
                                        const isTargetLeader = region.id === targetRegion && region.role === "L"
                                        const regionLit = isTargetLeader
                                            ? storeLeaderLit
                                            : region.id === targetRegion && lit
                                        return (
                                            <motion.div
                                                key={region.id}
                                                animate={{
                                                    borderColor: regionLit ? accent : "rgba(247,245,241,0.12)",
                                                    backgroundColor: regionLit ? `${accent}1a` : "transparent",
                                                }}
                                                transition={{ duration: 0.22 }}
                                                className="flex items-center justify-between rounded-[8px] border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em]"
                                            >
                                                <span className="text-white/72">{region.id}</span>
                                                <span
                                                    className="font-semibold"
                                                    style={{
                                                        color:
                                                            region.role === "L"
                                                                ? regionLit
                                                                    ? accent
                                                                    : "#f7f5f1cc"
                                                                : "rgba(247,245,241,0.44)",
                                                    }}
                                                >
                                                    {region.role}
                                                </span>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                                {/* Engine layers */}
                                <div className="mt-2 border-t border-white/8 pt-2">
                                    <div className="mb-1 font-mono text-[7px] uppercase tracking-[0.22em] text-white/36">
                                        engine
                                    </div>
                                    {["WAL", "MemTable", "SSTable"].map((layer, i) => {
                                        const layerLit = engineLit && isLeaderStore
                                        return (
                                            <div
                                                key={layer}
                                                className="mt-0.5 flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.2em]"
                                            >
                                                <motion.div
                                                    animate={{
                                                        width: layerLit ? (i === 0 ? "88%" : i === 1 ? "64%" : "40%") : "24%",
                                                        backgroundColor: layerLit
                                                            ? accent
                                                            : "rgba(247,245,241,0.22)",
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: layerLit ? i * 0.12 : 0,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                    className="h-[2px] rounded-full"
                                                />
                                                <span className="text-white/44">{layer}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    )
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={stage.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 rounded-[18px] border border-white/10 px-5 py-4"
                >
                    <div
                        className="font-mono text-[10px] uppercase tracking-[0.24em]"
                        style={{ color: accent }}
                    >
                        0{active + 1}
                    </div>
                    <div className="flex-1">
                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/56">{stage.label}</div>
                        <p className="mt-2 text-sm leading-7 text-white/62">{stage.detail}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

const heroLines = ["A Distributed", "Storage", "Simulator"]

export default function EntryPortal() {
    const [visible, setVisible] = useState(false)
    const [leaving, setLeaving] = useState(false)
    const [tick, setTick] = useState(0)
    const [protocolMode, setProtocolMode] = useState<ProtocolMode>("raft")
    const [protocolStep, setProtocolStep] = useState(0)
    const [protocolAutoPlay, setProtocolAutoPlay] = useState(true)
    const [closeTarget, setCloseTarget] = useState<{ x: number; y: number } | null>(null)
    const portalRef = useRef<HTMLDivElement | null>(null)
    const inspectRef = useRef<HTMLDivElement | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const pointerRef = useRef({ x: 0, y: 0 })
    const particleRef = useRef<PortalParticleSeed[]>([])
    const pointerX = useMotionValue(0)
    const pointerY = useMotionValue(0)
    const springX = useSpring(pointerX, { stiffness: 110, damping: 22, mass: 0.8 })
    const springY = useSpring(pointerY, { stiffness: 110, damping: 22, mass: 0.8 })
    const cardRotateX = useTransform(springY, [-0.5, 0.5], [6, -6])
    const cardRotateY = useTransform(springX, [-0.5, 0.5], [-8, 8])
    const graphShiftX = useTransform(springX, [-0.5, 0.5], [-14, 14])
    const graphShiftY = useTransform(springY, [-0.5, 0.5], [-10, 10])
    const glowX = useTransform(springX, [-0.5, 0.5], ["36%", "64%"])
    const glowY = useTransform(springY, [-0.5, 0.5], ["36%", "64%"])

    useEffect(() => {
        if (typeof window === "undefined") return
        const alreadyEntered = window.sessionStorage.getItem("entry-portal-dismissed") === "1"
        setVisible(!alreadyEntered)
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return
        const handleOpen = () => {
            setLeaving(false)
            setVisible(true)
            setProtocolStep(0)
            setProtocolAutoPlay(true)
            window.setTimeout(() => {
                portalRef.current?.scrollTo({ top: 0, behavior: "auto" })
            }, 20)
        }
        window.addEventListener("entry-portal-open", handleOpen)
        return () => window.removeEventListener("entry-portal-open", handleOpen)
    }, [])

    useEffect(() => {
        if (!visible || leaving) return
        const timer = window.setInterval(() => {
            setTick((value) => (value + 1) % 1000)
        }, 1600)
        return () => window.clearInterval(timer)
    }, [visible, leaving])

    useEffect(() => {
        if (typeof window === "undefined") return
        window.dispatchEvent(new CustomEvent("entry-portal-visibility", { detail: { visible } }))
    }, [visible])

    useEffect(() => {
        setProtocolStep(0)
        setProtocolAutoPlay(true)
    }, [protocolMode])

    useEffect(() => {
        if (!visible || leaving || !protocolAutoPlay) return
        const timer = window.setInterval(() => {
            setProtocolStep((value) => (value + 1) % 4)
        }, 1500)
        return () => window.clearInterval(timer)
    }, [visible, leaving, protocolMode, protocolAutoPlay])

    useEffect(() => {
        if (typeof window === "undefined" || !visible) return
        const html = document.documentElement
        const body = document.body
        const prevHtmlOverflow = html.style.overflow
        const prevBodyOverflow = body.style.overflow
        html.style.overflow = "hidden"
        body.style.overflow = "hidden"
        return () => {
            html.style.overflow = prevHtmlOverflow
            body.style.overflow = prevBodyOverflow
        }
    }, [visible])

    const runtime = useMemo(() => String(128 + tick).padStart(3, "0"), [tick])
    const storageStep = tick

    const closePortal = () => {
        if (typeof window !== "undefined") {
            const target = document.getElementById("hero-visual-target")
            const canvas = panelRef.current?.querySelector("canvas")
            if (target && canvas && particleRef.current.length > 0) {
                const canvasRect = canvas.getBoundingClientRect()
                const particles = particleRef.current.map((node, index) => ({
                    x: canvasRect.left + node.x,
                    y: canvasRect.top + node.y,
                    size: 4 + node.size * 2.8 + node.depth * 4,
                    delay: index * 0.015,
                }))
                window.dispatchEvent(new CustomEvent("entry-portal-handoff", { detail: { particles } }))
            } else {
                window.dispatchEvent(new CustomEvent("entry-portal-handoff"))
            }
            if (target) {
                const rect = target.getBoundingClientRect()
                setCloseTarget({
                    x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
                    y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
                })
            }
            window.sessionStorage.setItem("entry-portal-dismissed", "1")
        }
        setLeaving(true)
        window.setTimeout(() => {
            setVisible(false)
            setLeaving(false)
            setCloseTarget(null)
        }, 900)
    }

    const handlePortalMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const nextX = event.clientX / window.innerWidth - 0.5
        const nextY = event.clientY / window.innerHeight - 0.5
        pointerRef.current = { x: nextX, y: nextY }
        pointerX.set(nextX)
        pointerY.set(nextY)
    }

    const scrollToInspect = () => {
        inspectRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const clipPathClosed = closeTarget
        ? `circle(0% at ${closeTarget.x}% ${closeTarget.y}%)`
        : "circle(0% at 50% 50%)"

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    ref={portalRef}
                    key="entry-portal"
                    initial={{ opacity: 0, clipPath: "circle(150% at 50% 50%)" }}
                    animate={
                        leaving
                            ? {
                                opacity: 1,
                                clipPath: clipPathClosed,
                                scale: 0.94,
                                filter: "blur(14px)",
                            }
                            : { opacity: 1, clipPath: "circle(150% at 50% 50%)", scale: 1, filter: "blur(0px)" }
                    }
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: leaving ? 0.9 : 0.42,
                        ease: leaving ? [0.76, 0, 0.24, 1] : [0.22, 1, 0.36, 1],
                    }}
                    data-lenis-prevent
                    onWheelCapture={(event) => event.stopPropagation()}
                    onMouseMove={handlePortalMove}
                    className="fixed inset-0 z-[220] overflow-y-auto overscroll-y-contain bg-[#090909] text-[#f7f5f1] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{ WebkitOverflowScrolling: "touch", willChange: "transform, clip-path, filter" }}
                >
                    <AnimatePresence>
                        {leaving && (
                            <motion.div
                                key="close-flash"
                                aria-hidden
                                className="pointer-events-none fixed inset-0 z-[230] bg-[#ffb86b]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.4, 0] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.38, times: [0, 0.25, 1], ease: "easeOut" }}
                                style={{ mixBlendMode: "screen" }}
                            />
                        )}
                    </AnimatePresence>

                    <motion.div
                        aria-hidden
                        className="pointer-events-none fixed inset-0 z-0 opacity-[0.55]"
                        style={{
                            background:
                                "radial-gradient(circle at var(--entry-glow-x) var(--entry-glow-y), rgba(247,245,241,0.09), transparent 32%)",
                            ["--entry-glow-x" as string]: glowX,
                            ["--entry-glow-y" as string]: glowY,
                        }}
                    />

                    <div className="relative z-10 px-5 py-6 md:px-10 md:py-8">
                        <div className="mx-auto w-full max-w-[1500px]">
                            <div className="sticky top-0 z-30 -mx-5 mb-12 flex items-start justify-between gap-6 bg-[#090909]/70 px-5 pb-5 pt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 backdrop-blur-xl md:-mx-10 md:px-10">
                                <div className="space-y-1.5">
                                    <div>guocheng song · entry</div>
                                    <div className="text-white/32">runtime {runtime} · online</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={closePortal}
                                    className="text-white/48 transition-colors hover:text-white"
                                >
                                    skip →
                                </button>
                            </div>

                            <section className="grid min-h-[calc(100vh-160px)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: leaving ? 0 : 1 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col justify-center"
                                >
                                    <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-white/42">
                                        entry · systems layer
                                    </div>
                                    <h1 className="mt-8 text-[13vw] font-medium leading-[0.86] tracking-[-0.055em] sm:text-[5rem] lg:text-[6.4rem] xl:text-[7.6rem]">
                                        {heroLines.map((line, index) => (
                                            <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                                                <motion.span
                                                    initial={{ y: "110%" }}
                                                    animate={{ y: leaving ? "-40%" : "0%" }}
                                                    transition={{
                                                        duration: 0.95,
                                                        delay: leaving ? index * 0.04 : 0.18 + index * 0.08,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                    className={`inline-block ${index === 1 ? "text-white/62" : ""}`}
                                                >
                                                    {line}
                                                </motion.span>
                                            </span>
                                        ))}
                                    </h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -8 : 0 }}
                                        transition={{ duration: 0.8, delay: leaving ? 0 : 0.6 }}
                                        className="mt-8 max-w-xl text-base leading-8 text-white/64"
                                    >
                                        Three consensus protocols and one storage architecture, animated end to end. Drag any step, pause any phase.
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -8 : 0 }}
                                        transition={{ duration: 0.72, delay: leaving ? 0 : 0.75 }}
                                        className="mt-10 flex flex-wrap items-center gap-4"
                                    >
                                        <MagneticButton
                                            as="button"
                                            onClick={closePortal}
                                            strength={0.24}
                                            className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-7 font-mono text-[11px] uppercase tracking-[0.26em] text-black"
                                        >
                                            enter portfolio
                                            <ArrowRight className="h-4 w-4" />
                                        </MagneticButton>
                                        <MagneticButton
                                            as="button"
                                            onClick={scrollToInspect}
                                            strength={0.18}
                                            className="inline-flex h-14 items-center gap-3 rounded-full border border-white/14 px-7 font-mono text-[11px] uppercase tracking-[0.24em] text-white/72"
                                        >
                                            inspect systems
                                            <ArrowDown className="h-4 w-4" />
                                        </MagneticButton>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    ref={panelRef}
                                    initial={{ opacity: 0, y: 28 }}
                                    animate={{ opacity: leaving ? 0 : 1, y: leaving ? 12 : 0 }}
                                    transition={{ duration: 0.8, delay: leaving ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformPerspective: 1400 }}
                                    className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-5"
                                >
                                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-white/44">
                                        <span>node field</span>
                                        <span>build 24.04</span>
                                    </div>
                                    <motion.div
                                        style={{ x: graphShiftX, y: graphShiftY }}
                                        className="mt-5 h-[22rem] overflow-hidden rounded-[22px] border border-white/10 bg-black/40"
                                    >
                                        <NodeField pointerRef={pointerRef} particleRef={particleRef} />
                                    </motion.div>
                                    <div className="mt-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.26em] text-white/42">
                                        <span>pointer-reactive</span>
                                        <span className="text-white/32">canvas · 60fps</span>
                                    </div>
                                </motion.div>
                            </section>

                            <section ref={inspectRef} className="mt-28 border-t border-white/8 pt-16">
                                <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                                    <div className="max-w-2xl">
                                        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-white/38">02 · consensus</div>
                                        <h2 className="mt-5 text-4xl font-medium leading-[0.98] tracking-[-0.04em] md:text-5xl">
                                            Three consensus protocols, animated end to end.
                                        </h2>
                                    </div>
                                    <p className="max-w-sm text-sm leading-7 text-white/56">
                                        Raft moves a commit index, Paxos walks two quorums, chain replication hands a write from head to tail.
                                    </p>
                                </div>
                                <ConsensusSection
                                    mode={protocolMode}
                                    onModeChange={setProtocolMode}
                                    step={protocolStep}
                                    onStepChange={setProtocolStep}
                                    autoPlay={protocolAutoPlay}
                                    onAutoPlayChange={setProtocolAutoPlay}
                                />
                            </section>

                            <section className="mt-28 border-t border-white/8 pt-16">
                                <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                                    <div className="max-w-2xl">
                                        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-white/38">03 · storage</div>
                                        <h2 className="mt-5 text-4xl font-medium leading-[0.98] tracking-[-0.04em] md:text-5xl">
                                            One write, from gateway to durable commit.
                                        </h2>
                                    </div>
                                    <p className="max-w-sm text-sm leading-7 text-white/56">
                                        Gateway routes through the control plane into a raftstore quorum, then into the storage engine.
                                    </p>
                                </div>
                                <StorageFabric step={storageStep} />
                            </section>

                            <section className="mt-28 border-t border-white/8 pb-20 pt-16">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="max-w-xl">
                                        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-white/38">continue</div>
                                        <h2 className="mt-4 text-3xl font-medium leading-[0.98] tracking-[-0.03em] md:text-4xl">
                                            Close the portal, land in the portfolio.
                                        </h2>
                                    </div>
                                    <MagneticButton
                                        as="button"
                                        onClick={closePortal}
                                        strength={0.2}
                                        className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-7 font-mono text-[11px] uppercase tracking-[0.26em] text-black"
                                    >
                                        enter portfolio
                                        <ArrowRight className="h-4 w-4" />
                                    </MagneticButton>
                                </div>
                            </section>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
