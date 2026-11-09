import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import ArticleHeader from "@/components/ArticleHeader"
import BlogArticleBody from "@/components/BlogArticleBody"
import { requireBlogAdmin } from "@/lib/blog-admin"
import { type BlogPostRow, toBlogPost } from "@/lib/blog"

type StudioPreviewPageProps = {
    params: Promise<{ id: string }>
}

export default async function StudioPreviewPage({ params }: StudioPreviewPageProps) {
    const { id } = await params
    const { supabase } = await requireBlogAdmin()
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) notFound()
    const post = toBlogPost(data as BlogPostRow)

    return (
        <main className="min-h-screen bg-[#f7f5f1] pb-24">
            <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-black/[0.06] bg-[#f7f5f1]/90 px-3 backdrop-blur-md md:px-5">
                <Link href={`/studio/${post.id}`} className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-black/60 hover:bg-black/[0.05] hover:text-black">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to editor
                </Link>
                <span className="rounded-md bg-black/[0.06] px-2 py-1 text-[12px] text-black/56">
                    Private preview · {post.status}
                </span>
            </header>

            {post.coverUrl ? (
                <div className="relative h-[26vh] max-h-[340px] min-h-[180px] w-full overflow-hidden border-b border-black/[0.06] bg-[#ece8df] md:h-[32vh]">
                    <Image src={post.coverUrl} alt="" fill priority sizes="100vw" className="object-cover" unoptimized />
                </div>
            ) : null}

            <article className="mx-auto w-full max-w-[720px] px-5 pt-10 md:pt-14">
                <ArticleHeader post={post} linked={false} />
                <div className="mt-9">
                    <BlogArticleBody content={post.content} />
                </div>
            </article>
        </main>
    )
}
