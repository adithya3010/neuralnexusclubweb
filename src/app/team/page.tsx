"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Github, Linkedin, User } from "lucide-react"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

// Type definitions
type TeamMember = {
    name: string
    role: string
    linkedin?: string
    github?: string
}

type TeamSection = {
    title: string
    members: TeamMember[]
}

// Data
const coreCommittee: TeamMember[] = [
    { role: "President", name: "RamiReddy" },
    { role: "Vice President", name: "Karthik" },
    { role: "Vice President", name: "ShehBaz Singh" },
    { role: "General Secretary", name: "Makam Devansh" },
    { role: "Joint Secretary", name: "Y.S.SUPREETH" },
    { role: "Joint Secretary", name: "Pavani" },
    { role: "Treasurer", name: "Sahith Rao" },
    { role: "Joint Treasurer", name: "Vaishnavi Nandamuri" },
]

const technicalTeams = [
    {
        title: "Research Team",
        heads: [
            { name: "Abhivandan", role: "Head" },
            { name: "Saketh", role: "Head" },
        ],
        deputies: [
            { name: "Preethi", role: "Deputy" },
            { name: "Sravya", role: "Deputy" },
            { name: "Saarthak", role: "Deputy" },
            { name: "Sanjana", role: "Deputy" },
        ]
    },
    {
        title: "Machine Learning Team",
        heads: [
            { name: "Badrinath", role: "Head" },
            { name: "Sai Chaitanya", role: "Head" },
        ],
        deputies: [
            { name: "Sakshi Joshi", role: "Deputy" },
            { name: "Raghav", role: "Deputy" },
            { name: "Apeksha", role: "Deputy" },
            { name: "Anaz Mizra", role: "Deputy" },
        ]
    },
    {
        title: "Web Development Team",
        heads: [
            { name: "Sathvik Reddy", role: "Head" },
            { name: "Omkar", role: "Head" },
        ],
        deputies: [
            { name: "Adithya", role: "Deputy" },
            { name: "Shreya", role: "Deputy" },
            { name: "Siri Reddy", role: "Deputy" },
            { name: "Harsha Vardhan", role: "Deputy" },
        ]
    }
]

// Components
function MemberCard({ member, className = "" }: { member: TeamMember, className?: string }) {
    return (
        <GlassCard hoverEffect className={`w-[280px] h-[350px] flex-shrink-0 overflow-hidden text-center group flex flex-col ${className}`}>
            <div className="h-40 bg-white/5 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80 z-10" />
                {/* No alphabet, just user icon or maybe empty if desired, keeping user icon for placeholder */}
                <User className="h-20 w-20 text-muted-foreground/20 group-hover:text-primary/50 transition-colors duration-500 scale-100 group-hover:scale-110 transform" />
            </div>

            <div className="p-6 relative z-20 flex-grow flex flex-col justify-center -mt-10">
                <h3 className="text-xl font-bold truncate px-2 text-white" title={member.name}>{member.name}</h3>
                <p className="text-sm font-medium text-primary/80 mb-6">{member.role}</p>

                <div className="flex justify-center gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                    <a href="#" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                </div>
            </div>
        </GlassCard>
    )
}

export default function TeamPage() {
    return (
        <div className="min-h-screen pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <div className="pt-24 pb-12 px-4 text-center bg-gradient-to-b from-primary/10 to-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent mb-6">
                        The Core Team
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        The minds and hands building NeuroVerse.
                    </p>
                </motion.div>
            </div>

            <div className="space-y-24 pb-20">
                {/* Core Committee */}
                <SectionWrapper className="max-w-full px-0">
                    <div className="container mx-auto px-4 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" />
                            <h2 className="text-3xl font-bold text-center">Core Committee</h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" />
                        </div>
                    </div>

                    <InfiniteMovingCards direction="left" speed="slow">
                        {coreCommittee.map((member, i) => (
                            <MemberCard key={i} member={member} className="border-primary/20 bg-primary/5" />
                        ))}
                    </InfiniteMovingCards>
                </SectionWrapper>

                {/* Technical Teams */}
                <div className="space-y-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                            Technical Teams
                        </h2>
                    </div>

                    {technicalTeams.map((team, tIdx) => (
                        <div key={tIdx} className="space-y-8">
                            <div className="container mx-auto px-4 border-l-4 border-primary ml-4 md:ml-10 py-2">
                                <h3 className="text-2xl font-bold">{team.title}</h3>
                            </div>

                            {/* Combined Heads and Deputies in one seamless flow? Or separate? 
                                User asked for "infinite carousel separately for all sections". 
                                The prompt implies sections like "Core", "Research", "ML". 
                                Inside a team, heads and deputies are hierarchy. 
                                Putting them in one carousel might mix hierarchy. 
                                But splitting them into two carousels per team might be too much.
                                Let's combine them but style Heads distinctively OR just put Heads first.
                            */}

                            <InfiniteMovingCards direction={tIdx % 2 === 0 ? "left" : "right"} speed="slow">
                                {[...team.heads, ...team.deputies].map((member, mIdx) => (
                                    <MemberCard
                                        key={mIdx}
                                        member={member}
                                        // Highlight heads slightly differently if needed, generic card looks good for uniformity in carousel
                                        className={member.role.includes("Head") ? "border-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.1)]" : ""}
                                    />
                                ))}
                            </InfiniteMovingCards>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
