// Based on the Python ReportLab design
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export async function generateMembershipCard(
  firstName: string,
  lastName: string,
  memberId: string,
  joinDate: string,  // Format: YYYY-MM-DD
  logoPath?: string
): Promise<Buffer> {
  try {
    // Default logo path if not provided
    const defaultLogoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat-union.png');
    const finalLogoPath = logoPath || defaultLogoPath;

    // Card dimensions (credit card size in mm)
    const cardWidth = 85.6;
    const cardHeight = 53.98;

    // Create PDF with card dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [cardWidth + 20, cardHeight + 20],
    });

    // Colors
    const textColor = [26, 77, 110]; // #1a4d6e dark blue
    const shadowColor = [208, 208, 208]; // #d0d0d0 light gray

    // Position card on page
    const x = 10;
    const y = 10;

    // Draw shadow (subtle)
    pdf.setFillColor(shadowColor[0], shadowColor[1], shadowColor[2]);
    pdf.roundedRect(x + 0.5, y - 0.5, cardWidth, cardHeight, 4, 4, 'F');

    // Draw white card background
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'F');

    // Draw card border
    pdf.setDrawColor(224, 224, 224);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(x, y, cardWidth, cardHeight, 4, 4, 'S');

    // Set text color to dark blue
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

    // TOP SECTION: Organization name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('SINDIKAT RADNIKA', x + 7, y + cardHeight - 9);

    // Subtitle
    pdf.setFontSize(7);
    pdf.text('NCR ATLEOS - BEOGRAD', x + 7, y + cardHeight - 13.5);

    // MEMBER INFO SECTION (left side, bottom)
    const infoStartY = y + 24;

    // Name label
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('IME I PREZIME:', x + 8, infoStartY);

    // Name value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    const fullName = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
    pdf.text(fullName, x + 8, infoStartY - 5);

    // Member ID label
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text('BROJ ČLANSKE KARTE:', x + 8, infoStartY - 11);

    // Member ID value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(memberId, x + 8, infoStartY - 16);

    // Join date
    const joinDateObj = new Date(joinDate);
    const joinStr = `${String(joinDateObj.getMonth() + 1).padStart(2, '0')}/${joinDateObj.getFullYear()}`;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text('UČLANJEN:', x + 8, infoStartY - 21.5);

    pdf.setFont('helvetica', 'bold');
    pdf.text(joinStr, x + 22, infoStartY - 21.5);

    // RIGHT SIDE: QR Code (bottom right)
    try {
      const qrData = `MEMBER_ID:${memberId}|NAME:${firstName}|LASTNAME:${lastName}`;
      const qrDataUrl = await QRCode.toDataURL(qrData, { width: 200 });
      
      // QR code positioned at bottom right
      const qrSize = 17; // mm
      const qrX = x + cardWidth - qrSize - 1.5;
      const qrY = y + 3;
      
      pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    } catch (qrErr) {
      console.error('⚠️ QR code generation error:', qrErr);
    }

    // RIGHT SIDE: Logo (top right)
    try {
      if (fs.existsSync(finalLogoPath)) {
        const logoSize = 25; // mm
        const logoX = x + cardWidth - logoSize - 1.5;
        const logoY = y + cardHeight - logoSize + 0.5;
        
        const logoData = fs.readFileSync(finalLogoPath);
        pdf.addImage(logoData, 'PNG', logoX, logoY, logoSize, logoSize);
      }
    } catch (logoErr) {
      console.error('⚠️ Logo load error:', logoErr);
    }

    // Generate PDF buffer (no filesystem write)
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    console.log('✅ Card generated successfully, size:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;
  } catch (error) {
    console.error('❌ Card generation error:', error);
    throw error;
  }
}

