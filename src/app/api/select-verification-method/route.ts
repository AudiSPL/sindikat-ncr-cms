import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyVerificationToken } from '@/lib/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const { token, method } = await request.json();

    // Verify token
    const decoded = verifyVerificationToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { memberId, qlid } = decoded as { memberId: string; qlid: string };

    // Update member
    const { error: updateError } = await supabase
      .from('members')
      .update({
        verification_method: method,
        method_selected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', memberId);

    if (updateError) throw updateError;

    // Log event
    try {
      await supabase.from('verification_events').insert({
        member_id: memberId,
        event_type: 'method_selected',
        event_meta: { method },
      });
    } catch (logError) {
      // Table might not exist, continue
      console.warn('Could not log verification event');
    }

    // No email sends - reminders come from cron job only
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Method selection error:', error);
    return NextResponse.json(
      { error: 'Failed to select verification method' },
      { status: 500 }
    );
  }
}



