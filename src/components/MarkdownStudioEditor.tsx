"use client"

import { useEffect, useRef, useState } from "react"
import { Crepe } from "@milkdown/crepe"

import { uploadBlogAsset } from "@/lib/blog-assets"

type MarkdownStudioEditorProps = {
    postId: string
    initialContent: string
    onChange: (markdown: string) => void
    onReady?: () => void
}

export default function MarkdownStudioEditor({
    postId,
    initialContent,
    onChange,
    onReady,
}: MarkdownStudioEditorProps) {
    const rootRef = useRef<HTMLDivElement | null>(null)
    const onChangeRef = useRef(onChange)
    const onReadyRef = useRef(onReady)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        onChangeRef.current = onChange
        onReadyRef.current = onReady
    }, [onChange, onReady])

    useEffect(() => {
        if (!rootRef.current) return

        let disposed = false
        let editorReady = false
        let lastMarkdown = initialContent
        let pendingMarkdown = initialContent
        let updateFrame: number | null = null
        const upload = (file: File) => uploadBlogAsset(postId, file)
        const crepe = new Crepe({
            root: rootRef.current,
            defaultValue: initialContent,
            features: {
                [Crepe.Feature.AI]: false,
            },
            featureConfigs: {
                [Crepe.Feature.ImageBlock]: {
                    onUpload: upload,
                    blockOnUpload: upload,
                    inlineOnUpload: upload,
                },
            },
        })

        crepe.on((listener) => {
            listener.markdownUpdated((_ctx, markdown) => {
                if (!editorReady) {
                    lastMarkdown = markdown
                    return
                }
                if (markdown === lastMarkdown) return
                lastMarkdown = markdown
                pendingMarkdown = markdown

                if (updateFrame !== null) return
                updateFrame = window.requestAnimationFrame(() => {
                    updateFrame = null
                    onChangeRef.current(pendingMarkdown)
                })
            })
        })

        void crepe.create().then(() => {
            if (disposed) {
                void crepe.destroy()
                return
            }
            lastMarkdown = crepe.getMarkdown()
            editorReady = true
            setReady(true)
            onReadyRef.current?.()
        })

        return () => {
            disposed = true
            if (updateFrame !== null) window.cancelAnimationFrame(updateFrame)
            void crepe.destroy()
        }
    }, [initialContent, postId])

    return (
        <div className="relative min-h-[40vh]">
            <div
                ref={rootRef}
                className={`studio-editor min-h-[40vh] transition-opacity duration-200 ${ready ? "opacity-100" : "opacity-0"}`}
            />
            {!ready ? (
                <div className="pointer-events-none absolute inset-0 space-y-7 py-3" aria-label="Loading editor">
                    <div className="h-7 w-2/3 animate-pulse rounded-full bg-black/[0.055]" />
                    <div className="space-y-3">
                        <div className="h-3 w-full animate-pulse rounded-full bg-black/[0.045]" />
                        <div className="h-3 w-[92%] animate-pulse rounded-full bg-black/[0.045]" />
                        <div className="h-3 w-[76%] animate-pulse rounded-full bg-black/[0.045]" />
                    </div>
                    <div className="h-5 w-1/3 animate-pulse rounded-full bg-black/[0.05]" />
                </div>
            ) : null}
        </div>
    )
}
