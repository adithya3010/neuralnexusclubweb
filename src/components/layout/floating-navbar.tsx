"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowRight } from "lucide-react"

const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "About Event", path: "/about" },
]

export function FloatingNavbar() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none"
            >
                <div
                    className={cn(
                        "pointer-events-auto transition-all duration-500 ease-in-out flex items-center justify-between rounded-full border border-white/10 backdrop-blur-md shadow-lg ring-1 ring-black/5",
                        scrolled ? "bg-black/60 w-[90%] md:w-[60%] py-2 px-4 shadow-black/20" : "bg-black/30 w-full md:w-[80%] py-4 px-8"
                    )}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group z-50">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-inner group-hover:scale-110 transition-transform">
                            NN
                        </div>
                        <span className={cn("font-bold tracking-tight transition-all duration-300", scrolled ? "text-lg" : "text-xl")}>
                            NeuroVerse
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={cn(
                                        "relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-white",
                                        isActive ? "text-white" : "text-muted-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-white/10 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* CTA & Mobile Toggle */}
                    <div className="flex items-center gap-2">


                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors pointer-events-auto"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ y: -300, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -300, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-20 left-4 right-4 bg-[#0a0a0a] border border-white/10 rounded-2xl z-50 p-4 shadow-2xl md:hidden overflow-hidden"
                        >
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item, i) => (
                                    <motion.div
                                        key={item.path}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "block p-4 rounded-xl text-lg font-medium transition-all active:scale-95",
                                                pathname === item.path ? "bg-white/10 text-white" : "hover:bg-white/5 text-muted-foreground hover:text-white"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                <div className="h-px bg-white/10 my-2" />

                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
