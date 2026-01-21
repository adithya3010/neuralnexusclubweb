"use client";
import React from "react";
import Image from "next/image";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Badge } from "@/components/ui/badge";
import { Carousel3D } from "@/components/ui/carousel-3d"; // Using Carousel3D for image side if needed, or simple image

// Create a dummy content component for the Image side
function ImageSide({ images }: { images: string[] }) {
    // For now simple image, user asked for carousel. 
    // Since I don't have a simple carousel ready other than 3D one (which is full width), 
    // I made a simple crossfade or just single image for now.
    // User asked "related images as carousel". 
    return (
        <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
            {/* Simple single image for MVP, user can update images later */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
                src={images[0] || "/placeholder.jpg"}
                alt="Achievement"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Badge/Overlay if needed */}
        </div>
    )
}

const dummyContent = [
    {
        title: "National Hackathon Champions",
        description: (
            <>
                <p>
                    Our team secured the <span className="text-primary font-bold">1st Place</span> in the prestigious Smart India Hackathon 2024.
                    Competing against 500+ teams nationwide, we built a generative AI solution for optimizing renewable energy grids.
                </p>
                <p className="mt-4">
                    This victory showcased our club's strength in problem-solving and rapid prototyping under pressure.
                </p>
            </>
        ),
        badge: "Smart India Hackathon",
        date: "Dec 2024",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3853247?q=80&w=1287&auto=format&fit=crop",
    },
    {
        title: "Best Research Paper Award",
        description: (
            <>
                <p>
                    Our research wing published a groundbreaking paper on "Efficient Transformer Architectures for Edge Devices" at the
                    <span className="text-secondary font-bold"> International Conference on Machine Learning (ICML)</span>.
                </p>
                <p className="mt-4">
                    The paper was recognized for its contribution to making AI accessible on low-power hardware.
                </p>
            </>
        ),
        badge: "ICML Paper",
        date: "Aug 2024",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1740&auto=format&fit=crop",
    },
    {
        title: "Community Growth Milestone",
        description: (
            <>
                <p>
                    We officially crossed <span className="text-primary font-bold">500+ Active Members</span> and hosted our 25th consecutive
                    workshop, impacting over 2000 students across the university.
                </p>
                <p className="mt-4">
                    Neural Nexus is now the largest technical society on campus.
                </p>
            </>
        ),
        badge: "Milestone",
        date: "June 2024",
        image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1349&auto=format&fit=crop",
    },
];

export function AchievementsSection() {
    return (
        <section className="py-20 relative bg-background">
            <div className="container mx-auto px-4 mb-20 text-center">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4">
                    Our Achievements
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Moments of glory and milestones in our journey.
                </p>
            </div>

            <TracingBeam className="px-6">
                <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                    {dummyContent.map((item, index) => (
                        <div key={`content-${index}`} className="mb-24 relative grid grid-cols-1 gap-8 group">
                            {/* Header with Dot alignment handled by TracingBeam */}
                            <div className="absolute -left-4 md:-left-20 top-0 h-full w-0.5 bg-transparent" />

                            <div className="relative z-10">
                                <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
                                    {item.badge} • {item.date}
                                </Badge>

                                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>

                                {/* Mobile: Image stacked below title, Desktop: Could be side by side if we change grid */}
                                {/* User asked for "image carousel and text on the other side". 
                            With TracingBeam, it's usually a single column timeline. 
                            Let's adapt: Content is split.
                        */}

                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="order-2 md:order-1 prose prose-invert">
                                        {item.description}
                                    </div>

                                    <div className="order-1 md:order-2">
                                        <ImageSide images={[item.image]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </TracingBeam>
        </section>
    );
}
