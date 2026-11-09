"use client"

import { useActionState } from "react"
import { ArrowRight, KeyRound } from "lucide-react"

import { updatePasswordAction, type PasswordUpdateState } from "@/app/studio/actions"

const initialState: PasswordUpdateState = { error: null }

export default function StudioPasswordResetForm() {
    const [state, action, pending] = useActionState(updatePasswordAction, initialState)

    return (
        <form action={action} className="mt-8 space-y-5">
            <label className="block">
                <span className="studio-field-label">New password</span>
                <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    required
                    className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3.5 text-base outline-none focus:border-black/35"
                />
            </label>
            <label className="block">
                <span className="studio-field-label">Confirm password</span>
                <input
                    name="confirmation"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    required
                    className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3.5 text-base outline-none focus:border-black/35"
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
                className="group flex w-full items-center justify-between rounded-full bg-black px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white disabled:opacity-50"
            >
                <span className="inline-flex items-center gap-2">
                    <KeyRound className="h-3.5 w-3.5" />
                    {pending ? "Updating" : "Set password"}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
        </form>
    )
}
