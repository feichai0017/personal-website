import Link from "next/link"

import Home from "@/components/Home"
import About from "@/components/About"
import Projects from "@/components/Projects"
import TechStack from "@/components/TechStack"
import Experience from "@/components/Experience"
import ContactMe from "@/components/ContactMe"
import SectionReveal from "@/components/SectionReveal"
import { getBlogTopic, type BlogPostSummary } from "@/lib/blog"

function formatDate(value?: string | null) {
    if (!value) return "draft"
    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value))
}

function LatestWriting({ post }: { post: BlogPostSummary | null }) {
    if (!post) return null

    return (
        <section className="px-4 py-20 text-black">
            <div className="mx-auto w-full max-w-[1800px] rounded-[34px] border border-black/10 bg-[#fbfaf7] p-5 shadow-[0_18px_48px_rgba(10,10,10,0.045)] md:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/38">
                            latest from the blog
                        </div>
                        <h2 className="mt-2 text-3xl font-medium leading-none tracking-[-0.05em] md:text-5xl">
                            Field notes, not status updates.
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="rounded-full border border-black/12 bg-[#f7f5f1] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-black transition-colors hover:border-black/24"
                    >
                        all posts →
                    </Link>
                </div>

                <Link
                    href={`/blog/${post.slug}`}
                    className="group mt-5 grid gap-5 rounded-[26px] px-2 py-4 transition-colors hover:bg-[#f7f5f1] md:grid-cols-[170px_1fr_140px] md:items-start md:px-4"
                >
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">
                        <div>{formatDate(post.publishedAt ?? post.updatedAt)}</div>
                        <div className="mt-2">{post.readingMinutes} min read</div>
                        <div className="mt-2">{getBlogTopic(post)}</div>
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.filter((tag) => tag !== getBlogTopic(post)).slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-black/44"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h3 className="mt-4 max-w-5xl text-3xl font-medium leading-[0.98] tracking-[-0.05em] md:text-5xl">
                            {post.title}
                        </h3>
                        <p className="mt-4 max-w-4xl text-sm leading-7 text-black/58 md:text-base">
                            {post.summary}
                        </p>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black md:text-right">
                        read →
                    </div>
                </Link>
            </div>
        </section>
    )
}

export default function HomePageSections({ latestPost }: { latestPost: BlogPostSummary | null }) {
    return (
        <div className="[overflow-x:clip] text-[#0a0a0a]">
            <Home />
            <SectionReveal>
                <About />
            </SectionReveal>
            <SectionReveal>
                <Projects />
            </SectionReveal>
            <SectionReveal>
                <LatestWriting post={latestPost} />
            </SectionReveal>
            <SectionReveal>
                <TechStack />
            </SectionReveal>
            <SectionReveal>
                <Experience />
            </SectionReveal>
            <SectionReveal>
                <ContactMe />
            </SectionReveal>
        </div>
    )
}
