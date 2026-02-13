"use client"

import { useState, useEffect, useActionState, useRef, ChangeEvent } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { QRCodeSVG } from "qrcode.react"
import { Loader2, CheckCircle, Download, X, ChevronRight, ChevronLeft } from "lucide-react"
import html2canvas from "html2canvas-pro"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { registerForEvent, RegistrationState } from "@/app/actions"
// REMOVED: import { events } from "@/lib/data" - We now accept event as prop
import { Event } from "@/lib/data"

const initialState: RegistrationState = {}
const TOTAL_STEPS = 3

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

interface RegisterFormProps {
    event: Event | null
    eventSlug: string | null
}

export function RegisterForm({ event, eventSlug }: RegisterFormProps) {
    const [state, formAction] = useActionState(registerForEvent, initialState)
    const [step, setStep] = useState(1)
    const [memberCount, setMemberCount] = useState(0)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const ticketRef = useRef<HTMLDivElement>(null)

    // Events that require Drive link
    const eventsRequiringDriveLink = [
        "paper-presentation",
        "project-expo",
        "poster-presentation"
    ]

    const showDriveLink =
        eventSlug ? eventsRequiringDriveLink.includes(eventSlug) : false
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleRemoveFile = () => {
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const validateStep = (currentStep: number) => {
        if (!formRef.current) return false

        // Get all inputs in the current step container
        const stepContainer = formRef.current.querySelector(`[data-step="${currentStep}"]`)
        if (!stepContainer) return true

        const inputs = stepContainer.querySelectorAll('input')
        let isValid = true

        // Check validity of each input
        for (const input of inputs) {
            if (!input.checkValidity()) {
                input.reportValidity()
                isValid = false
                break // Report first error and stop
            }
        }
        return isValid
    }

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, TOTAL_STEPS))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const downloadTicket = () => {
        if (ticketRef.current) {
            html2canvas(ticketRef.current, {
                backgroundColor: null, // Keep transparency if any
                scale: 2, // High resolution
            }).then(canvas => {
                const link = document.createElement("a")
                link.download = `NeuroVerse-${state.data?.event || "Event"}-Ticket.png`
                link.href = canvas.toDataURL("image/png")
                link.click()
            })
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

                    <p className="text-sm text-muted-foreground">
                        Please save this QR code. It will be used for entry.
                    </p>

                    {/* Hidden Ticket Template for Generation */}
                    <div className="fixed left-[-9999px] top-0">
                        <div
                            ref={ticketRef}
                            className="w-[400px] bg-zinc-950 text-white p-8 rounded-xl border border-white/20 relative overflow-hidden font-sans"
                            style={{ backgroundImage: "linear-gradient(to bottom right, #09090b, #18181b)" }}
                        >
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                {/* Header */}
                                <div className="space-y-1">
                                    <h2 className="text-xs uppercase tracking-[0.2em] text-primary font-bold">NeuroVerse</h2>
                                    <h1 className="text-2xl font-bold leading-tight">{event?.title || state.data.event}</h1>
                                </div>

                                {/* QR Code */}
                                <div className="bg-white p-3 rounded-lg shadow-lg">
                                    <QRCodeSVG
                                        value={state.data.qrData}
                                        size={180}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                </div>

                                {/* Details */}
                                <div className="w-full space-y-3 pt-2">
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-md">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider">Attendee</span>
                                        <span className="font-semibold text-sm truncate max-w-[180px]">{state.data.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-md">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider">Event Date</span>
                                        <span className="font-semibold text-sm">{event?.date || "Check Schedule"}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-md">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider">Venue</span>
                                        <span className="font-semibold text-sm">{event?.venue || "TBA"}</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <p className="text-[10px] text-gray-500">Present this ticket at the entry gate.</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-col gap-3 w-full">
                        <Button onClick={downloadTicket} variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" /> Download Ticket
                        </Button>

                        {event?.whatsappLink && (
                            <Button asChild variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white border-none">
                                <a href={event.whatsappLink} target="_blank" rel="noopener noreferrer">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="mr-2 h-4 w-4 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Join WhatsApp Group
                                </a>
                            </Button>
                        )}

                        <Button variant="ghost" className="w-full" asChild>
                            <Link href="/events">Back to Events</Link>
                        </Button>
                    </div>
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
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            {['Lead Details', 'Team Details', 'Payment'].map((label, index) => {
                                const stepNum = index + 1
                                const isActive = stepNum === step
                                const isCompleted = stepNum < step

                                return (
                                    <div key={label} className="flex flex-col items-center z-10">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'bg-primary border-primary text-primary-foreground' :
                                            isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                                'bg-background border-muted text-muted-foreground'
                                            }`}>
                                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : stepNum}
                                        </div>
                                        <span className={`text-[10px] md:text-xs mt-2 font-medium text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="relative h-2 bg-secondary/30 rounded-full w-full -mt-8 -z-0 top-[-1.25rem] md:top-[-1.5rem]">
                            <div
                                className="absolute h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <form ref={formRef} action={formAction} className="space-y-8">
                        <input type="hidden" name="eventSlug" value={eventSlug || "general-interest"} />
                        <input type="hidden" name="memberCount" value={memberCount} />

                        {/* Step 1: Team Lead Details */}
                        <div data-step="1" className={step === 1 ? "space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
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

                        {/* Step 2: Team Details & Members */}
                        <div data-step="2" className={step === 2 ? "space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
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
                                    {event && memberCount < (event.maxTeamSize - 1) && (
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
                        </div>

                        {/* Step 3: Payment Verification */}
                        <div data-step="3" className={step === 3 ? "space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
                            {showDriveLink && (
                                <div className="space-y-2">
                                    <Label htmlFor="driveLink">
                                        Abstract / Project Link
                                    </Label>
                                    <Input
                                        id="driveLink"
                                        name="driveLink"
                                        type="url"
                                        placeholder="https://..."
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Please provide a publicly accessible link (Google Drive, GitHub, etc.)
                                    </p>
                                </div>
                            )}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Payment Verification</h3>

                                {event && event.feeType !== 'free' ? (
                                    <>
                                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-2">
                                            <p className="text-sm text-muted-foreground">Payment Breakdown</p>
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Fee Type:</span>
                                                <span className="font-medium capitalize">{event.feeType?.replace('_', ' ')}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Fee Amount:</span>
                                                <span className="font-medium">₹{event.feeAmount}</span>
                                            </div>
                                            {event.feeType === 'per_person' && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span>Team Members:</span>
                                                    <span className="font-medium">{memberCount + 1} (Lead + {memberCount})</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-white/10 mt-2">
                                                <span>Total Amount:</span>
                                                <span>
                                                    ₹{event.feeType === 'per_person'
                                                        ? (event.feeAmount || 0) * (memberCount + 1)
                                                        : event.feeType === 'tiered'
                                                            ? (event.tieredPrices?.[(memberCount + 1).toString()] || 0)
                                                            : (event.feeAmount || 0)}
                                                </span>
                                            </div>
                                            {event.feeType === 'tiered' && (
                                                <p className="text-xs text-muted-foreground mt-1 text-right">
                                                    Applied price for Team Size of {memberCount + 1}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <Label>Scan to Pay</Label>
                                            <div className="border rounded-lg p-4 bg-white w-fit">
                                                <img
                                                    src="/images/qrcode.jpeg"
                                                    alt="Payment QR Code"
                                                    className="w-48 h-48 object-contain"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Scan this QR code with any UPI app to pay.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="utrId">UTR ID / Transaction ID</Label>
                                            <Input id="utrId" name="utrId" placeholder="e.g. 1234567890" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="screenshot">Payment Screenshot</Label>
                                            <div className="space-y-4">
                                                {previewUrl ? (
                                                    <div className="relative inline-block">
                                                        <div className="border border-white/20 rounded-lg overflow-hidden w-32 h-32 bg-black/20">
                                                            <img
                                                                src={previewUrl}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveFile}
                                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                                                            title="Remove image"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : null}

                                                <Input
                                                    ref={fileInputRef}
                                                    id="screenshot"
                                                    name="screenshot"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className={`cursor-pointer file:cursor-pointer file:text-primary file:font-semibold ${previewUrl ? 'hidden' : ''}`}
                                                    required
                                                />
                                                {!previewUrl && (
                                                    <p className="text-xs text-muted-foreground">Upload a screenshot of your payment or relevant verify doc.</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg text-center space-y-2">
                                        <div className="flex justify-center">
                                            <CheckCircle className="h-10 w-10 text-green-500" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-green-500">Free Registration</h4>
                                        <p className="text-sm text-muted-foreground">No payment is required for this event. Click below to complete your registration.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {state.error && (
                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {state.error}
                            </div>
                        )}

                        <div className="flex justify-between gap-4 pt-4">
                            {step > 1 ? (
                                <Button type="button" variant="outline" onClick={handleBack} className="w-full md:w-1/3">
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                            ) : (
                                <div className="hidden md:block w-1/3"></div> /* Placeholder for spacing */
                            )}

                            {step < TOTAL_STEPS ? (
                                <Button type="button" onClick={handleNext} className="w-full md:w-1/3 ml-auto">
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="w-full md:w-1/2 ml-auto">
                                    <SubmitButton />
                                </div>
                            )}
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    )
}
