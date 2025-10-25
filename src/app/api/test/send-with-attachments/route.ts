import { sendMail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log("[WITH-ATTACHMENTS] Testing email with PDF attachments");
    const to = req.nextUrl.searchParams.get("to") || "savinmilos@yahoo.com";

    const file1Path = path.join(process.cwd(), "public/members/29/card.pdf");
    const file2Path = path.join(process.cwd(), "public/members/29/confirmation.pdf");

    console.log("[WITH-ATTACHMENTS] Reading files...");
    console.log("[WITH-ATTACHMENTS] Card path:", file1Path);
    console.log("[WITH-ATTACHMENTS] Confirmation path:", file2Path);

    let cardContent: Buffer;
    let confirmationContent: Buffer;

    try {
      cardContent = await fs.readFile(file1Path);
      console.log("[WITH-ATTACHMENTS] Card PDF read successfully");
    } catch (err) {
      console.error("[WITH-ATTACHMENTS] Failed to read card PDF:", err);
      cardContent = Buffer.from("dummy card pdf");
    }

    try {
      confirmationContent = await fs.readFile(file2Path);
      console.log("[WITH-ATTACHMENTS] Confirmation PDF read successfully");
    } catch (err) {
      console.error("[WITH-ATTACHMENTS] Failed to read confirmation PDF:", err);
      confirmationContent = Buffer.from("dummy confirmation pdf");
    }

    console.log("[WITH-ATTACHMENTS] Preparing email with attachments...");

    const result = await sendMail({
      to,
      subject: "Test: Email with Attachments",
      html: `
        <h2>Email with Attachments Test</h2>
        <p>This email includes TWO PDF attachments.</p>
        <p>If you receive this with the PDFs, Resend accepts attachments.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
      attachments: [
        {
          filename: "card.pdf",
          content: cardContent.toString("base64"),
          contentType: "application/pdf",
        },
        {
          filename: "confirmation.pdf",
          content: confirmationContent.toString("base64"),
          contentType: "application/pdf",
        },
      ],
    });

    console.log("[WITH-ATTACHMENTS] Result:", result);

    return NextResponse.json(
      {
        message: "Email with attachments test sent",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[WITH-ATTACHMENTS] Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}


