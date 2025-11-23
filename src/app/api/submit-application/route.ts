import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateVerificationToken } from '@/lib/jwt';
import { sendDiscordNotification } from '@/lib/discord';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, quicklook_id, city, division, agree_join, agree_gdpr, is_anonymous } = body;

    console.log('📥 API received is_anonymous:', is_anonymous);
    console.log('📥 API received is_anonymous type:', typeof is_anonymous);

    // Validation
    if (!full_name || !email || !quicklook_id || !city || !division) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Extract is_anonymous with explicit boolean conversion
    // Default to false (not anonymous) if not provided
    const isAnonymous = is_anonymous !== undefined ? Boolean(is_anonymous) : false;
    
    console.log('💾 Inserting to DB with is_anonymous:', isAnonymous);

    // Validate QLID format: 2 capital letters + 6 digits (e.g., AB123123)
    const qlIdPattern = /^[A-Z]{2}[0-9]{6}$/;
    if (!qlIdPattern.test(quicklook_id)) {
      return NextResponse.json(
        { error: 'QLID must be 2 capital letters + 6 digits (e.g., AB123123)' },
        { status: 400 }
      );
    }

    // Check for duplicate qlid
    const { data: existingMember } = await supabase
      .from('members')
      .select('id, quicklook_id, verification_status')
      .eq('quicklook_id', quicklook_id)
      .in('verification_status', ['code_verified', 'contacted', 'verified'])
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'Član sa ovim Quicklook ID-om je već u bazi podataka. Kontaktirajte administraciju ako mislite da je ovo greška.' },
        { status: 400 }
      );
    }

    // Insert member
    const { data: newMember, error: insertError } = await supabase
      .from('members')
      .insert({
        full_name,
        email,
        quicklook_id,
        city,
        division,
        agree_join: agree_join || false,
        agree_gdpr: agree_gdpr || false,
        is_anonymous: isAnonymous, // ✅ EXPLICITLY SET THIS
        verification_status: 'pending',
      })
      .select()
      .single();

    console.log('✅ Member inserted with is_anonymous:', newMember?.is_anonymous);

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    console.log('✅ Member inserted successfully:', newMember.id);

    // 🔔 Send Discord notification
    try {
      await sendDiscordNotification({
        full_name: newMember.full_name,
        email: newMember.email,
        quicklook_id: newMember.quicklook_id,
        city: newMember.city,
        division: newMember.division,
        team: newMember.team,
        is_anonymous: newMember.is_anonymous,
        created_at: newMember.created_at,
      });
    } catch (discordError) {
      // Log but don't fail the application
      console.error('Discord notification failed (non-critical):', discordError);
    }

    // Generate verification token (no memberId or qlid in URL)
    const token = generateVerificationToken(newMember.id, quicklook_id);

    // No email sent immediately - reminder comes from cron job after 24h
    
    return NextResponse.json({
      success: true,
      token, // Return token for immediate redirect
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}