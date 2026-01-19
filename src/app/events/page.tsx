import { eventStore } from "@/lib/store"
import { EventsGrid } from "@/components/events-grid"

export const dynamic = "force-dynamic"

export default function EventsPage() {
    const events = eventStore.getAll()

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                    Upcoming Events
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore our latest workshops, hackathons, and tech talks.
                </p>
            </div>

            <EventsGrid events={events} />
        </div>
    )
}
