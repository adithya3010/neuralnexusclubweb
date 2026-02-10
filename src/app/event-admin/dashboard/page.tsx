import { verifyEventToken, logoutEvent } from "@/app/admin/actions"
import { redirect } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { QrCode, LogOut, Users, CheckCircle, ClipboardList } from "lucide-react"
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

async function getEventStats(eventSlug: string) {
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

        const eventRows = rows.filter(row => row.get("Event") === eventSlug);
        const totalRegistrations = eventRows.length;
        const totalCheckedIn = eventRows.filter(row => row.get("Attended") === "Yes").length;

        return {
            total: totalRegistrations,
            checkedIn: totalCheckedIn
        };
    } catch (error) {
        console.error("Stats Fetch Error:", error);
        return { total: 0, checkedIn: 0 };
    }
}

export default async function EventAdminDashboard() {
    const eventPayload = await verifyEventToken()

    if (!eventPayload) {
        redirect("/event-login")
    }

    const stats = await getEventStats(eventPayload.slug);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center bg-white/5 p-6 rounded-xl border border-white/10">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                            {eventPayload.title} Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">Event Coordinator Panel</p>
                    </div>
                    <form action={logoutEvent}>
                        <Button variant="outline" size="sm" className="hover:bg-red-500/10 hover:text-red-500 transition-colors">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </form>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                            <Users className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold">{stats.total}</h3>
                        <p className="text-sm text-muted-foreground">Total Registrations</p>
                    </GlassCard>

                    <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                            <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold">{stats.checkedIn}</h3>
                        <p className="text-sm text-muted-foreground">Checked In</p>
                    </GlassCard>

                    <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                            <ClipboardList className="h-6 w-6 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold">{stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%</h3>
                        <p className="text-sm text-muted-foreground">Turnout Rate</p>
                    </GlassCard>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/event-admin/scan" className="group">
                        <GlassCard className="p-8 hover:bg-white/10 transition-all cursor-pointer flex items-center space-x-6 h-full border-teal-500/30 hover:border-teal-500/60">
                            <div className="h-16 w-16 rounded-full bg-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <QrCode className="h-8 w-8 text-teal-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold mb-2 text-teal-100">Scan Tickets</h2>
                                <p className="text-muted-foreground">Open scanner to verify participants and mark attendance.</p>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link href="/event-admin/participants" className="group">
                        <GlassCard className="p-8 hover:bg-white/10 transition-all cursor-pointer flex items-center space-x-6 h-full border-indigo-500/30 hover:border-indigo-500/60">
                            <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="h-8 w-8 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold mb-2 text-indigo-100">Participants List</h2>
                                <p className="text-muted-foreground">View details of all registered teams and members.</p>
                            </div>
                        </GlassCard>
                    </Link>

                    <Link href="/event-admin/edit" className="group md:col-span-2">
                        <GlassCard className="p-8 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center space-x-6 h-full border-amber-500/30 hover:border-amber-500/60">
                            <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ClipboardList className="h-8 w-8 text-amber-400" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-2xl font-semibold mb-2 text-amber-100">Edit Event Details</h2>
                                <p className="text-muted-foreground">Update description, rules, coordinators, and settings.</p>
                            </div>
                        </GlassCard>
                    </Link>
                </div>
            </div>
        </div>
    )
}
