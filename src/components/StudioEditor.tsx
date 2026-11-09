"use client"

import Link from "next/link"
import { startTransition, useCallback, useEffect, useRef, useState } from "react"
import {
    ArrowLeft,
    ArrowUpRight,
    Check,
    CircleAlert,
    CloudUpload,
    Eye,
    ImagePlus,
    LoaderCircle,
    RotateCcw,
    Save,
    Send,
    Trash2,
    Undo2,
    WifiOff,
} from "lucide-react"

import {
    deletePostAction,
    restorePostRevisionAction,
    savePostAction,
    setPostStatusAction,
    type StudioMutationResult,
    type StudioPostInput,
} from "@/app/studio/actions"
import MarkdownStudioEditor from "@/components/MarkdownStudioEditor"
import { uploadBlogAsset } from "@/lib/blog-assets"
import {
    BLOG_KIND_META,
    BLOG_TOPICS,
    EDITABLE_BLOG_KINDS,
    getBlogTopic,
    type BlogKind,
    type BlogPost,
    type BlogPostSummary,
    type BlogRevisionSummary,
} from "@/lib/blog"
import { estimateReadingTime } from "@/lib/blog-content"

type SavePhase = "idle" | "saving" | "saved" | "error" | "offline"

type DocumentMetrics = {
    characters: number
    words: number
    readingMinutes: number
}

function formatSavedAt(value: string) {
    return new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date(value))
}

function formatRevisionDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value))
}

function getDocumentMetrics(markdown: string): DocumentMetrics {
    const words = markdown.trim().split(/\s+/).filter(Boolean).length
    const cjkCharacters = (markdown.match(/[\u4e00-\u9fff]/g) ?? []).length

    return {
        characters: markdown.length,
        words: words + cjkCharacters,
        readingMinutes: estimateReadingTime(markdown),
    }
}

