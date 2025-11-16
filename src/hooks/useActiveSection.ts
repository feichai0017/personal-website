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
        const observer = new IntersectionObserver(
            (entries) => {
                // 找到所有可见的sections
                const visibleSections = entries
                    .filter(entry => entry.isIntersecting)
                    .map(entry => ({
                        id: entry.target.id,
                        ratio: entry.intersectionRatio,
                        top: entry.boundingClientRect.top
                    }))
                    .sort((a, b) => {
                        // 优先选择更靠近顶部的section
                        if (Math.abs(a.top - b.top) < 100) {
                            // 如果两个section都在相似位置，选择intersection ratio更大的
                            return b.ratio - a.ratio
                        }
                        return a.top - b.top
                    })

                if (visibleSections.length > 0) {
                    const newActiveSection = visibleSections[0].id
                    setActiveSection(prev => (prev === newActiveSection ? prev : newActiveSection))
                }
            },
            {
                threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
                rootMargin: '-80px 0px -50% 0px' // 考虑navbar高度
            }
        )

        const pendingIds = new Set<string>()

        const tryObserve = (id: string) => {
            const element = document.getElementById(id)
            if (element) {
                observer.observe(element)
                pendingIds.delete(id)
            } else {
                pendingIds.add(id)
            }
        }

        normalizedSectionIds.forEach(tryObserve)

        let retryTimer: number | null = null
        if (pendingIds.size > 0) {
            retryTimer = window.setInterval(() => {
                pendingIds.forEach(tryObserve)
                if (pendingIds.size === 0 && retryTimer) {
                    clearInterval(retryTimer)
                    retryTimer = null
                }
            }, 500)
        }

        return () => {
            observer.disconnect()
            if (retryTimer) {
                clearInterval(retryTimer)
            }
        }
    }, [normalizedSectionIds])

    return activeSection
}
