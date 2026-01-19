import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { BadgeCheck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getTicketDetails(id: string) {
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

        // Find row with matching Ticket ID
        const ticketRow = rows.find(row => row.get("Ticket ID") === id);

        if (!ticketRow) return null;

        return {
            id: ticketRow.get("Ticket ID"),
            event: ticketRow.get("Event"),
            name: ticketRow.get("Lead Name"),
            roll: ticketRow.get("Lead Roll"),
            team: ticketRow.get("Team Name"),
            members: ticketRow.get("Members"), // "Name (Roll), Name (Roll)"
            timestamp: ticketRow.get("Timestamp"),
        };
    } catch (error) {
        console.error("Ticket Fetch Error:", error);
        return null;
    }
}

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ticket = await getTicketDetails(id);

    if (!ticket) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
                <GlassCard className="p-8 text-center max-w-md w-full border-red-500/50">
                    <div className="flex justify-center mb-6">
                        <XCircle className="h-20 w-20 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Invalid Ticket</h1>
                    <p className="text-muted-foreground mb-6">
                        This ticket ID ({id}) could not be found in our records.
                    </p>
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </GlassCard>
            </div>
        )
    }

    // Parse members string: "Name (Roll), Name (Roll)"
    const membersList = ticket.members
        ? ticket.members.split(',').map((m: string) => m.trim()).filter(Boolean)
        : [];

    return (
        <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <SectionWrapper className="relative z-10 w-full max-w-md">
                <GlassCard className="p-8 text-center border-green-500/50 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)]">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full" />
                            <BadgeCheck className="h-24 w-24 text-green-500 relative z-10" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-green-400 mb-1">VERIFIED TICKET</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-8">{ticket.id}</p>

                    <div className="space-y-4 text-left bg-white/5 p-6 rounded-lg mb-8">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Participant</p>
                            <p className="text-xl font-bold">{ticket.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Roll Number</p>
                            <p className="text-lg">{ticket.roll}</p>
                        </div>
                        <div className="h-px bg-white/10 my-2" />
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Event</p>
                            <p className="text-lg font-medium text-primary">{ticket.event}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">Team</p>
                            <p className="text-lg">{ticket.team}</p>
                        </div>

                        {membersList.length > 0 && (
                            <>
                                <div className="h-px bg-white/10 my-2" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase mb-1">Team Members</p>
                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                        {membersList.map((member: string, i: number) => (
                                            <li key={i}>• {member}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-6">
                        Registered on {new Date(ticket.timestamp).toLocaleDateString()}
                    </p>

                    <Button className="w-full" asChild>
                        <Link href="/">Back to Event</Link>
                    </Button>
                </GlassCard>
            </SectionWrapper>
        </div>
    )
}
