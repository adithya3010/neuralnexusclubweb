"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


import { SignJWT, jwtVerify } from 'jose';

// Secret key for JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'neural-nexus-secret-key-change-me');

import { revalidatePath } from "next/cache"
import { prisma, eventStore } from "@/lib/store"

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

// --- Event Admin Authentication ---

export async function loginEvent(prevState: any, formData: FormData) {
    const slug = formData.get("slug") as string;
    const password = formData.get("password") as string;

    if (!slug || !password) {
        return { error: "Please select an event and enter the password." };
    }

    try {
        const event = await eventStore.getBySlug(slug);

        if (!event) {
            return { error: "Event not found." };
        }

        // Check if password matches
        if ((event as any).password !== password) {
            return { error: "Invalid password for this event." };
        }

        // Generate JWT
        const alg = 'HS256';
        const jwt = await new SignJWT({ slug: event.slug, title: event.title })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set("event_token", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/"
        });

    } catch (error) {
        console.error("Event login error:", error);
        return { error: "Login failed. Please try again." };
    }

    redirect("/event-admin/dashboard");
}

export async function logoutEvent() {
    (await cookies()).delete("event_token");
    redirect("/event-login");
}

// Helper to verify event token
export async function verifyEventToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("event_token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { slug: string; title: string };
    } catch (error) {
        console.error("JWT Verification failed:", error);
        return null;
    }
}

// --- Faculty Authentication ---

export async function loginFacultyAction(prevState: any, formData: FormData) {
    const facultyId = formData.get("facultyId") as string
    const password = formData.get("password") as string

    if (!facultyId || !password) {
        return { error: "Please enter both Faculty ID and Password." }
    }

    try {
        const faculty = await (prisma as any).faculty.findUnique({
            where: { facultyId }
        })

        if (!faculty || faculty.password !== password) {
            return { error: "Invalid credentials." }
        }

        // Generate JWT
        const alg = 'HS256'
        const jwt = await new SignJWT({ facultyId: faculty.facultyId, name: faculty.name })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET)

        const cookieStore = await cookies()
        cookieStore.set("faculty_session", jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/"
        })

    } catch (error) {
        console.error("Faculty login error:", error)
        return { error: "Login failed." }
    }

    redirect("/faculty/dashboard")
}

export async function logoutFaculty() {
    (await cookies()).delete("faculty_session")
    redirect("/faculty-login")
}

export async function verifyFacultyToken() {
    const cookieStore = await cookies()
    const token = cookieStore.get("faculty_session")?.value

    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload as { facultyId: string; name: string }
    } catch (error) {
        return null
    }
}

// --- Faculty Management (Admin) ---

export async function createFacultyAction(prevState: any, formData: FormData) {
    // Verify Admin
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin_session")?.value === "true"
    if (!isAdmin) return { error: "Unauthorized" }

    const facultyId = formData.get("facultyId") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string

    if (!facultyId || !name || !password) {
        return { error: "All fields are required." }
    }

    try {
        await (prisma as any).faculty.create({
            data: { facultyId, name, password }
        })
        revalidatePath("/admin/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Create faculty failed:", error)
        return { error: "Failed to create faculty (ID might be taken)." }
    }
}

export async function deleteFacultyAction(prevState: any, formData: FormData) {
    // Verify Admin
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin_session")?.value === "true"
    if (!isAdmin) return { error: "Unauthorized" }

    const id = formData.get("id") as string
    if (!id) return { error: "ID missing" }

    try {
        await (prisma as any).faculty.delete({
            where: { id }
        })
        revalidatePath("/admin/dashboard")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete." }
    }
}

