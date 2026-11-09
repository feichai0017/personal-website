import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

export default function StudioAuthLayout({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <main className="flex min-h-screen flex-col bg-[#f7f5f1]">
            <header className="flex h-12 items-center justify-between border-b border-black/[0.06] px-3 md:px-5">
                <Link href="/blog" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] text-black/56 transition hover:bg-black/[0.05] hover:text-black">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Notebook
                </Link>
            </header>

            <div className="flex flex-1 items-center justify-center px-5 py-16">
                <section className="w-full max-w-[380px]">
                    <Image src="/img/my.png" alt="" width={44} height={44} className="h-11 w-11 rounded-xl border border-black/10" />
                    <h1 className="mt-5 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-black">{title}</h1>
                    <p className="mt-2 text-[15px] leading-7 text-black/52">{description}</p>
                    {children}
                </section>
            </div>
        </main>
    )
}
