import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cookies } from "next/headers";
import { AdminTicketManager } from "@/components/admin-ticket-manager";
import { TicketDetailsCard } from "@/components/ticket-details-card";
import { TicketExpiredView } from "@/components/ticket-expired-view";

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
            attended: ticketRow.get("Attended"),
            attendedAt: ticketRow.get("Attended At"),
            memberAttendance: ticketRow.get("Member Attendance"),
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

    // Check if user is admin
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin_session")?.value === "true"

    return (
        <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <SectionWrapper className="relative z-10 w-full max-w-md flex flex-col items-center">

                {/* Admin View Logic */}
                {isAdmin ? (
                    ticket.attended === "Yes" ? (
                        <TicketExpiredView
                            attendedAt={ticket.attendedAt}
                            memberAttendance={ticket.memberAttendance}
                        />
                    ) : (
                        <AdminTicketManager ticket={ticket} />
                    )
                ) : (
                    /* Public/Participant View */
                    <TicketDetailsCard ticket={ticket} />
                )}

                {/* Admin Quick Link back to scanner */}
                {isAdmin && (
                    <div className="mt-8">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-white">
                            <Link href="/admin/scan">
                                Return to Scanner
                            </Link>
                        </Button>
                    </div>
                )}

            </SectionWrapper>
        </div>
    )
}
