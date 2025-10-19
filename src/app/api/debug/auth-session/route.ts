import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("[DEBUG] Auth Session:", {
      exists: !!session,
      user: session?.user?.email,
      expires: session?.expires,
    });

    return NextResponse.json(
      {
        message: "Auth session debug",
        session: session || { error: "No session found" },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DEBUG] Auth error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}