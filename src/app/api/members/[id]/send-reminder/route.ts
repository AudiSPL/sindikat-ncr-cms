import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMail } from '@/lib/mailer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Helper function to generate token (copy from submit-application route)
function generateVerificationToken(memberId: string, quicklookId: string): string {
  const payload = {
    mid: memberId,
    qid: quicklookId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

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

    // Fetch member info
    const { data: member, error: fetchError } = await supabase
      .from('members')
      .select('full_name, email, quicklook_id, verification_method')
      .eq('id', id)
      .single();

    if (fetchError || !member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Generate verification token
    const token = generateVerificationToken(id, member.quicklook_id);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://app.sindikatncr.com';
    const verifyUrl = `${baseUrl}/verify?token=${token}`;

    // Send reminder email
    await sendMail({
      to: member.email,
      subject: 'Podsetnik: Završi prijavu – Sindikat Radnika NCR Atleos',
      html: `
        <h2>Pozdrav ${member.full_name},</h2>
        
        <p>Primili smo tvoju prijavu za Sindikat Radnika NCR Atleos, ali nisi završio/la drugi korak verifikacije.</p>
        
        <p><strong>Za aktivaciju članstva potrebno je da završiš verifikaciju.</strong></p>
        
        <p>Klikni na link ispod da izabereš metod verifikacije:</p>
        
        <p style="margin: 30px 0;">
          <a href="${verifyUrl}" 
             style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Završi verifikaciju
          </a>
        </p>
        
        <p>Možeš odabrati jedan od sledećih metoda:</p>
        <ul>
          <li><strong>Lični susret</strong> - Najsigurniji metod (dogovor)</li>
          <li><strong>Fotografija bedža</strong> - Upload fotografije tvog NCR Atleos ID-a</li>
          <li><strong>Direktna poruka</strong> - Organizator će te kontaktirati</li>
          <li><strong>Email sa posla</strong> - Pošalji email sa @ncratleos.com adrese</li>
        </ul>
        
        <p>Link za verifikaciju: <a href="${verifyUrl}">${verifyUrl}</a></p>
        
        <p>Ako imaš bilo kakvih pitanja, slobodno odgovori na ovaj email.</p>
        
        <p>Solidarnost,<br>
        Sindikat Radnika NCR Atleos</p>
      `
    });

    // Log the reminder sent
    await supabase.from('audit_logs').insert({
      admin_id: (session.user as any).id,
      action: 'send_verification_reminder',
      target_type: 'member',
      target_id: id.toString(),
      details: {
        member_name: member.full_name,
        member_email: member.email
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Reminder email sent successfully'
    });

  } catch (error: any) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
