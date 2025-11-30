import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendMail } from '@/lib/mailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { memberIds, subject, message } = await req.json();

    if (!memberIds || memberIds.length === 0) {
      return NextResponse.json(
        { error: 'No members selected' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Fetch selected members
    const { data: members, error } = await supabase
      .from('members')
      .select('id, full_name, email')
      .in('id', memberIds);

    if (error || !members) {
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      );
    }

    // Send individual emails
    const results = [];
    for (const member of members) {
      try {
        const firstName = member.full_name?.split(' ')[0] || 'Člane';
        
        // HTML email template with logo
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #E67E22 0%, #FF8C42 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Sindikat Radnika NCR Atleos - Beograd</h1>
            </div>

            <div style="background: white; padding: 30px 20px; border: 1px solid #e0e0e0; border-top: none;">
              <p style="font-size: 16px; margin: 0 0 20px 0;">Poštovani/a <strong>${firstName}</strong>,</p>
              
              <div style="font-size: 15px; line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="text-align: center; background: #f8f9fa; padding: 25px 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
              <img src="https://sindikatncr.com/brand/logo-sindikat.png" alt="Sindikat Radnika NCR Atleos - Beograd" style="max-width: 150px; margin-bottom: 15px;">
              <p style="font-size: 13px; color: #666; margin: 10px 0 5px 0;">
                <strong>Sindikat Radnika NCR Atleos - Beograd</strong>
              </p>
              <p style="font-size: 13px; color: #666; margin: 5px 0;">
                Španskih boraca 75, Beograd
              </p>
              <p style="font-size: 13px; margin: 5px 0;">
                📧 <a href="mailto:office@sindikatncr.com" style="color: #E67E22; text-decoration: none;">office@sindikatncr.com</a><br>
                🌐 <a href="https://sindikatncr.com" style="color: #E67E22; text-decoration: none;">www.sindikatncr.com</a>
              </p>
            </div>
          </div>
        `;

        await sendMail({
          to: member.email,
          subject: subject,
          html: emailHtml,
        });

        results.push({ email: member.email, success: true });
      } catch (err) {
        console.error(`Failed to send to ${member.email}:`, err);
        results.push({ email: member.email, success: false, error: String(err) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
      results,
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}

