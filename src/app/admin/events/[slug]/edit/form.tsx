"use client"

import { useActionState, useState } from "react"
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
    const [registrationType, setRegistrationType] = useState<"website" | "google_form">(event.registrationType as "website" | "google_form" || "website")
    const [feeType, setFeeType] = useState<"free" | "per_person" | "fixed_team" | "tiered">((event.feeType as any) || "free")

    return (
        <GlassCard className="max-w-2xl mx-auto p-8">
            <form action={formAction} className="space-y-6">
                <input type="hidden" name="slug" value={event.slug} />

                <div className="space-y-2">
                    <Label htmlFor="image">Event Poster</Label>
                    <div className="flex items-center gap-4">
                        {event.image && (
                            <img src={event.image} alt="Current Poster" className="h-20 w-32 object-cover rounded-md border border-white/10" />
                        )}
                        <div className="flex-1">
                            <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
                            <p className="text-xs text-muted-foreground mt-1">Upload to replace current poster. Max 5MB.</p>
                        </div>
                    </div>
                </div>

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
                        <Label htmlFor="teamSize">Team Size (Display)</Label>
                        <Input id="teamSize" name="teamSize" defaultValue={event.teamSize} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="maxTeamSize">Max Team Size (Number)</Label>
                        <Input id="maxTeamSize" name="maxTeamSize" type="number" min="1" defaultValue={event.maxTeamSize} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select id="status" name="status" defaultValue={event.status} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
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
                            <Input id="googleFormUrl" name="googleFormUrl" defaultValue={event.googleFormUrl || ""} placeholder="https://forms.google.com/..." required />
                        </div>
                    )}
                </div>

                {/* Registration Fee Section */}
                <div className="space-y-4 border rounded-lg p-4 bg-white/5">
                    <div className="space-y-2">
                        <Label htmlFor="feeType">Registration Fee Type</Label>
                        <select
                            id="feeType"
                            name="feeType"
                            defaultValue={event.feeType || "free"}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={(e) => {
                                const amountInput = document.getElementById('feeAmount');
                                const tieredSection = document.getElementById('tiered-section');

                                if (e.target.value === 'free') {
                                    if (amountInput) {
                                        amountInput.setAttribute('disabled', 'true');
                                        (amountInput as HTMLInputElement).value = '0';
                                    }
                                    if (tieredSection) tieredSection.classList.add('hidden');
                                } else if (e.target.value === 'tiered') {
                                    if (amountInput) {
                                        amountInput.setAttribute('disabled', 'true');
                                        (amountInput as HTMLInputElement).value = '0';
                                    }
                                    if (tieredSection) tieredSection.classList.remove('hidden');
                                } else {
                                    if (amountInput) amountInput.removeAttribute('disabled');
                                    if (tieredSection) tieredSection.classList.add('hidden');
                                }
                                setFeeType(e.target.value as any);
                            }}
                        >
                            <option value="free">Free</option>
                            <option value="per_person">Per Person</option>
                            <option value="fixed_team">Fixed Team Price</option>
                            <option value="tiered">Tiered (Based on Team Size)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="feeAmount">Base Fee Amount (₹)</Label>
                        <Input
                            id="feeAmount"
                            name="feeAmount"
                            type="number"
                            min="0"
                            defaultValue={event.feeAmount || 0}
                            disabled={!event.feeType || event.feeType === 'free' || event.feeType === 'tiered'}
                            placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">Applies to Per Person & Fixed Team Price.</p>
                    </div>

                    {/* Tiered Pricing Inputs */}
                    <div id="tiered-section" className={`space-y-3 pt-2 ${feeType !== 'tiered' ? 'hidden' : ''}`}>
                        <Label className="text-secondary">Tiered Pricing (₹ per Team)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => {
                                const size = (i + 1).toString();
                                // @ts-ignore - tieredPrices type check
                                const price = event.tieredPrices?.[size] || '';
                                return (
                                    <div key={i} className="space-y-1">
                                        <Label htmlFor={`tier_${size}`} className="text-xs">Team of {size}</Label>
                                        <Input
                                            id={`tier_${size}`}
                                            name={`tier_${size}`}
                                            type="number"
                                            min="0"
                                            defaultValue={price}
                                            placeholder="₹"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground">Set price for each team size.</p>
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

                {/* Coordinator & Extras Section */}
                <div className="space-y-4 border rounded-lg p-4 bg-white/5">
                    <h3 className="text-lg font-semibold">Event Admin & details</h3>

                    <div className="space-y-2">
                        <Label htmlFor="password">Event Admin Password</Label>
                        <Input id="password" name="password" type="text" defaultValue={event.password || ""} placeholder="Password for event coordinator login" required />
                        <p className="text-xs text-muted-foreground">Used to log in to the Event Dashboard.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="whatsappLink">WhatsApp Group Link</Label>
                        <Input id="whatsappLink" name="whatsappLink" defaultValue={event.whatsappLink || ""} placeholder="https://chat.whatsapp.com/..." />
                    </div>

                    {/* Faculty Coordinators */}
                    <div className="space-y-3 pt-2">
                        <Label className="text-secondary">Faculty Coordinators</Label>
                        <div id="faculty-coordinators-container" className="space-y-2">
                            {(event.facultyCoordinators && event.facultyCoordinators.length > 0 ? event.facultyCoordinators : [{ name: "", phone: "" }]).map((coordinator, index) => (
                                <div key={index} className="grid md:grid-cols-2 gap-4">
                                    <Input name={`facultyCoordinatorName_${index}`} defaultValue={coordinator.name} placeholder="Name" />
                                    <Input name={`facultyCoordinatorPhone_${index}`} defaultValue={coordinator.phone} placeholder="Phone" />
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => {
                            const container = document.getElementById('faculty-coordinators-container');
                            if (container) {
                                const index = container.children.length;
                                const div = document.createElement('div');
                                div.className = "grid md:grid-cols-2 gap-4";
                                div.innerHTML = `
                                        <input type="text" name="facultyCoordinatorName_${index}" placeholder="Name" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <input type="text" name="facultyCoordinatorPhone_${index}" placeholder="Phone" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    `;
                                container.appendChild(div);
                            }
                        }}>
                            + Add Faculty Coordinator
                        </Button>
                    </div>

                    {/* Student Coordinators */}
                    <div className="space-y-3 pt-2">
                        <Label className="text-secondary">Student Coordinators</Label>
                        <div id="student-coordinators-container" className="space-y-2">
                            {(event.studentCoordinators && event.studentCoordinators.length > 0 ? event.studentCoordinators : [{ name: "", phone: "" }]).map((coordinator, index) => (
                                <div key={index} className="grid md:grid-cols-2 gap-4">
                                    <Input name={`studentCoordinatorName_${index}`} defaultValue={coordinator.name} placeholder="Name" />
                                    <Input name={`studentCoordinatorPhone_${index}`} defaultValue={coordinator.phone} placeholder="Phone" />
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => {
                            const container = document.getElementById('student-coordinators-container');
                            if (container) {
                                const index = container.children.length;
                                const div = document.createElement('div');
                                div.className = "grid md:grid-cols-2 gap-4";
                                div.innerHTML = `
                                        <input type="text" name="studentCoordinatorName_${index}" placeholder="Name" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <input type="text" name="studentCoordinatorPhone_${index}" placeholder="Phone" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    `;
                                container.appendChild(div);
                            }
                        }}>
                            + Add Student Coordinator
                        </Button>
                    </div>
                </div>

                <SubmitButton />
            </form>
        </GlassCard >
    )
}
