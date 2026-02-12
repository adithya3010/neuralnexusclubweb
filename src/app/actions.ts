"use server"

import { z } from "zod"
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { google } from "googleapis";
import { Readable } from "stream";

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
    driveLink: z.string().optional(),
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
    try {
        const rawData = {
            leadName: formData.get("leadName"),
            leadEmail: formData.get("leadEmail"),
            leadRoll: formData.get("leadRoll"),
            leadPhone: formData.get("leadPhone"),
            leadBranch: formData.get("leadBranch"),
            leadYear: formData.get("leadYear"),
            teamName: formData.get("teamName"),
            eventSlug: formData.get("eventSlug"),
            utrId: formData.get("utrId"),
            driveLink: formData.get("driveLink"),
        }

        const validatedFields = formSchema.safeParse(rawData)

        if (!validatedFields.success) {
            console.error(validatedFields.error)
            return { error: "Invalid lead details. Please check your inputs." }
        }

        const { leadName, leadEmail, leadRoll, leadPhone, leadBranch, leadYear, teamName, eventSlug,driveLink} = validatedFields.data

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

        const screenshot = formData.get("screenshot") as File | null;
        let screenshotLink = "";

        if (screenshot && screenshot.size > 0) {
            try {
                /* 
                 * REPLACED GOOGLE DRIVE WITH CLOUDINARY
                 * Google Drive Service Accounts have 0 storage quota for personal drives.
                 * Cloudinary is a dedicated image hosting service that works perfectly here.
                 */
                const { v2: cloudinary } = await import("cloudinary")

                cloudinary.config({
                    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET
                })

                // Convert buffer to base64 for Cloudinary upload
                const buffer = Buffer.from(await screenshot.arrayBuffer());
                const base64Image = `data:${screenshot.type};base64,${buffer.toString('base64')}`;

                const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                    folder: "neural_nexus_payments",
                    public_id: `${leadName}_${eventSlug}_Payment`.replace(/\s+/g, '_'),
                    resource_type: "image"
                });

                screenshotLink = uploadResponse.secure_url;

            } catch (error: any) {
                console.error("Cloudinary Upload Error:", error);
                // Continue even if upload fails
            }
        }

        const ticketId = Math.random().toString(36).substr(2, 9).toUpperCase();

        // 1. Google Sheets Integration
        try {
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

            // Fetch event to calculate fee
            const event = await import("@/lib/store").then(m => m.eventStore.getBySlug(eventSlug));
            let amount = 0;
            if (event) {
                if (event.feeType === 'per_person') {
                    amount = (event.feeAmount || 0) * (members.length + 1); // +1 for lead
                } else if (event.feeType === 'fixed_team') {
                    amount = event.feeAmount || 0;
                } else if (event.feeType === 'tiered') {
                    // Tiered logic: simplistic assumption or need more complex logic?
                    // Usually tiered is per team size.
                    const teamSize = members.length + 1;
                    amount = (event.tieredPrices as any)?.[teamSize.toString()] || event.feeAmount || 0;
                }
            }

            // Check for headers and add if missing
            await sheet.loadHeaderRow().catch(async () => {
                await sheet.setHeaderRow([
                    "Ticket ID",
                    "Timestamp",
                    "Event",
                    "Team Name",
                    "Lead Name",
                    "Lead Email",
                    "Lead Roll",
                    "Lead Phone",
                    "Lead Branch",
                    "Lead Year",
                    "Members",
                    "Screenshot",
                    "UTR ID",
                    "Amount"
                ]);
            });

            // Flatten members for the sheet (just comma separated or first few)
            const membersString = members.map(m => `${m.name} (${m.roll})`).join(', ');

            await sheet.addRow({
                "Ticket ID": ticketId,
                Timestamp: new Date().toISOString(),
                Event: eventSlug,
                "Team Name": teamName || "Individual",
                "Lead Name": leadName,
                "Lead Email": leadEmail,
                "Lead Roll": leadRoll,
                "Lead Phone": leadPhone,
                "Lead Branch": leadBranch,
                "Lead Year": leadYear,
                Members: membersString,
                "Screenshot": screenshotLink,
                "UTR ID": (rawData.utrId as string) || '',
                "Amount": amount.toString()
            });
        } catch (error: any) {
            console.error("Sheet Error:", error);
            // Don't restart, just log. 
        }

        // 2. Email Confirmation
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            // QR Code Image URL (Public API)
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;

            await transporter.sendMail({
                from: `"NeuroVerse Event Team" <${process.env.SMTP_USER}>`,
                to: leadEmail as string,
                subject: `Registration Confirmed: ${eventSlug}`,
                text: `Hello ${leadName},\n\nYou have successfully registered for ${eventSlug}.\n\nYour Ticket ID: ${ticketId}\n\nPlease show the QR code attached for entry.\n\nNeuroVerse Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h1 style="color: #7c3aed;">Registration Confirmed!</h1>
                        <p>Hi <strong>${leadName}</strong>,</p>
                        <p>You have successfully registered for <strong>${eventSlug}</strong>.</p>
                        <p><strong>Ticket ID:</strong> ${ticketId}</p>
                        
                        <div style="margin: 20px 0;">
                            <p>Here is your Entry Ticket:</p>
                            <img src="${qrImageUrl}" alt="Ticket QR Code" style="border: 2px solid #eee; padding: 10px; border-radius: 8px;" />
                        </div>
                        
                        <hr />
                        <p>NeuroVerse Team</p>
                    </div>
                `,
            });
        } catch (error: any) {
            console.error("Email Error:", error);
            // Fail if email doesn't work? Maybe just log for now to key flow moving.
        }

        // Return only ticket ID for the frontend QR (so scanning it shows only ID)
        const qrData = ticketId;

        return {
            success: true,
            data: {
                qrData,
                name: leadName,
                event: eventSlug
            }
        }

    } catch (err) {
        console.error("Registration error:", err)
        return { error: "Something went wrong. Please try again." }
    }
}
