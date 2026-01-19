"use client"

import { motion } from "framer-motion"
import { achievements } from "@/lib/data"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionWrapper } from "@/components/ui/section-wrapper"

export default function AchievementsPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <SectionWrapper className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                    Our Achievements
                </h1>
                <p className="text-muted-foreground text-lg">
                    Milestones in our journey of excellence.
                </p>
            </SectionWrapper>

            <div className="max-w-3xl mx-auto relative">
                {/* Vertical Line */}
                <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-white/10 -translate-x-[50%]" />

                {achievements.map((item, i) => (
                    <SectionWrapper key={i} className="mb-12 relative flex justify-between items-center w-full">
                        {/* Dot */}
                        <div className="absolute left-[50%] -translate-x-[50%] w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                        {/* Content (Alternating) */}
                        <div className={`w-[45%] ${i % 2 === 0 ? 'mr-auto text-right' : 'ml-auto text-left pl-8'} ${i % 2 === 0 ? 'pr-8' : ''}`}>
                            <GlassCard hoverEffect className={`p-6 inline-block w-full`}>
                                <span className="text-secondary font-bold text-xl mb-2 block">{item.year}</span>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.description}</p>
                            </GlassCard>
                        </div>
                    </SectionWrapper>
                ))}
            </div>
        </div>
    )
}
