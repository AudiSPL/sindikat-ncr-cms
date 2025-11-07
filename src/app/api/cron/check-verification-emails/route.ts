import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUnprocessedVerificationEmails } from '@/lib/gmail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting verification email check...');

    // Get unread emails from Gmail
    const processedEmails = await getUnprocessedVerificationEmails();
    console.log(`✅ Found ${processedEmails.length} verification emails`);

    // For each email, find member and update
    for (const email of processedEmails) {
      try {
        const { firstName, lastName, emailAddress, subject, date, messageId } = email as any;

        if (!firstName || !lastName) {
          console.warn('⚠️ Skipping email without parseable first/last name in cron job');
          continue;
        }

        const normalizedFirst = firstName.toLowerCase();
        const normalizedLast = lastName.toLowerCase();

        const { data: potentialMembers, error: findError } = await supabase
          .from('members')
          .select('id, email, full_name, status, verification_status, verification_method')
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
          console.warn(`⚠️ Cron: No member found matching ${firstName} ${lastName} (${emailAddress})`);
          continue;
        }

        const { status, verification_method: method } = matchedMember as any;

        if (status !== 'pending' || (method && method !== 'email')) {
          console.log(`ℹ️ Cron: Member ${matchedMember.full_name} already verified or using method ${method ?? 'unknown'} - skipping`);
          continue;
        }

        const { error: updateError } = await supabase
          .from('members')
          .update({
            verification_status: 'code_verified',
            verified_at: new Date().toISOString(),
            verification_method: 'email',
            updated_at: new Date().toISOString(),
            is_verified: true,
          })
          .eq('id', matchedMember.id);

        if (updateError) {
          console.error(`Error updating member ${matchedMember.id}:`, updateError);
          continue;
        }

        const { error: logError } = await supabase
          .from('verification_events')
          .insert({
            member_id: matchedMember.id,
            event_type: 'email_seen',
            event_meta: {
              email: emailAddress,
              subject,
              date,
              gmail_message_id: messageId,
              parsed_first_name: firstName,
              parsed_last_name: lastName,
            },
          });

        if (logError) {
          console.error('Error logging event:', logError);
        }

        console.log(`✅ Cron: Member ${matchedMember.full_name} verified via email (${emailAddress})`);
      } catch (memberErr) {
        console.error('Error processing verification email:', memberErr);
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedEmails.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to check verification emails', details: error },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
