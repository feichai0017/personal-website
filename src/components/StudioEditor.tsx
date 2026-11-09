"use client"

import Link from "next/link"
import {
    startTransition,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
    type TextareaHTMLAttributes,
} from "react"
import {
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
import KindBadge from "@/components/KindBadge"
import KnowledgeMobileNav from "@/components/KnowledgeMobileNav"
import MarkdownStudioEditor from "@/components/MarkdownStudioEditor"
import NotebookTopBar from "@/components/NotebookTopBar"
import StudioShell from "@/components/StudioShell"
import StudioStatusBadge from "@/components/StudioStatusBadge"
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

const propertyFieldClass =
    "w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[13px] text-black/80 outline-none transition-colors placeholder:text-black/28 hover:bg-black/[0.04] focus:border-black/15 focus:bg-white"

function PropertyRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-2">
            <span className="text-[13px] text-black/44">{label}</span>
            {children}
        </label>
    )
}

function AutoGrowTextarea({ value, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
    const ref = useRef<HTMLTextAreaElement | null>(null)

    useLayoutEffect(() => {
        const element = ref.current
        if (!element) return
        const fit = () => {
            element.style.height = "0px"
            element.style.height = `${element.scrollHeight}px`
        }
        fit()
        window.addEventListener("resize", fit)
        return () => window.removeEventListener("resize", fit)
    }, [value])

    return <textarea ref={ref} rows={1} value={value} className={`block resize-none overflow-hidden ${className ?? ""}`} {...props} />
}

export default function StudioEditor({
    post,
    relatedPosts,
    revisions,
    sidebar,
}: {
    post: BlogPost
    relatedPosts: BlogPostSummary[]
    revisions: BlogRevisionSummary[]
    sidebar: ReactNode
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

    const kindMeta = BLOG_KIND_META[kind]

    return (
        <StudioShell sidebar={sidebar}>
            <NotebookTopBar
                leading={<KnowledgeMobileNav>{sidebar}</KnowledgeMobileNav>}
                breadcrumbs={[
                    { label: "Studio", href: "/studio" },
                    { label: kindMeta.plural, href: `/studio?kind=${kind}` },
                    { label: title || "Untitled" },
                ]}
            >
                <span
                    aria-live="polite"
                    className={`hidden items-center gap-1.5 text-[12px] md:inline-flex ${savePhase === "error" ? "text-red-800" : "text-black/42"}`}
                >
                    <SaveIcon className={`h-3.5 w-3.5 shrink-0 ${savePhase === "saving" ? "animate-spin" : ""}`} />
                    <span className="max-w-[220px] truncate">{saveMessage}</span>
                </span>
                <button
                    type="button"
                    disabled={previewing}
                    onClick={() => void handlePreview()}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] text-black/60 transition hover:bg-black/[0.05] hover:text-black disabled:opacity-50"
                >
                    {previewing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">{previewing ? "Preparing" : "Preview"}</span>
                </button>
                <button
                    type="button"
                    disabled={!isDirty || savePhase === "saving"}
                    onClick={() => {
                        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
                        void queueSave()
                    }}
                    className="hidden h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] text-black/60 transition hover:bg-black/[0.05] hover:text-black disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent sm:inline-flex"
                >
                    {savePhase === "saving" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    {savePhase === "saving" ? "Saving" : isDirty ? "Save" : "Saved"}
                </button>
                <button
                    type="button"
                    disabled={publishing}
                    onClick={() => void handleStatusChange()}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition disabled:opacity-50 ${
                        status === "published"
                            ? "border border-black/12 bg-white text-black/72 hover:border-black/30 hover:text-black"
                            : "bg-black text-[#f7f5f1] hover:bg-black/80"
                    }`}
                >
                    {publishing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : status === "published" ? <Undo2 className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                    {status === "published" ? "Unpublish" : "Publish"}
                </button>
            </NotebookTopBar>

            <div className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-10 md:px-10 md:pt-12 xl:grid xl:grid-cols-[minmax(0,720px)_288px] xl:justify-between xl:gap-12">
                <article className="mx-auto w-full min-w-0 max-w-[720px] xl:mx-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-black/44">
                        <KindBadge kind={kind} />
                        <span>{series}</span>
                        {project ? (
                            <>
                                <span aria-hidden>·</span>
                                <span>{project}</span>
                            </>
                        ) : null}
                        <span aria-hidden>·</span>
                        <StudioStatusBadge status={status} />
                        <span className="ml-auto hidden text-[12px] text-black/30 sm:inline">⌘S to save</span>
                    </div>

                    <AutoGrowTextarea
                        value={title}
                        onChange={(event) => {
                            const value = event.target.value
                            setTitle(value)
                            latestDraftRef.current.title = value
                            markDirty()
                        }}
                        aria-label="Title"
                        placeholder="Untitled"
                        className="mt-4 w-full bg-transparent text-[30px] font-semibold leading-[1.28] tracking-[-0.022em] text-black outline-none placeholder:text-black/22 md:text-[40px] md:leading-[1.22]"
                    />
                    <AutoGrowTextarea
                        value={summary}
                        onChange={(event) => {
                            const value = event.target.value
                            setSummary(value)
                            latestDraftRef.current.summary = value
                            markDirty()
                        }}
                        aria-label="Summary"
                        placeholder="Add a summary — it shows under the title and in link previews."
                        className="mt-3 w-full bg-transparent text-[17px] leading-8 text-black/58 outline-none placeholder:text-black/26"
                    />
                    <div className="mt-6 border-b border-black/[0.07]" />

                    <div className="pt-8">
                        <MarkdownStudioEditor
                            postId={post.id}
                            initialContent={post.content}
                            onChange={handleContentChange}
                        />
                    </div>

                    <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.07] pt-4 text-[12px] text-black/40">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span>{metrics.characters.toLocaleString()} characters</span>
                            <span>{metrics.words.toLocaleString()} words</span>
                            <span>{metrics.readingMinutes} min read</span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-[#4c7a43]" : "bg-red-700"}`} />
                                {isOnline ? "Online" : "Offline"}
                            </span>
                        </div>
                        {status === "published" ? (
                            <Link href={`/blog/${slug}`} target="_blank" className="inline-flex items-center gap-1 text-black/60 hover:text-black">
                                View live <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        ) : (
                            <span>Private draft</span>
                        )}
                    </footer>
                </article>

                <aside className="mt-14 border-t border-black/[0.07] pt-8 xl:mt-0 xl:border-t-0 xl:pt-0">
                    <div data-lenis-prevent className="space-y-8 xl:sticky xl:top-[72px] xl:max-h-[calc(100vh-96px)] xl:overflow-y-auto xl:pb-6 xl:pr-1">
                        <section aria-labelledby="studio-properties">
                            <h2 id="studio-properties" className="mb-2 text-[12px] font-medium text-black/44">Properties</h2>
                            <div className="space-y-0.5">
                                <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-2">
                                    <span className="text-[13px] text-black/44">Type</span>
                                    <div role="radiogroup" aria-label="Document type" className="grid grid-cols-2 gap-0.5 rounded-md bg-black/[0.05] p-0.5">
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
                                                    className={`rounded px-2 py-1 text-[12px] transition ${selected ? "bg-white font-medium text-black shadow-sm" : "text-black/52 hover:text-black"}`}
                                                >
                                                    {BLOG_KIND_META[value].label} <span className={selected ? "text-black/40" : "text-black/30"}>{BLOG_KIND_META[value].zh}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <PropertyRow label="Topic">
                                    <select
                                        value={series}
                                        onChange={(event) => {
                                            const value = event.target.value
                                            setSeries(value)
                                            latestDraftRef.current.series = value
                                            markDirty()
                                        }}
                                        className={`${propertyFieldClass} cursor-pointer`}
                                    >
                                        {!BLOG_TOPICS.includes(series as (typeof BLOG_TOPICS)[number]) ? <option value={series}>{series}</option> : null}
                                        {BLOG_TOPICS.map((value) => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </select>
                                </PropertyRow>

                                <PropertyRow label="Project">
                                    <input
                                        value={project}
                                        onChange={(event) => {
                                            const value = event.target.value
                                            setProject(value)
                                            latestDraftRef.current.project = value
                                            markDirty()
                                        }}
                                        placeholder="OrbitKV"
                                        className={propertyFieldClass}
                                    />
                                </PropertyRow>

                                <PropertyRow label="Slug">
                                    <span className="flex items-center rounded-md border border-transparent px-2 transition-colors focus-within:border-black/15 focus-within:bg-white hover:bg-black/[0.04]">
                                        <span className="text-[12px] text-black/30">/blog/</span>
                                        <input
                                            value={slug}
                                            onChange={(event) => {
                                                const value = event.target.value
                                                setSlug(value)
                                                latestDraftRef.current.slug = value
                                                markDirty()
                                            }}
                                            className="min-w-0 flex-1 bg-transparent py-1.5 text-[13px] text-black/80 outline-none"
                                        />
                                    </span>
                                </PropertyRow>

                                <PropertyRow label="Tags">
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
                                        className={propertyFieldClass}
                                    />
                                </PropertyRow>
                            </div>
                            <p className="mt-2 text-[12px] leading-5 text-black/36">
                                One stable topic for navigation; comma-separated tags for narrower concepts.
                            </p>
                        </section>

                        <section aria-labelledby="studio-cover">
                            <div className="mb-2 flex items-center justify-between">
                                <h2 id="studio-cover" className="text-[12px] font-medium text-black/44">Cover</h2>
                                {coverUrl ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCoverUrl("")
                                            latestDraftRef.current.coverUrl = null
                                            markDirty()
                                        }}
                                        className="text-[12px] text-black/40 hover:text-black"
                                    >
                                        Remove
                                    </button>
                                ) : null}
                            </div>
                            {coverUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={coverUrl} alt="Current cover" className="aspect-[16/9] w-full rounded-lg border border-black/[0.08] object-cover" />
                            ) : null}
                            <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-black/56 transition-colors hover:bg-black/[0.04] hover:text-black">
                                {uploadingCover ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                                {uploadingCover ? "Uploading…" : coverUrl ? "Replace cover" : "Add cover image"}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                                    className="sr-only"
                                    onChange={(event) => void handleCoverUpload(event.target.files?.[0])}
                                />
                            </label>
                        </section>

                        <section aria-labelledby="studio-related">
                            <div className="mb-2 flex items-center justify-between">
                                <h2 id="studio-related" className="text-[12px] font-medium text-black/44">Related</h2>
                                <span className="text-[11px] tabular-nums text-black/32">{relatedIds.length}/12</span>
                            </div>
                            <div className="max-h-56 space-y-px overflow-y-auto">
                                {relatedPosts.length ? relatedPosts.map((candidate) => {
                                    const checked = relatedIds.includes(candidate.id)
                                    return (
                                        <label
                                            key={candidate.id}
                                            className={`flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 transition-colors ${checked ? "bg-black/[0.05]" : "hover:bg-black/[0.035]"}`}
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
                                                className="mt-[3px] h-3.5 w-3.5 accent-black"
                                            />
                                            <span className="min-w-0">
                                                <span className="block truncate text-[13px] text-black/80">{candidate.title}</span>
                                                <span className="mt-0.5 block text-[11px] text-black/36">
                                                    {BLOG_KIND_META[candidate.kind]?.label} · {getBlogTopic(candidate)}
                                                </span>
                                            </span>
                                        </label>
                                    )
                                }) : (
                                    <p className="px-2 text-[12px] leading-5 text-black/38">Create another document to link related reading.</p>
                                )}
                            </div>
                        </section>

                        <section aria-labelledby="studio-history">
                            <div className="mb-2 flex items-center justify-between">
                                <h2 id="studio-history" className="text-[12px] font-medium text-black/44">Version history</h2>
                                <span className="text-[11px] tabular-nums text-black/32">{revisions.length}</span>
                            </div>
                            <div className="space-y-px">
                                {revisions.length ? revisions.map((revision) => (
                                    <button
                                        key={revision.id}
                                        type="button"
                                        disabled={restoringRevision !== null}
                                        onClick={() => void handleRestoreRevision(revision)}
                                        className="group flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-black/[0.04] disabled:opacity-50"
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-[13px] text-black/80">v{revision.version} · {revision.title}</span>
                                            <span className="mt-0.5 block text-[11px] text-black/36">
                                                {formatRevisionDate(revision.createdAt)} · {BLOG_KIND_META[revision.kind]?.label ?? "document"}
                                            </span>
                                        </span>
                                        {restoringRevision === revision.id
                                            ? <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin" />
                                            : <RotateCcw className="h-3.5 w-3.5 shrink-0 text-black/30 transition group-hover:text-black" />}
                                    </button>
                                )) : (
                                    <p className="px-2 text-[12px] leading-5 text-black/38">Earlier states appear after the first meaningful save.</p>
                                )}
                            </div>
                        </section>

                        <button
                            type="button"
                            onClick={() => void handleDelete()}
                            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-red-900/70 transition-colors hover:bg-red-50 hover:text-red-900"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Delete document
                        </button>
                    </div>
                </aside>
            </div>
        </StudioShell>
    )
}
