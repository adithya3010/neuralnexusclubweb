"use client"

import { motion } from "framer-motion"

export function BackgroundGrid() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* Dark Gradient Background */}
            <div className="absolute inset-0 bg-background" />

            {/* Animated Gradient Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[120px] will-change-transform"
                style={{ transform: "translate3d(0,0,0)" }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -30, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-secondary/10 rounded-full blur-[150px] will-change-transform"
                style={{ transform: "translate3d(0,0,0)" }}
            />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)" }}
            />

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-[1]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        </div>
    )
}
