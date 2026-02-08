"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Users } from "lucide-react"
import { markAttendanceAction } from "@/app/admin/actions"
import { useRouter } from "next/navigation"

interface TicketCheckInFormProps {
    ticket: {
        id: string
        name: string // Lead Name
        roll: string // Lead Roll
        team: string
        members: string // "Name (Roll), Name (Roll)"
    }
}

export function TicketCheckInForm({ ticket }: TicketCheckInFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Parse members to create initial state
    // We want to track attendance for Lead + Members
    // Format: "Name (Roll)"

    const leadEntry = `${ticket.name} (${ticket.roll})`
    const membersList = ticket.members
        ? ticket.members.split(',').map((m: string) => m.trim()).filter(Boolean)
        : []

    const allMembers = [leadEntry, ...membersList]

    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set(allMembers))

    const toggleMember = (member: string) => {
        const newSelected = new Set(selectedMembers)
        if (newSelected.has(member)) {
            newSelected.delete(member)
        } else {
            newSelected.add(member)
        }
        setSelectedMembers(newSelected)
    }

    const handleCheckIn = async () => {
        setIsSubmitting(true)
        try {
            // Create a string of attended members: "Name (Roll):Present, Name (Roll):Absent"
            const attendanceStatus = allMembers.map(member =>
                `${member}:${selectedMembers.has(member) ? 'Present' : 'Absent'}`
            ).join(', ')

            const result = await markAttendanceAction(ticket.id, attendanceStatus)

            if (result.error) {
                alert(result.error)
            } else {
                setIsSuccess(true)
                router.refresh()
            }
        } catch (error) {
            console.error("Check-in failed", error)
            alert("Failed to mark attendance. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <GlassCard className="p-8 w-full max-w-md border-green-500/50 bg-black/60 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)]">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full" />
                        <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center relative z-10 border border-green-500/50">
                            <Check className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-2">Check In Confirmed!</h1>
                <p className="text-sm text-muted-foreground text-center mb-8">
                    Attendance has been marked for {ticket.team || "Independent Entry"}.
                </p>

                <div className="space-y-3">
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="lg"
                        onClick={() => router.push('/admin/scan')}
                    >
                        Scan Next Ticket
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => window.location.reload()}
                    >
                        View Updated Ticket
                    </Button>
                </div>
            </GlassCard>
        )
    }

    return (
        <GlassCard className="p-8 w-full max-w-md border-primary/20 bg-black/60 shadow-[0_0_50px_-12px_rgba(124,58,237,0.2)]">
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-xl opacity-20 rounded-full" />
                    <Users className="h-16 w-16 text-primary relative z-10" />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Check In</h1>
            <p className="text-sm text-muted-foreground text-center mb-8">
                Select members present for {ticket.team || "Independent Entry"}
            </p>

            <div className="space-y-3 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {allMembers.map((member, idx) => {
                    const isSelected = selectedMembers.has(member)
                    return (
                        <div
                            key={idx}
                            onClick={() => toggleMember(member)}
                            className={`
                                flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200
                                ${isSelected
                                    ? 'bg-primary/20 border-primary/50 shadow-[inset_0_0_10px_rgba(124,58,237,0.1)]'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }
                            `}
                        >
                            <span className={`text-sm ${isSelected ? 'text-primary-foreground font-medium' : 'text-muted-foreground'}`}>
                                {member}
                            </span>
                            <div className={`
                                h-5 w-5 rounded border flex items-center justify-center transition-colors
                                ${isSelected ? 'bg-primary border-primary' : 'border-white/20'}
                            `}>
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                        </div>
                    )
                })}
            </div>

            <Button
                className="w-full"
                size="lg"
                onClick={handleCheckIn}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Confirm Attendance"
                )}
            </Button>
        </GlassCard>
    )
}
