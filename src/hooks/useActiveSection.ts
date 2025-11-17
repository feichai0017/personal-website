import { useEffect, useMemo, useState } from 'react'

export function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState('')
    const idsKey = JSON.stringify(sectionIds)
    const normalizedSectionIds = useMemo(() => {
        try {
            const parsed = JSON.parse(idsKey) as string[]
            return Array.from(new Set(parsed)).filter(Boolean)
        } catch {
            return []
        }
    }, [idsKey])

    useEffect(() => {
        if (normalizedSectionIds.length === 0) return
        if (typeof window === 'undefined') return

        let frameRequest: number | null = null

        const resolveSection = () => {
            frameRequest = null
            const viewportHeight = window.innerHeight || 0
            const focusLine = viewportHeight * 0.35 // bias towards top third
            let winner = ''
            let bestDistance = Number.POSITIVE_INFINITY

            normalizedSectionIds.forEach((id) => {
                const element = document.getElementById(id)
                if (!element) return
                const rect = element.getBoundingClientRect()
                const fullyBelow = rect.top - viewportHeight > 0
                const fullyAbove = rect.bottom < 0
                const distance = Math.abs(rect.top - focusLine)

                if (!fullyAbove && !fullyBelow) {
                    if (distance < bestDistance) {
                        bestDistance = distance
                        winner = id
                    }
                } else if (!winner && distance < bestDistance) {
                    // fallback when nothing is in view yet
                    bestDistance = distance
                    winner = id
                }
            })

            if (winner) {
                setActiveSection(prev => (prev === winner ? prev : winner))
            }
        }

        const requestUpdate = () => {
            if (frameRequest !== null) return
            frameRequest = window.requestAnimationFrame(resolveSection)
        }

        window.addEventListener('scroll', requestUpdate, { passive: true })
        window.addEventListener('resize', requestUpdate)
        requestUpdate()

        return () => {
            window.removeEventListener('scroll', requestUpdate)
            window.removeEventListener('resize', requestUpdate)
            if (frameRequest !== null) {
                window.cancelAnimationFrame(frameRequest)
            }
        }
    }, [normalizedSectionIds])

    return activeSection
}
