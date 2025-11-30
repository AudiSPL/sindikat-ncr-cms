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
        const firstName = member.full_name?.split(' ')[0] || '';
        
        // Simpler, more personal email template
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: white;">
            <div style="padding: 30px 20px;">
              <p style="font-size: 16px; margin: 0 0 20px 0;"><strong>Ćao${firstName ? ' ' + firstName : ''},</strong></p>
              
              <div style="font-size: 15px; line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</div>

              <div style="background: #fff9e6; border-left: 4px solid #E67E22; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="font-size: 13px; color: #666; margin: 0 0 10px 0;">
                  <strong>📌 Važno:</strong> Da ne biste propustili buduće poruke od sindikata:
                </p>
                <ol style="font-size: 13px; color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>Ako je ovaj email stigao u folder "Obaveštenja" ili "Promocije", prevucite ga u "Primarno"</li>
                  <li>Gmail će pitati: "Da li želite da uradite isto i za buduće poruke?" - Odaberite <strong>DA</strong></li>
                  <li>Tako ćete dobijati sve važne informacije direktno u glavnom inbox-u</li>
                </ol>
              </div>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 14px; color: #666; margin: 5px 0;">
                  S poštovanjem,<br>
                  <strong>Sindikat Radnika NCR Atleos - Beograd</strong>
                </p>
                <p style="font-size: 13px; color: #888; margin: 10px 0 0 0;">
                  Španskih boraca 75, Beograd<br>
                  📧 office@sindikatncr.com | 🌐 www.sindikatncr.com
                </p>
              </div>
            </div>
          </div>
        `;

        await sendMail({
          to: member.email,
          subject: subject,
          html: emailHtml,
          replyTo: 'office@sindikatncr.com',
          fromName: 'Milos Savin',
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

