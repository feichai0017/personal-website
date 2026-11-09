import Image from "next/image"
import Link from "next/link"
import { FileText, Rss } from "lucide-react"

import KnowledgeShell from "@/components/KnowledgeShell"
import { getBlogTopic, type BlogPostSummary } from "@/lib/blog"
import { formatPostDate, groupPostsByTopic, groupPostsByYear, postDate } from "@/lib/knowledge"

function plural(count: number, noun: string) {
    return `${count} ${count === 1 ? noun : `${noun}s`}`
}

function CoverArt({ post }: { post: BlogPostSummary }) {
    if (post.coverUrl) {
        return (
            <div className="relative aspect-[2.6/1] overflow-hidden border-b border-black/[0.06] bg-[#ece8df]">
                <Image src={post.coverUrl} alt="" fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.015]" unoptimized />
            </div>
        )
    }
    return (
        <div className="relative aspect-[3.4/1] overflow-hidden border-b border-black/[0.06] bg-[#ece8df]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,10,10,0.05)_1px,transparent_1px)] bg-[length:16px_16px]" />
            <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border border-black/[0.08]" />
            <div className="absolute -right-2 -top-6 h-32 w-32 rounded-full border border-black/[0.08]" />
            <div className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.28em] text-black/40 md:left-7">
                {getBlogTopic(post)}
            </div>
        </div>
    )
}

function FeaturedPost({ post }: { post: BlogPostSummary }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group mt-10 block overflow-hidden rounded-2xl border border-black/[0.08] bg-[#fbfaf7] transition-[border-color,box-shadow] hover:border-black/[0.16] hover:shadow-[0_18px_50px_rgba(10,10,10,0.06)]"
        >
            <CoverArt post={post} />
            <div className="p-5 md:p-7">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-black/44">
                    <span className="font-medium text-black/60">Latest</span>
                    <span aria-hidden>·</span>
                    <time dateTime={postDate(post)}>{formatPostDate(postDate(post))}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingMinutes} min read</span>
                </div>
                <h2 className="mt-3 text-[26px] font-semibold leading-[1.25] tracking-[-0.02em] text-black md:text-[32px]">
                    {post.title}
                </h2>
                {post.summary ? (
                    <p className="mt-3 line-clamp-3 max-w-3xl text-[15px] leading-7 text-black/58 md:text-base md:leading-8">{post.summary}</p>
                ) : null}
            </div>
        </Link>
    )
}

function PostRow({ post }: { post: BlogPostSummary }) {
    return (
        <li>
            <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-x-6 gap-y-1.5 border-b border-black/[0.06] py-5 md:grid-cols-[84px_minmax(0,1fr)]"
            >
                <time dateTime={postDate(post)} className="text-[13px] tabular-nums text-black/38 md:pt-[3px]">
                    {formatPostDate(postDate(post), "day")}
                </time>
                <div className="min-w-0">
                    <h3 className="text-[18px] font-semibold leading-[1.45] tracking-[-0.012em] text-black decoration-black/25 underline-offset-4 group-hover:underline md:text-[20px]">
                        {post.title}
                    </h3>
                    {post.summary ? (
                        <p className="mt-1 line-clamp-2 text-[15px] leading-7 text-black/56">{post.summary}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-black/42">
                        <span>{getBlogTopic(post)}</span>
                        <span aria-hidden>·</span>
                        <span>{post.readingMinutes} min read</span>
                    </div>
                </div>
            </Link>
        </li>
    )
}

export default function KnowledgeIndex({ posts }: { posts: BlogPostSummary[] }) {
    const [featured, ...rest] = posts
    const topicCount = groupPostsByTopic(posts).length
    const lastUpdated = posts.reduce<string | null>((latest, post) => (!latest || post.updatedAt > latest ? post.updatedAt : latest), null)

    return (
        <KnowledgeShell posts={posts} breadcrumbs={[{ label: "Notebook" }]} onIndex>
            <main className="mx-auto w-full max-w-[860px] px-5 pb-24 pt-10 md:px-10 md:pt-16">
                <header>
                    <div className="text-[13px] font-medium text-black/40">Guocheng Song</div>
                    <h1 className="mt-2 text-[36px] font-semibold leading-[1.15] tracking-[-0.025em] text-black md:text-[46px]">
                        Notebook
                        <span className="mt-1 block text-[0.5em] font-normal tracking-normal text-black/34 sm:ml-3 sm:mt-0 sm:inline-block">博客</span>
                    </h1>
                    <p className="mt-3 max-w-2xl text-[16px] leading-8 text-black/56">
                        Writing on AI infra, large models, storage engines, databases, and distributed systems — to make complex systems debuggable.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-black/40">
                        <span>{plural(posts.length, "post")}</span>
                        <span aria-hidden>·</span>
                        <span>{plural(topicCount, "topic")}</span>
                        {lastUpdated ? (
                            <>
                                <span aria-hidden>·</span>
                                <span>Updated {formatPostDate(lastUpdated, "short")}</span>
                            </>
                        ) : null}
                        <a href="/rss.xml" className="inline-flex items-center gap-1 text-black/48 hover:text-black">
                            <Rss className="h-3 w-3" /> RSS
                        </a>
                    </div>
                </header>

                {featured ? (
                    <>
                        <FeaturedPost post={featured} />
                        {rest.length ? (
                            <div className="mt-6">
                                {groupPostsByYear(rest).map((group) => (
                                    <section key={group.year} aria-label={`Published in ${group.year}`}>
                                        <h2 className="sticky top-12 z-10 -mx-1 flex items-baseline gap-2 bg-[#f7f5f1]/95 px-1 pb-1 pt-5 backdrop-blur-sm">
                                            <span className="text-[15px] font-semibold tabular-nums text-black/80">{group.year}</span>
                                            <span className="text-[12px] text-black/34">{group.posts.length}</span>
                                        </h2>
                                        <ul>
                                            {group.posts.map((post) => (
                                                <PostRow key={post.id} post={post} />
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </div>
                        ) : null}
                    </>
                ) : (
                    <div className="mt-10 rounded-2xl border border-dashed border-black/[0.14] px-6 py-14 text-center">
                        <FileText className="mx-auto h-6 w-6 text-black/30" />
                        <p className="mt-4 text-[15px] font-medium text-black/70">Nothing published yet.</p>
                    </div>
                )}
            </main>
        </KnowledgeShell>
    )
}
