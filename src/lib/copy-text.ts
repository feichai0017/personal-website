export async function copyText(value: string) {
    try {
        if (navigator.clipboard?.writeText) {
            const copied = await Promise.race([
                navigator.clipboard.writeText(value).then(() => true, () => false),
                new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), 400)),
            ])
            if (copied) return true
        }
    } catch {
        // Fall through to the selection-based path for restrictive browsers.
    }

    const textarea = document.createElement("textarea")
    textarea.value = value
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand("copy")
    textarea.remove()
    return copied
}
