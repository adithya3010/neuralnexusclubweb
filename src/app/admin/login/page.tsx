"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { login } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Lock, Loader2 } from "lucide-react" // Lock is still used in the component, so it must be kept.

function LoginButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
        </Button>
    )
}

// initialState is no longer needed as the initial state is passed directly to useActionState
// const initialState = {
//     error: ""
// }

export default function AdminLogin() { // Keeping AdminLogin as LoginPage was not explicitly requested for the entire file
    const [state, formAction] = useActionState(login, {
        error: "", // Changed from 'message' to 'error' to match original state usage
    })

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-sm p-8 space-y-6">
                <div className="text-center space-y-2">
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Access</h1>
                    <p className="text-sm text-muted-foreground">Enter credentials to continue</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" placeholder="admin" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-red-500 text-center">{state.error}</p>
                    )}

                    <LoginButton />
                </form>
            </GlassCard>
        </div>
    )
}
