import GithubSlugger from "github-slugger"

export type BlogHeading = {
    id: string
    text: string
    level: 2 | 3
}

export function estimateReadingTime(content: string) {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    const cjkChars = (content.match(/[\u4e00-\u9fff]/g) || []).length
    return Math.max(1, Math.ceil((words + cjkChars) / 220))
}

export function extractMarkdownHeadings(content: string): BlogHeading[] {
    const slugger = new GithubSlugger()

    return content
        .split("\n")
        .map((line) => {
            const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line.trim())
            if (!match) return null

            const text = match[2]
                .replace(/`([^`]+)`/g, "$1")
                .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
                .replace(/[~*_]/g, "")
                .trim()
            if (!text) return null

            return {
                id: slugger.slug(text),
                text,
                level: match[1].length as 2 | 3,
            }
        })
        .filter((heading): heading is BlogHeading => Boolean(heading))
}
