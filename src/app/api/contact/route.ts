import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactRequest {
    name: string;
    email: string;
    message: string;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ContactRequest;

        const { name, email, message } = body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        const { error } = await resend.emails.send({
            from: "Mahsa Geramy <hello@mahsageramy.ir>",
            to: process.env.CONTACT_EMAIL!,
            replyTo: email,
            subject: `New message from ${name}`,
            html: `
                <h2>New Contact Message</h2>

                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>

                <h3>Message</h3>
                <p>${message}</p>
            `,
        });

        if (error) {
            console.error("Resend error:", error);

            return NextResponse.json(
                { error: "Failed to send email." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Email sent successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact API error:", error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}