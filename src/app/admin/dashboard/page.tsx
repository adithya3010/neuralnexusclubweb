import { Link } from "lucide-react"
import NextLink from "next/link"
import { logout } from "../actions"
import { eventStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { LogOut, Users, Calendar, AlertCircle } from "lucide-react"
import { DeleteEventButton } from "@/components/admin/delete-event-button"

export default async function AdminDashboard() {
    const events = await eventStore.getAll()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, Admin.</p>
                </div>
                <form action={logout}>
                    <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </form>
            </div>

            {/* Stats Cards ... (Keep existing) */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <GlassCard className="p-6 flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Registrations</p>
                        <p className="text-2xl font-bold">1,234</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Active Events</p>
                        <p className="text-2xl font-bold">{events.filter((e: any) => e.status === "Open").length}</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Pending Approvals</p>
                        <p className="text-2xl font-bold">5</p>
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Event Status</h2>
                    <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                        <NextLink href="/admin/events/create">Create Event</NextLink>
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-muted-foreground text-sm uppercase">
                            <tr>
                                <th className="p-4">Event Name</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Registrations</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {events.map((event: any) => (
                                <tr key={event.slug} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium">{event.title}</td>
                                    <td className="p-4 text-muted-foreground">{event.date}</td>
                                    <td className="p-4 text-muted-foreground">{event.category}</td>
                                    <td className="p-4">
                                        {Math.floor(Math.random() * 200)} {/* Mock Data */}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === "Open" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-8" asChild>
                                            <NextLink href={`/admin/events/${event.slug}/edit`}>Edit</NextLink>
                                        </Button>
                                        <DeleteEventButton slug={event.slug} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    )
}
