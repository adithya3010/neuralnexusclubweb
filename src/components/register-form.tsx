"use client"

import { useState, useEffect, useActionState, useRef, ChangeEvent } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { QRCodeSVG } from "qrcode.react"
import { Loader2, CheckCircle, Download, X, ChevronRight, ChevronLeft } from "lucide-react"

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
                downloadLink.download = `NeuroVerse-${state.data?.event}-Pass.png`
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
                        <Link href="/events">Back to Events</Link>
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
                                        <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="relative h-2 bg-secondary/30 rounded-full w-full -mt-8 -z-0 top-[-1.25rem]">
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
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold border-b border-white/10 pb-2">Payment Verification</h3>


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
                                        <br />
                                        <span className="text-yellow-500 font-medium">Note: Ensure 'payment-qr.png' exists in 'public/images/'.</span>
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
                                        />
                                        {!previewUrl && (
                                            <p className="text-xs text-muted-foreground">Upload a screenshot of your payment or relevant verify doc.</p>
                                        )}
                                    </div>
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

                        {state.error && (
                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {state.error}
                            </div>
                        )}

                        <div className="flex justify-between gap-4 pt-4">
                            {step > 1 ? (
                                <Button type="button" variant="outline" onClick={handleBack} className="w-1/3">
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                            ) : (
                                <div className="w-1/3"></div> /* Placeholder for spacing */
                            )}

                            {step < TOTAL_STEPS ? (
                                <Button type="button" onClick={handleNext} className="w-1/3">
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="w-1/2">
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
