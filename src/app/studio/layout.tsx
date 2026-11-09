import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Sign in",
    robots: {
        index: false,
        follow: false,
    },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-[#f7f5f1] text-[#0a0a0a]">{children}</div>
}
