import { verifyEventToken } from "@/app/admin/actions"
import { redirect } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

async function getEventParticipants(eventTitle: string) {
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

        // Filter rows by event title
        return rows
            .filter(row => row.get("Event") === eventTitle)
            .map(row => ({
                ticketId: row.get("Ticket ID"),
                leadName: row.get("Lead Name"),
                leadRoll: row.get("Lead Roll"),
                leadPhone: row.get("Lead Phone"), // Assuming this column exists, need to verify
                teamName: row.get("Team Name"),
                attended: row.get("Attended"),
                timestamp: row.get("Timestamp"),
            }))
            .reverse(); // Show newest first
    } catch (error) {
        console.error("Participants Fetch Error:", error);
        return [];
    }
}

export default async function ParticipantsPage() {
    const eventPayload = await verifyEventToken()

    if (!eventPayload) {
        redirect("/event-login")
    }

    const participants = await getEventParticipants(eventPayload.title);

    return (
        <div className="min-h-screen p-8">
            {/* Background Blob */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                <header className="flex justify-between items-center bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <Link href="/event-admin/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{eventPayload.title} Participants</h1>
                            <p className="text-sm text-muted-foreground">{participants.length} Total Registrations</p>
                        </div>
                    </div>
                </header>

                <GlassCard className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ticket ID</TableHead>
                                <TableHead>Team / Lead</TableHead>
                                <TableHead>Roll Number</TableHead>
                                <TableHead>Registered At</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participants.map((p) => (
                                <TableRow key={p.ticketId}>
                                    <TableCell className="font-mono text-xs">{p.ticketId}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{p.leadName}</div>
                                        {p.teamName && <div className="text-xs text-muted-foreground">{p.teamName}</div>}
                                    </TableCell>
                                    <TableCell className="text-xs">{p.leadRoll}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{p.timestamp}</TableCell>
                                    <TableCell>
                                        {p.attended === "Yes" ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                                Checked In
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-muted-foreground">
                                                Registered
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {participants.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No participants found for this event.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </GlassCard>
            </div>
        </div>
    )
}
