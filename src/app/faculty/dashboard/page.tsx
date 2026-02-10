import { verifyFacultyToken } from "@/app/admin/actions"
import { redirect } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { logoutFaculty } from "@/app/admin/actions"
import { eventStore } from "@/lib/store"
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientFilter } from "./client-filter"

async function getAllParticipants() {
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

        return rows.map(row => ({
            eventSlug: row.get("Event"), // This is the SLUG
            ticketId: row.get("Ticket ID"),
            leadName: row.get("Lead Name"),
            attended: row.get("Attended"),
            timestamp: row.get("Timestamp"),
            amount: parseFloat(row.get("Amount") || "0")
        })).reverse();
    } catch (error) {
        console.error("Error fetching participants:", error);
        return [];
    }
}

export default async function FacultyDashboard() {
    const faculty = await verifyFacultyToken()
    if (!faculty) redirect("/faculty-login")

    const events = await eventStore.getAll()
    const rawParticipants = await getAllParticipants()

    // Map slug to title and attach to participant
    const participants = rawParticipants.map(p => {
        const event = events.find(e => e.slug === p.eventSlug)
        return {
            ...p,
            eventTitle: event ? event.title : p.eventSlug // Fallback to slug if not found
        }
    })

    // Aggregate Stats
    const totalRegistrations = participants.length
    const totalCheckedIn = participants.filter(p => p.attended === "Yes").length
    const turnoutRate = totalRegistrations > 0 ? ((totalCheckedIn / totalRegistrations) * 100).toFixed(1) : "0"
    const totalRevenue = participants.reduce((sum, p) => sum + p.amount, 0)

    const eventStats = events.map(event => {
        const eventParticipants = participants.filter(p => p.eventSlug === event.slug)
        return {
            title: event.title,
            slug: event.slug, // Add slug for filtering
            total: eventParticipants.length,
            checkedIn: eventParticipants.filter(p => p.attended === "Yes").length,
            revenue: eventParticipants.reduce((sum, p) => sum + p.amount, 0)
        }
    })

    return (
        <div className="min-h-screen p-8 space-y-8">
            <header className="flex items-center justify-between bg-white/5 p-6 rounded-xl border border-white/10">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Welcome, {faculty.name}
                    </h1>
                    <p className="text-muted-foreground mt-1">Faculty Dashboard</p>
                </div>
                <form action={logoutFaculty}>
                    <Button variant="destructive">Logout</Button>
                </form>
            </header>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-6 border-blue-500/20">
                    <h3 className="text-lg font-medium text-blue-200">Total Registrations</h3>
                    <p className="text-4xl font-bold mt-2 text-white">{totalRegistrations}</p>
                </GlassCard>
                <GlassCard className="p-6 border-green-500/20">
                    <h3 className="text-lg font-medium text-green-200">Total Checked In</h3>
                    <p className="text-4xl font-bold mt-2 text-white">{totalCheckedIn}</p>
                </GlassCard>
                <GlassCard className="p-6 border-purple-500/20">
                    <h3 className="text-lg font-medium text-purple-200">Overall Turnout</h3>
                    <p className="text-4xl font-bold mt-2 text-white">{turnoutRate}%</p>
                </GlassCard>
                <GlassCard className="p-6 border-yellow-500/20">
                    <h3 className="text-lg font-medium text-yellow-200">Total Revenue</h3>
                    <p className="text-4xl font-bold mt-2 text-white">₹{totalRevenue}</p>
                </GlassCard>
            </div>

            {/* Client Side Filter & List */}
            <ClientFilter events={events} participants={participants} eventStats={eventStats} />
        </div>
    )
}
