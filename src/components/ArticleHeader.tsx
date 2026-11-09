import Image from "next/image"
import Link from "next/link"

import KindBadge from "@/components/KindBadge"
import { getBlogTopic, type BlogPostSummary } from "@/lib/blog"
import { formatPostDate, knowledgeHref, postDate } from "@/lib/knowledge"

const DAY_MS = 24 * 60 * 60 * 1000

export default function ArticleHeader({ post, linked = true }: { post: BlogPostSummary; linked?: boolean }) {
    const topic = getBlogTopic(post)
    const published = postDate(post)
    const revisedLater = Boolean(post.publishedAt) && new Date(post.updatedAt).getTime() - new Date(published).getTime() > DAY_MS
    const isNote = post.kind === "note"

    return (
        <header>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-black/44">
                <KindBadge kind={post.kind} />
                {linked ? (
                    <Link href={knowledgeHref({ topic })} className="hover:text-black">{topic}</Link>
                ) : (
                    <span>{topic}</span>
                )}
                {post.project ? (
                    <>
                        <span aria-hidden>·</span>
                        {linked ? (
                            <Link href={knowledgeHref({ project: post.project })} className="hover:text-black">{post.project}</Link>
                        ) : (
                            <span>{post.project}</span>
                        )}
                    </>
                ) : null}
            </div>

            <h1 className="mt-4 text-[30px] font-semibold leading-[1.28] tracking-[-0.022em] text-black md:text-[40px] md:leading-[1.22]">
                {post.title}
            </h1>

            {post.summary ? (
                <p className="mt-4 text-[17px] leading-8 text-black/54">{post.summary}</p>
            ) : null}

            <div className="mt-7 flex items-center gap-3 border-b border-black/[0.07] pb-7">
                <Image
                    src="/img/my.png"
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full border border-black/10"
                />
                <div className="min-w-0 text-[13px] leading-5">
                    <div className="font-medium text-black">Guocheng Song</div>
                    <div className="flex flex-wrap items-center gap-x-1.5 text-black/44">
                        {isNote ? (
                            <span>
                                Updated <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
                            </span>
                        ) : (
                            <>
                                <time dateTime={published}>{formatPostDate(published)}</time>
                                {revisedLater ? (
                                    <span>
                                        · Updated <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt, "short")}</time>
                                    </span>
                                ) : null}
                            </>
                        )}
                        <span aria-hidden>·</span>
                        <span>{post.readingMinutes} min read</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
