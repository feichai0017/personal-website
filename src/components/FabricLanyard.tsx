"use client"

import type { MotionValue } from "framer-motion"
import { useEffect, useRef } from "react"

type Point = {
    x: number
    y: number
    previousX: number
    previousY: number
}

type Chain = {
    points: Point[]
    restLengths: number[]
}

type FabricLanyardProps = {
    offsetX: MotionValue<number>
    offsetY: MotionValue<number>
    cardTop: number
    reducedMotion: boolean
}

const POINT_COUNT = 13
const ANCHOR_GAP = 42
const RING_RADIUS = 11
const RING_CENTER_OFFSET = 14

function createChain(anchorX: number, anchorY: number, endX: number, endY: number, direction: -1 | 1): Chain {
    const points = Array.from({ length: POINT_COUNT }, (_, index) => {
        const progress = index / (POINT_COUNT - 1)
        const bow = Math.sin(Math.PI * progress)
        const x = anchorX + (endX - anchorX) * progress + direction * bow * 18
        const y = anchorY + (endY - anchorY) * progress + bow * 8
        return { x, y, previousX: x, previousY: y }
    })

    return {
        points,
        restLengths: points.slice(1).map((point, index) => {
            const previous = points[index]
            return Math.hypot(point.x - previous.x, point.y - previous.y)
        }),
    }
}

function pinChain(chain: Chain, anchorX: number, anchorY: number, endX: number, endY: number) {
    const first = chain.points[0]
    const last = chain.points[chain.points.length - 1]
    first.x = anchorX
    first.y = anchorY
    first.previousX = anchorX
    first.previousY = anchorY
    last.x = endX
    last.y = endY
    last.previousX = endX
    last.previousY = endY
}

function solveChain(chain: Chain, anchorX: number, anchorY: number, endX: number, endY: number) {
    pinChain(chain, anchorX, anchorY, endX, endY)

    for (let iteration = 0; iteration < 8; iteration += 1) {
        for (let index = 0; index < chain.points.length - 1; index += 1) {
            const current = chain.points[index]
            const next = chain.points[index + 1]
            const deltaX = next.x - current.x
            const deltaY = next.y - current.y
            const distance = Math.max(0.0001, Math.hypot(deltaX, deltaY))
            const correction = (distance - chain.restLengths[index]) / distance

            if (index === 0) {
                next.x -= deltaX * correction
                next.y -= deltaY * correction
            } else if (index === chain.points.length - 2) {
                current.x += deltaX * correction
                current.y += deltaY * correction
            } else {
                current.x += deltaX * correction * 0.5
                current.y += deltaY * correction * 0.5
                next.x -= deltaX * correction * 0.5
                next.y -= deltaY * correction * 0.5
            }
        }

        pinChain(chain, anchorX, anchorY, endX, endY)
    }
}

function traceChain(context: CanvasRenderingContext2D, points: Point[]) {
    context.beginPath()
    context.moveTo(points[0].x, points[0].y)

    for (let index = 1; index < points.length - 1; index += 1) {
        const point = points[index]
        const next = points[index + 1]
        const midpointX = (point.x + next.x) * 0.5
        const midpointY = (point.y + next.y) * 0.5
        context.quadraticCurveTo(point.x, point.y, midpointX, midpointY)
    }

    const last = points[points.length - 1]
    context.lineTo(last.x, last.y)
}

function drawFabric(context: CanvasRenderingContext2D, chain: Chain) {
    context.save()
    context.lineCap = "round"
    context.lineJoin = "round"

    traceChain(context, chain.points)
    context.strokeStyle = "rgba(10, 10, 10, 0.12)"
    context.lineWidth = 11
    context.stroke()

    traceChain(context, chain.points)
    context.strokeStyle = "#20201e"
    context.lineWidth = 8.5
    context.stroke()

    traceChain(context, chain.points)
    context.strokeStyle = "#34332f"
    context.lineWidth = 5.8
    context.stroke()

    traceChain(context, chain.points)
    context.setLineDash([2, 3])
    context.strokeStyle = "rgba(247, 245, 241, 0.27)"
    context.lineWidth = 0.9
    context.stroke()
    context.restore()
}

export default function FabricLanyard({ offsetX, offsetY, cardTop, reducedMotion }: FabricLanyardProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return

        let width = 0
        let height = 0
        let frameId = 0
        let lastTime = performance.now()
        let visible = true
        let leftChain: Chain | null = null
        let rightChain: Chain | null = null

        const getRig = () => {
            const centerX = width * 0.5
            const ringX = centerX + offsetX.get()
            const ringY = cardTop - RING_CENTER_OFFSET + offsetY.get()
            return {
                centerX,
                ringX,
                ringY,
                leftAnchorX: centerX - ANCHOR_GAP,
                rightAnchorX: centerX + ANCHOR_GAP,
                leftEndX: ringX - 7.5,
                rightEndX: ringX + 7.5,
                endY: ringY - 7.5,
            }
        }

        const initialize = () => {
            const rig = getRig()
            leftChain = createChain(rig.leftAnchorX, 24, rig.leftEndX, rig.endY, -1)
            rightChain = createChain(rig.rightAnchorX, 24, rig.rightEndX, rig.endY, 1)
        }

        const resize = () => {
            const rect = canvas.getBoundingClientRect()
            const density = Math.min(window.devicePixelRatio || 1, 2)
            width = rect.width
            height = rect.height
            canvas.width = Math.round(width * density)
            canvas.height = Math.round(height * density)
            context.setTransform(density, 0, 0, density, 0, 0)
            initialize()
        }

        const observer = new ResizeObserver(resize)
        observer.observe(canvas)
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
        })
        visibilityObserver.observe(canvas)
        resize()

        const render = (time: number) => {
            frameId = requestAnimationFrame(render)
            if (!visible || !leftChain || !rightChain) return

            const elapsed = Math.min(1.6, Math.max(0.5, (time - lastTime) / 16.667))
            lastTime = time
            const rig = getRig()

            ;[leftChain, rightChain].forEach((chain, chainIndex) => {
                for (let index = 1; index < chain.points.length - 1; index += 1) {
                    const point = chain.points[index]
                    const velocityX = (point.x - point.previousX) * 0.978
                    const velocityY = (point.y - point.previousY) * 0.978
                    point.previousX = point.x
                    point.previousY = point.y
                    const wind = reducedMotion ? 0 : Math.sin(time * 0.0014 + index * 0.55 + chainIndex) * 0.018
                    point.x += velocityX + wind * elapsed
                    point.y += velocityY + 0.075 * elapsed * elapsed
                }
            })

            solveChain(leftChain, rig.leftAnchorX, 24, rig.leftEndX, rig.endY)
            solveChain(rightChain, rig.rightAnchorX, 24, rig.rightEndX, rig.endY)

            context.clearRect(0, 0, width, height)
            drawFabric(context, leftChain)
            drawFabric(context, rightChain)

            context.beginPath()
            context.arc(rig.ringX, rig.ringY, RING_RADIUS, 0, Math.PI * 2)
            context.fillStyle = "#ece8df"
            context.fill()
            context.strokeStyle = "#5a5751"
            context.lineWidth = 2.2
            context.stroke()
        }

        frameId = requestAnimationFrame(render)
        return () => {
            cancelAnimationFrame(frameId)
            observer.disconnect()
            visibilityObserver.disconnect()
        }
    }, [cardTop, offsetX, offsetY, reducedMotion])

    return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
