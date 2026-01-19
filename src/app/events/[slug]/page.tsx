import { notFound } from "next/navigation"
import Link from "next/link"
import { eventStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react"

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const event = await eventStore.getBySlug(slug)

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

                            {/* Rules could go here */}
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
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    {event.status === "Open" ? (
                                        <Button size="lg" className="w-full" asChild>
                                            <Link href={`/register?event=${event.slug}`}>
                                                Register Now
                                            </Link>
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
