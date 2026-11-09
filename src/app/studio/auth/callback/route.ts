import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const tokenHash = url.searchParams.get("token_hash")
    const type = url.searchParams.get("type")
    const next = url.searchParams.get("next")
    const safeNext = next?.startsWith("/studio/") && !next.startsWith("//") ? next : "/blog"
    const destination = new URL(safeNext, url.origin)
    const otpType: EmailOtpType | null = type === "magiclink" || type === "recovery" ? type : null

    if (!code && (!tokenHash || !otpType)) {
        return NextResponse.redirect(new URL("/studio/login?error=missing-code", url.origin))
    }

    const supabase = await createSupabaseServerClient()
    const result = code
        ? await supabase.auth.exchangeCodeForSession(code)
        : await supabase.auth.verifyOtp({
            token_hash: tokenHash!,
            type: otpType!,
        })
    const { data, error } = result

    if (error || data.user?.app_metadata?.blog_role !== "admin") {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL("/studio/login?error=access-denied", url.origin))
    }

    return NextResponse.redirect(destination)
}
