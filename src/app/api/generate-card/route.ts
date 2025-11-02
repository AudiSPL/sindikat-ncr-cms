export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

console.log('=== generate-card/route.ts LOADED ===');

interface MemberData {
  id: string;
  fullName: string;
  email: string;
  quicklookId: string;
  city: string;
  organization: string;
  membershipNumber: string;
  status: string;
  joinDate: string;
}

function safeText(text: string): string {
  if (!text) return '';
  // SAMO LATINICA - uklanjanje svih ćiriličnih karaktera
  const cyrillicMap: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'dj',
    'е': 'e', 'ж': 'z', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k',
    'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'ћ': 'c', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'c', 'џ': 'dz', 'ш': 's',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ђ': 'DJ',
    'Е': 'E', 'Ж': 'Z', 'З': 'Z', 'И': 'I', 'Ј': 'J', 'К': 'K',
    'Л': 'L', 'Љ': 'LJ', 'М': 'M', 'Н': 'N', 'Њ': 'NJ', 'О': 'O',
    'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'Ћ': 'C', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'C', 'Џ': 'DZ', 'Ш': 'S'
  };
  
  return text.split('').map(char => cyrillicMap[char] || char).join('');
}

async function tryRead(filePath: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

// Funkcija za generisanje QR koda
async function generateQRCode(text: string): Promise<Buffer | null> {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
    const response = await fetch(qrUrl);
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
    return null;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}

export async function POST(request: Request) {
  console.log('=== PDF Card Generation Started ===');
  
  try {
    const requestBody = await request.json();
    console.log('Card request body received');

    const { memberId, memberData } = requestBody;
    console.log('Processing card for member:', memberId);

    if (!memberId || !memberData) {
      return NextResponse.json(
        { success: false, error: 'Missing memberId or memberData' },
        { status: 400 }
      );
    }

    // Učitaj PDF biblioteku
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    console.log('PDF library loaded for card');

    // Kreiraj novi PDF dokument za karticu
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([242.65, 153.07]); // ID kartica format

    const { width, height } = page.getSize();

    // Učitaj fontove
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Učitaj logo za watermark
    const logoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat-gold.png');
    const logoBuffer = await tryRead(logoPath);
    let logoImage;
    
    if (logoBuffer) {
      try {
        logoImage = await pdfDoc.embedPng(logoBuffer);
        console.log('Gold logo embedded for card');
      } catch (logoError) {
        console.warn('Gold logo failed for card');
      }
    }

    // Generiši QR kod
    const qrData = `SINDIKAT:${memberData.membershipNumber}:${safeText(memberData.fullName)}`;
    const qrBuffer = await generateQRCode(qrData);
    let qrImage;
    
    if (qrBuffer) {
      try {
        qrImage = await pdfDoc.embedPng(qrBuffer);
        console.log('QR code embedded for card');
      } catch (qrError) {
        console.warn('QR code embedding failed for card');
      }
    }

    // Pripremi podatke - SAMO LATINICA
    const safeName = safeText(memberData.fullName || '');
    console.log('Processed card name:', safeName);

    // TAMNO PLAVA POZADINA
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.1, 0.2, 0.4),
    });

    // WATERMARK LOGO - DOLE DO ŽUTE LINIJE
    if (logoImage) {
      const logoDims = logoImage.scale(0.06);
      page.drawImage(logoImage, {
        x: width - logoDims.width - 15,
        y: height - 60, // POMEREN DOLE DO LINIJE
        width: logoDims.width,
        height: logoDims.height,
        opacity: 0.3,
      });
    }

    // GORNJI DEO
    const goldColor = rgb(1, 0.84, 0);
    const whiteColor = rgb(1, 1, 1);

    page.drawText('SINDIKAT RADNIKA', {
      x: 15,
      y: height - 25,
      size: 7,
      font: fontBold,
      color: goldColor,
    });

    page.drawText('NCR ATLEOS', {
      x: 15,
      y: height - 38,
      size: 7,
      font: fontBold,
      color: goldColor,
    });

    page.drawText('CLANSKA KARTICA', {
      x: 15,
      y: height - 52,
      size: 6,
      font: fontBold,
      color: goldColor,
    });

    // Linija ispod naslova
    page.drawLine({
      start: { x: 10, y: height - 60 }, // LINIJA - LOGO IDE DO OVDE
      end: { x: width - 10, y: height - 60 },
      thickness: 1,
      color: goldColor,
    });

    // PODACI O ČLANU
    const infoStartY = height - 80;

    // Ime i prezime
    page.drawText('Ime i prezime:', {
      x: 15,
      y: infoStartY,
      size: 6,
      font: fontBold,
      color: whiteColor,
    });

    page.drawText(safeName, {
      x: 15,
      y: infoStartY - 15,
      size: 8,
      font: fontBold,
      color: whiteColor,
      maxWidth: width - 100,
    });

    // Datum učlanjenja
    const joinDate = new Date(memberData.joinDate).toLocaleDateString('sr-RS');
    page.drawText('Datum uclanjenja:', {
      x: 15,
      y: infoStartY - 35,
      size: 6,
      font: fontBold,
      color: whiteColor,
    });

    page.drawText(joinDate, {
      x: 15,
      y: infoStartY - 45,
      size: 7,
      font: fontRegular,
      color: whiteColor,
    });

    // Članski broj
    page.drawText('Clanski broj:', {
      x: 15,
      y: infoStartY - 60,
      size: 6,
      font: fontBold,
      color: whiteColor,
    });

    page.drawText(memberData.membershipNumber || '', {
      x: 15,
      y: infoStartY - 70,
      size: 7,
      font: fontRegular,
      color: whiteColor,
    });

    // QR KOD - BEZ ŽUTOG TEKSTA
    const qrSize = 50;
    const qrX = width - qrSize - 15;
    const qrY = infoStartY - 15;

    // Plava pozadina za QR kod - BEZ TEKSTA
    if (qrImage) {
      // Samo QR kod bez dodatnog teksta
      page.drawImage(qrImage, {
        x: qrX,
        y: qrY - qrSize,
        width: qrSize,
        height: qrSize,
      });
    } else {
      // Fallback - plavi kvadrat bez teksta
      page.drawRectangle({
        x: qrX,
        y: qrY - qrSize,
        width: qrSize,
        height: qrSize,
        color: rgb(0.15, 0.25, 0.45),
        borderColor: whiteColor,
        borderWidth: 1.5,
      });
    }

    // DONJI DEO - SAMO ID BROJ, BEZ "VAZI DO"
    page.drawText(`ID: ${memberData.membershipNumber || ''}`, {
      x: width - 60,
      y: 25,
      size: 5,
      font: fontRegular,
      color: goldColor,
    });

    console.log('Card PDF content drawn, generating...');

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    console.log('✅ Card PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF as response (no filesystem save)
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="card-${memberData.membershipNumber || memberId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('=== ERROR in generate-card ===');
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}