export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    // Sanity guard – odmah prekini ako nema service key-a
    if (!process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('SUPABASE_SERVICE_KEY is missing');
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('[API /members/update] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('[API /members/update] SERVICE KEY PRESENT:', !!process.env.SUPABASE_SERVICE_KEY);
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Zabranjena polja (generated/read-only)
    delete (body as any).is_active_member;
    delete (body as any).created_at;
    delete (body as any).updated_at;
    delete (body as any).member_id;
    delete (body as any).approved_by;

    const { id, ids, updates } = body;
    // ✅ whitelist za update
    const updateData: any = {};
    if (updates?.full_name !== undefined) updateData.full_name = updates.full_name;
    if (updates?.email !== undefined) updateData.email = updates.email;
    if (updates?.quicklook_id !== undefined) updateData.quicklook_id = updates.quicklook_id;
    if (updates?.city !== undefined) updateData.city = updates.city;
    if (updates?.organization !== undefined) updateData.organization = updates.organization;
    if (updates?.status !== undefined) updateData.status = updates.status;
    if (updates?.special_status !== undefined) updateData.special_status = updates.special_status;
    if (updates?.is_anonymous !== undefined) updateData.is_anonymous = !!updates.is_anonymous;
    if (updates?.consent !== undefined) updateData.consent = !!updates.consent;
    if (updates?.agree_join !== undefined) updateData.agree_join = !!updates.agree_join;
    if (updates?.agree_gdpr !== undefined) updateData.agree_gdpr = !!updates.agree_gdpr;
    if (updates?.active_participation !== undefined) updateData.active_participation = !!updates.active_participation;
    if (updates?.send_copy !== undefined) updateData.send_copy = !!updates.send_copy;
    if (updates?.language !== undefined) updateData.language = updates.language;
    if (updates?.notes !== undefined) updateData.notes = updates.notes;

    updateData.updated_at = new Date().toISOString();

    // Single member update
    if (id && Object.keys(updateData).length > 0) {
      const { error } = await getSupabaseAdmin()
        .from("members")
        .update(updateData)
        .eq("id", id);

      if (error) {
        throw new Error(`Failed to update member: ${error.message}`);
      }

      // If member approved -> ensure joined_at and member_id, then generate PDFs and send activation email
      try {
        if (updates?.status === 'active') {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                  // Get member data for activation
                  const { data: memberData } = await getSupabaseAdmin()
                    .from('members')
                    .select('*')
                    .eq('id', id)
                    .single();
          
          if (memberData) {
            // Work with an effective member snapshot
            let effective = memberData as any;
          const shouldSetJoin = !effective.joined_at;
          const shouldSetMemberId = !effective.member_id;
          if (shouldSetJoin || shouldSetMemberId) {
            const membershipNumber = shouldSetMemberId ? `SIN-AT${String(effective.id).padStart(4, '0')}` : effective.member_id;
            const { data: ensured } = await getSupabaseAdmin()
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
        }
      } catch (mailErr) {
        console.error('Activation email dispatch error:', mailErr);
      }

      return NextResponse.json({ success: true });
    }

    // Bulk update
    if (ids && Array.isArray(ids) && Object.keys(updateData).length > 0) {
      const { error } = await getSupabaseAdmin()
        .from("members")
        .update(updateData)
        .in("id", ids);

      if (error) {
        throw new Error(`Failed to bulk update: ${error.message}`);
      }

      return NextResponse.json({
        success: true,
        count: ids.length,
        message: `${ids.length} members updated successfully`,
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
