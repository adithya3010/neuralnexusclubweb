import { eventStore } from "@/lib/store"
import { HomePage } from "@/components/home-page"

export const dynamic = "force-dynamic"

export default async function Home() {
  // Get upcoming events for Highlights (Server Side)
  const events = await eventStore.getAll()
  const upcomingEvents = events.filter((e: any) => e.status === "Open").slice(0, 3)

  return <HomePage upcomingEvents={upcomingEvents} />
}
