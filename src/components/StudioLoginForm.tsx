"use client"

import { useActionState, useState } from "react"
import { ArrowLeft, KeyRound, LockKeyhole, Mail } from "lucide-react"

import {
    loginAction,
    requestMagicLinkAction,
    requestPasswordResetAction,
    type LoginState,
    type MagicLinkState,
    type PasswordResetState,
} from "@/app/studio/actions"
import {
    studioAlertClass,
    studioInputClass,
    studioLabelClass,
    studioNoticeClass,
    studioPrimaryButtonClass,
} from "@/lib/studio-form"

const initialState: LoginState = { error: null }
const initialMagicLinkState: MagicLinkState = { error: null, sent: false }
const initialPasswordResetState: PasswordResetState = { error: null, sent: false }

export default function StudioLoginForm() {
    const [mode, setMode] = useState<"password" | "link" | "reset">("password")
    const [state, action, pending] = useActionState(loginAction, initialState)
    const [linkState, linkAction, linkPending] = useActionState(requestMagicLinkAction, initialMagicLinkState)
    const [resetState, resetAction, resetPending] = useActionState(requestPasswordResetAction, initialPasswordResetState)

    return (
        <div className="mt-8">
            {mode !== "reset" ? (
                <div role="tablist" aria-label="Sign-in method" className="grid grid-cols-2 gap-0.5 rounded-lg bg-black/[0.05] p-0.5">
                    {([
                        ["password", "Password"],
                        ["link", "Email link"],
                    ] as const).map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            role="tab"
                            aria-selected={mode === value}
                            onClick={() => setMode(value)}
                            className={`rounded-md px-3 py-1.5 text-[13px] transition ${mode === value ? "bg-white font-medium text-black shadow-sm" : "text-black/52 hover:text-black"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            ) : null}

            {mode === "password" ? (
                <form action={action} className="mt-6 space-y-4">
                    <label className="block">
                        <span className={studioLabelClass}>Email</span>
                        <input name="email" type="email" autoComplete="email" required className={studioInputClass} />
                    </label>
                    <label className="block">
                        <span className={studioLabelClass}>Password</span>
                        <input name="password" type="password" autoComplete="current-password" required className={studioInputClass} />
                    </label>

                    {state.error ? <p role="alert" className={studioAlertClass}>{state.error}</p> : null}

                    <button type="submit" disabled={pending} className={studioPrimaryButtonClass}>
                        <LockKeyhole className="h-3.5 w-3.5" />
                        {pending ? "Verifying…" : "Continue"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("reset")}
                        className="mx-auto block text-[13px] text-black/48 hover:text-black"
                    >
                        Forgot or never set a password?
                    </button>
                </form>
            ) : mode === "link" ? (
                <form action={linkAction} className="mt-6 space-y-4">
                    <label className="block">
                        <span className={studioLabelClass}>Owner email</span>
                        <input name="email" type="email" autoComplete="email" required className={studioInputClass} />
                    </label>

                    {linkState.sent ? (
                        <p role="status" className={studioNoticeClass}>
                            Check your inbox. The sign-in link returns to <strong className="font-medium text-black">eric-sgc.cafe</strong> and expires in 15 minutes.
                        </p>
                    ) : null}
                    {linkState.error ? <p role="alert" className={studioAlertClass}>{linkState.error}</p> : null}

                    <button type="submit" disabled={linkPending} className={studioPrimaryButtonClass}>
                        <Mail className="h-3.5 w-3.5" />
                        {linkPending ? "Sending…" : "Email me a sign-in link"}
                    </button>
                </form>
            ) : (
                <form action={resetAction} className="space-y-4">
                    <button
                        type="button"
                        onClick={() => setMode("password")}
                        className="-ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-black/52 hover:bg-black/[0.05] hover:text-black"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
                    </button>
                    <div>
                        <h2 className="text-[17px] font-semibold text-black">Reset your password</h2>
                        <p className="mt-1 text-[14px] leading-6 text-black/52">We&rsquo;ll email a secure recovery link to the owner account.</p>
                    </div>
                    <label className="block">
                        <span className={studioLabelClass}>Owner email</span>
                        <input name="email" type="email" autoComplete="email" required className={studioInputClass} />
                    </label>
                    {resetState.sent ? (
                        <p role="status" className={studioNoticeClass}>
                            Recovery email sent. Its link opens the new-password screen on eric-sgc.cafe.
                        </p>
                    ) : null}
                    {resetState.error ? <p role="alert" className={studioAlertClass}>{resetState.error}</p> : null}
                    <button type="submit" disabled={resetPending} className={studioPrimaryButtonClass}>
                        <KeyRound className="h-3.5 w-3.5" />
                        {resetPending ? "Sending…" : "Send recovery link"}
                    </button>
                </form>
            )}
        </div>
    )
}