export default function StudioEditor({
    post,
    relatedPosts,
    revisions,
}: {
    post: BlogPost
    relatedPosts: BlogPostSummary[]
    revisions: BlogRevisionSummary[]
}) {
    const initialTopic = post.series ?? getBlogTopic(post)
    const [title, setTitle] = useState(post.title)
    const [slug, setSlug] = useState(post.slug)
    const [summary, setSummary] = useState(post.summary)
    const [tags, setTags] = useState(post.tags.join(", "))
    const [kind, setKind] = useState<BlogKind>(post.kind)
    const [series, setSeries] = useState(initialTopic)
    const [project, setProject] = useState(post.project ?? "")
    const [relatedIds, setRelatedIds] = useState(post.relatedIds)
    const [coverUrl, setCoverUrl] = useState(post.coverUrl ?? "")
    const [status, setStatus] = useState(post.status)
    const [savePhase, setSavePhase] = useState<SavePhase>("idle")
    const [saveMessage, setSaveMessage] = useState("Ready to edit")
    const [isDirty, setIsDirty] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [publishing, setPublishing] = useState(false)
    const [previewing, setPreviewing] = useState(false)
    const [uploadingCover, setUploadingCover] = useState(false)
    const [restoringRevision, setRestoringRevision] = useState<string | null>(null)
    const [metrics, setMetrics] = useState(() => getDocumentMetrics(post.content))

    const versionRef = useRef(post.version)
    const statusRef = useRef(post.status)
    const activeSaveRef = useRef<Promise<StudioMutationResult> | null>(null)
    const saveAgainRef = useRef(false)
    const editSequenceRef = useRef(0)
    const dirtyRef = useRef(false)
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const metricsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const latestDraftRef = useRef<Omit<StudioPostInput, "version">>({
        id: post.id,
        title,
        slug,
        summary,
        content: post.content,
        tags: post.tags,
        coverUrl: post.coverUrl ?? null,
        kind: post.kind,
        series: initialTopic,
        project: post.project ?? "",
        relatedIds: post.relatedIds,
    })

    const queueSave = useCallback(() => {
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)

        if (!dirtyRef.current) {
            return Promise.resolve<StudioMutationResult>({
                ok: true,
                version: versionRef.current,
                status: statusRef.current,
            })
        }

        if (typeof navigator !== "undefined" && !navigator.onLine) {
            setSavePhase("offline")
            setSaveMessage("Offline · changes stay in this tab")
            return Promise.resolve<StudioMutationResult>({
                ok: false,
                error: "You are offline. Reconnect to save this draft.",
            })
        }

        if (activeSaveRef.current) {
            saveAgainRef.current = true
            return activeSaveRef.current
        }

        const runSaveLoop = async () => {
            let lastResult: StudioMutationResult = {
                ok: true,
                version: versionRef.current,
                status: statusRef.current,
            }

            do {
                saveAgainRef.current = false
                const snapshotSequence = editSequenceRef.current
                const snapshot = {
                    ...latestDraftRef.current,
                    tags: [...latestDraftRef.current.tags],
                    relatedIds: [...latestDraftRef.current.relatedIds],
                }

                setSavePhase("saving")
                setSaveMessage("Saving latest changes")

                const result = await savePostAction({
                    ...snapshot,
                    version: versionRef.current,
                })
                lastResult = result

                if (result.ok && result.version !== undefined) {
                    versionRef.current = result.version

                    if (editSequenceRef.current === snapshotSequence) {
                        dirtyRef.current = false
                        startTransition(() => setIsDirty(false))
                        setSavePhase("saved")
                        setSaveMessage(`Saved ${formatSavedAt(result.updatedAt ?? new Date().toISOString())}`)
                    } else {
                        setSavePhase("idle")
                        setSaveMessage("Unsaved changes")
                    }
                } else {
                    setSavePhase("error")
                    setSaveMessage(result.error ?? "Save failed")
                    return result
                }
            } while (saveAgainRef.current)

            return lastResult
        }

        const task = runSaveLoop()
            .catch((error: unknown): StudioMutationResult => {
                const message = error instanceof Error ? error.message : "Save failed"
                setSavePhase("error")
                setSaveMessage(message)
                return { ok: false, error: message }
            })
            .finally(() => {
                activeSaveRef.current = null
            })

        activeSaveRef.current = task
        return task
    }, [])

    const scheduleAutosave = useCallback(() => {
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)

        if (typeof navigator !== "undefined" && !navigator.onLine) {
            setSavePhase("offline")
            setSaveMessage("Offline · changes stay in this tab")
            return
        }

        autosaveTimerRef.current = setTimeout(() => {
            void queueSave()
        }, 1600)
    }, [queueSave])

    const markDirty = useCallback(() => {
        const wasDirty = dirtyRef.current
        dirtyRef.current = true
        editSequenceRef.current += 1

        if (!wasDirty) {
            startTransition(() => setIsDirty(true))
            setSavePhase("idle")
            setSaveMessage("Unsaved changes")
        }

        scheduleAutosave()
    }, [scheduleAutosave])

    const handleContentChange = useCallback((markdown: string) => {
        latestDraftRef.current.content = markdown
        markDirty()

        if (metricsTimerRef.current) clearTimeout(metricsTimerRef.current)
        metricsTimerRef.current = setTimeout(() => {
            startTransition(() => setMetrics(getDocumentMetrics(markdown)))
        }, 180)
    }, [markDirty])

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            if (dirtyRef.current) {
                setSavePhase("idle")
                setSaveMessage("Back online · saving shortly")
                scheduleAutosave()
            }
        }
        const handleOffline = () => {
            setIsOnline(false)
            if (dirtyRef.current) {
                setSavePhase("offline")
                setSaveMessage("Offline · changes stay in this tab")
            }
        }

        setIsOnline(navigator.onLine)
        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [scheduleAutosave])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden" && dirtyRef.current && navigator.onLine) {
                void queueSave()
            }
        }
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!dirtyRef.current) return
            event.preventDefault()
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
            if (metricsTimerRef.current) clearTimeout(metricsTimerRef.current)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [queueSave])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
                event.preventDefault()
                if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
                void queueSave()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [queueSave])

    const handleStatusChange = async () => {
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
        setPublishing(true)
        const saved = await queueSave()

        if (!saved.ok) {
            setPublishing(false)
            return
        }

        const nextStatus = status === "published" ? "draft" : "published"
        const result = await setPostStatusAction({
            id: post.id,
            version: versionRef.current,
            status: nextStatus,
        })

        if (result.ok && result.version !== undefined && result.status) {
            versionRef.current = result.version
            statusRef.current = result.status
            setStatus(result.status)
            setSavePhase("saved")
            setSaveMessage(result.status === "published" ? "Published" : "Moved back to draft")
        } else {
            setSavePhase("error")
            setSaveMessage(result.error ?? "Status update failed")
        }
        setPublishing(false)
    }

    const handleCoverUpload = async (file: File | undefined) => {
        if (!file) return
        setUploadingCover(true)
        try {
            const url = await uploadBlogAsset(post.id, file)
            setCoverUrl(url)
            latestDraftRef.current.coverUrl = url
            markDirty()
        } catch (error) {
            setSavePhase("error")
            setSaveMessage(error instanceof Error ? error.message : "Upload failed")
        } finally {
            setUploadingCover(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return
        await deletePostAction(post.id)
    }

    const handleRestoreRevision = async (revision: BlogRevisionSummary) => {
        if (!window.confirm(`Restore version ${revision.version} from ${formatRevisionDate(revision.createdAt)}? The current document will remain in history.`)) return

        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
        setRestoringRevision(revision.id)
        const saved = await queueSave()

        if (!saved.ok) {
            setRestoringRevision(null)
            return
        }

        const result = await restorePostRevisionAction({
            postId: post.id,
            revisionId: revision.id,
            version: versionRef.current,
        })

        if (result.ok) {
            window.location.reload()
            return
        }

        setSavePhase("error")
        setSaveMessage(result.error ?? "Revision restore failed")
        setRestoringRevision(null)
    }

    const handlePreview = async () => {
        const previewWindow = window.open("about:blank", `studio-preview-${post.id}`)
        if (!previewWindow) {
            setSavePhase("error")
            setSaveMessage("Allow popups to open the private preview")
            return
        }

        setPreviewing(true)
        const result = await queueSave()

        if (result.ok) {
            previewWindow.location.replace(`/studio/preview/${post.id}`)
        } else {
            previewWindow.close()
        }
        setPreviewing(false)
    }

    const SaveIcon = savePhase === "saving"
        ? LoaderCircle
        : savePhase === "saved"
            ? Check
            : savePhase === "offline"
                ? WifiOff
            : savePhase === "error"
                ? CircleAlert
                : CloudUpload

    return (
        <main className="min-h-screen pb-20">
            <header className="sticky top-0 z-40 border-b border-black/10 bg-[#eeebe4]/94 px-4 py-3 backdrop-blur-xl md:px-6">
                <div className="mx-auto flex w-full max-w-[1720px] flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <Link
                            href="/studio"
                            aria-label="Back to documents"
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/12 bg-[#fbfaf7] hover:border-black/30"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{title || "Untitled Post"}</div>
                            <div aria-live="polite" className={`mt-0.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] ${savePhase === "error" ? "text-red-800" : "text-black/42"}`}>
                                <SaveIcon className={`h-3 w-3 ${savePhase === "saving" ? "animate-spin" : ""}`} />
                                {saveMessage}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                            type="button"
                            disabled={previewing}
                            onClick={() => void handlePreview()}
                            className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-[#fbfaf7] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] transition hover:border-black/30 disabled:opacity-50"
                        >
                            {previewing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                            {previewing ? "Preparing" : "Preview"}
                        </button>
                        <button
                            type="button"
                            disabled={!isDirty || savePhase === "saving"}
                            onClick={() => {
                                if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
                                void queueSave()
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-[#fbfaf7] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] transition hover:border-black/30 disabled:cursor-default disabled:opacity-45"
                        >
                            {savePhase === "saving" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            {savePhase === "saving" ? "Saving" : isDirty ? "Save" : "Saved"}
                        </button>
                        <button
                            type="button"
                            disabled={publishing}
                            onClick={() => void handleStatusChange()}
                            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] transition disabled:opacity-50 ${status === "published" ? "border border-black/14 bg-transparent text-black hover:bg-[#fbfaf7]" : "bg-black text-white hover:bg-black/80"}`}
                        >
                            {publishing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : status === "published" ? <Undo2 className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                            {status === "published" ? "Unpublish" : "Publish"}
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-[1720px] gap-5 px-4 pt-5 md:px-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                <aside className="space-y-4 xl:sticky xl:top-[86px] xl:h-[calc(100vh-110px)] xl:overflow-y-auto xl:pr-1">
                    <section className="rounded-[30px] border border-black/10 bg-[#fbfaf7] p-5">
                        <div className="flex items-center justify-between border-b border-black/10 pb-4">
                            <span className="font-mono text-[10px] uppercase tracking-[0.24em]">Document</span>
                            <span className={`rounded-full px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] ${status === "published" ? "bg-black text-white" : "border border-black/12 text-black/48"}`}>
                                {status}
                            </span>
                        </div>

                        <div className="mt-5 space-y-5">
                            <div>
                                <span className="studio-field-label">Type</span>
                                <div role="radiogroup" aria-label="Document type" className="mt-2 grid grid-cols-2 gap-1 rounded-2xl border border-black/10 bg-white p-1">
                                    {EDITABLE_BLOG_KINDS.map((value) => {
                                        const selected = kind === value
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                onClick={() => {
                                                    if (selected) return
                                                    setKind(value)
                                                    latestDraftRef.current.kind = value
                                                    markDirty()
                                                }}
                                                className={`rounded-xl px-3 py-2 text-sm transition ${selected ? "bg-black text-white" : "text-black/56 hover:bg-black/[0.04] hover:text-black"}`}
                                            >
                                                {BLOG_KIND_META[value].label}
                                                <span className={`ml-1.5 text-xs ${selected ? "text-white/60" : "text-black/36"}`}>{BLOG_KIND_META[value].zh}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                                <span className="mt-2 block text-xs leading-5 text-black/40">{BLOG_KIND_META[kind].blurb}</span>
                            </div>

                            <label className="block">
                                <span className="studio-field-label">Primary topic</span>
                                <select
                                    value={series}
                                    onChange={(event) => {
                                        const value = event.target.value
                                        setSeries(value)
                                        latestDraftRef.current.series = value
                                        markDirty()
                                    }}
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none focus:border-black/28"
                                >
                                    {!BLOG_TOPICS.includes(series as (typeof BLOG_TOPICS)[number]) ? <option value={series}>{series}</option> : null}
                                    {BLOG_TOPICS.map((value) => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
                                <span className="mt-2 block text-xs leading-5 text-black/40">One stable category for navigation. Use tags for narrower concepts.</span>
                            </label>

                            <div>
                                <label className="block">
                                    <span className="studio-field-label">Project</span>
                                    <input
                                        value={project}
                                        onChange={(event) => {
                                            const value = event.target.value
                                            setProject(value)
                                            latestDraftRef.current.project = value
                                            markDirty()
                                        }}
                                        placeholder="QuillCache"
                                        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none focus:border-black/28"
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="studio-field-label">Slug</span>
                                <div className="mt-2 flex items-center rounded-2xl border border-black/10 bg-white px-3">
                                    <span className="font-mono text-xs text-black/28">/blog/</span>
                                    <input
                                        value={slug}
                                        onChange={(event) => {
                                            const value = event.target.value
                                            setSlug(value)
                                            latestDraftRef.current.slug = value
                                            markDirty()
                                        }}
                                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="studio-field-label">Summary</span>
                                <textarea
                                    value={summary}
                                    onChange={(event) => {
                                        const value = event.target.value
                                        setSummary(value)
                                        latestDraftRef.current.summary = value
                                        markDirty()
                                    }}
                                    rows={5}
                                    placeholder="A concise reason to read this post."
                                    className="mt-2 w-full resize-y rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-black/28"
                                />
                            </label>

                            <label className="block">
                                <span className="studio-field-label">Tags</span>
                                <input
                                    value={tags}
                                    onChange={(event) => {
                                        const value = event.target.value
                                        setTags(value)
                                        latestDraftRef.current.tags = value
                                            .split(",")
                                            .map((tag) => tag.trim())
                                            .filter(Boolean)
                                        markDirty()
                                    }}
                                    placeholder="storage, rust, systems"
                                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm outline-none focus:border-black/28"
                                />
                                <span className="mt-2 block text-xs leading-5 text-black/38">Separate specific concepts with commas.</span>
                            </label>
                        </div>
                    </section>

                    <section className="rounded-[30px] border border-black/10 bg-[#fbfaf7] p-5">
                        <div className="font-mono text-[10px] uppercase tracking-[0.24em]">Cover</div>
                        {coverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={coverUrl} alt="Current cover" className="mt-4 aspect-[16/9] w-full rounded-2xl border border-black/10 object-cover" />
                        ) : (
                            <div className="mt-4 flex aspect-[16/9] items-center justify-center rounded-2xl border border-dashed border-black/16 bg-white text-black/28">
                                <ImagePlus className="h-6 w-6" />
                            </div>
                        )}
                        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-black/12 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] hover:border-black/30">
                            {uploadingCover ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                            {uploadingCover ? "Uploading" : "Upload cover"}
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                                className="sr-only"
                                onChange={(event) => void handleCoverUpload(event.target.files?.[0])}
                            />
                        </label>
                        {coverUrl ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setCoverUrl("")
                                    latestDraftRef.current.coverUrl = null
                                    markDirty()
                                }}
                                className="mt-2 w-full text-center font-mono text-[8px] uppercase tracking-[0.18em] text-black/38 hover:text-black"
                            >
                                remove cover
                            </button>
                        ) : null}
                    </section>

                    <section className="rounded-[30px] border border-black/10 bg-[#fbfaf7] p-5">
                        <div className="flex items-center justify-between">
                            <div className="font-mono text-[10px] uppercase tracking-[0.24em]">Related posts</div>
                            <span className="font-mono text-[9px] text-black/34">{relatedIds.length}/12</span>
                        </div>
                        <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
                            {relatedPosts.length ? relatedPosts.map((candidate) => {
                                const checked = relatedIds.includes(candidate.id)
                                return (
                                    <label
                                        key={candidate.id}
                                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3 py-3 transition ${checked ? "border-black/28 bg-white" : "border-black/8 bg-transparent hover:border-black/18"}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                                const next = checked
                                                    ? relatedIds.filter((id) => id !== candidate.id)
                                                    : [...relatedIds, candidate.id].slice(0, 12)
                                                setRelatedIds(next)
                                                latestDraftRef.current.relatedIds = next
                                                markDirty()
                                            }}
                                            className="mt-0.5 h-3.5 w-3.5 accent-black"
                                        />
                                        <span className="min-w-0">
                                            <span className="block truncate text-xs font-medium">{candidate.title}</span>
                                            <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.16em] text-black/36">
                                                {getBlogTopic(candidate)}{candidate.project ? ` · ${candidate.project}` : ""}
                                            </span>
                                        </span>
                                    </label>
                                )
                            }) : (
                                <p className="text-xs leading-5 text-black/38">Create another document to build explicit links.</p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-[30px] border border-black/10 bg-[#fbfaf7] p-5">
                        <div className="flex items-center justify-between">
                            <div className="font-mono text-[10px] uppercase tracking-[0.24em]">Version history</div>
                            <span className="font-mono text-[9px] text-black/34">{revisions.length}</span>
                        </div>
                        <div className="mt-4 space-y-2">
                            {revisions.length ? revisions.map((revision) => (
                                <button
                                    key={revision.id}
                                    type="button"
                                    disabled={restoringRevision !== null}
                                    onClick={() => void handleRestoreRevision(revision)}
                                    className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-black/8 px-3 py-3 text-left transition hover:border-black/22 hover:bg-white disabled:opacity-50"
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate text-xs font-medium">v{revision.version} · {revision.title}</span>
                                        <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.16em] text-black/34">
                                            {formatRevisionDate(revision.createdAt)} · {BLOG_KIND_META[revision.kind]?.label ?? "document"}
                                        </span>
                                    </span>
                                    {restoringRevision === revision.id
                                        ? <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin" />
                                        : <RotateCcw className="h-3.5 w-3.5 shrink-0 text-black/34 transition group-hover:text-black" />}
                                </button>
                            )) : (
                                <p className="text-xs leading-5 text-black/38">Earlier states appear after the first meaningful save.</p>
                            )}
                        </div>
                    </section>

                    <button
                        type="button"
                        onClick={() => void handleDelete()}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-red-900/15 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-red-900/65 hover:border-red-900/30 hover:text-red-900"
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Delete document
                    </button>
                </aside>

                <article className="min-w-0 overflow-hidden rounded-[36px] border border-black/10 bg-[#fbfaf7] shadow-[0_18px_60px_rgba(10,10,10,0.05)]">
                    <div className="border-b border-black/10 px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
                        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-black/36">
                            <span>{BLOG_KIND_META[kind].label} · Markdown document</span>
                            <span>⌘S to save</span>
                        </div>
                        <textarea
                            value={title}
                            onChange={(event) => {
                                const value = event.target.value
                                setTitle(value)
                                latestDraftRef.current.title = value
                                markDirty()
                            }}
                            rows={2}
                            className="mt-8 w-full resize-none overflow-hidden bg-transparent text-5xl font-medium leading-[0.92] tracking-[-0.06em] text-black outline-none md:text-7xl"
                            placeholder="Untitled Post"
                        />
                    </div>
                    <div className="px-5 py-8 sm:px-8 lg:px-14 lg:py-12">
                        <MarkdownStudioEditor
                            postId={post.id}
                            initialContent={post.content}
                            onChange={handleContentChange}
                        />
                    </div>
                    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 px-6 py-5 font-mono text-[9px] uppercase tracking-[0.2em] text-black/38 sm:px-10 lg:px-14">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <span>{metrics.characters.toLocaleString()} characters</span>
                            <span>{metrics.words.toLocaleString()} words</span>
                            <span>{metrics.readingMinutes} min read</span>
                            {series ? <span>topic · {series}</span> : null}
                            {project ? <span>project · {project}</span> : null}
                            <span className="inline-flex items-center gap-1.5">
                                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-700" : "bg-red-700"}`} />
                                {isOnline ? "online" : "offline"}
                            </span>
                        </div>
                        {status === "published" ? (
                            <Link href={`/blog/${slug}`} target="_blank" className="inline-flex items-center gap-2 text-black hover:underline">
                                Open published article <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        ) : (
                            <span>Private draft</span>
                        )}
                    </footer>
                </article>
            </div>
        </main>
    )
}
