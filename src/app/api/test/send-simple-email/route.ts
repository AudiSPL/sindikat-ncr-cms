import { sendMail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log("[SIMPLE-EMAIL] Testing plain email send (no attachments)");
    const to = req.nextUrl.searchParams.get("to") || "savinmilos@yahoo.com";

    const result = await sendMail({
      to,
      subject: "Test: Simple Email (No Attachments)",
      html: `
        <h2>Simple Email Test</h2>
        <p>This is a plain HTML email with NO attachments.</p>
        <p>If you receive this, Resend is working.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    });

    console.log("[SIMPLE-EMAIL] Result:", result);

    return NextResponse.json(
      {
        message: "Simple email test sent",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SIMPLE-EMAIL] Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}


