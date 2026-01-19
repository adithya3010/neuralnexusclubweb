import { eventStore } from "@/lib/store"
import { HomePage } from "@/components/home-page"

export const dynamic = "force-dynamic"

export default function Home() {
  // Get upcoming events for Highlights (Server Side)
  const upcomingEvents = eventStore.getAll().filter(e => e.status === "Open").slice(0, 3)

  return <HomePage upcomingEvents={upcomingEvents} />
}
