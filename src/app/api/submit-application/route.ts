import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateVerificationToken } from '@/lib/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, quicklook_id, city, division } = body;

    // Validation
    if (!full_name || !email || !quicklook_id || !city || !division) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
        verification_status: 'pending',
      })
      .select()
      .single();

    if (insertError) throw insertError;

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