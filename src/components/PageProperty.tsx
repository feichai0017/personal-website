import type { ReactNode } from "react"

export default function PageProperty({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
    return (
        <div className="grid min-h-[32px] grid-cols-[104px_minmax(0,1fr)] items-center gap-3 text-[14px] sm:grid-cols-[132px_minmax(0,1fr)]">
            <span className="flex items-center gap-2 text-black/42">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span>
                {label}
            </span>
            <div className="min-w-0 text-black/72">{children}</div>
        </div>
    )
}
