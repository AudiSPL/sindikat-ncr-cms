import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUnprocessedVerificationEmails } from '@/lib/gmail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    const emails = await getUnprocessedVerificationEmails();
    const verifiedMembers: string[] = [];

    for (const email of emails as any[]) {
      const { qlid } = email;

      // Find member by quicklook_id - email MUST be from qlid@ncratleos.com
      const { data: member, error: findError } = await supabase
        .from('members')
        .select('id, quicklook_id, status, verification_status, verification_method')
        .eq('quicklook_id', qlid)
        .single();

      if (findError || !member) {
        console.warn(`⚠️ Member not found for QLID: ${qlid}`);
        continue;
      }

      // Verify email sender matches member's QLID
      // Email is already verified to be from qlid@ncratleos.com in gmail.ts
      // Only update if member is pending and verification_method is email (or null)
      if (member.status === 'pending' && (!member.verification_method || member.verification_method === 'email')) {
        const { data: updatedMember, error } = await supabase
          .from('members')
          .update({
            verification_status: 'code_verified',
            is_verified: true,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            verification_method: 'email',
          })
          .eq('id', member.id)
          .select()
          .single();

        if (!error && updatedMember) {
          verifiedMembers.push(qlid);
          console.log(`✅ Member ${qlid} verified via email from ${qlid}@ncratleos.com`);

          // Log event if table exists
          try {
            await supabase.from('verification_events').insert({
              member_id: member.id,
              event_type: 'email_seen',
              event_meta: {
                subject: (email as any).subject,
                date: (email as any).date,
              },
            });
          } catch (logError) {
            // Table might not exist, continue
            console.warn('Could not log verification event');
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      verified: verifiedMembers.length,
      members: verifiedMembers,
    });

  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { error: 'Failed to check verification emails' },
      { status: 500 }
    );
  }
}



