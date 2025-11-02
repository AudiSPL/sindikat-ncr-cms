import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

interface MemberData {
  fullName: string;
  email: string;
  quicklookId: string;
  city: string;
  organization: string;
  membershipNumber: string;
  status: string;
  joinDate: string;
}

export async function POST(request: Request) {
  try {
    const { memberId, memberData } = await request.json();

    if (!memberId || !memberData) {
      return NextResponse.json(
        { success: false, error: 'Missing memberId or memberData' },
        { status: 400 }
      );
    }

    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4

    const { width, height } = page.getSize();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title
    page.drawText('POTVRDA O ČLANSTVU', {
      x: 200,
      y: height - 100,
      size: 20,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Line under title
    page.drawLine({
      start: { x: 50, y: height - 130 },
      end: { x: width - 50, y: height - 130 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Member info
    const startY = height - 180;
    const lineHeight = 28;

    const info = memberData as MemberData;

    const memberInfo = [
      { label: 'Ime i prezime:', value: info.fullName || '' },
      { label: 'Email:', value: info.email || '' },
      { label: 'Quicklook ID:', value: info.quicklookId || '' },
      { label: 'Organizacija:', value: info.organization || '' },
      { label: 'Mesto:', value: info.city || '' },
      { label: 'Članski broj:', value: info.membershipNumber || '' },
      { label: 'Datum učlanjenja:', value: info.joinDate ? new Date(info.joinDate).toLocaleDateString('sr-RS') : '' },
      { label: 'Status:', value: 'Aktivan' },
    ];

    memberInfo.forEach((row, index) => {
      const yPos = startY - index * lineHeight;
      page.drawText(row.label, {
        x: 80,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      page.drawText(String(row.value), {
        x: 220,
        y: yPos,
        size: 12,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
    });

    // Footer
    const footerY = 120;
    page.drawText('Sa postovanjem,', {
      x: 80,
      y: footerY,
      size: 11,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });

    page.drawText('Sindikat Radnika NCR Atleos Beograd', {
      x: 80,
      y: footerY - 25,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // Create member directory
    const memberDir = path.join(process.cwd(), 'public', 'members', String(memberId));
    await fs.mkdir(memberDir, { recursive: true });

    // Save file
    const pdfPath = path.join(memberDir, 'pristupnica.pdf');
    await fs.writeFile(pdfPath, pdfBuffer);

    return NextResponse.json({
      success: true,
      pdfUrl: `/members/${memberId}/pristupnica.pdf`,
    });
  } catch (error: any) {
    console.error('Error generating pristupnica:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}





