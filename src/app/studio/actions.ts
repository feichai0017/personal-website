"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

import { requireBlogAdmin } from "@/lib/blog-admin"
import { isBlogKind, slugify, type BlogKind, type BlogStatus } from "@/lib/blog"
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

export type StudioPostInput = {
    id: string
    version: number
    title: string
    slug: string
    summary: string
    content: string
    tags: string[]
    coverUrl: string | null
    kind: BlogKind
    series: string
    project: string
    relatedIds: string[]
}

export type StudioMutationResult = {
    ok: boolean
    error?: string
    version?: number
    status?: BlogStatus
    updatedAt?: string
}

function refreshPublishedBlog(slug?: string) {
    revalidateTag("blog-posts", "max")
    revalidatePath("/")
    revalidatePath("/blog")
    revalidatePath("/notes")
    revalidatePath("/rss.xml")
    revalidatePath("/sitemap.xml")
    if (slug) revalidatePath(`/blog/${slug}`)
}

function sanitizePostInput(input: StudioPostInput) {
    const title = input.title.trim().slice(0, 240) || "Untitled Post"
    const slug = slugify(input.slug || title) || `post-${input.id.slice(0, 8)}`
    const summary = input.summary.trim().slice(0, 800)
    const tags = input.tags
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 12)

    return {
        title,
        slug,
        summary,
        content: input.content,
        tags: Array.from(new Set(tags)),
        cover_url: input.coverUrl?.trim() || null,
        kind: isBlogKind(input.kind) ? input.kind : "essay",
        series: input.series.trim().slice(0, 120) || null,
        project: input.project.trim().slice(0, 120) || null,
        related_ids: Array.from(new Set(input.relatedIds.filter(Boolean))).slice(0, 12),
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
        return { error: "This account does not have studio access." }
    }

    redirect("/studio")
}

export async function requestMagicLinkAction(
    _previous: MagicLinkState,
    formData: FormData,
): Promise<MagicLinkState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const admins = new Set(
        (process.env.BLOG_ADMIN_EMAILS ?? "")
            .split(",")
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean),
    )

    if (!email || !admins.has(email)) {
        return { error: "This email is not configured as the studio owner.", sent: false }
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
    const admins = new Set(
        (process.env.BLOG_ADMIN_EMAILS ?? "")
            .split(",")
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean),
    )

    if (!email || !admins.has(email)) {
        return { error: "This email is not configured as the studio owner.", sent: false }
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

    redirect("/studio")
}

export async function logoutAction() {
    const { supabase } = await requireBlogAdmin()
    await supabase.auth.signOut()
    redirect("/studio/login")
}

const NEW_DOCUMENT_TEMPLATES: Record<BlogKind, { title: string; content: string }> = {
    essay: {
        title: "Untitled Essay",
        content: "## Working thesis\n\nStart with the question or claim this post should resolve.\n\n## Evidence\n\nAdd code paths, experiments, papers, and production behavior.\n\n## Tradeoffs\n\nState what the current explanation does not cover.",
    },
    note: {
        title: "Untitled Note",
        content: "> [!NOTE]\n> Source: paper, repo, talk, or chapter this note is about.\n\n## Key ideas\n\n- \n\n## Details\n\n## Open questions\n\n- ",
    },
    lab: {
        title: "Untitled Experiment",
        content: "## Setup\n\n## Results\n\n## Takeaways",
    },
}

export async function createPostAction(formData: FormData) {
    const { supabase } = await requireBlogAdmin()
    const requestedKind = formData.get("kind")
    const kind: BlogKind = isBlogKind(requestedKind) ? requestedKind : "essay"
    const template = NEW_DOCUMENT_TEMPLATES[kind]
    const suffix = Date.now().toString(36)
    const { data, error } = await supabase
        .from("blog_posts")
        .insert({
            title: template.title,
            slug: `untitled-${suffix}`,
            summary: "",
            content: template.content,
            tags: [],
            status: "draft",
            kind,
        })
        .select("id")
        .single()

    if (error || !data) {
        throw new Error(error?.message ?? "Unable to create a draft")
    }

    redirect(`/studio/${data.id}`)
}

export async function restorePostRevisionAction(input: {
    postId: string
    revisionId: string
    version: number
}): Promise<StudioMutationResult> {
    const { supabase } = await requireBlogAdmin()
    const { data: revision, error: revisionError } = await supabase
        .from("blog_post_revisions")
        .select("slug, title, summary, content, tags, cover_url, kind, series, project, related_ids")
        .eq("id", input.revisionId)
        .eq("post_id", input.postId)
        .maybeSingle()

    if (revisionError) return { ok: false, error: revisionError.message }
    if (!revision) return { ok: false, error: "That revision no longer exists." }

    const { data, error } = await supabase
        .from("blog_posts")
        .update({
            slug: revision.slug,
            title: revision.title,
            summary: revision.summary,
            content: revision.content,
            tags: revision.tags,
            cover_url: revision.cover_url,
            kind: isBlogKind(revision.kind) ? revision.kind : "essay",
            series: revision.series,
            project: revision.project,
            related_ids: revision.related_ids,
        })
        .eq("id", input.postId)
        .eq("version", input.version)
        .select("version, status, slug, updated_at")
        .maybeSingle()

    if (error) return { ok: false, error: error.message }
    if (!data) return { ok: false, error: "The document changed before restore. Reload and try again." }

    if (data.status === "published") refreshPublishedBlog(data.slug)
    revalidatePath(`/studio/${input.postId}`)

    return {
        ok: true,
        version: Number(data.version),
        status: data.status as BlogStatus,
        updatedAt: data.updated_at,
    }
}

export async function savePostAction(input: StudioPostInput): Promise<StudioMutationResult> {
    const { supabase } = await requireBlogAdmin()
    const payload = sanitizePostInput(input)
    const { data, error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", input.id)
        .eq("version", input.version)
        .select("version, status, slug, updated_at")
        .maybeSingle()

    if (error) {
        if (error.code === "23505") {
            return { ok: false, error: "That slug is already in use." }
        }
        return { ok: false, error: error.message }
    }

    if (!data) {
        return { ok: false, error: "This draft changed elsewhere. Reload before saving again." }
    }

    if (data.status === "published") {
        refreshPublishedBlog(data.slug)
    }

    return {
        ok: true,
        version: Number(data.version),
        status: data.status as BlogStatus,
        updatedAt: data.updated_at,
    }
}

export async function setPostStatusAction(input: {
    id: string
    version: number
    status: BlogStatus
}): Promise<StudioMutationResult> {
    const { supabase } = await requireBlogAdmin()
    const { data, error } = await supabase
        .from("blog_posts")
        .update({ status: input.status })
        .eq("id", input.id)
        .eq("version", input.version)
        .select("version, status, slug, updated_at")
        .maybeSingle()

    if (error) return { ok: false, error: error.message }
    if (!data) return { ok: false, error: "The draft changed before publication. Reload and try again." }

    refreshPublishedBlog(data.slug)

    return {
        ok: true,
        version: Number(data.version),
        status: data.status as BlogStatus,
        updatedAt: data.updated_at,
    }
}

export async function deletePostAction(id: string) {
    const { supabase } = await requireBlogAdmin()
    const { data, error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id)
        .select("slug")
        .single()

    if (error) throw new Error(error.message)

    refreshPublishedBlog(data.slug)
    redirect("/studio")
}
