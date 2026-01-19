"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { achievements } from "@/lib/data"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionWrapper } from "@/components/ui/section-wrapper"

import { CyberGrid3D } from "@/components/scene/cyber-grid-3d"

export default function AchievementsPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80%", "end 50%"]
    })

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <div className="container mx-auto px-4 py-20 relative overflow-hidden min-h-screen">
            {/* Background Animation */}
            <CyberGrid3D />

            <SectionWrapper className="text-center mb-16 relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                    Our Achievements
                </h1>
                <p className="text-muted-foreground text-lg">
                    Milestones in our journey of excellence.
                </p>
            </SectionWrapper>

            <div ref={containerRef} className="max-w-3xl mx-auto relative">
                {/* Vertical Line - Background */}
                <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-white/10 -translate-x-[50%]" />

                {/* Vertical Line - Scroll Fill */}
                <motion.div
                    style={{ scaleY, transformOrigin: "top" }}
                    className="absolute left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary -translate-x-[50%]"
                />

                {achievements.map((item, i) => (
                    <SectionWrapper key={i} className="mb-12 relative flex justify-between items-center w-full">
                        {/* Dot */}
                        <div className="absolute left-[50%] -translate-x-[50%] w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                        {/* Content (Alternating) */}
                        <div className={`w-[45%] ${i % 2 === 0 ? 'mr-auto text-right' : 'ml-auto text-left pl-8'} ${i % 2 === 0 ? 'pr-8' : ''}`}>
                            <GlassCard hoverEffect className={`p-6 inline-block w-full text-left`}>
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
