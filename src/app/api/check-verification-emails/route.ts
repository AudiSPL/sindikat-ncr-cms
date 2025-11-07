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
      const { firstName, lastName, emailAddress, subject, date } = email;

      if (!firstName || !lastName) {
        console.warn('⚠️ Skipping email without parseable first/last name');
        continue;
      }

      const normalizedFirst = firstName.toLowerCase();
      const normalizedLast = lastName.toLowerCase();

      const { data: potentialMembers, error: findError } = await supabase
        .from('members')
        .select('id, full_name, status, verification_status, verification_method')
        .ilike('full_name', `%${lastName}%`);

      if (findError) {
        console.error(`❌ Error fetching members for ${firstName} ${lastName}:`, findError);
        continue;
      }

      const matchedMember = (potentialMembers || []).find(candidate => {
        if (!candidate?.full_name) return false;
        const parts = candidate.full_name.trim().split(/\s+/);
        const candidateFirst = parts[0]?.toLowerCase();
        const candidateLast = parts[parts.length - 1]?.replace(/\d+$/, '').toLowerCase();
        return candidateFirst === normalizedFirst && candidateLast === normalizedLast;
      });

      if (!matchedMember) {
        console.warn(`⚠️ No member found matching ${firstName} ${lastName} (${emailAddress})`);
        continue;
      }

      if (matchedMember.status === 'pending' && (!matchedMember.verification_method || matchedMember.verification_method === 'email')) {
        const { data: updatedMember, error } = await supabase
          .from('members')
          .update({
            verification_status: 'code_verified',
            is_verified: true,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            verification_method: 'email',
          })
          .eq('id', matchedMember.id)
          .select()
          .single();

        if (!error && updatedMember) {
          verifiedMembers.push(updatedMember.full_name ?? `${firstName} ${lastName}`);
          console.log(`✅ Member ${updatedMember.full_name ?? `${firstName} ${lastName}`} verified via email (${emailAddress})`);

          // Log event if table exists
          try {
            await supabase.from('verification_events').insert({
              member_id: matchedMember.id,
              event_type: 'email_seen',
              event_meta: {
                subject,
                date,
                email: emailAddress,
                parsed_first_name: firstName,
                parsed_last_name: lastName,
              },
            });
          } catch (logError) {
            console.warn('Could not log verification event');
          }
        }
      } else {
        console.log(`ℹ️ Member ${matchedMember.full_name} already has verification status ${matchedMember.verification_status} via ${matchedMember.verification_method ?? 'unknown'} – skipping`);
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



