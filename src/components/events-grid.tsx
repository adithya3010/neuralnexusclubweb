"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, ArrowRight } from "lucide-react"
import { Event } from "@/lib/data"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function EventsGrid({ events }: { events: Event[] }) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {events.map((event) => (
                <motion.div key={event.slug} variants={item}>
                    <GlassCard className="h-full flex flex-col overflow-hidden relative group border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-primary/50">

                        {/* Status Indicator Line */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${event.status === 'Open' ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-red-500/50'}`} />

                        {/* Image Area */}
                        <div className="h-48 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden group-hover:shadow-[inset_0_0_20px_rgba(157,134,255,0.2)]">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-1 text-[10px] font-mono tracking-widest border rounded-sm uppercase ${event.status === 'Open'
                                    ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                    : 'border-red-500/30 text-red-400 bg-red-500/10'
                                    }`}>
                                    {event.status === 'Open' ? 'ACTIVE' : 'OFFLINE'}
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                    {"//"} {event.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-1 border-l-2 border-white/5 pl-3">
                                {event.shortDescription}
                            </p>

                            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-6 bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="h-3 w-px bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3" />
                                    <span>Team: {event.teamSize}</span>
                                </div>
                            </div>

                            <Button variant="default" className="w-full bg-white/5 hover:bg-primary hover:text-white border border-white/10 text-foreground transition-all duration-300 group/btn" asChild>
                                <Link href={`/events/${event.slug}`}>
                                    <span className="mr-2">Register Now</span>
                                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </GlassCard>
                </motion.div>
            ))}
        </motion.div>
    )
}
