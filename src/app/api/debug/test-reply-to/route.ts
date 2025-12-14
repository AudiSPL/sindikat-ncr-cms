import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testEmail = searchParams.get('to');
  
  if (!testEmail) {
    return NextResponse.json({
      error: 'Missing "to" parameter. Usage: /api/debug/test-reply-to?to=your-email@example.com'
    }, { status: 400 });
  }
  
  try {
    await sendMail({
      to: testEmail,
      subject: 'TEST - Reply-To Header Verification',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e40af;">Reply-To Header Test</h1>
          
          <p>Ovo je test email za verifikaciju replyTo header-a.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Instrukcije za testiranje:</h2>
            <ol>
              <li>Klikni "Reply" na ovaj email</li>
              <li>Proveri da reply ide na: <strong>office@sindikatncr.com</strong></li>
              <li>Proveri da email NIJE u spam folderu</li>
            </ol>
          </div>
          
          <p><strong>Očekivani rezultat:</strong></p>
          <ul>
            <li>✅ Reply adresa: office@sindikatncr.com</li>
            <li>✅ Email u inbox-u (ne spam)</li>
          </ul>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="font-size: 12px; color: #6b7280;">
            Test poslat: ${new Date().toLocaleString('sr-RS')}<br>
            Poslato na: ${testEmail}
          </p>
        </body>
        </html>
      `
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      details: {
        to: testEmail,
        from: 'Sindikat NCR <predsednik@sindikatncr.com>',
        replyTo: 'office@sindikatncr.com',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

