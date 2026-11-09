"use client"

import { useActionState } from "react"
import { KeyRound } from "lucide-react"

import { updatePasswordAction, type PasswordUpdateState } from "@/app/studio/actions"
import { studioAlertClass, studioInputClass, studioLabelClass, studioPrimaryButtonClass } from "@/lib/studio-form"

const initialState: PasswordUpdateState = { error: null }

export default function StudioPasswordResetForm() {
    const [state, action, pending] = useActionState(updatePasswordAction, initialState)

    return (
        <form action={action} className="mt-8 space-y-4">
            <label className="block">
                <span className={studioLabelClass}>New password</span>
                <input name="password" type="password" autoComplete="new-password" minLength={12} required className={studioInputClass} />
            </label>
            <label className="block">
                <span className={studioLabelClass}>Confirm password</span>
                <input name="confirmation" type="password" autoComplete="new-password" minLength={12} required className={studioInputClass} />
            </label>
            {state.error ? <p role="alert" className={studioAlertClass}>{state.error}</p> : null}
            <button type="submit" disabled={pending} className={studioPrimaryButtonClass}>
                <KeyRound className="h-3.5 w-3.5" />
                {pending ? "Updating…" : "Set password"}
            </button>
        </form>
    )
}
