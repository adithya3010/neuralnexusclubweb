"use client"

import { useState } from "react"
import { useActionState } from "react"
import { createFacultyAction, deleteFacultyAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Trash2, Plus, Users } from "lucide-react"

interface Faculty {
    id: string
    facultyId: string
    name: string
    createdAt: Date
}

export function FacultyManager({ facultyList }: { facultyList: Faculty[] }) {
    const [createState, createAction] = useActionState(createFacultyAction, null)

    return (
        <div className="space-y-6">
            <GlassCard className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Faculty Management</h2>
                        <p className="text-sm text-muted-foreground">Create and manage faculty accounts.</p>
                    </div>
                </div>

                {/* Create Form */}
                <form action={createAction} className="mb-8 border-b border-white/10 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-3 space-y-2">
                            <Label htmlFor="facultyId">Faculty ID</Label>
                            <Input name="facultyId" placeholder="e.g. FAC001" required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="md:col-span-4 space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input name="name" placeholder="e.g. Dr. Smith" required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" type="text" placeholder="Password" required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="h-4 w-4 mr-2" /> Add
                            </Button>
                        </div>
                    </div>
                    {createState?.error && (
                        <p className="text-red-400 text-sm mt-4">{createState.error}</p>
                    )}
                </form>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Existing Faculty</h3>
                    <div className="grid gap-4">
                        {facultyList.map((faculty) => (
                            <FacultyItem key={faculty.id} faculty={faculty} />
                        ))}
                        {facultyList.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No faculty accounts created yet.</p>
                        )}
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}

function FacultyItem({ faculty }: { faculty: Faculty }) {
    const [deleteState, deleteAction] = useActionState(deleteFacultyAction, null)

    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
                <p className="font-medium text-white">{faculty.name}</p>
                <p className="text-sm text-muted-foreground">ID: {faculty.facultyId}</p>
            </div>
            <form action={deleteAction}>
                <input type="hidden" name="id" value={faculty.id} />
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
                {deleteState?.error && <span className="text-xs text-red-500 ml-2">{deleteState.error}</span>}
            </form>
        </div>
    )
}
