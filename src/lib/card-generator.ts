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

    // Card dimensions in mm (CREDIT CARD SIZE)
    const cardWidthMM = 85.6;
    const cardHeightMM = 53.98;
    
    // Convert mm to points (1mm = 2.83465 points at 72 DPI)
    const mmToPoints = 2.83465;
    const cardWidth = cardWidthMM * mmToPoints;
    const cardHeight = cardHeightMM * mmToPoints;

    // Add a card-sized page (NOT Letter/A4)
    const page = pdfDoc.addPage([cardWidth, cardHeight]);
    
    // Card starts at origin (0,0) since page is card-sized
    const cardX = 0;
    const cardY = 0;

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
    const red = rgb(0.768, 0.118, 0.227); // #C41E3A
    const lightGray = rgb(0.878, 0.878, 0.878); // #E0E0E0

    // Draw white card background with rounded corners
    // pdf-lib doesn't support roundedRect natively, but we'll use border color
    page.drawRectangle({
      x: cardX,
      y: cardY,
      width: cardWidth,
      height: cardHeight,
      borderColor: lightGray,
      borderWidth: 1,
      color: white,
    });

    // Helper to draw text with embossed/shadow effect
    const drawTextEmbossed = (
      text: string,
      xPos: number,
      yPos: number,
      size: number,
      font: any,
      color: any
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
        color,
      });
    };

    // RIGHT SIDE FIRST: Calculate logo and QR positions for alignment
    const rightMargin = 8 * mmToPoints;
    const topMargin = 8 * mmToPoints;
    const bottomMargin = 8 * mmToPoints;
    
    // Logo size: 41.31mm (45.9mm reduced by 10%)
    const logoSize = 41.31 * mmToPoints;
    const qrSize = 13.5 * mmToPoints;
    
    // Logo position: TOP-RIGHT CORNER (extends beyond card edges)
    const logoX = cardX + cardWidth - logoSize + (8 * mmToPoints); // 8mm outside (moved 1mm left)
    const logoY = cardY + cardHeight - logoSize + (9 * mmToPoints); // 9mm outside (moved 1mm down)
    const qrY = cardY + bottomMargin; // From bottom

    // DRAW LOGO FIRST (behind text)
    try {
      const defaultLogoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat-union.png');
      const finalLogoPath = logoPath || defaultLogoPath;
      const logoData = await fs.readFile(finalLogoPath);
      const logoImage = await pdfDoc.embedPng(logoData);
      
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoSize,
        height: logoSize,
      });
      console.log('✅ Logo added to card (behind text, top-right)');
    } catch (logoErr) {
      console.warn('⚠️ Logo load error:', logoErr);
    }

    // LEFT COLUMN TEXT: Increased spacing by 1mm (6mm instead of 5mm)
    const leftMargin = 6 * mmToPoints;
    let currentY = cardY + cardHeight - topMargin;

    // Title with embossed effect - RED color (aligns with logo top)
    drawTextEmbossed(
      'SINDIKAT RADNIKA',
      cardX + leftMargin,
      currentY,
      11,
      fontBold,
      red
    );

    // Subtitle with embossed effect - BOLD (increased spacing)
    currentY -= 5 * mmToPoints;
    drawTextEmbossed(
      'NCR ATLEOS - BEOGRAD',
      cardX + leftMargin,
      currentY,
      10,
      fontBold, // BOLD
      darkBlue
    );

    // Member ID label (LARGE GAP after subtitle: 8-10mm)
    currentY -= 9 * mmToPoints;
    drawTextEmbossed(
      'BROJ ČLANSKE KARTE:',
      cardX + leftMargin,
      currentY,
      9,
      fontRegular,
      darkBlue
    );

    // Member ID value
    currentY -= 4 * mmToPoints;
    drawTextEmbossed(
      memberId,
      cardX + leftMargin,
      currentY,
      9,
      fontBold,
      darkBlue
    );

    // Full name label (increased spacing)
    currentY -= 6 * mmToPoints;
    drawTextEmbossed(
      'IME I PREZIME:',
      cardX + leftMargin,
      currentY,
      9,
      fontRegular,
      darkBlue
    );

    // Full name value
    const fullName = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
    currentY -= 4 * mmToPoints;
    drawTextEmbossed(
      fullName,
      cardX + leftMargin,
      currentY,
      9,
      fontBold,
      darkBlue
    );

    // Join date label (increased spacing)
    currentY -= 6 * mmToPoints;
    drawTextEmbossed(
      'UČLANJEN:',
      cardX + leftMargin,
      currentY,
      8,
      fontRegular,
      darkBlue
    );

    // Join date value (aligns with QR code bottom)
    const joinDateObj = new Date(joinDate);
    const joinStr = `${String(joinDateObj.getMonth() + 1).padStart(2, '0')}/${joinDateObj.getFullYear()}`;
    currentY -= 4 * mmToPoints;
    drawTextEmbossed(
      joinStr,
      cardX + leftMargin,
      currentY,
      8,
      fontRegular,
      darkBlue
    );

    // RIGHT SIDE: QR Code (BOTTOM-RIGHT, 13.5mm, dark blue)
    try {
      const qrData = `MEMBER_ID:${memberId}|NAME:${firstName}|LASTNAME:${lastName}`;
      // Use qrserver.com with dark blue color
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=1a4d6e&bgcolor=FFFFFF&margin=0`;
      
      const qrResponse = await fetch(qrUrl);
      const qrBuffer = Buffer.from(await qrResponse.arrayBuffer());
      const qrImage = await pdfDoc.embedPng(qrBuffer);
      
      const qrX = cardX + cardWidth - qrSize - rightMargin + (2 * mmToPoints); // Moved 2mm right
      
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
