import { redirect } from "next/navigation"

import StudioAuthLayout from "@/components/StudioAuthLayout"
import StudioLoginForm from "@/components/StudioLoginForm"
import { getBlogAdminSession } from "@/lib/blog-admin"

export default async function StudioLoginPage() {
    const session = await getBlogAdminSession()
    if (session.isAdmin) redirect("/studio")

    return (
        <StudioAuthLayout
            title="Sign in to Studio"
            description="The private writing workspace behind Guocheng’s Notebook. Owner account only."
        >
            <StudioLoginForm />
        </StudioAuthLayout>
    )
}
