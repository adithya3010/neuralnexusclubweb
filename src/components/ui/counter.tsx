"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

interface CounterProps {
    value: number
    suffix?: string
    direction?: "up" | "down"
}

export function Counter({ value, suffix = "", direction = "up" }: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(direction === "down" ? value : 0)
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 100,
    })
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    useEffect(() => {
        if (isInView) {
            motionValue.set(direction === "down" ? 0 : value)
        }
    }, [isInView, motionValue, direction, value])

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(Math.round(latest)) + suffix
            }
        })
    }, [springValue, suffix])

    return <span ref={ref} />
}
