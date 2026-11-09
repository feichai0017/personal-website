import { permanentRedirect } from "next/navigation"

export default function NotesPage() {
    permanentRedirect("/blog")
}
