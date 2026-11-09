import { FileText, NotebookPen } from "lucide-react"

import { BLOG_KIND_META, type BlogKind } from "@/lib/blog"

export default function KindBadge({ kind }: { kind: BlogKind }) {
    const meta = BLOG_KIND_META[kind]
    const Icon = kind === "note" ? NotebookPen : FileText
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-4 ${
                kind === "note" ? "bg-[#e6ece1] text-[#46613e]" : "bg-[#ebe7df] text-[#5b544a]"
            }`}
        >
            <Icon className="h-3 w-3" aria-hidden />
            {meta.label}
        </span>
    )
}
