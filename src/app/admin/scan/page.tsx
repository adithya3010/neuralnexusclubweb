"use client"

import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminScanPage() {
    const router = useRouter()
    const [scanResult, setScanResult] = useState<string | null>(null)

    useEffect(() => {
        // Initialize scanner only on client side
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                // Handle Success
                console.log(`Scan result: ${decodedText}`);
                scanner.clear();
                setScanResult(decodedText);

                // Redirect to verify page
                // The QR code contains JUST the ID now (e.g. "ABC123XYZ")
                // So we redirect to /ticket/ABC123XYZ
                router.push(`/ticket/${decodedText.trim()}`);
            },
            (errorMessage) => {
                // handle error (ignore mostly, as it errors on every frame it doesn't see a QR)
                // console.log(errorMessage); 
            }
        );

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        }
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-32 min-h-screen flex flex-col items-center">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <SectionWrapper className="relative z-10 w-full max-w-md">
                <GlassCard className="p-6 text-center">
                    <h1 className="text-2xl font-bold mb-6 text-primary">Admin Ticket Scanner</h1>

                    <div id="reader" className="overflow-hidden rounded-lg mb-6 bg-black" />

                    <p className="text-sm text-muted-foreground mb-4">
                        Point camera at a participant&apos;s QR code.
                    </p>

                    <Button variant="outline" asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </GlassCard>
            </SectionWrapper>
        </div>
    )
}
