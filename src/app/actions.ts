"use server"

import { z } from "zod"
import { Resend } from "resend"

// Initialize Resend with a dummy key if not present (will fail gracefully or log)
const resend = new Resend(process.env.RESEND_API_KEY || "re_123")

const formSchema = z.object({
    // Team Lead / Individual Details
    leadName: z.string().min(2, "Name is required"),
    leadEmail: z.string().email("Invalid email address"),
    leadRoll: z.string().min(5, "Roll number is required"),
    leadPhone: z.string().min(10, "Phone number must be at least 10 digits"),
    leadBranch: z.string().min(2, "Branch is required"),
    leadYear: z.string().min(1, "Year is required"),

    // Team Details
    teamName: z.string().optional(),
    eventSlug: z.string(),

    // Members (Array of objects) - We'll parse this from JSON string or naming convention
    // For simplicity in FormData, we might receive member_1_name, member_1_roll, etc. 
    // Or we handle members in the action by iterating keys.
})

export type RegistrationState = {
    success?: boolean
    error?: string
    data?: {
        qrData: string
        name: string
        event: string
    }
}

export async function registerForEvent(prevState: RegistrationState, formData: FormData): Promise<RegistrationState> {
    // Extract static lead fields
    const rawData = {
        leadName: formData.get("leadName"),
        leadEmail: formData.get("leadEmail"),
        leadRoll: formData.get("leadRoll"),
        leadPhone: formData.get("leadPhone"),
        leadBranch: formData.get("leadBranch"),
        leadYear: formData.get("leadYear"),
        teamName: formData.get("teamName"),
        eventSlug: formData.get("eventSlug"),
    }

    const validatedFields = formSchema.safeParse(rawData)

    if (!validatedFields.success) {
        console.error(validatedFields.error)
        return { error: "Invalid lead details. Please check your inputs." }
    }

    const { leadName, leadEmail, leadRoll, leadPhone, leadBranch, leadYear, teamName, eventSlug } = validatedFields.data

    // Extract Members dynamically
    const members = []
    let memberIndex = 0
    while (formData.get(`member_${memberIndex}_name`)) {
        members.push({
            name: formData.get(`member_${memberIndex}_name`),
            roll: formData.get(`member_${memberIndex}_roll`),
            email: formData.get(`member_${memberIndex}_email`),
        })
        memberIndex++
    }

    try {
        // 1. Google Sheets Integration (Mocked Fetch)
        const submissionData = {
            timestamp: new Date().toISOString(),
            event: eventSlug,
            teamName: teamName || "N/A",
            lead: { name: leadName, email: leadEmail, roll: leadRoll, phone: leadPhone, branch: leadBranch, year: leadYear },
            members: members
        }

        console.log("Submitting to Google Sheets:", JSON.stringify(submissionData, null, 2))

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 2. Email Confirmation (Only to Team Lead)
        // if (process.env.RESEND_API_KEY) {
        //   await resend.emails.send({ to: leadEmail, ... })
        // }

        // 3. Generate Return Data (QR Content)
        const qrData = JSON.stringify({
            id: Math.random().toString(36).substr(2, 9),
            name: leadName,
            roll: leadRoll,
            event: eventSlug,
            team: teamName,
            timestamp: new Date().toISOString()
        })

        return {
            success: true,
            data: {
                qrData,
                name: leadName,
                event: eventSlug
            }
        }

    } catch (err) {
        console.error("Registration validation failed:", err)
        return { error: "Something went wrong. Please try again." }
    }
}
