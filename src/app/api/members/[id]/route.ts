import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import path from "path";
import { promises as fs } from "fs";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Member not found: ${error.message}`);
    }

    // Check if member has documents
    const memberDir = path.join(process.cwd(), "public", "members", String(id));
    let hasDocuments = false;
    let documents: string[] = [];

    try {
      const files = await fs.readdir(memberDir);
      documents = files.filter(file => file.endsWith(".pdf"));
      hasDocuments = documents.length > 0;
    } catch {
      // Directory doesn't exist or empty
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        hasDocuments,
        documents,
      },
    });
  } catch (error: any) {
    console.error("Get member error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to get member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Delete from database
    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete member: ${error.message}`);
    }

    // Delete member documents
    const memberDir = path.join(process.cwd(), "public", "members", String(id));

    try {
      await fs.rm(memberDir, { recursive: true, force: true });
    } catch (error) {
      console.warn("Failed to delete member documents:", error);
      // Don't fail the request if document deletion fails
    }

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete member error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete member" },
      { status: 500 }
    );
  }
}
