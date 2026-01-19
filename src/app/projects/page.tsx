"use client"

import { projects } from "@/lib/data"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { ArrowUpRight } from "lucide-react"

export default function ProjectsPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <SectionWrapper className="mb-16">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                    Our Projects
                </h1>
                <p className="text-muted-foreground text-lg">
                    Innovations built by our event participants.
                </p>
            </SectionWrapper>

            <div className="grid md:grid-cols-3 gap-8">
                {projects.map((project, i) => (
                    <SectionWrapper key={i} delay={i * 0.1} className="py-0">
                        <GlassCard hoverEffect className="p-8 h-full flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                                    <a href={project.link} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </a>
                                </div>
                                <p className="text-muted-foreground mb-6">
                                    {project.description}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map(t => (
                                    <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>
                    </SectionWrapper>
                ))}
            </div>
        </div>
    )
}
