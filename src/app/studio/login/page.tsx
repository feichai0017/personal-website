import Link from "next/link"
import { redirect } from "next/navigation"

import StudioLoginForm from "@/components/StudioLoginForm"
import { getBlogAdminSession } from "@/lib/blog-admin"

export default async function StudioLoginPage() {
    const session = await getBlogAdminSession()
    if (session.isAdmin) redirect("/studio")

    return (
        <main className="flex min-h-screen items-center justify-center px-5 py-16">
            <section className="grid w-full max-w-[1040px] overflow-hidden rounded-[44px] border border-black/10 bg-[#fbfaf7] shadow-[0_28px_90px_rgba(10,10,10,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[420px] overflow-hidden border-b border-black/10 bg-black p-8 text-[#f7f5f1] lg:border-b-0 lg:border-r">
                    <div className="absolute inset-0 studio-dot-field opacity-35" />
                    <div className="relative flex h-full flex-col justify-between">
                        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/48">
                            Private publishing surface
                        </div>
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span className="h-px w-20 bg-white/28" />
                                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/42">owner only</span>
                            </div>
                            <h1 className="max-w-lg text-5xl font-medium leading-[0.9] tracking-[-0.06em] md:text-6xl">
                                Write in blocks. Publish as Markdown.
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="p-7 sm:p-10 lg:p-12">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em]">Blog Studio</span>
                        <Link href="/blog" className="font-mono text-[10px] uppercase tracking-[0.22em] text-black/45 hover:text-black">
                            Public journal ↗
                        </Link>
                    </div>
                    <h2 className="mt-16 text-4xl font-medium tracking-[-0.05em]">Welcome back.</h2>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-black/55">
                        Sign in with the administrator account attached to this Supabase project.
                    </p>
                    <StudioLoginForm />
                </div>
            </section>
        </main>
    )
}
