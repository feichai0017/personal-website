import type { BlogStatus } from "@/lib/blog"

export default function StudioStatusBadge({ status }: { status: BlogStatus }) {
    const published = status === "published"
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-4 ${
                published ? "bg-[#e6ece1] text-[#46613e]" : "bg-black/[0.05] text-black/52"
            }`}
        >
            <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${published ? "bg-[#4c7a43]" : "border border-black/40"}`}
            />
            {published ? "Published" : "Draft"}
        </span>
    )
}
