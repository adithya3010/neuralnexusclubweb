"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"

// ... imports

interface Props {
    events: any[]
    participants: any[]
    eventStats: any[]
}

export function ClientFilter({ events, participants, eventStats }: Props) {
    const [selectedEvent, setSelectedEvent] = useState<string>("all")

    const filteredParticipants = selectedEvent === "all"
        ? participants
        : participants.filter(p => p.eventTitle === selectedEvent)

    const currentStats = selectedEvent === "all"
        ? null
        : eventStats.find(s => s.title === selectedEvent)

    return (
        <div className="space-y-6">
            <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold">Event Details</h2>
                    <div className="w-full md:w-64">
                        <Label className="mb-2 block text-xs">Filter by Event</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                        >
                            <option value="all">All Events</option>
                            {events.map(e => (
                                <option key={e.slug} value={e.title}>{e.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Specific Event Stats */}
                {currentStats && (
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground">Registrations</p>
                            <p className="text-2xl font-bold">{currentStats.total}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Checked In</p>
                            <p className="text-2xl font-bold text-green-400">{currentStats.checkedIn}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                            <p className="text-2xl font-bold text-yellow-400">₹{currentStats.revenue}</p>
                        </div>
                    </div>
                )}

                <div className="rounded-md border border-white/10 max-h-[600px] overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Ticket ID</TableHead>
                                <TableHead>Lead Name / Roll</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>UTR ID</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>At</TableHead>
                                <TableHead>Attended</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParticipants.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                        No participants found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredParticipants.map((p, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium text-xs">{p.eventTitle}</TableCell>
                                        <TableCell className="font-mono text-xs">{p.ticketId}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-sm">{p.leadName}</div>
                                            <div className="text-xs text-muted-foreground">{p.leadRoll}</div>
                                        </TableCell>
                                        <TableCell className="text-xs max-w-[150px] truncate" title={p.members}>{p.members || "-"}</TableCell>
                                        <TableCell className="text-xs font-mono">{p.utrId || "-"}</TableCell>
                                        <TableCell>
                                            {p.screenshot ? (
                                                <a
                                                    href={p.screenshot}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2"
                                                >
                                                    View
                                                </a>
                                            ) : <span className="text-xs text-muted-foreground">N/A</span>}
                                        </TableCell>
                                        <TableCell>₹{p.amount}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{new Date(p.timestamp).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {p.attended === "Yes" ? (
                                                <span className="text-green-400 font-bold text-xs">Yes</span>
                                            ) : (
                                                <span className="text-red-400 text-xs">No</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 text-sm text-muted-foreground text-right">
                    Showing {filteredParticipants.length} participants
                </div>
            </GlassCard>
        </div>
    )
}
