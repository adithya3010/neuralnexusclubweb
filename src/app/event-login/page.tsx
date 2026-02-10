"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { loginEvent } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Loader2 } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Access Dashboard"}
        </Button>
    )
}

export default function EventLoginPage() {
    const [state, formAction] = useActionState(loginEvent, { error: "" })
    const [events, setEvents] = useState<{ slug: string, title: string }[]>([])

    useEffect(() => {
        // Fetch events for the dropdown
        // Since this is a client component, we should probably fetch this data
        // For now, I'll fetch from an API route or server action if possible, 
        // to avoid exposing all data. But specific public event list is public anyway.

        async function fetchEvents() {
            try {
                const res = await fetch('/api/events-list'); // I need to create this or use a server action to get list
                if (res.ok) {
                    const data = await res.json()
                    setEvents(data)
                }
            } catch (e) {
                console.error("Failed to fetch events")
            }
        }
        fetchEvents()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="accent-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />

            <GlassCard className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Event Coordinator Login</h1>
                    <p className="text-muted-foreground">Access your event dashboard</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="slug">Select Event</Label>
                        <select
                            id="slug"
                            name="slug"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">-- Select Event --</option>
                            {events.map(event => (
                                <option key={event.slug} value={event.slug}>{event.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Event Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-red-500 text-center">{state.error}</p>
                    )}

                    <SubmitButton />
                </form>
            </GlassCard>
        </div>
    )
}
