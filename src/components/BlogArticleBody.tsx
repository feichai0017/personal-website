import "katex/dist/katex.min.css"

import Link from "next/link"
import { isValidElement, type ReactNode } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { CircleAlert, Info, Lightbulb, MessageSquareWarning, TriangleAlert, type LucideIcon } from "lucide-react"

import BlogCodeBlock from "@/components/BlogCodeBlock"
import BlogCodeCopyController from "@/components/BlogCodeCopyController"
import { remarkCallouts, type CalloutType } from "@/lib/markdown-callouts"

const CALLOUTS: Record<CalloutType, { label: string; icon: LucideIcon }> = {
    note: { label: "Note", icon: Info },
    tip: { label: "Tip", icon: Lightbulb },
    important: { label: "Important", icon: MessageSquareWarning },
    warning: { label: "Warning", icon: TriangleAlert },
    caution: { label: "Caution", icon: CircleAlert },
}

const IMAGE_FILENAME = /\.(png|jpe?g|gif|webp|svg|avif)$/i

function HeadingAnchor({ id }: { id?: string }) {
    if (!id || id === "footnote-label") return null
    return (
        <a href={`#${id}`} className="heading-anchor" aria-label="Link to this section">
            #
        </a>
    )
}

const components: Components = {
    h2: ({ node: _node, id, children, ...props }) => (
        <h2 id={id} {...props}>
            <HeadingAnchor id={id} />
            {children}
        </h2>
    ),
    h3: ({ node: _node, id, children, ...props }) => (
        <h3 id={id} {...props}>
            <HeadingAnchor id={id} />
            {children}
        </h3>
    ),
    a: ({ node: _node, href, children, ...props }) => {
        if (!href) return <span>{children}</span>
        if (/^https?:\/\//.test(href)) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                </a>
            )
        }
        if (href.startsWith("#") || href.startsWith("mailto:")) {
            return <a href={href} {...props}>{children}</a>
        }
        return <Link href={href} {...props}>{children}</Link>
    },
    pre: ({ node: _node, children }) => {
        if (!isValidElement(children)) return <pre>{children}</pre>
        const { className, children: code } = children.props as { className?: string; children?: ReactNode }
        const language = /language-([\w+#.-]+)/.exec(className ?? "")?.[1]
        return (
            <BlogCodeBlock language={language} className={className}>
                {code}
            </BlogCodeBlock>
        )
    },
    table: ({ node: _node, children }) => (
        <div className="notebook-table">
            <table>{children}</table>
        </div>
    ),
    img: ({ node: _node, src, alt, title }) => {
        if (!src || typeof src !== "string") return null
        const caption = title || (alt && !IMAGE_FILENAME.test(alt) ? alt : "")
        return (
            <span className="notebook-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
                {caption ? <span className="notebook-figcaption">{caption}</span> : null}
            </span>
        )
    },
    input: ({ node: _node, type, checked }) => {
        if (type !== "checkbox") return null
        return (
            <span
                role="img"
                aria-label={checked ? "Done" : "To do"}
                data-checked={checked ? "true" : "false"}
                className="task-checkbox"
            />
        )
    },
    aside: ({ node: _node, className, children }) => {
        const type = /callout-(\w+)/.exec(className ?? "")?.[1] as CalloutType | undefined
        const callout = type ? CALLOUTS[type] : undefined
        if (!type || !callout) return <aside className={className}>{children}</aside>
        const Icon = callout.icon
        return (
            <aside className={`callout callout-${type}`}>
                <div className="callout-title">
                    <Icon className="h-4 w-4" aria-hidden />
                    {callout.label}
                </div>
                <div className="callout-body">{children}</div>
            </aside>
        )
    },
}

export default function BlogArticleBody({ content }: { content: string }) {
    return (
        <div id="blog-article-content" className="notebook-prose">
            <BlogCodeCopyController rootId="blog-article-content" />
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkCallouts]}
                rehypePlugins={[rehypeSlug, rehypeKatex, rehypeHighlight]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
