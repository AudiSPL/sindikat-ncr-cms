import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PDFDocument, rgb } from 'pdf-lib';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    console.log('🔵 [test-email-with-pdf] Received request');
    
    // Generate PDF
    console.log('🔵 [test-email-with-pdf] Generating PDF...');
    const pdfBuffer = await generatePDF();
    
    console.log('✅ [test-email-with-pdf] PDF generated, size:', pdfBuffer.length);

    // Convert buffer to base64 for Resend
    const base64PDF = pdfBuffer.toString('base64');

    // Send email with attachment
    console.log('🔵 [test-email-with-pdf] Sending email...');
    const response = await resend.emails.send({
      from: 'noreply@sindikatncr.com', // Change to your verified sender
      to: 'savinmilos@gmail.com', // Change to your test email
      subject: '[TEST] PDF Attachment Test',
      html: `
        <h1>Test Email with PDF Attachment</h1>
        <p>This is a test email with a PDF attachment.</p>
        <p>Check the attachments section below.</p>
      `,
      attachments: [
        {
          filename: 'test-document.pdf',
          content: base64PDF,
        },
      ],
    });

    console.log('✅ [test-email-with-pdf] Email sent:', response);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      response,
    });
  } catch (error) {
    console.error('❌ [test-email-with-pdf] Error:', error);
    return NextResponse.json(
      { error: 'Email send failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function generatePDF(): Promise<Buffer> {
  try {
    console.log('🔵 [generatePDF] Creating PDFDocument with pdf-lib...');
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    console.log('🔵 [generatePDF] Writing content to PDF...');
    
    // Add text
    page.drawText('Member Application', {
      x: 50,
      y: height - 50,
      size: 20,
      color: rgb(0, 0, 0),
    });

    page.drawText('Generated: ' + new Date().toLocaleString(), {
      x: 50,
      y: height - 100,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Test member data goes here', {
      x: 50,
      y: height - 130,
      size: 12,
      color: rgb(0.5, 0.5, 0.5),
    });

    console.log('🔵 [generatePDF] Converting to bytes...');
    
    // Save PDF as bytes
    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    console.log('✅ [generatePDF] PDF created successfully, size:', buffer.length);
    
    return buffer;
  } catch (error) {
    console.error('❌ [generatePDF] Error:', error);
    throw error;
  }
}


