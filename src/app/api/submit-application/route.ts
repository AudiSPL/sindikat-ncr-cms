export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sanitizeInput, sanitizeEmail, sanitizeQuicklookId } from '@/lib/sanitize';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { sendMail } from '@/lib/mailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Posle kreiranja klijenta, dodaj log:
console.log('[SUPABASE] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Runtime zaštita: nikad ne šalji is_active_member
    delete (body as any).is_active_member;
    delete (body as any).isActiveMember;

    // (Log za dev) potvrdi koji projekat koristiš
    if (process.env.NODE_ENV !== 'production') {
      console.log('[API] Using Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    }
    
    // Rate limit
    const identifier = getRateLimitIdentifier(req);
    const rl = rateLimit(identifier, 5, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: 'Previše zahteva. Pokušajte ponovo za minut.' }, { status: 429, headers: { 'X-RateLimit-Remaining': '0' } });
    }

    const {
      fullName, 
      email, 
      quicklookId, 
      city, 
      organization,
      agreeJoin,
      agreeGDPR,
      isAnonymous,
      recaptchaToken 
    } = body;

    // Verify reCAPTCHA v2
    try {
      const recaptchaToken = (body as any)?.recaptchaToken;
      if (!recaptchaToken) {
        console.error('❌ No reCAPTCHA token provided');
        return NextResponse.json({ error: 'reCAPTCHA token is required' }, { status: 400 });
      }

      const secret = process.env.RECAPTCHA_SECRET_KEY;
      if (!secret) {
        console.error('❌ RECAPTCHA_SECRET_KEY not configured');
        return NextResponse.json({ error: 'reCAPTCHA not configured' }, { status: 500 });
      }

      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret,
          response: recaptchaToken,
        }),
      });

      if (!verifyRes.ok) {
        console.error('❌ reCAPTCHA HTTP error:', verifyRes.status);
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
      }

      type V2Response = {
        success: boolean;
        challenge_ts?: string;
        hostname?: string;
        'error-codes'?: string[];
      };

      const verifyData = (await verifyRes.json()) as V2Response;
      console.log('📥 reCAPTCHA v2 response:', verifyData);

      if (!verifyData.success) {
        console.error('❌ reCAPTCHA verification failed:', verifyData);
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
      }

      console.log('✅ reCAPTCHA v2 verification passed');
    } catch (recaptchaErr) {
      console.error('❌ reCAPTCHA verification error:', recaptchaErr);
      return NextResponse.json({ error: 'reCAPTCHA verification error' }, { status: 400 });
    }

    // Validacija
    if (!fullName || !email || !quicklookId || !city) {
      return NextResponse.json({ 
        error: 'Sva polja su obavezna' 
      }, { status: 400 });
    }

    // Statute/Rules is mandatory; privacy/newsletter are optional
    if (!agreeJoin) {
      return NextResponse.json({ 
        error: 'Morate prihvatiti Statut i pravila' 
      }, { status: 400 });
    }

    // Proveri duplikat email
    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .eq('email', email)
      .single();
    // Proveri duplikat quicklook_id
    const { data: existingQ } = await supabase
      .from('members')
      .select('id')
      .eq('quicklook_id', quicklookId)
      .single();

    if (existingQ) {
      return NextResponse.json({ 
        error: 'duplicate',
        field: 'quicklookId'
      }, { status: 409 });
    }

    if (existing) {
      return NextResponse.json({ 
        error: 'duplicate',
        field: 'email'
      }, { status: 409 });
    }

    const payload = {
      full_name: sanitizeInput(fullName),
      email: sanitizeEmail(email),
      quicklook_id: sanitizeQuicklookId(quicklookId),
      city: sanitizeInput(city),
      organization: sanitizeInput(organization) || null,
      status: 'active',
      consent: true,
      agree_join: !!agreeJoin,
      agree_gdpr: !!agreeGDPR,
      is_anonymous: isAnonymous ?? true,
      special_status: 'clan',
      active_participation: false,
      send_copy: false,
      language: 'sr',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log('INSERT payload →', JSON.stringify(payload, null, 2));
    }

    const { error: insertError } = await supabase
      .from('members')
      .insert(payload); // bez .select()

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ 
        error: 'Greška pri čuvanju podataka: ' + insertError.message 
      }, { status: 500 });
    }

    console.log('✅ Member created successfully');

    // Generate membership number on submit: MBR-000123
    try {
      // Get the latest member ID (since we didn't use .select())
      const { data: latestMember } = await supabase
        .from('members')
        .select('id')
        .eq('email', email)
        .single();
      
      if (latestMember) {
        const membershipNumber = `MBR-${String(latestMember.id).padStart(6, '0')}`;
        const { error: updateError } = await supabase
          .from('members')
          .update({
            member_id: membershipNumber,
            updated_at: new Date().toISOString(),
          })
          .eq('id', latestMember.id);

        if (updateError) {
          console.error('⚠️ Failed to set membership number:', updateError.message);
        } else {
          console.log('🔢 Membership number set:', membershipNumber);
        }
      }
    } catch (mnErr: any) {
      console.error('Membership number generation error:', mnErr?.message || mnErr);
    }

    // Slanje emailova (Resend helper)
    try {
      await sendMail({
        to: email,
        subject: 'Hvala na prijavi – Sindikat NCR',
        html: `<p>Zdravo ${sanitizeInput(fullName)},</p><p>Hvala na prijavi. Uskoro se javljamo.</p>`,
        bcc: 'sindikatncratleos@gmail.com',
      });

      await sendMail({
        to: 'office@sindikatncr.com',
        subject: `Nova prijava: ${sanitizeInput(fullName)}`,
        html: `<p><b>Email:</b> ${sanitizeEmail(email)}<br/><b>Grad:</b> ${sanitizeInput(city) ?? '-'}<br/><b>Anoniman:</b> ${(isAnonymous ?? true) ? 'Da' : 'Ne'}</p>`,
      });
    } catch (e) {
      console.error('Mail error (submit-application):', e);
      // non-fatal
    }

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error('❌ Submit application error:', error);
    return NextResponse.json({ 
      error: error.message || 'Server error' 
    }, { status: 500 });
  }
}