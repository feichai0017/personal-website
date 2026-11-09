import HomePageSections from "@/components/HomePageSections"
import { getLatestPublishedBlogPost } from "@/lib/blog-server"

export const revalidate = 300

export default async function Page() {
    const latestPost = await getLatestPublishedBlogPost()

    return <HomePageSections latestPost={latestPost} />
}
