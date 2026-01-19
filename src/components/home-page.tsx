"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Brain, Code, Terminal, Users, Cpu, Trophy, CalendarDays } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { Counter } from "@/components/ui/counter"
import { Event } from "@/lib/data"

const stats = [
    { label: "Members", value: 500, suffix: "+", icon: Users },
    { label: "Events Hosted", value: 25, suffix: "+", icon: Trophy },
    { label: "Workshops", value: 10, suffix: "+", icon: Terminal },
    { label: "Projects", value: 50, suffix: "+", icon: Cpu },
]

const features = [
    {
        title: "Hands-on Workshops",
        desc: "Learn current GenAI, ML, and Deep Learning technologies through interactive sessions.",
        icon: Brain,
    },
    {
        title: "Hackathons",
        desc: "Competitions to solve real-world problems with code and creativity.",
        icon: Code,
    },
    {
        title: "Project Development",
        desc: "Collaborate on innovative projects and build your portfolio.",
        icon: Terminal,
    },
]

import { NeuralNetwork3D } from "@/components/scene/neural-network-3d"
import { TextReveal } from "@/components/ui/text-reveal"
import { Carousel3D } from "@/components/ui/carousel-3d"
import { StoryTellingSection } from "@/components/ui/story-telling-section"

export function HomePage({ upcomingEvents }: { upcomingEvents: Event[] }) {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20">
                {/* 3D Background */}
                <NeuralNetwork3D />

                <div className="container mx-auto text-center z-10 space-y-8 relative pointer-events-none">
                    {/* Badge */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block pointer-events-auto"
                    >
                        <span className="py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary uppercase tracking-wider shadow-lg shadow-primary/10 backdrop-blur-sm">
                            The Future of AI is Here
                        </span>
                    </motion.div> */}

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter font-[family-name:var(--font-orbitron)]">
                        <span className="inline-block bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                            <TextReveal delay={0.2}>NEURO</TextReveal>
                        </span>
                        <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative ml-1">
                            <TextReveal delay={0.8}>VERSE</TextReveal>
                            {/* Glow behind text */}
                            <div className="absolute inset-0 bg-primary/20 blur-[50px] -z-10" />
                        </span>
                    </h1>

                    <div className="text-2xl md:text-3xl font-light text-muted-foreground block">
                        <TextReveal delay={1.5}>Premier AI/ML Event of CBIT</TextReveal>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
                        className="max-w-2xl mx-auto text-lg text-muted-foreground/80 leading-relaxed"
                    >
                        Join a community of innovators, builders, and dreamers. We explore the frontiers of Artificial Intelligence together.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 pointer-events-auto"
                    >
                        <Button size="lg" className="h-14 rounded-full px-10 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow bg-gradient-to-r from-primary to-secondary hover:scale-105" asChild>
                            <Link href="/events">
                                Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 rounded-full px-10 text-lg border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-primary/30 transition-all" asChild>
                            <Link href="/join">Register Now</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section with Animated Counters */}
            {/* <SectionWrapper className="container mx-auto px-4 py-20 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <GlassCard key={i} className="p-6 text-center flex flex-col items-center justify-center space-y-2 hover:bg-white/10 transition-colors">
                            <stat.icon className="h-8 w-8 text-primary mb-2" />
                            <h3 className="text-3xl md:text-4xl font-bold text-white">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </h3>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        </GlassCard>
                    ))}
                </div>
            </SectionWrapper> */}

            {/* Highlights / Upcoming Events (3D Carousel) */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 mb-10">
                    <h2 className="text-4xl font-bold mb-2">
                        <TextReveal>Highlights</TextReveal>
                    </h2>
                    <p className="text-muted-foreground">Upcoming events you don't want to miss.</p>
                </div>

                {/* Full Width Carousel */}
                <div className="w-full">
                    <Carousel3D events={upcomingEvents} />
                </div>
            </section>

            {/* Storytelling Section */}
            <StoryTellingSection />
        </div>
        // {/* CTA Section */}
        // {/* <SectionWrapper className="container mx-auto px-4 text-center mb-20 relative z-10">
        //     <GlassCard className="p-12 relative overflow-hidden group">
        //         <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        //         <div className="relative z-10">
        //             <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Shape the Future?</h2>
        //             <p className="text-muted-foreground max-w-xl mx-auto mb-8">
        //                 Join hundreds of other students in the journey to master AI.
        //                 Open to all branches and years.
        //             </p>
        //             <Button size="lg" className="rounded-full px-10 py-6 text-lg bg-white text-black hover:bg-white/90" asChild>
        //                 <Link href="/join">Register Now</Link>
        //             </Button>
        //         </div>
        //     </GlassCard>
        // </SectionWrapper> */}

    )
}
