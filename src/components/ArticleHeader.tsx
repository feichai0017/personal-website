import { CalendarDays, Clock, Hash, Tags } from "lucide-react"

import PageProperty from "@/components/PageProperty"
import { getBlogTopic, type BlogPostSummary } from "@/lib/blog"
import { formatPostDate, postDate } from "@/lib/knowledge"

const DAY_MS = 24 * 60 * 60 * 1000

export default function ArticleHeader({ post }: { post: BlogPostSummary }) {
    const published = postDate(post)
    const revisedLater = Boolean(post.publishedAt) && new Date(post.updatedAt).getTime() - new Date(published).getTime() > DAY_MS

    return (
        <header>
            <h1 className="text-[32px] font-semibold leading-[1.22] tracking-[-0.022em] text-black md:text-[42px]">
                {post.title}
            </h1>

            {post.summary ? (
                <p className="mt-4 text-[17px] leading-8 text-black/54">{post.summary}</p>
            ) : null}

            <div className="mt-6 space-y-0.5">
                <PageProperty icon={<CalendarDays className="h-3.5 w-3.5" />} label="Published">
                    <time dateTime={published}>{formatPostDate(published)}</time>
                    {revisedLater ? (
                        <span className="text-black/40">
                            {" "}· updated <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt, "short")}</time>
                        </span>
                    ) : null}
                </PageProperty>
                <PageProperty icon={<Hash className="h-3.5 w-3.5" />} label="Topic">
                    {getBlogTopic(post)}
                </PageProperty>
                {post.tags.length ? (
                    <PageProperty icon={<Tags className="h-3.5 w-3.5" />} label="Tags">
                        <span className="flex flex-wrap gap-1">
                            {post.tags.map((tag) => (
                                <span key={tag} className="rounded bg-black/[0.055] px-1.5 py-0.5 text-[12px] text-black/60">
                                    {tag}
                                </span>
                            ))}
                        </span>
                    </PageProperty>
                ) : null}
                <PageProperty icon={<Clock className="h-3.5 w-3.5" />} label="Read time">
                    {post.readingMinutes} min
                </PageProperty>
            </div>

            <div className="mt-6 border-b border-black/[0.07]" />
        </header>
    )
}
