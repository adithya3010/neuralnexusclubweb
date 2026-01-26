"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updateEventAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Event } from "@/lib/data"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
    )
}

export function EditEventForm({ event }: { event: Event }) {
    const [state, formAction] = useActionState(updateEventAction, { error: "" })

    return (
        <GlassCard className="max-w-2xl mx-auto p-8">
            <form action={formAction} className="space-y-6">
                <input type="hidden" name="slug" value={event.slug} />

                <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" name="title" defaultValue={event.title} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" defaultValue={event.date} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" name="time" defaultValue={event.time} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input id="venue" name="venue" defaultValue={event.venue} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="teamSize">Team Size</Label>
                        <Input id="teamSize" name="teamSize" defaultValue={event.teamSize} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select id="status" name="status" defaultValue={event.status} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select id="category" name="category" defaultValue={event.category} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="Technical">Technical</option>
                            <option value="Non-Technical">Non-Technical</option>
                            <option value="Hackathon">Hackathon</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="showOnHighlights" name="showOnHighlights" defaultChecked={event.showOnHighlights} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <Label htmlFor="showOnHighlights">Show on Highlights</Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Input id="shortDescription" name="shortDescription" defaultValue={event.shortDescription} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fullDescription">Full Description</Label>
                    <textarea
                        id="fullDescription"
                        name="fullDescription"
                        defaultValue={event.fullDescription}
                        required
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <SubmitButton />
            </form>
        </GlassCard >
    )
}
