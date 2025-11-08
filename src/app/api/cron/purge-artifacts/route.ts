import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting artifact purge job...');

    // Find members with expired artifacts
    const { data: membersToClean, error: fetchError } = await supabase
      .from('members')
      .select('id, badge_object_path')
      .not('badge_object_path', 'is', null)
      .not('artifacts_purge_at', 'is', null)
      .lt('artifacts_purge_at', new Date().toISOString());

    if (fetchError) throw fetchError;

    console.log(`Found ${membersToClean?.length || 0} members with expired artifacts`);

    let deletedCount = 0;
    let errorCount = 0;

    for (const member of membersToClean || []) {
      try {
        // Delete badge photo from storage
        if ((member as any).badge_object_path) {
          const { error: deleteError } = await supabase.storage
            .from('badge-photos')
            .remove([(member as any).badge_object_path]);

          if (deleteError) {
            console.error(`Failed to delete ${(member as any).badge_object_path}:`, deleteError);
            errorCount++;
            continue;
          }
        }

        // Clear badge_object_path and artifacts_purge_at
        const { error: updateError } = await supabase
          .from('members')
          .update({
            badge_object_path: null,
            artifacts_purge_at: null,
          })
          .eq('id', (member as any).id);

        if (updateError) {
          console.error(`Failed to update member ${(member as any).id}:`, updateError);
          errorCount++;
          continue;
        }

        // Log purge event
        await supabase.from('verification_events').insert({
          member_id: (member as any).id,
          event_type: 'artifact_purged',
          event_meta: {
            purged_path: (member as any).badge_object_path,
            purged_at: new Date().toISOString(),
          },
        });

        deletedCount++;
        console.log(`Purged artifacts for member ${(member as any).id}`);

      } catch (error) {
        console.error(`Error processing member ${(member as any).id}:`, error);
        errorCount++;
      }
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      processed: membersToClean?.length || 0,
      deleted: deletedCount,
      errors: errorCount,
    };

    console.log('Purge job completed:', result);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Purge job failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}








