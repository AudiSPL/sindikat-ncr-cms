import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST() {
  try {
    // Admin only
    const session = await getServerSession();
    if (!session || (session as any).user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Same purge logic
    const { data: membersToClean } = await supabase
      .from('members')
      .select('id, badge_object_path, artifacts_purge_at')
      .not('badge_object_path', 'is', null)
      .not('artifacts_purge_at', 'is', null)
      .lt('artifacts_purge_at', new Date().toISOString());

    let deletedCount = 0;
    let errorCount = 0;

    for (const member of membersToClean || []) {
      try {
        if ((member as any).badge_object_path) {
          await supabase.storage
            .from('badge-photos')
            .remove([(member as any).badge_object_path]);
        }

        await supabase
          .from('members')
          .update({
            badge_object_path: null,
            artifacts_purge_at: null,
          })
          .eq('id', (member as any).id);

        await supabase.from('verification_events').insert({
          member_id: (member as any).id,
          event_type: 'artifact_purged',
          event_meta: { 
            purged_path: (member as any).badge_object_path,
            purged_at: new Date().toISOString(),
          },
        });

        deletedCount++;
      } catch (error) {
        console.error(`Error purging member ${(member as any).id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: membersToClean?.length || 0,
      deleted: deletedCount,
      errors: errorCount,
    });

  } catch (error) {
    console.error('Test purge failed:', error);
    return NextResponse.json(
      { error: 'Purge failed' },
      { status: 500 }
    );
  }
}











