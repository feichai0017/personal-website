"use client"

import "@milkdown/crepe/theme/common/style.css"
import "@milkdown/crepe/theme/frame.css"
import "./inline-editor.css"

import { useRouter } from "next/navigation"
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
    type TextareaHTMLAttributes,
} from "react"
import { createPortal } from "react-dom"
import type { SupabaseClient } from "@supabase/supabase-js"
import {
    CalendarDays,
    Check,
    CircleAlert,
    Clock,
    CloudUpload,
    Copy,
    Download,
    Hash,
    ImagePlus,
    Link2,
    LoaderCircle,
    LogOut,
    MoreHorizontal,
    Send,
    Tags,
    Trash2,
    Undo2,
    WifiOff,
} from "lucide-react"

import { revalidateNotebookAction } from "@/app/studio/actions"
import MarkdownStudioEditor from "@/components/MarkdownStudioEditor"
import PageProperty from "@/components/PageProperty"
import { useOwner } from "@/components/owner/OwnerProvider"
import { uploadBlogAsset } from "@/lib/blog-assets"
import {
    BLOG_TOPICS,
    buildPostUpdate,
    getBlogTopic,
    slugify,
    toBlogPost,
    type BlogPost,
    type BlogPostRow,
    type BlogStatus,
    type EditablePostFields,
} from "@/lib/blog"
import { estimateReadingTime } from "@/lib/blog-content"
import { copyText } from "@/lib/copy-text"
import { formatPostDate } from "@/lib/knowledge"

type SavePhase = "idle" | "saving" | "saved" | "error" | "offline"
type SaveResult = { ok: boolean }

const AUTOSAVE_DELAY_MS = 900
const REVALIDATE_DELAY_MS = 2500
const SAVE_COLUMNS = "version, status, slug, updated_at, published_at"

const fieldClass =
    "-mx-1.5 w-[calc(100%+0.75rem)] rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[14px] text-black/80 outline-none transition-colors placeholder:text-black/28 hover:bg-black/[0.04] focus:border-black/15 focus:bg-white"

function formatSavedAt(value: string) {
    return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date(value))
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
        const observer = new ResizeObserver(fit)
        observer.observe(element)
        return () => observer.disconnect()
    }, [value])

    return <textarea ref={ref} rows={1} value={value} className={`block resize-none overflow-hidden ${className ?? ""}`} {...props} />
}

