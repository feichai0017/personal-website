import StudioPasswordResetForm from "@/components/StudioPasswordResetForm"
import { requireBlogAdmin } from "@/lib/blog-admin"

export default async function StudioResetPasswordPage() {
    await requireBlogAdmin()

    return (
        <main className="flex min-h-screen items-center justify-center px-5 py-16">
            <section className="w-full max-w-[540px] rounded-[38px] border border-black/10 bg-[#fbfaf7] p-7 shadow-[0_28px_90px_rgba(10,10,10,0.08)] sm:p-10">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/40">GS / Blog Studio</div>
                <h1 className="mt-10 text-5xl font-medium leading-[0.92] tracking-[-0.06em]">Set a password you control.</h1>
                <p className="mt-5 text-sm leading-7 text-black/55">
                    Use at least 12 characters. This replaces any previous password for the administrator account.
                </p>
                <StudioPasswordResetForm />
            </section>
        </main>
    )
}
