import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export async function generateMembershipCard(
  firstName: string,
  lastName: string,
  memberId: string,
  joinDate: string,  // Format: YYYY-MM-DD
  logoPath?: string
): Promise<Buffer> {
  try {
    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Card dimensions in mm
    const cardWidthMM = 85.6;
    const cardHeightMM = 53.98;
    
    // Convert mm to points (1mm = 2.83465 points at 72 DPI)
    const mmToPoints = 2.83465;
    const cardWidth = cardWidthMM * mmToPoints;
    const cardHeight = cardHeightMM * mmToPoints;
    const pageWidth = 612; // Letter width in points
    const pageHeight = 792; // Letter height in points

    // Center card on letter-size page
    const x = (pageWidth - cardWidth) / 2;
    const y = (pageHeight - cardHeight) / 2;

    // Add a letter-size page
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Embed fonts once
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Colors
    const white = rgb(1, 1, 1);
    const darkBlue = rgb(0.102, 0.302, 0.431); // #1a4d6e
    const lightGray = rgb(0.878, 0.878, 0.878); // #E0E0E0

    // Draw white card background
    page.drawRectangle({
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      borderColor: lightGray,
      borderWidth: 1,
      color: white,
    });

    // LEFT COLUMN: Title
    page.drawText('SINDIKAT RADNIKA', {
      x: x + 10 * mmToPoints,
      y: y + cardHeight - 10 * mmToPoints,
      size: 10,
      font: helveticaBold,
      color: darkBlue,
    });

    // Subtitle
    page.drawText('NCR ATLEOS - BEOGRAD', {
      x: x + 10 * mmToPoints,
      y: y + cardHeight - 15 * mmToPoints,
      size: 10,
      font: helvetica,
      color: darkBlue,
    });

    // Member ID label
    page.drawText('BROJ ČLANSKE KARTE:', {
      x: x + 10 * mmToPoints,
      y: y + cardHeight - 20 * mmToPoints,
      size: 9,
      font: helvetica,
      color: darkBlue,
    });

    // Member ID value
    page.drawText(memberId, {
      x: x + 10 * mmToPoints,
      y: y + cardHeight - 28 * mmToPoints,
      size: 9,
      font: helveticaBold,
      color: darkBlue,
    });

    // Full name label
    page.drawText('IME I PREZIME:', {
      x: x + 10 * mmToPoints,
      y: y + cardHeight - 34 * mmToPoints,
      size: 9,
      font: helvetica,
      color: darkBlue,
    });

    // Full name value
    const fullName = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
    page.drawText(fullName, {
      x: x + 10 * mmToPoints,
      y: y + cardHeight - 42 * mmToPoints,
      size: 9,
      font: helveticaBold,
      color: darkBlue,
    });

    // Join date label
    page.drawText('UČLANJEN:', {
      x: x + 10 * mmToPoints,
      y: y + cardHeight - 48 * mmToPoints,
      size: 8,
      font: helvetica,
      color: darkBlue,
    });

    // Join date value
    const joinDateObj = new Date(joinDate);
    const joinStr = `${String(joinDateObj.getMonth() + 1).padStart(2, '0')}/${joinDateObj.getFullYear()}`;
    page.drawText(joinStr, {
      x: x + 10 * mmToPoints,
      y: y + cardHeight - 55 * mmToPoints,
      size: 8,
      font: helvetica,
      color: darkBlue,
    });

    // RIGHT SIDE: Logo
    try {
      const defaultLogoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat.png');
      const finalLogoPath = logoPath || defaultLogoPath;
      const logoData = await fs.readFile(finalLogoPath);
      const logoImage = await pdfDoc.embedPng(logoData);
      
      const logoSize = 25 * mmToPoints;
      const logoX = x + cardWidth - logoSize - 10 * mmToPoints;
      const logoY = y + cardHeight - logoSize - 10 * mmToPoints;
      
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoSize,
        height: logoSize,
      });
    } catch (logoErr) {
      console.warn('⚠️ Logo load error:', logoErr);
    }

    // RIGHT SIDE: QR Code
    try {
      const qrData = `MEMBER_ID:${memberId}|NAME:${firstName}|LASTNAME:${lastName}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
      
      const qrResponse = await fetch(qrUrl);
      const qrBuffer = Buffer.from(await qrResponse.arrayBuffer());
      const qrImage = await pdfDoc.embedPng(qrBuffer);
      
      const qrSize = 17 * mmToPoints;
      const qrX = x + cardWidth - qrSize - 10 * mmToPoints;
      const qrY = y + 10 * mmToPoints;
      
      page.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
      });
    } catch (qrErr) {
      console.warn('⚠️ QR code generation error:', qrErr);
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);
    console.log('✅ Card generated successfully, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;
  } catch (error) {
    console.error('❌ Card generation error:', error);
    throw error;
  }
}