// --- End Faculty Management ---


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

    // Security Check: Admin or Event Owner
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin_session")?.value === "true"
    let isEventOwner = false

    if (!isAdmin) {
        const eventToken = cookieStore.get("event_token")?.value
        if (eventToken) {
            try {
                const { payload } = await jwtVerify(eventToken, JWT_SECRET)
                if ((payload as any).slug === slug) {
                    isEventOwner = true
                }
            } catch (e) { }
        }

        if (!isEventOwner) {
            return { error: "Unauthorized" }
        }
    }



    // --- Helper to parse coordinators ---
    const parseCoordinators = (formData: FormData, type: 'faculty' | 'student') => {
        const coordinators = [];
        let index = 0;
        while (true) {
            const nameKey = `${type}CoordinatorName_${index}`;
            const phoneKey = `${type}CoordinatorPhone_${index}`;
            const name = formData.get(nameKey) as string;
            const phone = formData.get(phoneKey) as string;

            if (name || phone) {
                coordinators.push({ name: name || "", phone: phone || "" });
            } else {
                // strict check: if both specific index fields are null/undefined, stop?
                // But form might send disjointed indices if we just append?
                // The current form implementation appends valid indices sequentially based on container length.
                // But if we want to be safe against holes, maybe search until a max?
                // Let's search up to 20 to be safe, or break if we find 5 empty slots in a row?
                // Simple approach: Check up to 20.
                if (index > 20) break;
            }
            index++;
        }
        // Filter out empty ones just in case
        return coordinators.filter(c => c.name.trim() !== "" || c.phone.trim() !== "");
    };

    const facultyCoordinators = parseCoordinators(formData, 'faculty');
    const studentCoordinators = parseCoordinators(formData, 'student');


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
        feeType: (formData.get("feeType") as "free" | "per_person" | "fixed_team" | "tiered") || "free",
        feeAmount: parseInt(formData.get("feeAmount") as string) || 0,
        // New Fields
        password: formData.get("password") as string,
        whatsappLink: formData.get("whatsappLink") as string,
        facultyCoordinators: facultyCoordinators,
        studentCoordinators: studentCoordinators,
        pptTemplate: formData.get("pptTemplate") as string,
    }

    // Handle Tiered Prices
    if (updates.feeType === 'tiered') {
        const tieredPrices: Record<string, number> = {};
        for (let i = 1; i <= 6; i++) {
            const price = formData.get(`tier_${i}`);
            if (price) {
                tieredPrices[i.toString()] = parseInt(price as string);
            }
        }
        updates.tieredPrices = tieredPrices;
    } else {
        updates.tieredPrices = {};
    }

    if (updates.registrationType === "google_form" && (!updates.googleFormUrl || !updates.googleFormUrl.trim())) {
        return { error: "Google Form URL is required for Google Form registration." }
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
    if (isAdmin) {
        redirect("/admin/dashboard")
    } else {
        redirect("/event-admin/dashboard")
    }
}

export async function createEventAction(prevState: any, formData: FormData): Promise<{ error: string }> {
    const title = formData.get("title") as string
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    if (await eventStore.getBySlug(slug)) {
        return { error: "Event with this title already exists." }
    }

    // --- Helper to parse coordinators ---
    const parseCoordinators = (formData: FormData, type: 'faculty' | 'student') => {
        const coordinators = [];
        let index = 0;
        // Search for up to 20 potential entries
        while (index < 20) {
            const nameKey = `${type}CoordinatorName_${index}`;
            const phoneKey = `${type}CoordinatorPhone_${index}`;
            const name = formData.get(nameKey) as string;
            const phone = formData.get(phoneKey) as string;

            if (name || phone) {
                coordinators.push({ name: name || "", phone: phone || "" });
            }
            index++;
        }
        return coordinators.filter(c => c.name.trim() !== "" || c.phone.trim() !== "");
    };

    const facultyCoordinators = parseCoordinators(formData, 'faculty');
    const studentCoordinators = parseCoordinators(formData, 'student');

    const registrationType = (formData.get("registrationType") as "website" | "google_form") || "website";
    const googleFormUrl = (formData.get("googleFormUrl") as string) || "";

    if (registrationType === "google_form" && (!googleFormUrl || !googleFormUrl.trim())) {
        return { error: "Google Form URL is required for Google Form registration." }
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
        feeType: (formData.get("feeType") as "free" | "per_person" | "fixed_team") || "free",
        feeAmount: parseInt(formData.get("feeAmount") as string) || 0,
        // New Fields
        password: formData.get("password") as string,
        whatsappLink: formData.get("whatsappLink") as string,
        facultyCoordinators: facultyCoordinators,
        studentCoordinators: studentCoordinators,
        pptTemplate: formData.get("pptTemplate") as string,
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
    // 1. Verify Admin Session OR Event Session
    // We need to check if EITHER admin_session is true OR event_token is valid for this ticket's event
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get("admin_session")?.value === "true"

    // Check Event Token
    const eventToken = cookieStore.get("event_token")?.value;
    let eventSlug = null;
    if (eventToken) {
        try {
            const { payload } = await jwtVerify(eventToken, JWT_SECRET);
            eventSlug = (payload as any).slug;
        } catch (e) { /* ignore invalid token */ }
    }

    if (!isAdmin && !eventSlug) {
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

        // 4. Verify Event ownership if not Super Admin
        if (!isAdmin && eventSlug) {
            const ticketEventSlug = ticketRow.get("Event"); // This might be Title, need to match with logic
            // Assuming Ticket Sheet "Event" column stores the TITLE.
            // We have eventSlug from token.
            // We need to check if ticketRow.get("Event") matches the title of eventSlug
            // OR simpler: Fetch event by slug and compare titles.

            // Optimzation: We can't easily get event title from just slug without DB query.
            // But the JWT payload has 'title'.
            // Let's rely on that.

            // Wait, the ticket sheet usually stores the Event Title (e.g. "Paper Presentation").
            // We should check if that matches.

            // Ideally we should store slug in sheet, but modifying sheet structure adheres to "Event" column.
            // Let's fetch event from store to be safe.
            const event = await eventStore.getBySlug(eventSlug);
            if (!event || ticketRow.get("Event") !== event.title) {
                return { error: `Invalid Event: You are scanning a ticket for "${ticketRow.get("Event")}"` }
            }
        }

        // 5. Update Attendance
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
