import "server-only"

import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/lib/supabase/server"

type BlogAdminClaims = {
    sub?: string
    email?: string
    app_metadata?: {
        blog_role?: string
    }
}

export async function getBlogAdminSession() {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.getClaims()
    const claims = data?.claims as BlogAdminClaims | undefined
    const isAdmin = !error && claims?.app_metadata?.blog_role === "admin"

    return {
        supabase,
        claims,
        isAdmin,
    }
}

export async function requireBlogAdmin() {
    const session = await getBlogAdminSession()

    if (!session.isAdmin || !session.claims?.sub) {
        redirect("/studio/login")
    }

    return {
        supabase: session.supabase,
        userId: session.claims.sub,
        email: session.claims.email ?? "admin",
    }
}
