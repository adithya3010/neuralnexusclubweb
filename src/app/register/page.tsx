"use client"

import { useState, useEffect, useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { useFormStatus } from "react-dom"
import { QRCodeSVG } from "qrcode.react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { registerForEvent, RegistrationState } from "@/app/actions"
import { events } from "@/lib/data"

const initialState: RegistrationState = {}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full h-12 text-lg">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                </>
            ) : (
                "Complete Registration"
            )}
        </Button>
    )
}

import { Suspense } from "react"
// ... imports

// Move existing RegisterPage logic here
function RegisterContent() {
    const searchParams = useSearchParams()
    const eventSlug = searchParams.get("event")
    const [state, formAction] = useActionState(registerForEvent, initialState)
    const [memberCount, setMemberCount] = useState(0)

    // ... existing logic ...
    const event = events.find(e => e.slug === eventSlug)

    const downloadQR = () => {
        const svg = document.getElementById("event-qr")
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            const img = new Image()
            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height
                ctx?.drawImage(img, 0, 0)
                const pngFile = canvas.toDataURL("image/png")
                const downloadLink = document.createElement("a")
                downloadLink.download = `NeuralNexus-${state.data?.event}-Pass.png`
                downloadLink.href = pngFile
                downloadLink.click()
            }
            img.src = "data:image/svg+xml;base64," + btoa(svgData)
        }
    }

    // Effect to scroll to top on success
    useEffect(() => {
        if (state.success) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [state.success])

    if (state.success && state.data) {
        return (
            <div className="min-h-screen py-20 px-4 flex items-center justify-center">
                <GlassCard className="max-w-md w-full p-8 text-center space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Registration Successful!
                    </h1>
                    <p className="text-muted-foreground">
                        Team Lead <span className="text-white font-medium">{state.data.name}</span> is registered for <span className="text-white font-medium">{event?.title || state.data.event}</span>.
                    </p>
                    <p className="text-xs text-muted-foreground">Verification sent to registered email.</p>

                    <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4">
                        <QRCodeSVG
                            id="event-qr"
                            value={state.data.qrData}
                            size={200}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">
                        Please save this QR code. It will be used for entry.
                    </p>

                    <Button onClick={downloadQR} variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download Event Pass
                    </Button>

                    <Button variant="ghost" className="w-full" asChild>
                        <a href="/events">Back to Events</a>
                    </Button>
                </GlassCard>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-20 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Event Registration</h1>
                    {event && <p className="text-primary text-xl font-medium">{event.title}</p>}
                    {!event && <p className="text-muted-foreground">Join our upcoming activities</p>}
                </div>

                <GlassCard className="p-8">
                    <form action={formAction} className="space-y-8">
                        <input type="hidden" name="eventSlug" value={eventSlug || "general-interest"} />
                        <input type="hidden" name="memberCount" value={memberCount} />

                        {/* Team Lead Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Team Lead Details</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="leadName">Full Name</Label>
                                    <Input id="leadName" name="leadName" placeholder="Lead Name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="leadRoll">Roll Number</Label>
                                    <Input id="leadRoll" name="leadRoll" placeholder="1601..." required />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="leadEmail">Email Address</Label>
                                    <Input id="leadEmail" name="leadEmail" type="email" placeholder="lead@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="leadPhone">Phone Number</Label>
                                    <Input id="leadPhone" name="leadPhone" type="tel" placeholder="9876543210" required />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="leadBranch">Branch</Label>
                                    <Input id="leadBranch" name="leadBranch" placeholder="CSE/AIML..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="leadYear">Year</Label>
                                    <Input id="leadYear" name="leadYear" placeholder="2nd Year" required />
                                </div>
                            </div>
                        </div>

                        {/* Team Info */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Team Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="teamName">Team Name (Optional)</Label>
                                <Input id="teamName" name="teamName" placeholder="Neural Ninjas" />
                            </div>
                        </div>

                        {/* Team Members Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <h3 className="text-xl font-semibold">Team Members</h3>
                                {event && memberCount < (event.maxTeamSize - 2) && (
                                    <Button type="button" variant="outline" size="sm" onClick={() => setMemberCount(c => c + 1)}>
                                        + Add Member
                                    </Button>
                                )}
                            </div>

                            {memberCount === 0 && <p className="text-sm text-muted-foreground italic">No additional members added. Click above to add.</p>}

                            <div className="space-y-6">
                                {Array.from({ length: memberCount }).map((_, i) => (
                                    <div key={i} className="p-4 rounded-lg bg-white/5 space-y-4 relative group">
                                        <div className="absolute top-2 right-2">
                                            <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setMemberCount(c => c - 1)}>
                                                &times;
                                            </Button>
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">Member {i + 1}</p>
                                        <div className="grid md:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <Label htmlFor={`member_${i}_name`} className="text-xs">Name</Label>
                                                <Input id={`member_${i}_name`} name={`member_${i}_name`} placeholder="Name" required />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`member_${i}_roll`} className="text-xs">Roll No</Label>
                                                <Input id={`member_${i}_roll`} name={`member_${i}_roll`} placeholder="Roll No" required />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`member_${i}_email`} className="text-xs">Email</Label>
                                                <Input id={`member_${i}_email`} name={`member_${i}_email`} type="email" placeholder="Email" required />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {state.error && (
                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {state.error}
                            </div>
                        )}

                        <SubmitButton />
                    </form>
                </GlassCard>
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <RegisterContent />
        </Suspense>
    )
}
