import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { reason, type } = await request.json();

    if (!reason?.trim()) {
      return NextResponse.json(
        { error: 'Deletion reason is required' },
        { status: 400 }
      );
    }

    // Fetch member info for audit log
    const { data: member, error: fetchError } = await supabase
      .from('members')
      .select('full_name, email, quicklook_id')
      .eq('id', id)
      .single();

    if (fetchError || !member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Soft delete: update instead of delete
    const { error: updateError } = await supabase
      .from('members')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        deleted_by: (session.user as any).id,
        deletion_reason: reason.trim(),
        deletion_type: type || 'admin_action'
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error soft-deleting member:', updateError);
      throw new Error(`Deletion failed: ${updateError.message}`);
    }

    // Log to audit_logs
    await supabase.from('audit_logs').insert({
      admin_id: (session.user as any).id,
      action: 'soft_delete_member',
      target_type: 'member',
      target_id: id.toString(),
      details: {
        member_name: member.full_name,
        member_email: member.email,
        quicklook_id: member.quicklook_id,
        deletion_reason: reason.trim(),
        deletion_type: type || 'admin_action'
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Member marked as deleted (soft delete)'
    });

  } catch (error: any) {
    console.error('Error in soft delete:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
