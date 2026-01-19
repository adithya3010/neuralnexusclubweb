"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { ArrowRight, Zap, Target, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20 pb-20 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 right-[-20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <SectionWrapper className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-6"
                    >
                        About Neural Nexus
                    </motion.h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        The official Artificial Intelligence and Machine Learning Club of CBIT. We are generating the future, one node at a time.
                    </p>
                </SectionWrapper>

                {/* Mission & Vision Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <SectionWrapper delay={0.1}>
                        <GlassCard hoverEffect className="p-8 h-full border-l-4 border-l-primary/50">
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To foster a collaborative environment where students can explore, learn, and innovate in the fields of AI and ML. We aim to bridge the gap between theoretical knowledge and practical application through workshops, hackathons, and real-world projects.
                            </p>
                        </GlassCard>
                    </SectionWrapper>

                    <SectionWrapper delay={0.2}>
                        <GlassCard hoverEffect className="p-8 h-full border-l-4 border-l-secondary/50">
                            <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                                <Zap className="h-6 w-6 text-secondary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To be a premier hub for AI enthusiasts, producing industry-ready professionals and researchers who contribute to the technological advancement of society. We envision a community where every student is empowered to build smart solutions.
                            </p>
                        </GlassCard>
                    </SectionWrapper>
                </div>

                {/* History / "Who We Are" */}
                <SectionWrapper className="mb-20">
                    <GlassCard className="p-10 md:p-14 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">A Legacy of Innovation</h2>
                                <p className="text-muted-foreground mb-4 leading-relaxed">
                                    Founded in 2023, Neural Nexus started as a small study group of AI enthusiasts. Today, we are one of the most active technical clubs at CBIT, organizing city-wide hackathons and expert sessions.
                                </p>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Our members have secured internships at top tech giants, published research papers, and won national-level coding competitions.
                                </p>
                                <Button className="rounded-full" asChild>
                                    <a href="/team">Meet the Team <ArrowRight className="ml-2 h-4 w-4" /></a>
                                </Button>
                            </div>
                            {/* Abstract Decorative Element */}
                            <div className="flex justify-center items-center">
                                <div className="relative w-full aspect-square max-w-[300px]">
                                    <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-4 border border-secondary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                    <div className="absolute inset-8 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Users className="h-16 w-16 text-white/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </SectionWrapper>
            </div>
        </div>
    )
}
