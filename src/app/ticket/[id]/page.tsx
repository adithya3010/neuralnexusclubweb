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

    // Check if user is event admin
    let eventAdmin = null;
    const eventToken = cookieStore.get("event_token")?.value;
    if (eventToken) {
        try {
            // We can use the helper or just simpler decode if we trust the cookie signature was verified by middleware/action usually.
            // But valid verification is best. 
            // Importing verifyEventToken from actions might cause issues if it's not careful with 'server-only' etc.
            // We can duplicate the verified logic or assume if middleware passed it, it's roughly ok, 
            // but for security we should verify. 
            // Let's rely on `jose` here as well since we installed it.
            const { jwtVerify } = await import('jose');
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'neural-nexus-secret-key-change-me');
            const { payload } = await jwtVerify(eventToken, secret);
            eventAdmin = payload as { slug: string, title: string };
        } catch (e) {
            // invalid token
        }
    }

    // Logic:
    // 1. If Super Admin -> Allow
    // 2. If Event Admin:
    //    - Check if ticket.event matches eventAdmin.title
    //    - If Match -> Allow
    //    - If Mismatch -> Show Error
    // 3. If neither -> Public View

    const isAuthorizedAPI = isAdmin || !!eventAdmin;
    let isEventMismatch = false;

    if (eventAdmin && !isAdmin) {
        // Strict check replaced with improved logic
        // ticket.event is likely the Title from the Google Sheet.
        // eventAdmin.title is the Title from the JWT.
        // eventAdmin.slug is the Slug from the JWT.

        // 1. Try direct title match (case-insensitive)
        const ticketEventLower = ticket.event.trim().toLowerCase();
        const adminTitleLower = eventAdmin.title.trim().toLowerCase();
        const adminSlugLower = eventAdmin.slug.trim().toLowerCase();

        if (ticketEventLower !== adminTitleLower && ticketEventLower !== adminSlugLower) {
            // 2. If no match, try fetching event by slug (from admin token) and check if that event's title matches ticket
            // This handles cases where JWT title might be slightly different or outdated, OR if ticket used slug.
            // But we can't easily fetch event here without importing store which might be server-side restricted? 
            // modifying imports in this file might be safer.
            // Actually, let's just allow if it matches EITHER slug OR title.
            // The error message "This ticket is for xai-workshop" suggests the ticket sheet HAS the slug "xai-workshop".
            // But the admin token has title "XAi Workshop".
            // So comparing ticket.event (slug) vs admin.slug should fix it.

            isEventMismatch = true;
        }
    }

    if (isEventMismatch && eventAdmin) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
                <GlassCard className="p-8 text-center max-w-md w-full border-yellow-500/50">
                    <div className="flex justify-center mb-6">
                        <XCircle className="h-20 w-20 text-yellow-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Wrong Event</h1>
                    <p className="text-muted-foreground mb-4">
                        This ticket is for <strong>{ticket.event}</strong>.
                    </p>
                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 mb-6">
                        <p className="text-sm">
                            You are currently scanning for:<br />
                            <span className="font-semibold text-yellow-400 text-lg">{eventAdmin.title}</span>
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/event-admin/scan">
                            Return to Scanner
                        </Link>
                    </Button>
                </GlassCard>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <SectionWrapper className="relative z-10 w-full max-w-md flex flex-col items-center">

                {/* Admin View Logic */}
                {isAuthorizedAPI ? (
                    ticket.attended === "Yes" ? (
                        <TicketExpiredView
                            attendedAt={ticket.attendedAt}
                            memberAttendance={ticket.memberAttendance}
                            backLink={isAdmin ? "/admin/scan" : "/event-admin/scan"}
                        />
                    ) : (
                        <AdminTicketManager ticket={ticket} />
                    )
                ) : (
                    /* Public/Participant View */
                    <TicketDetailsCard ticket={ticket} />
                )}

                {/* Admin Quick Link back to scanner */}
                {(isAdmin || eventAdmin) && (
                    <div className="mt-8">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-white">
                            <Link href={isAdmin ? "/admin/scan" : "/event-admin/scan"}>
                                Return to Scanner
                            </Link>
                        </Button>
                    </div>
                )}

            </SectionWrapper>
        </div>
    )
}
