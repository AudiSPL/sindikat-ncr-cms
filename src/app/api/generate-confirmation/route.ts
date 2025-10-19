export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

interface ConfirmationData {
  memberId: string | number;
  memberData: {
    fullName: string;
    email: string;
    quicklookId?: string;
    city?: string;
    organization?: string;
    membershipNumber?: string;
    joinDate?: string;
  };
}

export async function POST(request: Request) {
  try {
    const { memberId, memberData } = (await request.json()) as ConfirmationData;
    if (!memberId || !memberData?.fullName) {
      return NextResponse.json(
        { success: false, error: 'Missing memberId or memberData.fullName' },
        { status: 400 }
      );
    }

    // Load pdf-lib dynamically
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait in points
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Helper to strip diacritics for WinAnsi fonts
    const toAscii = (s: string) => (s || '')
      .replace(/č/g, 'c').replace(/ć/g, 'c').replace(/ž/g, 'z').replace(/š/g, 's').replace(/đ/g, 'dj')
      .replace(/Č/g, 'C').replace(/Ć/g, 'C').replace(/Ž/g, 'Z').replace(/Š/g, 'S').replace(/Đ/g, 'DJ');

    // Try to embed brand logo (non-fatal if missing)
    try {
      const logoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat-blackonwhite.png');
      const logoBuf = await fs.readFile(logoPath);
      try {
        const logoImg = await pdfDoc.embedPng(logoBuf);
        const dims = logoImg.scale(0.1);
        page.drawImage(logoImg, { x: 50, y: height - 120, width: dims.width, height: dims.height });
      } catch {}
    } catch {}

    // Title
    page.drawText(toAscii('POTVRDA O CLANSTVU'), { x: 200, y: height - 100, size: 20, font: fontBold, color: rgb(0, 0, 0) });
    // Divider under title
    page.drawLine({ start: { x: 50, y: height - 130 }, end: { x: width - 50, y: height - 130 }, thickness: 2, color: rgb(0, 0, 0) });

    // Body text
    const textColor = rgb(0.1, 0.1, 0.1);
    let cursorY = height - 120;
    const lineGap = 20;

    // Member info block (matches previous CMS layout)
    const startY = height - 180;
    const lineH = 28;
    const safe = (s?: string) => toAscii(String(s || ''));
    const memberInfo = [
      { label: 'Ime i prezime:', value: safe(memberData.fullName) },
      { label: 'Quicklook ID:', value: safe(memberData.quicklookId) },
      { label: 'Organizacija:', value: safe(memberData.organization) },
      { label: 'Mesto:', value: safe(memberData.city) },
      { label: 'Datum uclanjenja:', value: toAscii(memberData.joinDate ? new Date(memberData.joinDate).toLocaleDateString('sr-RS') : '-') },
      { label: 'Status:', value: toAscii('Aktivan') },
      { label: 'Email:', value: safe(memberData.email) },
      { label: 'Clanski broj:', value: safe(memberData.membershipNumber) },
    ];

    memberInfo.forEach((info, idx) => {
      const y = startY - (idx * lineH);
      page.drawText(toAscii(info.label), { x: 80, y, size: 12, font: fontBold, color: rgb(0, 0, 0) });
      page.drawText(info.value, { x: 220, y, size: 12, font: fontRegular, color: rgb(0, 0, 0), maxWidth: width - 250 });
    });

    // Footer
    page.drawLine({ start: { x: 50, y: 70 }, end: { x: width - 50, y: 70 }, thickness: 1, color: rgb(0, 0, 0) });
    page.drawText(toAscii('S postovanjem,'), { x: 80, y: 120, size: 11, font: fontRegular, color: rgb(0, 0, 0) });
    page.drawText(toAscii('Sindikat Radnika NCR Atleos Beograd'), { x: 80, y: 95, size: 12, font: fontBold, color: rgb(0, 0, 0) });
    page.drawText(toAscii(`Datum izdavanja: ${new Date().toLocaleDateString('sr-RS')}`), { x: 400, y: 45, size: 10, font: fontRegular, color: rgb(0, 0, 0) });

    let pdfBuffer: Buffer;
    try {
      const pdfBytes = await pdfDoc.save();
      pdfBuffer = Buffer.from(pdfBytes);
    } catch (e: any) {
      console.error('generate-confirmation save() error:', e?.message || e);
      throw e;
    }

    const memberDir = path.join(process.cwd(), 'public', 'members', String(memberId));
    try {
      await fs.mkdir(memberDir, { recursive: true });
    } catch (e: any) {
      console.error('generate-confirmation mkdir error:', e?.message || e);
    }
    const pdfPath = path.join(memberDir, 'confirmation.pdf');
    try {
      await fs.writeFile(pdfPath, pdfBuffer);
    } catch (e: any) {
      console.error('generate-confirmation writeFile error:', e?.message || e);
      throw e;
    }

    return NextResponse.json({
      success: true,
      pdfUrl: `/members/${memberId}/confirmation.pdf`,
      message: 'Confirmation PDF generated successfully',
    });
  } catch (error) {
    console.error('generate-confirmation fatal error:', (error as any)?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate confirmation PDF',
      },
      { status: 500 }
    );
  }
}


