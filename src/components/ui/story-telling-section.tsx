"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Brain, Code, Terminal, Trophy, Cpu, Gamepad2, Layers } from "lucide-react"
import ScrollStack, { ScrollStackItem } from "./scroll-stack"

interface ContentBlock {
    title: string
    description: string
    tags: string[]
    icon: any
    color: string
    textColor: string
    bigText: string
}

const content: ContentBlock[] = [
    {
        title: "Workshops & Learning",
        description: "We believe in learning by doing. Our hands-on workshops cover the spectrum of Artificial Intelligence, from foundational Machine Learning algorithms to cutting-edge Generative AI models. Whether you're a beginner writing your first line of Python or an advanced user fine-tuning LLMs, we have a session for you.",
        tags: ["Coding Workshops", "Math Problem Solving", "Guest Lectures", "Deep Learning"],
        icon: Brain,
        color: "bg-black",
        textColor: "text-white",
        bigText: "LEARNING"
    },
    {
        title: "Events & Games",
        description: "Learning shouldn't be boring. We host engaging tech fests and competitions that test your skills in fun, unconventional ways. From high-stakes math heists to logic puzzle marathons, prepare to be challenged.",
        tags: ["Math Heist", "Puzzle Competitions", "Team Challenges", "Tech Trivia"],
        icon: Gamepad2,
        color: "bg-[#A78BFA]",
        textColor: "text-white",
        bigText: "GAMING"
    },
    {
        title: "Projects & Hackathons",
        description: "Theory is just the start. We push you to build. Participate in 24-hour hackathons, collaborate on research projects, or present your own paper. We provide the mentorship and resources to turn your ideas into deployed applications.",
        tags: ["Hackathons", "Student Projects", "Research Papers", "Open Source"],
        icon: Code,
        color: "bg-black",
        textColor: "text-white",
        bigText: "BUILDING"
    }
]

export function StoryTellingSection() {
    return (
        <section className="relative w-full bg-background">
            <div className="relative z-10">
                {/* Intro Section - Scrolls away */}
                <div className="min-h-[50vh] flex flex-col justify-center items-center text-center py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                What Our
                            </span>
                            <span className="block text-white">
                                Event Offers
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                            Exploring the frontiers of AI through collaboration, competition, and creation.
                        </p>
                    </motion.div>
                </div>

                {/* Stacking Cards Container */}
                <ScrollStack useWindowScroll={true} itemStackDistance={0} stackPosition="0px" itemScale={0} baseScale={1}>
                    {content.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <ScrollStackItem
                                key={index}
                                itemClassName={`min-h-[90vh] md:h-screen w-full max-w-none ${item.color} flex flex-col justify-between p-6 md:p-12  overflow-hidden shadow-2xl`}
                            >
                                {/* Content Wrapper */}
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    {/* Top Section: Number & Description */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                        {/* Number */}
                                        <div className="md:col-span-2">
                                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center text-xl md:text-2xl font-mono ${item.textColor} border-current opacity-80`}>
                                                {index + 1}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-6">
                                            <p className={`text-lg md:text-2xl leading-relaxed font-medium ${item.textColor}`}>
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Icon/Visual (Right Side) */}
                                        <div className="md:col-span-4 flex justify-end items-start md:items-center">
                                            <Icon className={`w-24 h-24 md:w-48 md:h-48 opacity-20 ${item.textColor}`} />
                                        </div>
                                    </div>

                                    {/* Bottom Section: Big Text */}
                                    <div className="mt-auto pt-10">
                                        <h1 className={`text-[13vw] leading-[0.8] font-black tracking-tighter ${item.textColor} uppercase break-all`}>
                                            {item.bigText}
                                        </h1>
                                    </div>
                                </div>

                                {/* Abstract decorative elements based on card */}
                                <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-overlay">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/20 blur-[100px] rounded-full" />
                                </div>
                            </ScrollStackItem>
                        )
                    })}
                </ScrollStack>
            </div>
        </section>
    )
}
