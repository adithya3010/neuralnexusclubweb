"use client"

import React from "react"
import { motion, Variants } from "framer-motion"

interface TextRevealProps {
    children: string
    className?: string
    delay?: number
}

export function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
    const letters = Array.from(children)

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: delay },
        }),
    }

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    }

    return (
        <motion.div
            className={className ? className + " inline-block" : "inline-block"}
            style={{ display: "inline-block" }}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index} className="inline-block">
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    )
}
