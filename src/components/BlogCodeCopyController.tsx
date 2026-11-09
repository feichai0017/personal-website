"use client"

import { useEffect } from "react"

import { copyText } from "@/lib/copy-text"

const RESET_DELAY_MS = 1600

export default function BlogCodeCopyController({ rootId }: { rootId: string }) {
    useEffect(() => {
        const root = document.getElementById(rootId)
        if (!root) return

        const resetTimers = new Map<HTMLButtonElement, number>()

        const setStatus = (button: HTMLButtonElement, status: "idle" | "copying" | "copied" | "failed") => {
            const label = button.querySelector<HTMLElement>("[data-copy-label]")
            button.dataset.copyStatus = status
            button.setAttribute("aria-label", status === "idle" ? "copy code" : status.replace("ing", ""))
            if (label) {
                label.textContent =
                    status === "copying" ? "copying" : status === "copied" ? "copied" : status === "failed" ? "copy failed" : "copy"
            }
        }

        const copyCode = async (button: HTMLButtonElement) => {
            if (button.dataset.copyStatus === "copying") return
            const code = button.closest<HTMLElement>("[data-code-block]")?.querySelector("code")?.textContent ?? ""
            setStatus(button, "copying")
            const succeeded = await copyText(code)
            setStatus(button, succeeded ? "copied" : "failed")

            const existingTimer = resetTimers.get(button)
            if (existingTimer) window.clearTimeout(existingTimer)
            resetTimers.set(
                button,
                window.setTimeout(() => {
                    setStatus(button, "idle")
                    resetTimers.delete(button)
                }, RESET_DELAY_MS)
            )
        }

        const buttonHandlers = new Map<HTMLButtonElement, () => void>()
        root.querySelectorAll<HTMLButtonElement>("[data-code-copy]").forEach((button) => {
            const handler = () => void copyCode(button)
            buttonHandlers.set(button, handler)
            button.addEventListener("click", handler)
        })
        return () => {
            buttonHandlers.forEach((handler, button) => button.removeEventListener("click", handler))
            resetTimers.forEach((timer) => window.clearTimeout(timer))
        }
    }, [rootId])

    return null
}
