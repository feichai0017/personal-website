import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Mail, Rss } from "lucide-react"

import ArticleHeader from "@/components/ArticleHeader"
import BlogArticleBody from "@/components/BlogArticleBody"
import BlogReadingProgress from "@/components/BlogReadingProgress"
import BlogTableOfContents from "@/components/BlogTableOfContents"
import KnowledgeShell from "@/components/KnowledgeShell"
import OwnerArticle from "@/components/owner/OwnerArticle"
import { getBlogTopic, type BlogPostSummary } from "@/lib/blog"
import { extractMarkdownHeadings, type BlogHeading } from "@/lib/blog-content"
import {
    getAdjacentPublishedBlogPosts,
    getPublishedBlogPostBySlug,
    getPublishedBlogPosts,
    getRelatedPublishedBlogPosts,
} from "@/lib/blog-server"
import { formatPostDate, postDate } from "@/lib/knowledge"
import { absoluteUrl } from "@/lib/site"
import { contactEmail } from "@/lib/site-links"

export const revalidate = 300

type BlogPostPageProps = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const posts = await getPublishedBlogPosts()
    return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getPublishedBlogPostBySlug(slug)

    return {
        title: post.title,
        description: post.summary,
        openGraph: {
            type: "article",
            url: `/blog/${post.slug}`,
            title: post.title,
            description: post.summary,
            publishedTime: post.publishedAt ?? undefined,
            modifiedTime: post.updatedAt,
            authors: ["Guocheng Song"],
            tags: post.tags,
            images: [
                {
                    url: post.coverUrl || `/blog/${post.slug}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.summary,
            images: [post.coverUrl || `/blog/${post.slug}/opengraph-image`],
        },
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
    }
}

function MobileTableOfContents({ headings }: { headings: BlogHeading[] }) {
    return (
        <details className="group/toc mt-6 rounded-xl border border-black/[0.08] bg-[#fbfaf7] xl:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[14px] font-medium text-black/70 [&::-webkit-details-marker]:hidden">
                <span>
                    On this page <span className="font-normal text-black/36">· {headings.length} sections</span>
                </span>
                <ChevronDown className="h-4 w-4 text-black/40 transition-transform group-open/toc:rotate-180" />
            </summary>
            <ol className="border-t border-black/[0.06] px-4 py-2">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className={`block py-1.5 text-[14px] leading-6 text-black/56 hover:text-black ${heading.level === 3 ? "pl-4" : ""}`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ol>
        </details>
    )
}

function NeighbourCard({ post, direction }: { post: BlogPostSummary; direction: "older" | "newer" }) {
    const older = direction === "older"
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`group flex flex-col rounded-xl border border-black/[0.08] bg-[#fbfaf7] p-4 transition-colors hover:border-black/[0.18] hover:bg-white ${older ? "" : "sm:items-end sm:text-right"}`}
        >
            <span className="inline-flex items-center gap-1.5 text-[12px] text-black/40">
                {older ? <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" /> : null}
                {older ? "Previous" : "Next"}
                {older ? null : <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
            </span>
            <span className="mt-1.5 line-clamp-2 text-[15px] font-medium leading-6 text-black">{post.title}</span>
        </Link>
    )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const [post, allPosts] = await Promise.all([getPublishedBlogPostBySlug(slug), getPublishedBlogPosts()])
    const topic = getBlogTopic(post)
    const [relatedPosts, adjacentPosts] = await Promise.all([
        getRelatedPublishedBlogPosts(post),
        getAdjacentPublishedBlogPosts(post.id, post.series),
    ])
    const headings = extractMarkdownHeadings(post.content)
    const articleUrl = absoluteUrl(`/blog/${post.slug}`)
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.summary,
        url: articleUrl,
        mainEntityOfPage: articleUrl,
        datePublished: post.publishedAt ?? post.createdAt ?? post.updatedAt,
        dateModified: post.updatedAt,
        image: absoluteUrl(post.coverUrl || `/blog/${post.slug}/opengraph-image`),
        keywords: post.tags,
        articleSection: topic,
        inLanguage: /[一-鿿]/.test(post.content) ? "zh-CN" : "en",
        author: {
            "@type": "Person",
            name: "Guocheng Song",
            url: absoluteUrl("/"),
        },
        publisher: {
            "@type": "Person",
            name: "Guocheng Song",
            url: absoluteUrl("/"),
        },
    }
    const replyHref = `mailto:${contactEmail}?subject=${encodeURIComponent(`Re: ${post.title}`)}`
    const hasNeighbours = Boolean(adjacentPosts.newer || adjacentPosts.older)

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
            />
            <KnowledgeShell
                posts={allPosts}
                activeSlug={post.slug}
                breadcrumbs={[
                    { label: "Notebook", href: "/blog" },
                    { label: topic },
                    { label: post.title },
                ]}
            >
                <BlogReadingProgress />

                <OwnerArticle slug={post.slug}>
                {post.coverUrl ? (
                    <div className="relative h-[26vh] max-h-[340px] min-h-[180px] w-full overflow-hidden border-b border-black/[0.06] bg-[#ece8df] md:h-[32vh]">
                        <Image src={post.coverUrl} alt="" fill priority sizes="100vw" className="object-cover" unoptimized />
                    </div>
                ) : null}

                <div className="mx-auto w-full max-w-[1080px] px-5 pb-16 pt-10 md:px-10 md:pt-14 xl:grid xl:grid-cols-[minmax(0,720px)_200px] xl:justify-between xl:gap-12">
                    <article className="mx-auto w-full min-w-0 max-w-[720px] xl:mx-0">
                        <ArticleHeader post={post} />

                        {headings.length > 1 ? <MobileTableOfContents headings={headings} /> : null}

                        <div className="mt-9">
                            <BlogArticleBody content={post.content} />
                        </div>

                        <footer className="mt-14 space-y-8">

                            <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.08] bg-[#fbfaf7] p-5 sm:flex-row sm:items-center">
                                <Image src="/img/my.png" alt="" width={52} height={52} className="h-[52px] w-[52px] shrink-0 rounded-full border border-black/10" />
                                <div className="min-w-0 flex-1">
                                    <div className="text-[15px] font-semibold text-black">Guocheng Song</div>
                                    <p className="mt-0.5 text-[14px] leading-6 text-black/52">
                                        ML systems engineer on AI infra at ByteDance AML. I write about storage engines, KV cache, and distributed systems.
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-wrap gap-2">
                                    <a
                                        href={replyHref}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-[13px] text-[#f7f5f1] transition-colors hover:bg-black/80"
                                    >
                                        <Mail className="h-3.5 w-3.5" />
                                        Reply by email
                                    </a>
                                    <a
                                        href="/rss.xml"
                                        aria-label="Subscribe via RSS"
                                        className="inline-flex items-center justify-center rounded-lg border border-black/12 bg-white px-2.5 py-2 text-black/56 transition-colors hover:border-black/30 hover:text-black"
                                    >
                                        <Rss className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </div>

                            {hasNeighbours ? (
                                <nav aria-label={`More in ${topic}`} className="grid gap-3 sm:grid-cols-2">
                                    {adjacentPosts.older ? <NeighbourCard post={adjacentPosts.older} direction="older" /> : <span className="hidden sm:block" />}
                                    {adjacentPosts.newer ? <NeighbourCard post={adjacentPosts.newer} direction="newer" /> : null}
                                </nav>
                            ) : null}

                            {relatedPosts.length ? (
                                <section aria-labelledby="related-heading">
                                    <h2 id="related-heading" className="text-[13px] font-medium text-black/44">Related</h2>
                                    <ul className="mt-2 border-t border-black/[0.07]">
                                        {relatedPosts.map((related) => (
                                            <li key={related.id}>
                                                <Link
                                                    href={`/blog/${related.slug}`}
                                                    className="group flex items-center justify-between gap-4 border-b border-black/[0.07] py-3.5"
                                                >
                                                    <span className="min-w-0">
                                                        <span className="block truncate text-[15px] font-medium text-black group-hover:underline group-hover:decoration-black/25 group-hover:underline-offset-4">
                                                            {related.title}
                                                        </span>
                                                        <span className="mt-1 block text-[12px] text-black/40">
                                                            {getBlogTopic(related)} · {formatPostDate(postDate(related), "short")} · {related.readingMinutes} min
                                                        </span>
                                                    </span>
                                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-black/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ) : null}
                        </footer>
                    </article>

                    {headings.length ? (
                        <aside className="hidden xl:block">
                            <BlogTableOfContents headings={headings} />
                        </aside>
                    ) : null}
                </div>
                </OwnerArticle>
            </KnowledgeShell>
        </>
    )
}
