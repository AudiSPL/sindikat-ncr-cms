import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    // Check admin auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get memberId from query params
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json(
        { error: 'memberId is required' },
        { status: 400 }
      );
    }

    // Get badge path
    const { data: member } = await supabase
      .from('members')
      .select('badge_object_path')
      .eq('id', memberId)
      .single();

    if (!(member as any)?.badge_object_path) {
      return NextResponse.json(
        { error: 'No badge photo found' },
        { status: 404 }
      );
    }

    // Generate signed URL (expires in 5 minutes)
    const { data: signedUrl, error } = await supabase.storage
      .from('badge-photos')
      .createSignedUrl((member as any).badge_object_path, 300);

    if (error) throw error;

    return NextResponse.json({ signedUrl: (signedUrl as any).signedUrl });

  } catch (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}



