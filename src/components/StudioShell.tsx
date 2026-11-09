import type { ReactNode } from "react"

export default function StudioShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f7f5f1] text-[#0a0a0a] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
            <aside className="sticky top-0 hidden h-screen border-r border-black/[0.07] bg-[#f1eee8] lg:block">
                {sidebar}
            </aside>
            <div className="flex min-h-screen min-w-0 flex-col">{children}</div>
        </div>
    )
}
