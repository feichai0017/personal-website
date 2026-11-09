"use client"

import { useActionState, useState } from "react"
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole, Mail } from "lucide-react"

import {
    loginAction,
    requestMagicLinkAction,
    requestPasswordResetAction,
    type LoginState,
    type MagicLinkState,
    type PasswordResetState,
} from "@/app/studio/actions"

const initialState: LoginState = { error: null }
const initialMagicLinkState: MagicLinkState = { error: null, sent: false }
const initialPasswordResetState: PasswordResetState = { error: null, sent: false }

export default function StudioLoginForm() {
    const [mode, setMode] = useState<"password" | "link" | "reset">("password")
    const [state, action, pending] = useActionState(loginAction, initialState)
    const [linkState, linkAction, linkPending] = useActionState(requestMagicLinkAction, initialMagicLinkState)
    const [resetState, resetAction, resetPending] = useActionState(requestPasswordResetAction, initialPasswordResetState)

    return (
        <div className="mt-10">
            {mode !== "reset" ? <div className="grid grid-cols-2 rounded-full border border-black/10 bg-[#f1eee7] p-1">
                <button
                    type="button"
                    onClick={() => setMode("password")}
                    className={`rounded-full px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] transition ${mode === "password" ? "bg-white text-black shadow-sm" : "text-black/42"}`}
                >
                    Password
                </button>
                <button
                    type="button"
                    onClick={() => setMode("link")}
                    className={`rounded-full px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] transition ${mode === "link" ? "bg-white text-black shadow-sm" : "text-black/42"}`}
                >
                    Email link
                </button>
            </div> : null}

            {mode === "password" ? (
                <form action={action} className="mt-6 space-y-5">
                    <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/45">Email</span>
                        <input
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3.5 text-base text-black outline-none transition focus:border-black/35"
                        />
                    </label>
                    <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/45">Password</span>
                        <input
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3.5 text-base text-black outline-none transition focus:border-black/35"
                        />
                    </label>

                    {state.error ? (
                        <p role="alert" className="rounded-2xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-900">
                            {state.error}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={pending}
                        className="group flex w-full items-center justify-between rounded-full bg-black px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-black/82 disabled:cursor-wait disabled:opacity-60"
                    >
                        <span className="inline-flex items-center gap-2">
                            <LockKeyhole className="h-3.5 w-3.5" />
                            {pending ? "Verifying" : "Enter studio"}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("reset")}
                        className="mx-auto block font-mono text-[9px] uppercase tracking-[0.2em] text-black/42 hover:text-black"
                    >
                        Set or reset password
                    </button>
                </form>
            ) : mode === "link" ? (
                <form action={linkAction} className="mt-6 space-y-5">
                    <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/45">Owner email</span>
                        <input
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3.5 text-base text-black outline-none transition focus:border-black/35"
                        />
                    </label>

                    {linkState.sent ? (
                        <p role="status" className="rounded-2xl border border-black/10 bg-[#f1eee7] px-4 py-3 text-sm leading-6 text-black/65">
                            Check your inbox. The sign-in link now returns to <strong>eric-sgc.cafe</strong> and expires in 15 minutes.
                        </p>
                    ) : null}
                    {linkState.error ? (
                        <p role="alert" className="rounded-2xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-900">
                            {linkState.error}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={linkPending}
                        className="group flex w-full items-center justify-between rounded-full bg-black px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-black/82 disabled:cursor-wait disabled:opacity-60"
                    >
                        <span className="inline-flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            {linkPending ? "Sending" : "Send secure link"}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>
            ) : (
                <form action={resetAction} className="space-y-5">
                    <button
                        type="button"
                        onClick={() => setMode("password")}
                        className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-black/42 hover:text-black"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
                    </button>
                    <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">Password recovery</div>
                        <h3 className="mt-3 text-3xl font-medium tracking-[-0.045em]">Choose a new password.</h3>
                        <p className="mt-2 text-sm leading-6 text-black/52">We will email a secure recovery link to the owner account.</p>
                    </div>
                    <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/45">Owner email</span>
                        <input
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3.5 text-base text-black outline-none transition focus:border-black/35"
                        />
                    </label>
                    {resetState.sent ? (
                        <p role="status" className="rounded-2xl border border-black/10 bg-[#f1eee7] px-4 py-3 text-sm leading-6 text-black/65">
                            Recovery email sent. Its link opens the new-password screen on eric-sgc.cafe.
                        </p>
                    ) : null}
                    {resetState.error ? (
                        <p role="alert" className="rounded-2xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-900">
                            {resetState.error}
                        </p>
                    ) : null}
                    <button
                        type="submit"
                        disabled={resetPending}
                        className="group flex w-full items-center justify-between rounded-full bg-black px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-black/82 disabled:cursor-wait disabled:opacity-60"
                    >
                        <span className="inline-flex items-center gap-2">
                            <KeyRound className="h-3.5 w-3.5" />
                            {resetPending ? "Sending" : "Send recovery link"}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>
            )}
        </div>
    )
}
