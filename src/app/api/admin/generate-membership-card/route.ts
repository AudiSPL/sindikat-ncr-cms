import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔵 [generate-card] Received request');
    
    const body = await req.json();
    const { type, members } = body;

    if (!type || !members) {
      return NextResponse.json(
        { error: 'Missing required fields: type, members' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['single', 'batch'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "single" or "batch"' },
        { status: 400 }
      );
    }

    console.log(`🔵 [generate-card] Generating ${type} card(s)...`);

    // Generate PDF using Python script
    const pdfBuffer = await generateCardPDF(type, members);

    console.log('✅ [generate-card] PDF generated successfully');

    return new NextResponse(pdfBuffer.buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="membership-cards-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('❌ [generate-card] Error:', error);
    return NextResponse.json(
      { error: 'Card generation failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function generateCardPDF(
  type: 'single' | 'batch',
  members: any[]
): Promise<Buffer> {
  try {
    // Create temporary Python script
    const pythonScript = await createPythonScript(type, members);
    
    // Execute Python script
    const { stdout, stderr } = await execPromise(`python3 "${pythonScript}"`);
    
    if (stderr && !stderr.includes('✓')) {
      console.error('Python error:', stderr);
      throw new Error(`Python execution failed: ${stderr}`);
    }

    // Read generated PDF
    const outputPath = '/tmp/membership_card_output.pdf';
    const pdfBuffer = fs.readFileSync(outputPath);

    // Clean up
    fs.unlinkSync(pythonScript);
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    return pdfBuffer;
  } catch (error) {
    console.error('❌ [generateCardPDF] Error:', error);
    throw error;
  }
}

async function createPythonScript(
  type: 'single' | 'batch',
  members: any[]
): Promise<string> {
  const pythonCode = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, '/mnt/user-data/outputs')

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import qrcode
from datetime import datetime
from io import BytesIO
import json

class MembershipCardGenerator:
    def __init__(self):
        self.card_width = 85.6 * mm
        self.card_height = 53.98 * mm
        self.bg_color = colors.white
        self.text_color = colors.HexColor('#1a4d6e')
        self.shadow_color = colors.HexColor('#d0d0d0')
        
        try:
            pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
            pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
            self.font_normal = 'DejaVuSans'
            self.font_bold = 'DejaVuSans-Bold'
        except:
            self.font_normal = 'Helvetica'
            self.font_bold = 'Helvetica-Bold'
    
    def generate_qr_code(self, member_id, name, lastname):
        qr_data = f"MEMBER_ID:{member_id}|NAME:{name}|LASTNAME:{lastname}"
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=2)
        qr.add_data(qr_data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        return img_buffer
    
    def draw_card(self, c, x, y, name, lastname, member_id, join_date):
        shadow_offset = 0.5*mm
        c.setFillColor(self.shadow_color)
        c.roundRect(x + shadow_offset, y - shadow_offset, self.card_width, self.card_height, 4*mm, fill=1, stroke=0)
        
        c.setFillColor(self.bg_color)
        c.roundRect(x, y, self.card_width, self.card_height, 4*mm, fill=1, stroke=0)
        
        c.setFillColor(self.text_color)
        c.setFont(self.font_bold, 11)
        org_y = y + self.card_height - 9*mm
        c.drawString(x + 7*mm, org_y, "SINDIKAT RADNIKA")
        
        c.setFont(self.font_bold, 7)
        c.drawString(x + 7*mm, org_y - 4.5*mm, "NCR ATLEOS - BEOGRAD")
        
        qr_size = 17*mm
        right_margin = 1.5*mm
        qr_img_buffer = self.generate_qr_code(member_id, name, lastname)
        qr_img = ImageReader(qr_img_buffer)
        qr_x = x + self.card_width - qr_size - right_margin
        qr_y = y + 3*mm
        c.drawImage(qr_img, qr_x, qr_y, width=qr_size, height=qr_size, mask='auto')
        
        info_start_y = y + 24*mm
        
        c.setFont(self.font_normal, 7)
        c.drawString(x + 8*mm, info_start_y, "IME I PREZIME:")
        
        c.setFont(self.font_bold, 11)
        full_name = f"{name.upper()} {lastname.upper()}"
        c.drawString(x + 8*mm, info_start_y - 5*mm, full_name)
        
        c.setFont(self.font_normal, 7)
        c.drawString(x + 8*mm, info_start_y - 11*mm, "BROJ ČLANSKE KARTE:")
        
        c.setFont(self.font_bold, 10)
        c.drawString(x + 8*mm, info_start_y - 16*mm, str(member_id))
        
        if isinstance(join_date, str):
            join_date_obj = datetime.strptime(join_date, "%Y-%m-%d")
        else:
            join_date_obj = join_date
        
        join_str = join_date_obj.strftime("%m/%Y")
        
        c.setFont(self.font_normal, 7)
        c.drawString(x + 8*mm, info_start_y - 21.5*mm, "UČLANJEN:")
        c.setFont(self.font_bold, 7)
        c.drawString(x + 22*mm, info_start_y - 21.5*mm, join_str)
        
        c.setStrokeColor(colors.HexColor('#e0e0e0'))
        c.setLineWidth(0.5)
        c.setFillColor(colors.transparent)
        c.roundRect(x, y, self.card_width, self.card_height, 4*mm, fill=0, stroke=1)
    
    def generate_single_card(self, name, lastname, member_id, join_date, output_filename):
        page_width = self.card_width + 20*mm
        page_height = self.card_height + 20*mm
        c = canvas.Canvas(output_filename, pagesize=(page_width, page_height))
        x = 10*mm
        y = 10*mm
        self.draw_card(c, x, y, name, lastname, member_id, join_date)
        c.save()
    
    def generate_multiple_cards(self, members_list, output_filename):
        c = canvas.Canvas(output_filename, pagesize=letter)
        page_width, page_height = letter
        
        margin_x = 12*mm
        margin_y = 15*mm
        spacing_x = 8*mm
        spacing_y = 10*mm
        
        cards_per_row = 2
        cards_per_column = 3
        
        for idx, member in enumerate(members_list):
            row = (idx % (cards_per_row * cards_per_column)) // cards_per_row
            col = (idx % (cards_per_row * cards_per_column)) % cards_per_row
            
            x = margin_x + col * (self.card_width + spacing_x)
            y = page_height - margin_y - (row + 1) * (self.card_height + spacing_y)
            
            self.draw_card(c, x, y, member['name'], member['lastname'], member['member_id'], member['join_date'])
            
            if (idx + 1) % (cards_per_row * cards_per_column) == 0 and idx + 1 < len(members_list):
                c.showPage()
        
        c.save()

generator = MembershipCardGenerator()
members = json.loads('''${JSON.stringify(members)}''')

if "${type}" == "single" and len(members) > 0:
    m = members[0]
    generator.generate_single_card(m['name'], m['lastname'], m['member_id'], m['join_date'], '/tmp/membership_card_output.pdf')
else:
    generator.generate_multiple_cards(members, '/tmp/membership_card_output.pdf')

print("✓ PDF generated successfully")
`;

  const scriptPath = `/tmp/generate_card_${Date.now()}.py`;
  fs.writeFileSync(scriptPath, pythonCode);
  return scriptPath;
}



