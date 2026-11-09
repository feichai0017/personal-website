import type { Root } from "mdast"
import { visit } from "unist-util-visit"

export const CALLOUT_TYPES = ["note", "tip", "important", "warning", "caution"] as const
export type CalloutType = (typeof CALLOUT_TYPES)[number]

const CALLOUT_MARKER = /^\[!(note|tip|important|warning|caution)\][ \t]*\n?/i

export function remarkCallouts() {
    return (tree: Root) => {
        visit(tree, "blockquote", (node) => {
            const paragraph = node.children[0]
            if (paragraph?.type !== "paragraph") return
            const head = paragraph.children[0]
            if (head?.type !== "text") return

            const match = CALLOUT_MARKER.exec(head.value)
            if (!match) return

            head.value = head.value.slice(match[0].length)
            if (!head.value) {
                paragraph.children.shift()
                if (paragraph.children[0]?.type === "break") paragraph.children.shift()
            }
            if (paragraph.children.length === 0) node.children.shift()

            const type = match[1].toLowerCase() as CalloutType
            node.data = {
                ...node.data,
                hName: "aside",
                hProperties: { className: ["callout", `callout-${type}`] },
            }
        })
    }
}
