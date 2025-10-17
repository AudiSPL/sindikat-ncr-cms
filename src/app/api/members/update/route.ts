import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ids, updates } = body;
    // Whitelist only known columns in 'members' table
    const allowedKeys = new Set([
      'full_name',
      'email',
      'quicklook_id',
      'city',
      'organization',
      'status',
      'member_id',
      'send_copy',
    ]);
    const safeUpdates: Record<string, any> = {};
    if (updates && typeof updates === 'object') {
      Object.keys(updates).forEach((k) => {
        if (allowedKeys.has(k)) {
          (safeUpdates as any)[k] = (updates as any)[k];
        }
      });
    }

    // Single member update
    if (id && Object.keys(safeUpdates).length > 0) {
      const { data, error } = await supabase
        .from("members")
        .update({
          ...safeUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update member: ${error.message}`);
      }

      // If member approved -> ensure joined_at and member_id, then generate PDFs and send activation email
      try {
        if (updates?.status === 'active' && data?.email) {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          // Work with an effective member snapshot
          let effective = data as any;
          const shouldSetJoin = !effective.joined_at;
          const shouldSetMemberId = !effective.member_id;
          if (shouldSetJoin || shouldSetMemberId) {
            const membershipNumber = shouldSetMemberId ? `MBR-${String(effective.id).padStart(6, '0')}` : effective.member_id;
            const { data: ensured } = await supabase
              .from('members')
              .update({
                joined_at: shouldSetJoin ? new Date().toISOString() : effective.joined_at,
                member_id: membershipNumber,
                updated_at: new Date().toISOString(),
              })
              .eq('id', effective.id)
              .select()
              .single();
            if (ensured) {
              effective = ensured;
            }
          }
          // 1) Generate confirmation PDF
          await fetch(`${baseUrl}/api/generate-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              memberId: effective.id,
              memberData: {
                fullName: effective.full_name,
                email: effective.email,
                quicklookId: effective.quicklook_id,
                city: effective.city,
                organization: effective.organization,
                membershipNumber: effective.member_id,
                joinDate: effective.joined_at || effective.created_at,
              },
            }),
          });

          // 2) Generate card PDF
          await fetch(`${baseUrl}/api/generate-card`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              memberId: effective.id,
              memberData: {
                fullName: effective.full_name,
                email: effective.email,
                quicklookId: effective.quicklook_id,
                city: effective.city,
                organization: effective.organization,
                membershipNumber: effective.member_id,
                status: 'active',
                joinDate: effective.joined_at || effective.created_at,
              },
            }),
          });

          // (policy generation temporarily disabled)

          // 3) Send activation email with attachments
          await fetch(`${baseUrl}/api/send-welcome-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: effective.email,
              type: 'activation',
              attachFiles: true,
              ccUnion: true,
              memberData: {
                id: effective.id,
                fullName: effective.full_name,
                email: effective.email,
                quicklookId: effective.quicklook_id,
                city: effective.city,
                organization: effective.organization,
                status: 'active',
                membershipNumber: effective.member_id,
              },
            }),
          });
        }
      } catch (mailErr) {
        console.error('Activation email dispatch error:', mailErr);
      }

      return NextResponse.json({
        success: true,
        data,
        message: "Member updated successfully",
      });
    }

    // Bulk update
    if (ids && Array.isArray(ids) && Object.keys(safeUpdates).length > 0) {
      const { data, error } = await supabase
        .from("members")
        .update({
          ...safeUpdates,
          updated_at: new Date().toISOString(),
        })
        .in("id", ids)
        .select();

      if (error) {
        throw new Error(`Failed to bulk update: ${error.message}`);
      }

      return NextResponse.json({
        success: true,
        data,
        count: data?.length || 0,
        message: `${data?.length || 0} members updated successfully`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid request body. Provide 'id' and 'updates' or 'ids' and 'updates'" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Update member error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update member(s)" },
      { status: 500 }
    );
  }
}
