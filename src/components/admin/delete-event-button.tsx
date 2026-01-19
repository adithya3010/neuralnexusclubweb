"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { deleteEventAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

function DeleteButton() {
    const { pending } = useFormStatus()
    return (
        <Button variant="ghost" size="sm" className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" type="submit" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
        </Button>
    )
}

export function DeleteEventButton({ slug }: { slug: string }) {
    const [state, formAction] = useActionState(deleteEventAction, { error: "" })

    return (
        <form action={formAction} className="inline-flex items-center gap-2">
            <input type="hidden" name="slug" value={slug} />
            <DeleteButton />
            {state?.error && (
                <span className="text-xs text-red-500 bg-red-950/50 px-2 py-1 rounded border border-red-500/20">
                    {state.error}
                </span>
            )}
        </form>
    )
}
