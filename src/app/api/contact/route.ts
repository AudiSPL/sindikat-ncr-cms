import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.log('📧 Contact form submission:', { name, email, subject });

    // Send email to admin
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #0B2C49; margin-bottom: 15px;">📧 New Contact Form Submission</h2>
          
          <div style="margin-bottom: 15px;">
            <p style="color: #333; line-height: 1.6;"><strong>Name:</strong> ${name}</p>
            <p style="color: #333; line-height: 1.6;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #005B99;">${email}</a></p>
            <p style="color: #333; line-height: 1.6;"><strong>Subject:</strong> ${subject}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
            <p style="color: #333; line-height: 1.6;"><strong>Message:</strong></p>
            <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              This message was sent from the contact form on sindikatncr.com
            </p>
          </div>
        </div>
      </div>
    `;

    await sendMail({
      to: process.env.CONTACT_EMAIL || 'office@sindikatncr.com',
      subject: `Contact Form: ${subject}`,
      html: emailHtml,
      replyTo: email,
    });

    console.log('✅ Contact form email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

