import { redirect } from "next/navigation"

import StudioAuthLayout from "@/components/StudioAuthLayout"
import StudioLoginForm from "@/components/StudioLoginForm"
import { getBlogAdminSession } from "@/lib/blog-admin"

export default async function StudioLoginPage() {
    const session = await getBlogAdminSession()
    if (session.isAdmin) redirect("/blog")

    return (
        <StudioAuthLayout
            title="Sign in to write"
            description="Once you’re signed in, every page in the notebook becomes editable in place."
        >
            <StudioLoginForm />
        </StudioAuthLayout>
    )
}
