
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // DEBUG: Check headers and env vars
        console.log("Register API called");
        console.log("Env Check:", {
            hasSheetId: !!process.env.GOOGLE_SHEET_ID,
            hasServiceEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
            hasSmtpUser: !!process.env.SMTP_USER,
            hasSmtpPass: !!process.env.SMTP_PASS,
            smtpHost: process.env.SMTP_HOST
        });

        const { name, email, year, branch, reason } = body;

        // 1. Append to Google Sheet
        try {
            const serviceAccountAuth = new JWT({
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                scopes: [
                    'https://www.googleapis.com/auth/spreadsheets',
                ],
            });

            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);

            await doc.loadInfo(); // loads document properties and worksheets
            const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

            await sheet.addRow({
                Date: new Date().toISOString(),
                Name: name,
                Email: email,
                Year: year,
                Branch: branch,
                Reason: reason
            });
        } catch (error: any) {
            console.error("Sheet Error:", error);
            // We can choose to soft-fail or hard-fail. 
            // For debugging, let's return it so the user sees it.
            return NextResponse.json({ error: "Failed to update spreadsheet: " + error.message }, { status: 500 });
        }

        // 2. Send Email
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

            await transporter.sendMail({
                from: `"NeuroVerse Event Team" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Registration Confirmed - NeuroVerse Event",
                text: `Hello ${name},\n\nThank you for registering for the NeuroVerse Event!\n\nWe have received your application.\n\nDetails:\nYear: ${year}\nBranch: ${branch}\n\nStay tuned for more updates.\n\nBest Regards,\nNeuroVerse Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h1 style="color: #7c3aed;">Registration Confirmed!</h1>
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>Thank you for registering for the <strong>NeuroVerse Event</strong>.</p>
                        <p>We're excited to have you join us. Here are the details we received:</p>
                        <ul>
                            <li><strong>Year:</strong> ${year}</li>
                            <li><strong>Branch:</strong> ${branch}</li>
                        </ul>
                        <p>We will get back to you with the schedule and further instructions soon.</p>
                        <hr />
                        <p style="font-size: 12px; color: #666;">NeuroVerse Team | <a href="https://neuralnexus.club">neuralnexus.club</a></p>
                    </div>
                `,
            });
        } catch (error: any) {
            console.error("Email Error:", error);
            return NextResponse.json({ error: "Failed to send email: " + error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Registration successful" }, { status: 200 });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
