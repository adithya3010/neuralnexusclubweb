"use client"

import { useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Users, ArrowRight } from "lucide-react"
import { Event } from "@/lib/data"

export function Carousel3D({ events }: { events: Event[] }) {
    // Duplicate events to create seamless loop
    const extendedEvents = [...events, ...events, ...events, ...events]

    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    // Auto scroll logic can be done with CSS or Framer Motion. 
    // Framer Motion gives us more control over pause state.

    return (
        <div
            className="w-full overflow-hidden py-10 relative group/carousel"
            ref={containerRef}
        >
            {/* Gradient Masks for fading edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div
                className="flex gap-8 px-4 w-max animate-marquee group-hover/carousel:[animation-play-state:paused]"
                ref={contentRef}
            >
                {extendedEvents.map((event, index) => (
                    <CarouselCard key={`${event.slug}-${index}`} event={event} />
                ))}
            </div>
        </div>
    )
}

// Re-write using CSS animation for deeper control over play-state
function CarouselCard({ event }: { event: Event }) {
    return (
        <div className="min-w-[300px] md:min-w-[400px] h-[500px] relative transition-transform duration-500">
            <GlassCard className="h-full flex flex-col overflow-hidden relative group border-white/10 bg-black/40 backdrop-blur-xl">
                {/* Holographic Border overlay */}
                <div className="absolute inset-0 border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-transparent to-secondary/50 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500" />

                {/* Image Area with "Scanner" effect */}
                <div className="h-52 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden group-hover:shadow-[inset_0_0_20px_rgba(157,134,255,0.3)] transition-all">
                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                    {/* Floating Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 text-[10px] font-mono tracking-widest text-primary border border-primary/30 bg-primary/10 rounded-sm uppercase">
                            {event.category}
                        </span>
                    </div>

                    {/* Animated Scan Line */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out" />
                </div>

                <div className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                            {event.title}
                        </h3>
                    </div>

                    <p className="text-secondary text-sm mb-6 line-clamp-3 leading-relaxed font-light border-l-2 border-white/10 pl-4">
                        {event.shortDescription}
                    </p>

                    {/* Tech Specs Grid */}
                    <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden mb-6 mt-auto">
                        <div className="bg-black/50 p-3 flex flex-col items-center justify-center group-hover:bg-primary/5 transition-colors">
                            <Calendar className="h-4 w-4 text-muted-foreground mb-1 group-hover:text-primary transition-colors" />
                            <span className="text-xs font-mono text-white/80">{event.date}</span>
                        </div>
                        <div className="bg-black/50 p-3 flex flex-col items-center justify-center group-hover:bg-secondary/5 transition-colors">
                            <Users className="h-4 w-4 text-muted-foreground mb-1 group-hover:text-secondary transition-colors" />
                            <span className="text-xs font-mono text-white/80">Team: {event.teamSize}</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary hover:text-white transition-all duration-300 group/btn" asChild>
                        <Link href={`/events/${event.slug}`}>
                            <span className="font-mono mr-2">[ACCESS]</span> Register Now
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </GlassCard>
        </div>
    )
}
