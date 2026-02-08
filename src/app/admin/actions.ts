"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


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

// Helper to upload image to Cloudinary
async function uploadEventImage(imageFile: File, slug: string): Promise<string | null> {
    try {
        if (!imageFile || imageFile.size === 0) return null;

        const { v2: cloudinary } = await import("cloudinary")
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: "neural_nexus_events",
            public_id: `event_${slug}`,
            resource_type: "image"
        });

        return uploadResponse.secure_url;
    } catch (error) {
        console.error("Image upload failed:", error);
        return null;
    }
}

export async function updateEventAction(prevState: { error: string }, formData: FormData): Promise<{ error: string }> {
    const slug = formData.get("slug") as string

    if (!slug) return { error: "Event slug missing" }

    const updates: any = {
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
        showOnHighlights: formData.get("showOnHighlights") === "on",
        registrationType: formData.get("registrationType") as string,
        googleFormUrl: formData.get("googleFormUrl") as string,
    }

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
        const imageUrl = await uploadEventImage(imageFile, slug);
        if (imageUrl) {
            updates.image = imageUrl;
        }
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

    const imageFile = formData.get("image") as File | null;
    const uploadedImageUrl = imageFile ? await uploadEventImage(imageFile, slug) : null;

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
        image: uploadedImageUrl || "/images/events/placeholder.jpg",
        showOnHighlights: formData.get("showOnHighlights") === "on",
        registrationType: (formData.get("registrationType") as "website" | "google_form") || "website",
        googleFormUrl: (formData.get("googleFormUrl") as string) || "",
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

export async function markAttendanceAction(ticketId: string, attendanceStatus: string) {
    // 1. Verify Admin Session
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin_session")?.value === "true"

    if (!isAdmin) {
        return { error: "Unauthorized" }
    }

    try {
        // 2. Load Google Sheet
        const key = process.env.GOOGLE_PRIVATE_KEY || '';
        const cleanedKey = key.replace(/\\n/g, '\n').replace(/"/g, '');

        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: cleanedKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        // 3. Find Ticket Row
        const ticketRow = rows.find(row => row.get("Ticket ID") === ticketId);

        if (!ticketRow) {
            return { error: "Ticket not found" }
        }

        // 4. Update Attendance
        ticketRow.set("Attended", "Yes")
        ticketRow.set("Attended At", new Date().toLocaleString())
        ticketRow.set("Member Attendance", attendanceStatus)

        await ticketRow.save();

        revalidatePath(`/ticket/${ticketId}`)
        return { success: true }

    } catch (error) {
        console.error("Attendance Mark Error:", error)
        return { error: "Failed to update attendance." }
    }
}
