"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { CheckCircle } from "lucide-react"
import { useState } from "react"

export default function JoinPage() {
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            year: (document.getElementById('year') as HTMLInputElement).value,
            branch: (document.getElementById('branch') as HTMLInputElement).value,
            reason: (document.getElementById('why') as HTMLTextAreaElement).value,
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setSubmitted(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                const data = await res.json()
                alert(`Registration failed: ${data.error || 'Please try again.'}`)
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <GlassCard className="max-w-md w-full p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Application Sent!</h2>
                    <p className="text-muted-foreground mb-6">
                        Thanks for your interest in NeuroVerse. We&apos;ll review your application and get back to you soon.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">Back to Form</Button>
                </GlassCard>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-20">
            <SectionWrapper className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                    Register for NeuroVerse
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Secure your spot. We are looking for passionate individuals to participate in our challenges and workshops.
                </p>
            </SectionWrapper>

            <SectionWrapper delay={0.2} className="max-w-xl mx-auto py-0">
                <GlassCard className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" required placeholder="Alice Bob" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" required placeholder="alice@example.com" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Input id="year" required placeholder="2nd Year" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="branch">Branch</Label>
                                <Input id="branch" required placeholder="CSE / AIML" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="why">Why do you want to join?</Label>
                            <textarea
                                id="why"
                                required
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us about your interests and skills..."
                            />
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Complete Registration'}
                        </Button>
                    </form>
                </GlassCard>
            </SectionWrapper>
        </div>
    )
}
