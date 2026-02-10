import { notFound } from "next/navigation"
import Link from "next/link"
import { eventStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"


export const revalidate = 60

export async function generateStaticParams() {
    const events = await eventStore.getAll()
    return events.map((event) => ({
        slug: event.slug,
    }))
}


import { Event } from "@/lib/data"

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const event = await eventStore.getBySlug(slug) as unknown as Event

    if (!event) {
        notFound()
    }


    return (
        <div className="min-h-screen py-20 px-4 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto max-w-4xl relative z-10">
                <Link href="/events" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                </Link>

                {/* Event Banner Image */}
                {event.image && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-white/10 group">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                )}

                <div className="space-y-8">
                    <div className="space-y-4">
                        <span className="text-secondary font-medium tracking-wide uppercase text-sm">{event.category}</span>
                        <h1 className="text-4xl md:text-6xl font-bold">{event.title}</h1>
                        <p className="text-xl text-muted-foreground">{event.shortDescription}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <GlassCard className="p-8 space-y-6">
                                <h2 className="text-2xl font-bold mb-4">About the Event</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {event.fullDescription}
                                </p>
                            </GlassCard>

                            {/* Coordinator Details */}
                            {(event.facultyCoordinatorName || event.studentCoordinatorName) && (
                                <GlassCard className="p-8 space-y-6">
                                    <h2 className="text-2xl font-bold mb-4">Coordinators</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {event.facultyCoordinatorName && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-primary">Faculty Coordinator</h3>
                                                <div className="bg-white/5 p-4 rounded-lg">
                                                    <p className="font-medium">{event.facultyCoordinatorName}</p>
                                                    {event.facultyCoordinatorPhone && (
                                                        <p className="text-sm text-muted-foreground">{event.facultyCoordinatorPhone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {event.studentCoordinatorName && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-primary">Student Coordinator</h3>
                                                <div className="bg-white/5 p-4 rounded-lg">
                                                    <p className="font-medium">{event.studentCoordinatorName}</p>
                                                    {event.studentCoordinatorPhone && (
                                                        <p className="text-sm text-muted-foreground">{event.studentCoordinatorPhone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </GlassCard>
                            )}
                        </div>

                        <div className="space-y-6">
                            <GlassCard className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="h-4 w-4 text-primary" />
                                        <span>Team Size: {event.teamSize}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="h-4 w-4 flex items-center justify-center font-bold text-primary mt-0.5">₹</div>
                                        <div className="flex flex-col gap-1">
                                            {event.feeType === 'free' ? (
                                                <span>Free Registration</span>
                                            ) : event.feeType === 'per_person' ? (
                                                <span>₹{event.feeAmount} / Person</span>
                                            ) : event.feeType === 'fixed_team' ? (
                                                <span>₹{event.feeAmount} / Team</span>
                                            ) : event.feeType === 'tiered' && event.tieredPrices ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-primary">Tiered Pricing:</span>
                                                    {Object.entries(event.tieredPrices)
                                                        .sort(([a], [b]) => Number(a) - Number(b))
                                                        .map(([size, price]) => (
                                                            <div key={size} className="flex items-center gap-2 text-muted-foreground">
                                                                <span className="w-16">Size {size}:</span>
                                                                <span className="text-white">₹{price}</span>
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : (
                                                <span>Price details unavailable</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    {event.status === "Open" ? (
                                        <Button size="lg" className="w-full" asChild>
                                            {event.registrationType === 'google_form' && event.googleFormUrl ? (
                                                <a href={event.googleFormUrl} target="_blank" rel="noopener noreferrer">
                                                    Register via Google Form
                                                </a>
                                            ) : (
                                                <Link href={`/register?event=${event.slug}`}>
                                                    Register Now
                                                </Link>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button size="lg" disabled className="w-full">
                                            Registration Closed
                                        </Button>
                                    )}
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
