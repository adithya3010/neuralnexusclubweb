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
    // ... (keep extraction logic)
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
            const buffer = Buffer.from(await screenshot.arrayBuffer());
            const stream = Readable.from(buffer);

            const auth = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                'http://localhost:3000/oauth2callback' // Not strictly used for server-side auth but required field
            );
            auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

            const drive = google.drive({ version: 'v3', auth });



            const response = await drive.files.create({
                requestBody: {
                    name: `${leadName}_${eventSlug}_Payment.png`, // Standardize name
                    parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : [],
                },
                media: {
                    mimeType: screenshot.type,
                    body: stream,
                },
                fields: 'id, webViewLink, webContentLink',
            });

            screenshotLink = response.data.webViewLink || response.data.webContentLink || "";
            // Optional: Make public
            /*
            await drive.permissions.create({
                fileId: response.data.id!,
                requestBody: { role: 'reader', type: 'anyone' },
            });
            */
        } catch (error) {
            console.error("Drive Upload Error:", error);
            // We continue even if upload fails, but log it.
        }
    }

    try {
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
                "Screenshot": screenshotLink
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
