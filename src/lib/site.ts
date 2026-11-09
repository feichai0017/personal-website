export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eric-sgc.cafe"

export function absoluteUrl(path: string) {
    return new URL(path, SITE_URL).toString()
}
