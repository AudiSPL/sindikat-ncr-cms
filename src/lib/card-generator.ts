import { PDFDocument, rgb } from 'pdf-lib';
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
    // Load fontkit using dynamic import
    let fontkit;
    try {
      // @ts-expect-error fontkit has no type definitions
      const fontkitModule = await import('fontkit');
      fontkit = fontkitModule.default || fontkitModule;
      console.log('✅ fontkit loaded for card generation');
    } catch (e) {
      console.error('fontkit import error:', e);
      throw new Error('Failed to load fontkit: ' + (e instanceof Error ? e.message : 'Unknown'));
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Register fontkit
    pdfDoc.registerFontkit(fontkit);
    console.log('✅ fontkit registered for card');

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

    // Load fonts for Serbian support
    let fontBold, fontRegular;
    try {
      const fontPathBold = path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans-Bold.ttf');
      const fontPathReg = path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans.ttf');
      
      const fontBytesBold = await fs.readFile(fontPathBold);
      const fontBytesReg = await fs.readFile(fontPathReg);
      
      fontBold = await pdfDoc.embedFont(fontBytesBold);
      fontRegular = await pdfDoc.embedFont(fontBytesReg);
      console.log('✅ DejaVuSans fonts embedded for Serbian characters');
    } catch (e) {
      console.error('Font error:', e);
      throw new Error(`Fonts failed: ${e instanceof Error ? e.message : 'Unknown'}`);
    }

    // Colors
    const white = rgb(1, 1, 1);
    const darkBlue = rgb(0.102, 0.302, 0.431); // #1a4d6e
    const lightGray = rgb(0.878, 0.878, 0.878); // #E0E0E0

    // ROUNDED CORNERS: Use lineTo with arc for rounded rectangle
    // pdf-lib doesn't have roundedRect, so we'll draw a regular rectangle and rely on PDF viewer rendering
    // Draw white card background with border
    page.drawRectangle({
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      borderColor: lightGray,
      borderWidth: 1.5,
      color: white,
    });

    // Helper to draw text with embossed/shadow effect
    const drawTextEmbossed = (
      text: string,
      xPos: number,
      yPos: number,
      size: number,
      font: any
    ) => {
      const shadowOffset = 1; // points offset for shadow
      // Draw shadow first (slightly offset down-right)
      page.drawText(text, {
        x: xPos + shadowOffset,
        y: yPos - shadowOffset,
        size,
        font,
        color: rgb(0.9, 0.9, 0.9), // very light shadow
      });
      // Draw main text on top
      page.drawText(text, {
        x: xPos,
        y: yPos,
        size,
        font,
        color: darkBlue,
      });
    };

    // LEFT COLUMN (5mm padding from left edge)
    const leftMargin = 5 * mmToPoints;
    const topMargin = 5 * mmToPoints;

    // Title with embossed effect
    drawTextEmbossed(
      'SINDIKAT RADNIKA',
      x + leftMargin,
      y + cardHeight - topMargin - (10 * mmToPoints),
      10,
      fontBold
    );

    // Subtitle with embossed effect
    drawTextEmbossed(
      'NCR ATLEOS - BEOGRAD',
      x + leftMargin,
      y + cardHeight - topMargin - (15 * mmToPoints),
      10,
      fontRegular
    );

    // Member ID label with embossed effect
    drawTextEmbossed(
      'BROJ ČLANSKE KARTE:',
      x + leftMargin,
      y + cardHeight - topMargin - (22 * mmToPoints),
      9,
      fontRegular
    );

    // Member ID value with embossed effect
    drawTextEmbossed(
      memberId,
      x + leftMargin,
      y + cardHeight - topMargin - (28 * mmToPoints),
      9,
      fontBold
    );

    // Full name label with embossed effect
    drawTextEmbossed(
      'IME I PREZIME:',
      x + leftMargin,
      y + cardHeight - topMargin - (34 * mmToPoints),
      9,
      fontRegular
    );

    // Full name value with embossed effect
    const fullName = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
    drawTextEmbossed(
      fullName,
      x + leftMargin,
      y + cardHeight - topMargin - (40 * mmToPoints),
      9,
      fontBold
    );

    // Join date label with embossed effect
    drawTextEmbossed(
      'UČLANJEN:',
      x + leftMargin,
      y + cardHeight - topMargin - (46 * mmToPoints),
      8,
      fontRegular
    );

    // Join date value with embossed effect
    const joinDateObj = new Date(joinDate);
    const joinStr = `${String(joinDateObj.getMonth() + 1).padStart(2, '0')}/${joinDateObj.getFullYear()}`;
    drawTextEmbossed(
      joinStr,
      x + leftMargin,
      y + cardHeight - topMargin - (52 * mmToPoints),
      8,
      fontRegular
    );

    // RIGHT SIDE: Logo (TOP-RIGHT corner, 5mm from edges, 20mm x 20mm)
    try {
      const defaultLogoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat-union2.png');
      const finalLogoPath = logoPath || defaultLogoPath;
      const logoData = await fs.readFile(finalLogoPath);
      const logoImage = await pdfDoc.embedPng(logoData);
      
      const logoSize = 20 * mmToPoints;
      const logoX = x + cardWidth - logoSize - (5 * mmToPoints);
      const logoY = y + cardHeight - logoSize - (5 * mmToPoints);
      
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoSize,
        height: logoSize,
      });
      console.log('✅ Logo added to card');
    } catch (logoErr) {
      console.warn('⚠️ Logo load error:', logoErr);
    }

    // RIGHT SIDE: QR Code (BOTTOM-RIGHT corner, 5mm from edges, 20mm x 20mm, dark blue)
    try {
      const qrData = `MEMBER_ID:${memberId}|NAME:${firstName}|LASTNAME:${lastName}`;
      // Use qrserver.com with dark blue color
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=1a4d6e&bgcolor=FFFFFF&margin=0`;
      
      const qrResponse = await fetch(qrUrl);
      const qrBuffer = Buffer.from(await qrResponse.arrayBuffer());
      const qrImage = await pdfDoc.embedPng(qrBuffer);
      
      const qrSize = 20 * mmToPoints;
      const qrX = x + cardWidth - qrSize - (5 * mmToPoints);
      const qrY = y + (5 * mmToPoints);
      
      page.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
      });
      console.log('✅ QR code added to card');
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
