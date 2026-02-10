import { verifyEventToken } from "@/app/admin/actions"
import { redirect } from "next/navigation"
import { eventStore } from "@/lib/store"
import { EditEventForm } from "@/app/admin/events/[slug]/edit/form"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EventAdminEditPage() {
    const eventPayload = await verifyEventToken()

    if (!eventPayload) {
        redirect("/event-login")
    }

    const event = await eventStore.getBySlug(eventPayload.slug)

    if (!event) {
        return <div className="p-8 text-center">Event not found</div>
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="flex items-center gap-4 bg-white/5 p-6 rounded-xl border border-white/10">
                    <Link href="/event-admin/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Event: {event.title}</h1>
                        <p className="text-sm text-muted-foreground">Update event details and settings.</p>
                    </div>
                </header>

                <EditEventForm event={event as any} />
            </div>
        </div>
    )
}
