export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import path from "path";
import { promises as fs } from "fs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Allow updating these fields (whitelist approach)
    if (body.full_name !== undefined) updateData.full_name = body.full_name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.quicklook_id !== undefined) updateData.quicklook_id = body.quicklook_id;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.organization !== undefined) updateData.organization = body.organization;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.special_status !== undefined) updateData.special_status = body.special_status;
    if (body.is_anonymous !== undefined) updateData.is_anonymous = body.is_anonymous;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const { data: member, error } = await getSupabaseAdmin()
      .from('members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log audit
    await getSupabaseAdmin().from('audit_logs').insert({
      admin_id: (session.user as Record<string, unknown>).id,
      action: 'UPDATE_MEMBER',
      target_type: 'member',
      target_id: id,
      details: { changes: updateData },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ member });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Brza dijagnostika
    if (process.env.NODE_ENV !== 'production') {
      console.log('[SUPABASE ADMIN URL]:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('[SERVICE KEY SET]:', !!process.env.SUPABASE_SERVICE_KEY);
    }

    // Delete from database using admin client
    const { error } = await getSupabaseAdmin()
      .from("members")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('Delete member supabase error:', error);
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

    // Ako brišeš i fajlove iz Storage-a, koristi admin klijent:
    // const storageRes = await getSupabaseAdmin().storage.from('member_docs').remove([...paths])
    // if (storageRes.error) throw new Error(`Storage delete failed: ${storageRes.error.message}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete member error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete member" },
      { status: 500 }
    );
  }
}
