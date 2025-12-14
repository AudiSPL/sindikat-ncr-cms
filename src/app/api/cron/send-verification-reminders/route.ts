import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { generateVerificationToken } from '@/lib/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function GET(request: Request) {
  // Verify this is a cron request (from Vercel Cron)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('=== Verification Reminder Cron Started ===');

    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Find members where method_selected_at < 24 hours ago and verification_status = 'pending'
    // who haven't received a reminder yet
    const { data: allPendingMembers, error: fetchError } = await supabase
      .from('members')
      .select('id, full_name, email, quicklook_id, method_selected_at, verification_method, verification_status, reminder_email_sent')
      .eq('verification_status', 'pending')
      .lt('method_selected_at', twentyFourHoursAgo.toISOString())
      .not('method_selected_at', 'is', null);

    if (fetchError) {
      console.error('Error fetching pending members:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Filter out those who already received reminder (in case column doesn't exist yet)
    const pendingMembers = (allPendingMembers || []).filter(
      (m: any) => !m.reminder_email_sent || m.reminder_email_sent === false
    );

    if (!pendingMembers || pendingMembers.length === 0) {
      console.log('✅ No members need reminders');
      return NextResponse.json({ success: true, sent: 0 });
    }

    console.log(`Found ${pendingMembers.length} members needing reminders`);

    let sentCount = 0;
    let errorCount = 0;

    // Send reminder emails
    for (const member of pendingMembers) {
      try {
        // Generate verification token
        const token = generateVerificationToken(String(member.id), member.quicklook_id);

        // Extract first name
        const firstName = (member.full_name || '').split(' ')[0] || member.full_name;

        // Build verify URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const verifyUrl = `${baseUrl}/sr/verify?token=${token}`;

        // Send reminder email
        await transporter.sendMail({
          from: process.env.UNION_EMAIL || 'office@sindikatncr.com',
          to: member.email,
          bcc: 'sindikatncratleos@gmail.com',
          replyTo: 'office@sindikatncr.com',
          subject: 'Završite prijavljivanje - Sindikat NCR Atleos',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
              <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1a1a1a; margin-bottom: 15px;">📋 Završite prijavljivanje</h2>
                
                <p style="color: #333; line-height: 1.6;">Poštovani/a <strong>${firstName}</strong>,</p>
                
                <p style="color: #333; line-height: 1.6;">
                  Počeli ste prijavljivanje. Molimo vas da završite proces verifikacije.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verifyUrl}" 
                     style="background-color: #F28C38; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Završi verifikaciju sada →
                  </a>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                  <p style="color: #666; font-size: 12px;">
                    Pitanja? Pišite nam: <a href="mailto:office@sindikatncr.com" style="color: #005B99;">office@sindikatncr.com</a>
                  </p>
                  <p style="color: #666; font-size: 12px; margin-top: 10px;">
                    S poštovanjem,<br>
                    <strong>Sindikat Radnika NCR Atleos Beograd</strong>
                  </p>
                </div>
              </div>
            </div>
          `,
        });

        // Mark reminder as sent
        await supabase
          .from('members')
          .update({ reminder_email_sent: true })
          .eq('id', member.id);

        sentCount++;
        console.log(`✅ Reminder sent to: ${member.email}`);
      } catch (emailError) {
        errorCount++;
        console.error(`❌ Error sending reminder to ${member.email}:`, emailError);
      }
    }

    console.log(`✅ Reminder cron completed: ${sentCount} sent, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      sent: sentCount,
      errors: errorCount,
      total: pendingMembers.length,
    });
  } catch (error) {
    console.error('❌ Reminder cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

