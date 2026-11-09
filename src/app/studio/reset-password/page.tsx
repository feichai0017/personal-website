import StudioAuthLayout from "@/components/StudioAuthLayout"
import StudioPasswordResetForm from "@/components/StudioPasswordResetForm"
import { requireBlogAdmin } from "@/lib/blog-admin"

export default async function StudioResetPasswordPage() {
    await requireBlogAdmin()

    return (
        <StudioAuthLayout
            title="Set a new password"
            description="Use at least 12 characters. This replaces any previous password for the owner account."
        >
            <StudioPasswordResetForm />
        </StudioAuthLayout>
    )
}
