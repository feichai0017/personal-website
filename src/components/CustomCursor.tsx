"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type CursorState = {
    label: string
    interactive: boolean
    textInput: boolean
    magnetX: number | null
    magnetY: number | null
}

export default function CustomCursor() {
    const [enabled, setEnabled] = useState(false)
    const [visible, setVisible] = useState(false)
    const [pressed, setPressed] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [cursorState, setCursorState] = useState<CursorState>({
        label: "",
        interactive: false,
        textInput: false,
        magnetX: null,
        magnetY: null,
    })

    useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQuery = window.matchMedia("(pointer: fine)")
        const updateEnabled = () => setEnabled(mediaQuery.matches)

        updateEnabled()
        mediaQuery.addEventListener("change", updateEnabled)

        return () => mediaQuery.removeEventListener("change", updateEnabled)
    }, [])

    useEffect(() => {
        if (!enabled) return

        const resolveCursorState = (target: EventTarget | null) => {
            const element = target instanceof Element ? target : null
            const textInput = element?.closest("input, textarea, select, [contenteditable='true']")
            if (textInput) {
                setCursorState({ label: "", interactive: false, textInput: true, magnetX: null, magnetY: null })
                return
            }

            const interactiveTarget = element?.closest("[data-cursor], a, button") as (HTMLElement | SVGElement | null)
            const explicitLabel = interactiveTarget?.dataset.cursor?.toUpperCase() ?? ""
            const rect = interactiveTarget?.getBoundingClientRect()
            const magnetX = rect ? rect.left + rect.width / 2 : null
            const magnetY = rect ? rect.top + rect.height / 2 : null

            setCursorState({
                label: explicitLabel,
                interactive: Boolean(interactiveTarget),
                textInput: false,
                magnetX,
                magnetY,
            })
        }

        const handleMove = (event: MouseEvent) => {
            setPosition({ x: event.clientX, y: event.clientY })
            setVisible(true)
            resolveCursorState(event.target)
        }

        const handleLeave = () => setVisible(false)
        const handleEnter = () => setVisible(true)
        const handleDown = () => setPressed(true)
        const handleUp = () => setPressed(false)

        window.addEventListener("mousemove", handleMove)
        window.addEventListener("mousedown", handleDown)
        window.addEventListener("mouseup", handleUp)
        window.addEventListener("mouseleave", handleLeave)
        window.addEventListener("mouseenter", handleEnter)

        return () => {
            window.removeEventListener("mousemove", handleMove)
            window.removeEventListener("mousedown", handleDown)
            window.removeEventListener("mouseup", handleUp)
            window.removeEventListener("mouseleave", handleLeave)
            window.removeEventListener("mouseenter", handleEnter)
        }
    }, [enabled])

    if (!enabled || cursorState.textInput || !cursorState.interactive) return null

    const cursorLabel = cursorState.label
    const cursorSize = cursorLabel === "DRAG" ? 92 : cursorLabel ? 70 : 44
    const targetX = cursorState.interactive && cursorState.magnetX !== null
        ? position.x * 0.78 + cursorState.magnetX * 0.22
        : position.x
    const targetY = cursorState.interactive && cursorState.magnetY !== null
        ? position.y * 0.78 + cursorState.magnetY * 0.22
        : position.y

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.16 }}
                    className="pointer-events-none fixed left-0 top-0 z-[120] hidden md:block"
                    style={{ x: targetX, y: targetY }}
                >
                    <motion.div
                        animate={{
                            width: cursorSize + 18,
                            height: cursorSize + 18,
                            x: -(cursorSize + 18) / 2,
                            y: -(cursorSize + 18) / 2,
                            opacity: 0.3,
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                        className="absolute rounded-full border border-black/12 bg-black/[0.02] dark:border-white/18 dark:bg-white/[0.03]"
                    />

                    <motion.div
                        animate={{
                            width: cursorSize,
                            height: cursorSize,
                            x: -cursorSize / 2,
                            y: -cursorSize / 2,
                            scale: pressed ? 0.92 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        className="absolute rounded-full border border-black/22 bg-white/72 backdrop-blur-[6px] dark:border-white/45 dark:bg-white/6"
                        style={{ boxShadow: "0 0 22px rgba(10,10,10,0.08)" }}
                    >
                        {cursorLabel ? (
                            <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.24em] text-black dark:text-white">
                                {cursorLabel}
                            </div>
                        ) : null}
                    </motion.div>

                    <motion.div
                        animate={{
                            x: -4,
                            y: -4,
                            scale: pressed ? 0.72 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 420, damping: 26 }}
                        className="absolute h-2 w-2 rounded-full bg-black dark:bg-[#f5f1e8]"
                        style={{ boxShadow: "0 0 12px rgba(10,10,10,0.16)" }}
                    />

                    <motion.div
                        animate={{
                            width: 6,
                            height: 6,
                            x: 10,
                            y: 10,
                            opacity: pressed ? 0.18 : 0.44,
                        }}
                        transition={{ type: "spring", stiffness: 180, damping: 18 }}
                        className="absolute rounded-full bg-black/50 dark:bg-white/65"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
