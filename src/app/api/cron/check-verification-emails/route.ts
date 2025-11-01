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
        // Find member by quicklook_id
        const { data: member, error: findError } = await supabase
          .from('members')
          .select('id, email, full_name, quicklook_id')
          .eq('quicklook_id', email.qlid)
          .single();

        if (findError || !member) {
          console.warn(`⚠️ Member not found for qlid: ${email.qlid}`);
          continue;
        }

        // Update member verification status
        const { error: updateError } = await supabase
          .from('members')
          .update({
            verification_status: 'code_verified',
            verified_at: new Date().toISOString(),
          })
          .eq('id', member.id);

        if (updateError) {
          console.error(`Error updating member ${member.id}:`, updateError);
          continue;
        }

        // Log verification event
        const { error: logError } = await supabase
          .from('verification_events')
          .insert({
            member_id: member.id,
            event_type: 'email_seen',
            event_meta: {
              qlid: email.qlid,
              from: `${email.qlid}@ncratleos.com`,
              subject: email.subject,
              date: email.date,
              gmail_message_id: email.messageId,
            },
          });

        if (logError) {
          console.error('Error logging event:', logError);
        }

        console.log(`✅ Member ${email.qlid} verified via email`);
      } catch (memberErr) {
        console.error(`Error processing email for ${email.qlid}:`, memberErr);
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
