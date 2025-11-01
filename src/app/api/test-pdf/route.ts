import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';

export async function GET(req: NextRequest) {
  console.log('🔵 [test-pdf] Received request');

  try {
    console.log('🔵 [test-pdf] Starting PDF generation with pdf-lib...');
    
    const pdfBuffer = await generatePDF();
    
    console.log('✅ [test-pdf] PDF generated successfully, size:', pdfBuffer.length);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="test.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('❌ [test-pdf] Error:', error);

    return NextResponse.json(
      { 
        error: 'PDF generation failed',
        message: String(error),
      },
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
    page.drawText('Test PDF', {
      x: 50,
      y: height - 50,
      size: 25,
      color: rgb(0, 0, 0),
    });

    page.drawText('This is a test PDF created locally', {
      x: 50,
      y: height - 100,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Generated: ' + new Date().toISOString(), {
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


