export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    console.log("🔐 Checking session for /api/members GET");
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.error("⛔ Unauthorized access to /api/members");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🗂️ Fetching members from Supabase (DESC by created_at)");
    const { data: members, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch members: ${error.message}`);
    }

    console.log(`✅ Retrieved ${members?.length || 0} members`);
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    console.error("🔥 Error in GET /api/members:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch members" },
      { status: 500 }
    );
  }
}


