"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function login(prevState: any, formData: FormData) {
    const username = formData.get("username")
    const password = formData.get("password")

    // Hardcoded credentials for simplicity
    if (username === "admin" && password === "admin123") {
        // Set cookie valid for 1 day
        const cookieStore = await cookies()
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/"
        })
        redirect("/admin/dashboard")
    } else {
        return { error: "Invalid credentials" }
    }
}

export async function logout() {
    (await cookies()).delete("admin_session")
    redirect("/admin/login")
}

import { revalidatePath } from "next/cache"
import { eventStore } from "@/lib/store"

export async function updateEventAction(prevState: { error: string }, formData: FormData): Promise<{ error: string }> {
    const slug = formData.get("slug") as string

    if (!slug) return { error: "Event slug missing" }

    const updates = {
        title: formData.get("title") as string,
        date: formData.get("date") as string,
        time: formData.get("time") as string,
        venue: formData.get("venue") as string,
        category: formData.get("category") as any,
        status: formData.get("status") as any,
        shortDescription: formData.get("shortDescription") as string,
        fullDescription: formData.get("fullDescription") as string,
        teamSize: formData.get("teamSize") as string,
        maxTeamSize: parseInt(formData.get("maxTeamSize") as string) || 1,
    }

    try {
        await eventStore.update(slug, updates)

        revalidatePath("/admin/dashboard")
        revalidatePath("/events")
        revalidatePath(`/events/${slug}`)
        revalidatePath("/")
    } catch (error) {
        console.error("Update failed:", error)
        return { error: "Failed to update event." }
    }
    redirect("/admin/dashboard")
}

export async function createEventAction(prevState: any, formData: FormData): Promise<{ error: string }> {
    const title = formData.get("title") as string
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    if (await eventStore.getBySlug(slug)) {
        return { error: "Event with this title already exists." }
    }

    const newEvent = {
        slug,
        title,
        date: formData.get("date") as string,
        time: formData.get("time") as string,
        venue: formData.get("venue") as string,
        category: formData.get("category") as any,
        status: formData.get("status") as any,
        shortDescription: formData.get("shortDescription") as string,
        fullDescription: formData.get("fullDescription") as string,
        teamSize: formData.get("teamSize") as string,
        maxTeamSize: parseInt(formData.get("maxTeamSize") as string) || 1,
        image: "/images/events/placeholder.jpg", // Default placeholder
    }

    try {
        await eventStore.add(newEvent)

        revalidatePath("/admin/dashboard")
        revalidatePath("/events")
        revalidatePath("/")
    } catch (error) {
        console.error("Create failed:", error)
        return { error: "Failed to create event." }
    }
    redirect("/admin/dashboard")
}

export async function deleteEventAction(prevState: any, formData: FormData) {
    const slug = formData.get("slug") as string
    if (slug) {
        try {
            await eventStore.delete(slug)
            revalidatePath("/admin/dashboard")
            revalidatePath("/events")
            revalidatePath("/")
            return { error: "" }
        } catch (error) {
            console.error("Delete failed:", error)
            return { error: "Failed to delete event." }
        }
    }
    return { error: "Invalid request" }
}
