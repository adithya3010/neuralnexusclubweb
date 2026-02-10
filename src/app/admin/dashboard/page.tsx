import { Link } from "lucide-react"
import NextLink from "next/link"
import { logout } from "../actions"
import { eventStore, prisma } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { LogOut, Users, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import { DeleteEventButton } from "@/components/admin/delete-event-button"
import { FacultyManager } from "@/components/admin/faculty-manager"
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

export const dynamic = "force-dynamic"

import { unstable_cache } from "next/cache"

const getGlobalStats = unstable_cache(
    async () => {
        try {
            const key = process.env.GOOGLE_PRIVATE_KEY || '';
            const cleanedKey = key.replace(/\\n/g, '\n').replace(/"/g, '');

            const serviceAccountAuth = new JWT({
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: cleanedKey,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            const rows = await sheet.getRows();

            const totalRegistrations = rows.length;
            const totalCheckedIn = rows.filter(row => row.get("Attended") === "Yes").length;

            return { totalRegistrations, totalCheckedIn };
        } catch (error) {
            console.error("Error fetching global stats:", error);
            return { totalRegistrations: 0, totalCheckedIn: 0 };
        }
    },
    ['global-stats'],
    { revalidate: 60, tags: ['stats'] }
)

export default async function AdminDashboard() {
    const events = await eventStore.getAll()
    const stats = await getGlobalStats()
    const facultyList = await (prisma as any).faculty.findMany({ orderBy: { createdAt: 'desc' } })

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, Admin.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <Button variant="outline" asChild className="border-purple-500/50 hover:bg-purple-500/10">
                        <NextLink href="/admin/scan">Scan QR Code</NextLink>
                    </Button>
                    <form action={logout}>
                        <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </form>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
                <GlassCard className="p-6 flex items-center space-x-4 border-blue-500/20">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Registrations</p>
                        <p className="text-2xl font-bold">{stats.totalRegistrations}</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center space-x-4 border-green-500/20">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Checked In</p>
                        <p className="text-2xl font-bold">{stats.totalCheckedIn}</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center space-x-4 border-purple-500/20">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Active Events</p>
                        <p className="text-2xl font-bold">{events.filter((e: any) => e.status === "Open").length}</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center space-x-4 border-yellow-500/20">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Events</p>
                        <p className="text-2xl font-bold">{events.length}</p>
                    </div>
                </GlassCard>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Event Management (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-8">
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

                {/* Faculty Management (Right col) */}
                <div>
                    <FacultyManager facultyList={facultyList} />
                </div>
            </div>
        </div>
    )
}
