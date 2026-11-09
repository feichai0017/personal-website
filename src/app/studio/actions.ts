"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"

import { requireBlogAdmin } from "@/lib/blog-admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { absoluteUrl } from "@/lib/site"

export type LoginState = {
    error: string | null
}

export type MagicLinkState = {
    error: string | null
    sent: boolean
}

export type PasswordResetState = {
    error: string | null
    sent: boolean
}

export type PasswordUpdateState = {
    error: string | null
}

function configuredOwnerEmails() {
    return new Set(
        (process.env.BLOG_ADMIN_EMAILS ?? "")
            .split(",")
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean),
    )
}

export async function revalidateNotebookAction(slugs: string[]) {
    await requireBlogAdmin()
    updateTag("blog-posts")
    for (const path of ["/", "/blog", "/rss.xml", "/sitemap.xml"]) revalidatePath(path)
    for (const slug of new Set(slugs)) {
        if (/^[a-z0-9-]+$/.test(slug)) revalidatePath(`/blog/${slug}`)
    }
}

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (!email || !password) {
        return { error: "Enter both email and password." }
    }

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || data.user?.app_metadata?.blog_role !== "admin") {
        await supabase.auth.signOut()
        return { error: "This account can’t write here." }
    }

    redirect("/blog")
}

export async function requestMagicLinkAction(
    _previous: MagicLinkState,
    formData: FormData,
): Promise<MagicLinkState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase()

    if (!email || !configuredOwnerEmails().has(email)) {
        return { error: "This email isn’t the notebook owner.", sent: false }
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: false,
            emailRedirectTo: absoluteUrl("/studio/auth/callback"),
        },
    })

    if (error) return { error: error.message, sent: false }
    return { error: null, sent: true }
}

export async function requestPasswordResetAction(
    _previous: PasswordResetState,
    formData: FormData,
): Promise<PasswordResetState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase()

    if (!email || !configuredOwnerEmails().has(email)) {
        return { error: "This email isn’t the notebook owner.", sent: false }
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: absoluteUrl("/studio/auth/callback?next=/studio/reset-password"),
    })

    if (error) return { error: error.message, sent: false }
    return { error: null, sent: true }
}

export async function updatePasswordAction(
    _previous: PasswordUpdateState,
    formData: FormData,
): Promise<PasswordUpdateState> {
    const password = String(formData.get("password") ?? "")
    const confirmation = String(formData.get("confirmation") ?? "")

    if (password.length < 12) {
        return { error: "Use at least 12 characters." }
    }
    if (password !== confirmation) {
        return { error: "The passwords do not match." }
    }

    const { supabase } = await requireBlogAdmin()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return { error: error.message }

    redirect("/blog")
}