function PageMenu({ onCopyLink, onDelete, onSignOut }: { onCopyLink: () => void; onDelete: () => void; onSignOut: () => void }) {
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!open) return
        const onPointerDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }
        document.addEventListener("mousedown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    const itemClass = "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors"
    const run = (action: () => void) => () => {
        setOpen(false)
        action()
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-label="Page options"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/56 transition hover:bg-black/[0.05] hover:text-black"
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>
            {open ? (
                <div role="menu" className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-black/10 bg-[#fbfaf7] p-1 shadow-[0_18px_50px_rgba(10,10,10,0.14)]">
                    <button type="button" role="menuitem" onClick={run(onCopyLink)} className={`${itemClass} text-black/72 hover:bg-black/[0.05]`}>
                        <Copy className="h-3.5 w-3.5 text-black/45" /> Copy link
                    </button>
                    <a role="menuitem" href="/studio/export" onClick={() => setOpen(false)} className={`${itemClass} text-black/72 hover:bg-black/[0.05]`}>
                        <Download className="h-3.5 w-3.5 text-black/45" /> Export all as Markdown
                    </a>
                    <button type="button" role="menuitem" onClick={run(onDelete)} className={`${itemClass} text-[#8c2e20] hover:bg-[#f6e7e3]`}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete page
                    </button>
                    <div className="my-1 border-t border-black/[0.07]" />
                    <button type="button" role="menuitem" onClick={run(onSignOut)} className={`${itemClass} text-black/72 hover:bg-black/[0.05]`}>
                        <LogOut className="h-3.5 w-3.5 text-black/45" /> Sign out
                    </button>
                </div>
            ) : null}
        </div>
    )
}

function PageEditor({ post, supabase, fallback }: { post: BlogPost; supabase: SupabaseClient; fallback: ReactNode }) {
    const router = useRouter()
    const { toolbarSlot, patchDraft, refreshDrafts, signOut } = useOwner()
    const initialTopic = post.series ?? getBlogTopic(post)

    const [editorReady, setEditorReady] = useState(false)
    const [title, setTitle] = useState(post.title)
    const [summary, setSummary] = useState(post.summary)
    const [slug, setSlug] = useState(post.slug)
    const [tags, setTags] = useState(post.tags.join(", "))
    const [topic, setTopic] = useState(initialTopic)
    const [coverUrl, setCoverUrl] = useState(post.coverUrl ?? "")
    const [status, setStatus] = useState<BlogStatus>(post.status)
    const [publishedAt, setPublishedAt] = useState(post.publishedAt ?? null)
    const [savePhase, setSavePhase] = useState<SavePhase>("idle")
    const [saveMessage, setSaveMessage] = useState("")
    const [publishing, setPublishing] = useState(false)
    const [uploadingCover, setUploadingCover] = useState(false)
    const [readingMinutes, setReadingMinutes] = useState(() => estimateReadingTime(post.content))

    const fieldsRef = useRef<EditablePostFields>({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        tags: post.tags,
        topic: initialTopic,
        coverUrl: post.coverUrl ?? null,
    })
    const versionRef = useRef(post.version)
    const statusRef = useRef<BlogStatus>(post.status)
    const savedSlugRef = useRef(post.slug)
    const dirtyRef = useRef(false)
    const editSequenceRef = useRef(0)
    const activeSaveRef = useRef<Promise<SaveResult> | null>(null)
    const saveAgainRef = useRef(false)
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const metricsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const revalidateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const staleSlugsRef = useRef(new Set<string>())

    const fail = useCallback((message: string): SaveResult => {
        setSavePhase("error")
        setSaveMessage(message)
        return { ok: false }
    }, [])

    const flushRevalidation = useCallback(async () => {
        if (revalidateTimerRef.current) clearTimeout(revalidateTimerRef.current)
        revalidateTimerRef.current = null
        const slugs = Array.from(staleSlugsRef.current)
        staleSlugsRef.current.clear()
        if (slugs.length) await revalidateNotebookAction(slugs).catch(() => undefined)
    }, [])

    const scheduleRevalidation = useCallback((slugs: string[]) => {
        slugs.forEach((value) => staleSlugsRef.current.add(value))
        if (revalidateTimerRef.current) clearTimeout(revalidateTimerRef.current)
        revalidateTimerRef.current = setTimeout(() => void flushRevalidation(), REVALIDATE_DELAY_MS)
    }, [flushRevalidation])

    const queueSave = useCallback((): Promise<SaveResult> => {
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
        if (!dirtyRef.current) return Promise.resolve({ ok: true })
        if (!navigator.onLine) {
            setSavePhase("offline")
            setSaveMessage("Offline · saves when you reconnect")
            return Promise.resolve({ ok: false })
        }
        if (activeSaveRef.current) {
            saveAgainRef.current = true
            return activeSaveRef.current
        }

        const run = async (): Promise<SaveResult> => {
            do {
                saveAgainRef.current = false
                const sequence = editSequenceRef.current
                const payload = buildPostUpdate(fieldsRef.current, savedSlugRef.current)
                setSavePhase("saving")
                setSaveMessage("Saving…")

                const { data, error } = await supabase
                    .from("blog_posts")
                    .update(payload)
                    .eq("id", post.id)
                    .eq("version", versionRef.current)
                    .select(SAVE_COLUMNS)
                    .maybeSingle()

                if (error) return fail(error.code === "23505" ? "That URL is taken by another page" : error.message)
                if (!data) return fail("Changed in another tab — reload to continue")

                versionRef.current = Number(data.version)
                const previousSlug = savedSlugRef.current
                if (data.slug !== previousSlug) {
                    savedSlugRef.current = data.slug
                    window.history.replaceState(window.history.state, "", `/blog/${data.slug}`)
                }
                if (statusRef.current === "published") {
                    scheduleRevalidation(previousSlug === data.slug ? [data.slug] : [previousSlug, data.slug])
                }
                patchDraft(post.id, { title: payload.title, slug: data.slug, updatedAt: data.updated_at })

                if (editSequenceRef.current === sequence) {
                    dirtyRef.current = false
                    setSavePhase("saved")
                    setSaveMessage(`Saved ${formatSavedAt(data.updated_at)}`)
                }
            } while (saveAgainRef.current)

            return { ok: true }
        }

        const task = run()
            .catch((error: unknown) => fail(error instanceof Error ? error.message : "Save failed"))
            .finally(() => {
                activeSaveRef.current = null
            })
        activeSaveRef.current = task
        return task
    }, [fail, patchDraft, post.id, scheduleRevalidation, supabase])

    const markDirty = useCallback(() => {
        const wasDirty = dirtyRef.current
        dirtyRef.current = true
        editSequenceRef.current += 1
        if (!wasDirty) {
            setSavePhase("idle")
            setSaveMessage("Editing…")
        }
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
        autosaveTimerRef.current = setTimeout(() => void queueSave(), AUTOSAVE_DELAY_MS)
    }, [queueSave])

    const updateField = useCallback(<K extends keyof EditablePostFields>(key: K, value: EditablePostFields[K]) => {
        fieldsRef.current[key] = value
        markDirty()
    }, [markDirty])

    const handleContentChange = useCallback((markdown: string) => {
        updateField("content", markdown)
        if (metricsTimerRef.current) clearTimeout(metricsTimerRef.current)
        metricsTimerRef.current = setTimeout(() => setReadingMinutes(estimateReadingTime(markdown)), 400)
    }, [updateField])

    const handleEditorReady = useCallback(() => setEditorReady(true), [])

    useEffect(() => {
        const onOnline = () => {
            if (dirtyRef.current) void queueSave()
        }
        const onVisibility = () => {
            if (document.visibilityState === "hidden" && dirtyRef.current) void queueSave()
        }
        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            if (dirtyRef.current || activeSaveRef.current) event.preventDefault()
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
                event.preventDefault()
                void queueSave()
            }
        }

        window.addEventListener("online", onOnline)
        document.addEventListener("visibilitychange", onVisibility)
        window.addEventListener("beforeunload", onBeforeUnload)
        window.addEventListener("keydown", onKeyDown)
        return () => {
            window.removeEventListener("online", onOnline)
            document.removeEventListener("visibilitychange", onVisibility)
            window.removeEventListener("beforeunload", onBeforeUnload)
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [queueSave])

    useEffect(() => {
        return () => {
            if (metricsTimerRef.current) clearTimeout(metricsTimerRef.current)
            // In-app navigation unmounts the editor; finish pending work instead of dropping it.
            if (dirtyRef.current) void queueSave()
            void flushRevalidation()
        }
    }, [flushRevalidation, queueSave])

    const togglePublish = async () => {
        const next: BlogStatus = statusRef.current === "published" ? "draft" : "published"
        if (next === "published" && savedSlugRef.current.startsWith("untitled-")) {
            const proceed = window.confirm(`This page still has a placeholder URL (/blog/${savedSlugRef.current}). Publish anyway?`)
            if (!proceed) return
        }

        setPublishing(true)
        const saved = await queueSave()
        if (!saved.ok) {
            setPublishing(false)
            return
        }

        const { data, error } = await supabase
            .from("blog_posts")
            .update({ status: next })
            .eq("id", post.id)
            .eq("version", versionRef.current)
            .select(SAVE_COLUMNS)
            .maybeSingle()

        if (error || !data) {
            fail(error?.message ?? "Changed in another tab — reload to continue")
            setPublishing(false)
            return
        }

        versionRef.current = Number(data.version)
        statusRef.current = data.status as BlogStatus
        setStatus(data.status as BlogStatus)
        setPublishedAt(data.published_at ?? null)
        staleSlugsRef.current.add(data.slug)
        await flushRevalidation()
        void refreshDrafts()
        setSavePhase("saved")
        setSaveMessage(next === "published" ? "Published" : "Moved to drafts")
        setPublishing(false)
    }

    const deletePage = async () => {
        if (!window.confirm(`Delete “${fieldsRef.current.title || "Untitled"}”? This can’t be undone.`)) return
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
        dirtyRef.current = false

        const { error } = await supabase.from("blog_posts").delete().eq("id", post.id)
        if (error) {
            fail(error.message)
            return
        }
        if (statusRef.current === "published") staleSlugsRef.current.add(savedSlugRef.current)
        await flushRevalidation()
        void refreshDrafts()
        router.push("/blog")
    }

    const uploadCover = async (file: File | undefined) => {
        if (!file) return
        setUploadingCover(true)
        try {
            const url = await uploadBlogAsset(post.id, file)
            setCoverUrl(url)
            updateField("coverUrl", url)
        } catch (error) {
            fail(error instanceof Error ? error.message : "Upload failed")
        } finally {
            setUploadingCover(false)
        }
    }

    const removeCover = () => {
        setCoverUrl("")
        updateField("coverUrl", null)
    }

    const coverInput = (label: string, className: string) => (
        <label className={className}>
            {uploadingCover ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {uploadingCover ? "Uploading…" : label}
            <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="sr-only"
                onChange={(event) => void uploadCover(event.target.files?.[0])}
            />
        </label>
    )

    const SaveIcon = savePhase === "saving"
        ? LoaderCircle
        : savePhase === "saved"
            ? Check
            : savePhase === "offline"
                ? WifiOff
                : savePhase === "error"
                    ? CircleAlert
                    : CloudUpload
    const isPublished = status === "published"

    const toolbar = (
        <div className="flex items-center gap-1">
            {saveMessage ? (
                <span
                    aria-live="polite"
                    title={saveMessage}
                    className={`mr-1 hidden max-w-[240px] items-center gap-1.5 truncate text-[12px] md:inline-flex ${savePhase === "error" ? "text-[#8c2e20]" : "text-black/42"}`}
                >
                    <SaveIcon className={`h-3.5 w-3.5 shrink-0 ${savePhase === "saving" ? "animate-spin" : ""}`} />
                    <span className="truncate">{saveMessage}</span>
                </span>
            ) : null}
            <button
                type="button"
                disabled={publishing}
                onClick={() => void togglePublish()}
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition disabled:opacity-50 ${
                    isPublished
                        ? "text-black/60 hover:bg-black/[0.05] hover:text-black"
                        : "bg-black text-[#f7f5f1] hover:bg-black/80"
                }`}
            >
                {publishing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : isPublished ? <Undo2 className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                {isPublished ? "Unpublish" : "Publish"}
            </button>
            <PageMenu
                onCopyLink={() => void copyText(`${window.location.origin}/blog/${savedSlugRef.current}`)}
                onDelete={() => void deletePage()}
                onSignOut={() => void queueSave().then(() => signOut())}
            />
        </div>
    )

    const page = (
        <div className="group/page">
            {coverUrl ? (
                <div className="group/cover relative h-[26vh] max-h-[340px] min-h-[180px] w-full overflow-hidden border-b border-black/[0.06] bg-[#ece8df] md:h-[32vh]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverUrl} alt="" className="h-full w-full object-cover" />
                    <div className="absolute bottom-3 right-4 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover/cover:opacity-100">
                        {coverInput("Change cover", "inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-[12px] text-black/70 shadow-sm hover:bg-white")}
                        <button type="button" onClick={removeCover} className="rounded-md bg-white/90 px-2 py-1 text-[12px] text-black/70 shadow-sm hover:bg-white">
                            Remove
                        </button>
                    </div>
                </div>
            ) : null}

            <article className="mx-auto w-full max-w-[720px] px-5 pb-24 pt-10 md:pt-14">
                {!coverUrl ? (
                    <div className="-mt-2 mb-3 flex h-7 items-center opacity-0 transition-opacity focus-within:opacity-100 group-hover/page:opacity-100">
                        {coverInput("Add cover", "-ml-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] text-black/44 hover:bg-black/[0.04] hover:text-black/70")}
                    </div>
                ) : null}

                <AutoGrowTextarea
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value)
                        updateField("title", event.target.value)
                    }}
                    aria-label="Title"
                    placeholder="Untitled"
                    className="w-full bg-transparent text-[32px] font-semibold leading-[1.22] tracking-[-0.022em] text-black outline-none placeholder:text-black/20 md:text-[42px]"
                />
                <AutoGrowTextarea
                    value={summary}
                    onChange={(event) => {
                        setSummary(event.target.value)
                        updateField("summary", event.target.value)
                    }}
                    aria-label="Summary"
                    placeholder="Add a one-line summary…"
                    className="mt-4 w-full bg-transparent text-[17px] leading-8 text-black/54 outline-none placeholder:text-black/24"
                />

                <div className="mt-6 space-y-0.5">
                    <PageProperty icon={<CalendarDays className="h-3.5 w-3.5" />} label="Status">
                        {isPublished ? (
                            <span>
                                <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-[#4c7a43]" />
                                Published {publishedAt ? formatPostDate(publishedAt) : ""}
                            </span>
                        ) : (
                            <span className="text-black/50">
                                <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full border border-black/40" />
                                Draft · only you can see this page
                            </span>
                        )}
                    </PageProperty>
                    <PageProperty icon={<Hash className="h-3.5 w-3.5" />} label="Topic">
                        <select
                            value={topic}
                            onChange={(event) => {
                                setTopic(event.target.value)
                                updateField("topic", event.target.value)
                            }}
                            className={`${fieldClass} cursor-pointer`}
                        >
                            {!BLOG_TOPICS.includes(topic as (typeof BLOG_TOPICS)[number]) ? <option value={topic}>{topic}</option> : null}
                            {BLOG_TOPICS.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </PageProperty>
                    <PageProperty icon={<Tags className="h-3.5 w-3.5" />} label="Tags">
                        <input
                            value={tags}
                            onChange={(event) => {
                                setTags(event.target.value)
                                updateField("tags", event.target.value.split(","))
                            }}
                            placeholder="Empty — separate with commas"
                            className={fieldClass}
                        />
                    </PageProperty>
                    <PageProperty icon={<Link2 className="h-3.5 w-3.5" />} label="URL">
                        <span className="-mx-1.5 flex items-center rounded-md border border-transparent px-1.5 transition-colors focus-within:border-black/15 focus-within:bg-white hover:bg-black/[0.04]">
                            <span className="text-[14px] text-black/32">/blog/</span>
                            <input
                                value={slug}
                                onChange={(event) => {
                                    setSlug(event.target.value)
                                    updateField("slug", event.target.value)
                                }}
                                onBlur={() => setSlug(slugify(slug) || savedSlugRef.current)}
                                spellCheck={false}
                                className="min-w-0 flex-1 bg-transparent py-1 text-[14px] text-black/80 outline-none"
                            />
                        </span>
                    </PageProperty>
                    <PageProperty icon={<Clock className="h-3.5 w-3.5" />} label="Read time">
                        {readingMinutes} min
                    </PageProperty>
                </div>

                <div className="mt-6 border-b border-black/[0.07]" />

                <div className="pt-8">
                    <MarkdownStudioEditor
                        postId={post.id}
                        initialContent={post.content}
                        onChange={handleContentChange}
                        onReady={handleEditorReady}
                    />
                </div>
            </article>
        </div>
    )

    return (
        <>
            {editorReady ? null : fallback}
            <div
                aria-hidden={editorReady ? undefined : true}
                className={editorReady ? undefined : "pointer-events-none fixed left-0 top-0 -z-10 w-full opacity-0"}
            >
                {page}
            </div>
            {toolbarSlot ? createPortal(toolbar, toolbarSlot) : null}
        </>
    )
}

export default function InlineEditor({ slug, fallback, missing }: { slug: string; fallback: ReactNode; missing?: ReactNode }) {
    const { supabase } = useOwner()
    const [lookupSlug] = useState(slug)
    const [post, setPost] = useState<BlogPost | null>(null)
    const [isMissing, setIsMissing] = useState(false)

    useEffect(() => {
        if (!supabase) return
        let cancelled = false
        void supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", lookupSlug)
            .maybeSingle()
            .then(({ data, error }) => {
                if (cancelled || error) return
                if (data) setPost(toBlogPost(data as BlogPostRow))
                else setIsMissing(true)
            })
        return () => {
            cancelled = true
        }
    }, [lookupSlug, supabase])

    if (isMissing) return <>{missing ?? fallback}</>
    if (!post || !supabase) return <>{fallback}</>
    return <PageEditor post={post} supabase={supabase} fallback={fallback} />
}
