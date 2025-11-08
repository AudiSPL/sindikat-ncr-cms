import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyVerificationToken } from '@/lib/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const file = formData.get('file') as File;

    if (!token || !file) {
      return NextResponse.json(
        { error: 'Missing token or file' },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = verifyVerificationToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { memberId } = decoded as { memberId: string };

    // Upload to private bucket
    const fileExt = (file as any).name?.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const fileName = `${memberId}/${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('badge-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Set purge date (30 days from now)
    const purgeDate = new Date();
    purgeDate.setDate(purgeDate.getDate() + 30);

    // Update member record
    const { error: updateError } = await supabase
      .from('members')
      .update({
        badge_object_path: fileName,
        verification_method: 'badge',
        method_selected_at: new Date().toISOString(),
        artifacts_purge_at: purgeDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', memberId);

    if (updateError) throw updateError;

    // Log event
    await supabase.from('verification_events').insert({
      member_id: memberId,
      event_type: 'badge_uploaded',
      event_meta: { path: fileName },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Badge upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload badge photo' },
      { status: 500 }
    );
  }
}








