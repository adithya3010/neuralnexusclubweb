"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { createEventAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Event"}
        </Button>
    )
}

export default function CreateEventPage() {
    const [state, formAction] = useActionState(createEventAction, { error: "" })
    const [registrationType, setRegistrationType] = useState("website")

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/admin/dashboard" className="inline-flex items-center text-muted-foreground hover:text-white mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Event</h1>
            </div>

            <GlassCard className="max-w-2xl mx-auto p-8">
                <form action={formAction} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="image">Event Poster</Label>
                        <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
                        <p className="text-xs text-muted-foreground">Recommended ratio: 16:9. Max size: 5MB.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" name="title" placeholder="e.g. AI Workshop" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" name="time" placeholder="10:00 AM" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="venue">Venue</Label>
                            <Input id="venue" name="venue" placeholder="Main Hall" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select id="status" name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="teamSize">Team Size (Display)</Label>
                            <Input id="teamSize" name="teamSize" placeholder="1-3" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxTeamSize">Max Team Size (Number)</Label>
                            <Input id="maxTeamSize" name="maxTeamSize" type="number" min="1" placeholder="3" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="Technical">Technical</option>
                            <option value="Non-Technical">Non-Technical</option>
                            <option value="Hackathon">Hackathon</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>

                    <div className="space-y-4 border rounded-lg p-4 bg-white/5">
                        <div className="space-y-2">
                            <Label htmlFor="registrationType">Registration Type</Label>
                            <select
                                id="registrationType"
                                name="registrationType"
                                value={registrationType}
                                onChange={(e) => setRegistrationType(e.target.value as "website" | "google_form")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="website">Website Registration</option>
                                <option value="google_form">Google Form</option>
                            </select>
                        </div>

                        {registrationType === "google_form" && (
                            <div className="space-y-2">
                                <Label htmlFor="googleFormUrl">Google Form URL</Label>
                                <Input id="googleFormUrl" name="googleFormUrl" placeholder="https://forms.google.com/..." required />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="showOnHighlights" name="showOnHighlights" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <Label htmlFor="showOnHighlights">Show on Highlights</Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">Short Description</Label>
                        <Input id="shortDescription" name="shortDescription" placeholder="Brief summary..." required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullDescription">Full Description</Label>
                        <textarea
                            id="fullDescription"
                            name="fullDescription"
                            required
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-red-500">{state.error}</p>
                    )}

                    <SubmitButton />
                </form>
            </GlassCard>
        </div>
    )
}
