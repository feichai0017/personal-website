import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const acceptedImageTypes = new Set([
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
])

export async function uploadBlogAsset(postId: string, file: File) {
    if (!acceptedImageTypes.has(file.type)) {
        throw new Error("Use PNG, JPEG, WebP, GIF, or SVG images.")
    }
    if (file.size > 10 * 1024 * 1024) {
        throw new Error("Images must be smaller than 10 MB.")
    }

    const safeName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "image"
    const path = `${postId}/${crypto.randomUUID()}-${safeName}`
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.storage
        .from("blog-assets")
        .upload(path, file, {
            cacheControl: "31536000",
            upsert: false,
        })

    if (error) throw new Error(error.message)

    return supabase.storage.from("blog-assets").getPublicUrl(path).data.publicUrl
}
