import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { RegisterForm } from "@/components/register-form"
import { eventStore } from "@/lib/store"
import { Event } from "@/lib/data"

// Force dynamic because of searchParams
export const dynamic = "force-dynamic"

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ event?: string }> }) {
    const { event: eventSlug } = await searchParams

    let event: Event | null = null

    if (eventSlug) {
        // Fetch from DB
        const dbEvent = await eventStore.getBySlug(eventSlug)
        if (dbEvent) {
            // Convert DB event to compatible type if necessary
            // In our case they should match or be compatible
            event = dbEvent as unknown as Event
        }
    }

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <RegisterForm event={event} eventSlug={eventSlug || null} />
        </Suspense>
    )
}
