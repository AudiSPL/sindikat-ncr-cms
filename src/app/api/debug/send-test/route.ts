import { sendMail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get("to");

  if (!to) {
    return NextResponse.json(
      { error: "Missing 'to' query parameter" },
      { status: 400 }
    );
  }

  try {
    await sendMail({
      to,
      subject: "🧪 Sindikat NCR - Test Email",
      html: `
        <h2>Test Email from Sindikat NCR</h2>
        <p>If you're reading this, email delivery is working! ✅</p>
        <p><small>Sent at: ${new Date().toISOString()}</small></p>
      `,
      bcc: "sindikatncratleos@gmail.com",
    });

    console.log("[DEBUG] Test email sent to:", to);

    return NextResponse.json(
      {
        message: "Test email sent successfully",
        to,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DEBUG] Email error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}