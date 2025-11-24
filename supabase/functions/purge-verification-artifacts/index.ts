import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  try {
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

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Purge job failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error?.message || String(error),
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});












