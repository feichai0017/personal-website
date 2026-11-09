import type { ReactNode } from "react"
import { Copy } from "lucide-react"

export default function BlogCodeBlock({
    language,
    className,
    children,
}: {
    language?: string
    className?: string
    children: ReactNode
}) {
    return (
        <div data-code-block className="notebook-code">
            <div className="notebook-code-bar">
                <span>{language || "text"}</span>
                <button
                    type="button"
                    data-code-copy
                    data-copy-status="idle"
                    aria-label="copy code"
                    className="notebook-code-copy"
                >
                    <Copy className="h-3 w-3" />
                    <span data-copy-label>copy</span>
                </button>
            </div>
            <pre>
                <code className={className}>{children}</code>
            </pre>
        </div>
    )
}
