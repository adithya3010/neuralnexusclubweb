"use client"

import { motion } from "framer-motion"
import { teamMembers } from "@/lib/data"
import { GlassCard } from "@/components/ui/glass-card"
import { Github, Linkedin } from "lucide-react"
import { SectionWrapper } from "@/components/ui/section-wrapper"

export default function TeamPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <SectionWrapper className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                    Meet The Team
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The minds behind Neural Nexus.
                </p>
            </SectionWrapper>

            <div className="grid md:grid-cols-4 gap-8">
                {teamMembers.map((member, i) => (
                    <SectionWrapper key={i} delay={i * 0.1} className="py-0">
                        <GlassCard hoverEffect className="overflow-hidden text-center group">
                            <div className="h-48 bg-gray-800/50 relative overflow-hidden">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60 z-10" />
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Photo
                                </div>
                            </div>
                            <div className="p-6 relative z-20 -mt-10">
                                <div className="h-20 w-20 mx-auto rounded-full bg-background border-2 border-primary mb-4 flex items-center justify-center overflow-hidden">
                                    {/* Circular avatar placeholder */}
                                    <span className="text-2xl font-bold text-primary">{member.name[0]}</span>
                                </div>
                                <h3 className="text-lg font-bold">{member.name}</h3>
                                <p className="text-sm text-secondary mb-4">{member.role}</p>
                                <div className="flex justify-center gap-4">
                                    <a href={member.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a href={member.github} className="text-muted-foreground hover:text-primary transition-colors">
                                        <Github className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </GlassCard>
                    </SectionWrapper>
                ))}
            </div>
        </div>
    )
}
