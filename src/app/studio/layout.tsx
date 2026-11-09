import type { Metadata } from "next"

import "@milkdown/crepe/theme/common/style.css"
import "@milkdown/crepe/theme/frame.css"
import "./studio.css"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Blog Studio",
    robots: {
        index: false,
        follow: false,
    },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return <div className="studio-shell min-h-screen bg-[#f7f5f1] text-[#0a0a0a]">{children}</div>
}
