import { eventStore } from "@/lib/store"
import { EditEventForm } from "./form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const event = eventStore.getBySlug(slug)

    if (!event) {
        return <div>Event not found</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/admin/dashboard" className="inline-flex items-center text-muted-foreground hover:text-white mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Event: {event.title}</h1>
            </div>

            <EditEventForm event={event} />
        </div>
    )
}
