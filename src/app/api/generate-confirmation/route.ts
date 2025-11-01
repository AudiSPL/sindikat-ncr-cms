import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { PDFDocument, rgb } from 'pdf-lib';

console.log('=== generate-confirmation/route.ts LOADED ===');

interface MemberData {
  id: string;
  fullName: string;
  email: string;
  city: string;
  organization: string;
  membershipNumber: string;
  status: string;
  joinDate: string;
}

export async function POST(request: Request) {
  console.log('=== PDF Confirmation Generation Started ===');
  
  try {
    const requestBody = await request.json();
    console.log('Request body received');

    const { memberId, memberData } = requestBody;
    console.log('Processing member:', memberId);

    if (!memberId || !memberData) {
      return NextResponse.json(
        { success: false, error: 'Missing memberId or memberData' },
        { status: 400 }
      );
    }

    // Load fontkit using dynamic import
    let fontkit;
    try {
      // @ts-expect-error fontkit has no type definitions
      const fontkitModule = await import('fontkit');
      fontkit = fontkitModule.default || fontkitModule;
      console.log('✅ fontkit loaded');
    } catch (e) {
      console.error('fontkit import error:', e);
      throw new Error('Failed to load fontkit: ' + (e instanceof Error ? e.message : 'Unknown'));
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Register fontkit
    pdfDoc.registerFontkit(fontkit);
    console.log('✅ fontkit registered');

    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Load fonts
    let fontBold, fontRegular;
    
    try {
      const fontPathBold = path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans-Bold.ttf');
      const fontPathReg = path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans.ttf');

      console.log('Reading font:', fontPathBold);
      const fontBytesBold = await fs.readFile(fontPathBold);
      const fontBytesReg = await fs.readFile(fontPathReg);

      console.log('Embedding fonts...');
      fontBold = await pdfDoc.embedFont(fontBytesBold);
      fontRegular = await pdfDoc.embedFont(fontBytesReg);

      console.log('✅ Fonts embedded successfully - Serbian characters ready');
    } catch (e) {
      console.error('Font error:', e);
      throw new Error(`Fonts failed: ${e instanceof Error ? e.message : 'Unknown'}`);
    }

    // Load logo
    let logoImage: any = null;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat-blackonwhite.png');
      const logoBuffer = await fs.readFile(logoPath);
      logoImage = await pdfDoc.embedPng(logoBuffer);
      console.log('✅ Logo loaded');
    } catch (e) {
      console.warn('Logo not found - continuing without logo');
    }

    // Draw logo
    if (logoImage) {
      page.drawImage(logoImage, {
        x: 50,
        y: height - 145,
        width: 80,
        height: 80,
      });
    }

    // Draw title
    page.drawText('POTVRDA O ČLANSTVU', {
      x: 150,
      y: height - 105,
      size: 24,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    console.log('✅ Title drawn with Serbian characters');

    // Draw line
    page.drawLine({
      start: { x: 50, y: height - 155 },
      end: { x: width - 50, y: height - 155 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Member information
    let yPos = height - 200;
    const lineHeight = 35;

    const memberInfo = [
      { label: 'Ime i prezime:', value: memberData.fullName || '' },
      { label: 'ORGANIZACIJA/TIM:', value: memberData.organization || memberData.division || '' },
      { label: 'Mesto:', value: memberData.city || '' },
      { label: 'Datum učlanjenja:', value: new Date(memberData.joinDate || memberData.created_at || new Date()).toLocaleDateString('sr-RS') },
      { label: 'Status:', value: memberData.status === 'active' ? 'Aktivan' : 'Neaktivan' },
      { label: 'Email:', value: memberData.email || '' },
      { label: 'Članski broj:', value: memberData.membershipNumber || '' },
    ];

    memberInfo.forEach((info) => {
      page.drawText(info.label, {
        x: 80,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(info.value, {
        x: 240,
        y: yPos,
        size: 12,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      yPos -= lineHeight;
    });

    console.log('✅ Member information drawn');

    // Footer - right side
    page.drawText('S poštovanjem,', {
      x: 300,
      y: 180,
      size: 12,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });

    page.drawText('Sindikat Radnika NCR Atleos Beograd', {
      x: 300,
      y: 150,
      size: 13,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    console.log('✅ Footer added');

    // Bottom line
    page.drawLine({
      start: { x: 50, y: 70 },
      end: { x: width - 50, y: 70 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Issue date
    page.drawText(`Datum izdavanja: ${new Date().toLocaleDateString('sr-RS')}`, {
      x: 350,
      y: 45,
      size: 10,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // Create directory and save
    const memberDir = path.join(process.cwd(), 'public', 'members', String(memberId));
    await fs.mkdir(memberDir, { recursive: true });

    const pdfPath = path.join(memberDir, 'confirmation.pdf');
    await fs.writeFile(pdfPath, pdfBuffer);

    console.log('✅ PDF saved successfully at:', pdfPath);

    return NextResponse.json({
      success: true,
      pdfUrl: `/members/${memberId}/confirmation.pdf`,
      message: 'PDF confirmation generated successfully'
    });

  } catch (error) {
    console.error('=== ERROR in generate-confirmation ===');
    console.error(error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
