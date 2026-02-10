"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { loginFacultyAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Loader2, Users } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
        </Button>
    )
}

export default function FacultyLoginPage() {
    const [state, formAction] = useActionState(loginFacultyAction, null)

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Faculty Login</h1>
                    <p className="text-sm text-muted-foreground">Access faculty dashboard and stats</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="facultyId">Faculty ID</Label>
                        <Input
                            id="facultyId"
                            name="facultyId"
                            placeholder="Enter your Faculty ID"
                            required
                            className="bg-black/20 border-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            className="bg-black/20 border-white/10"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </GlassCard>
        </div>
    )
}
