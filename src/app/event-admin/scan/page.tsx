"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Html5QrcodeScanner } from "html5-qrcode"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EventScannerPage() {
    const router = useRouter()
    const [scanResult, setScanResult] = useState<string | null>(null)

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear();
                setScanResult(decodedText);
                router.push(`/ticket/${decodedText.trim()}`);
            },
            (errorMessage) => {
                // handle error
            }
        );

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear scanner", error);
            });
        };
    }, [router]);

    return (
        <div className="min-h-screen p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-8 flex items-center">
                <Link href="/event-admin/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-4">Scan Ticket</h1>
            </div>

            <GlassCard className="w-full max-w-md p-6">
                {!scanResult ? (
                    <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Processing Ticket...</p>
                    </div>
                )}
            </GlassCard>
        </div>
    )
}
