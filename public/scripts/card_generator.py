#!/usr/bin/env python3
"""
Membership Card Generator for Sindikat NCR Atleos
Generates PDF membership cards with white background, dark blue text, logo, and QR code
"""

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import os
import tempfile
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import qrcode
from PIL import Image

# Register DejaVuSans fonts for Serbian Latin character support (Č, Š, Ž, Đ, etc.)
def register_fonts():
    """Register DejaVuSans fonts if not already registered"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    fonts_dir = os.path.join(script_dir, '..', 'fonts')
    
    # Register regular and bold variants
    try:
        if 'DejaVuSans' not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont('DejaVuSans', os.path.join(fonts_dir, 'DejaVuSans.ttf')))
        if 'DejaVuSans-Bold' not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', os.path.join(fonts_dir, 'DejaVuSans-Bold.ttf')))
        print("[OK] DejaVuSans fonts registered")
    except Exception as e:
        print(f"[WARNING] Font registration failed: {e}, falling back to Helvetica")

# Register fonts on module load
register_fonts()

class MembershipCardGenerator:
    def __init__(self, logo_path=None):
        self.logo_path = logo_path
        
        # Card dimensions (credit card size in mm)
        self.card_width = 85.6 * mm
        self.card_height = 53.98 * mm
        
        # Colors
        self.text_color = HexColor('#1a4d6e')  # Dark blue
        self.white = HexColor('#FFFFFF')
        
    def generate_single_card(self, firstName, lastName, memberId, joinDate, outputPath):
        """Generate a single membership card PDF"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(outputPath), exist_ok=True)
            
            # Create PDF with card size + margins
            c = canvas.Canvas(
                outputPath,
                pagesize=(self.card_width + 16*mm, self.card_height + 16*mm)  # Updated for 8mm margins on each side
            )
            
            # Position card on page
            x_offset = 8 * mm  # Reduced from 10*mm for better edge visibility
            y_offset = 8 * mm  # Reduced from 10*mm for better edge visibility
            
            # Draw white card background (fill only, border will be drawn later)
            c.setFillColor(self.white)
            c.roundRect(
                x_offset, 
                y_offset, 
                self.card_width, 
                self.card_height,
                radius=4*mm,
                fill=1,
                stroke=0
            )
            
            # Set text color to dark blue
            c.setFillColor(self.text_color)
            
            # TOP SECTION: Organization name - with embossed effect
            # Use DejaVuSans-Bold for Serbian Latin support (Č, Š, Ž, Đ, etc.)
            try:
                c.setFont("DejaVuSans-Bold", 11)
            except:
                c.setFont("Helvetica-Bold", 11)  # Fallback if font not registered
            # Draw shadow FIRST (slightly offset)
            c.setFillColor(HexColor('#E8E8E8'))  # Light gray shadow
            c.drawString(x_offset + 7*mm + 0.3*mm, (y_offset + self.card_height - 9*mm) - 0.3*mm, "SINDIKAT RADNIKA")
            # Draw main text ON TOP
            c.setFillColor(self.text_color)
            c.drawString(x_offset + 7*mm, y_offset + self.card_height - 9*mm, "SINDIKAT RADNIKA")
            
            # Use DejaVuSans for Serbian Latin support
            try:
                c.setFont("DejaVuSans", 7)
            except:
                c.setFont("Helvetica", 7)  # Fallback
            # Draw shadow FIRST
            c.setFillColor(HexColor('#E8E8E8'))
            c.drawString(x_offset + 7*mm + 0.3*mm, (y_offset + self.card_height - 13.5*mm) - 0.3*mm, "NCR ATLEOS - BEOGRAD")
            # Draw main text ON TOP
            c.setFillColor(self.text_color)
            c.drawString(x_offset + 7*mm, y_offset + self.card_height - 13.5*mm, "NCR ATLEOS - BEOGRAD")
            
            # MEMBER INFO SECTION (left side, bottom)
            info_start_y = y_offset + 24*mm
            
            # Name label - with embossed effect
            # Use DejaVuSans for Serbian Latin support
            try:
                c.setFont("DejaVuSans", 7)
            except:
                c.setFont("Helvetica", 7)  # Fallback
            # Draw shadow FIRST
            c.setFillColor(HexColor('#E8E8E8'))
            c.drawString(x_offset + 8*mm + 0.3*mm, info_start_y - 0.3*mm, "IME I PREZIME:")
            # Draw main text ON TOP
            c.setFillColor(self.text_color)
            c.drawString(x_offset + 8*mm, info_start_y, "IME I PREZIME:")
            
            # Name value - with embossed effect
            # Use DejaVuSans-Bold for Serbian Latin support
            # Reduced font size by 1pt: 11 → 10
            try:
                c.setFont("DejaVuSans-Bold", 10)
            except:
                c.setFont("Helvetica-Bold", 10)  # Fallback
            full_name = f"{firstName.upper()} {lastName.upper()}"
            # Draw shadow FIRST
            c.setFillColor(HexColor('#E8E8E8'))
            c.drawString(x_offset + 8*mm + 0.3*mm, (info_start_y - 5*mm) - 0.3*mm, full_name)
            # Draw main text ON TOP
            c.setFillColor(self.text_color)
            c.drawString(x_offset + 8*mm, info_start_y - 5*mm, full_name)
            
            # Member ID label - Fixed Serbian Latin: Č instead of C
            # Use DejaVuSans for Serbian Latin support
            try:
                c.setFont("DejaVuSans", 7)
            except:
                c.setFont("Helvetica", 7)  # Fallback
            # Draw text with shadow (embossed effect) - shadow FIRST
            c.setFillColor(HexColor('#E8E8E8'))  # Light gray shadow
            c.drawString(x_offset + 8*mm + 0.3*mm, info_start_y - 11*mm - 0.3*mm, "BROJ ČLANSKE KARTE:")
            # Draw main text ON TOP
            c.setFillColor(self.text_color)
            c.drawString(x_offset + 8*mm, info_start_y - 11*mm, "BROJ ČLANSKE KARTE:")
            
            # Member ID value - with embossed effect
            # Use DejaVuSans-Bold for Serbian Latin support
            # Reduced font size by 1pt: 10 → 9
            try:
                c.setFont("DejaVuSans-Bold", 9)
            except:
                c.setFont("Helvetica-Bold", 9)  # Fallback
            # Draw shadow FIRST
            c.setFillColor(HexColor('#E8E8E8'))
            c.drawString(x_offset + 8*mm + 0.3*mm, (info_start_y - 16*mm) - 0.3*mm, str(memberId))
            # Draw main text ON TOP
            c.setFillColor(self.text_color)
            c.drawString(x_offset + 8*mm, info_start_y - 16*mm, str(memberId))
            
            # Join date
            try:
                join_date_obj = datetime.strptime(joinDate, '%Y-%m-%d')
                join_str = f"{join_date_obj.month:02d}/{join_date_obj.year}"
            except:
                join_str = joinDate
            
            # Use DejaVuSans for Serbian Latin support
            try:
                c.setFont("DejaVuSans", 7)
            except:
                c.setFont("Helvetica", 7)  # Fallback
            # Draw shadow FIRST
            c.setFillColor(HexColor('#E8E8E8'))
            c.drawString(x_offset + 8*mm + 0.3*mm, (info_start_y - 21.5*mm) - 0.3*mm, "UČLANJEN:")
            # Draw main text ON TOP
            c.setFillColor(self.text_color)
            c.drawString(x_offset + 8*mm, info_start_y - 21.5*mm, "UČLANJEN:")
            
            # Use DejaVuSans-Bold for Serbian Latin support
            try:
                c.setFont("DejaVuSans-Bold", 7)
            except:
                c.setFont("Helvetica-Bold", 7)  # Fallback
            # Draw shadow FIRST
            c.setFillColor(HexColor('#E8E8E8'))
            c.drawString(x_offset + 22*mm + 0.3*mm, (info_start_y - 21.5*mm) - 0.3*mm, join_str)
            # Draw main text ON TOP
            c.setFillColor(self.text_color)
            c.drawString(x_offset + 22*mm, info_start_y - 21.5*mm, join_str)
            
            # RIGHT SIDE: QR Code (bottom right)
            qr_temp_file = None
            try:
                qr_data = f"MEMBER_ID:{memberId}|NAME:{firstName}|LASTNAME:{lastName}"
                qr = qrcode.QRCode(version=1, box_size=10, border=4)
                qr.add_data(qr_data)
                qr.make(fit=True)
                
                qr_img = qr.make_image(fill_color="black", back_color="white")
                qr_size = 17 * mm
                qr_x = x_offset + self.card_width - qr_size - 1.5*mm
                qr_y = y_offset + 3*mm
                
                # Save QR code to temporary file (ReportLab needs file path, not BytesIO)
                qr_temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False).name
                qr_img.save(qr_temp_file, format='PNG')
                
                # Draw QR code using file path
                c.drawImage(
                    qr_temp_file,
                    qr_x,
                    qr_y,
                    width=qr_size,
                    height=qr_size,
                    preserveAspectRatio=True
                )
            except Exception as qr_err:
                print(f"[WARNING] QR code generation error: {qr_err}")
            finally:
                # Clean up temporary file
                if qr_temp_file and os.path.exists(qr_temp_file):
                    try:
                        os.unlink(qr_temp_file)
                    except:
                        pass
            
            # RIGHT SIDE: Logo (top right) - Draw BEFORE border so border appears on top
            # Add embossed effect with shadow offset
            if self.logo_path and os.path.exists(self.logo_path):
                try:
                    # Make logo bigger: 25*mm → 30*mm
                    logo_size = 30 * mm  # Was 25*mm
                    # Move 3mm more to the right: from +1.5mm to +4.5mm
                    logo_x = x_offset + self.card_width - logo_size + 4.5*mm  # Moved 3mm more to the right
                    # Move 2mm more up: from 2.5mm to 4.5mm
                    logo_y = y_offset + self.card_height - logo_size + 4.5*mm  # Moved 2mm more up
                    
                    # Draw logo shadow FIRST (slightly offset for embossed effect)
                    shadow_offset = 0.4 * mm
                    try:
                        # Create shadow by drawing logo slightly offset (with reduced opacity effect via tint)
                        # Note: ReportLab doesn't support direct opacity, so we'll draw a semi-transparent shadow
                        # by using a lighter version or just offset it for visual depth
                        c.drawImage(
                            self.logo_path,
                            logo_x + shadow_offset,
                            logo_y - shadow_offset,
                            width=logo_size,
                            height=logo_size,
                            preserveAspectRatio=True
                        )
                    except:
                        pass  # If shadow fails, continue with main logo
                    
                    # Draw main logo ON TOP
                    c.drawImage(
                        self.logo_path,
                        logo_x,
                        logo_y,
                        width=logo_size,
                        height=logo_size,
                        preserveAspectRatio=True
                    )
                except Exception as logo_err:
                    print(f"[WARNING] Logo load error: {logo_err}")
            
            # Simple single border - Draw AFTER logo so border appears on top
            c.setStrokeColor(HexColor('#E0E0E0'))
            c.setLineWidth(1.5)
            c.roundRect(
                x_offset,
                y_offset,
                self.card_width,
                self.card_height,
                radius=4*mm,
                fill=0,
                stroke=1
            )
            
            # Save PDF
            c.save()
            print(f"[OK] Card generated: {outputPath}")
            
        except Exception as e:
            print(f"[ERROR] Card generation error: {e}")
            raise


if __name__ == "__main__":
    import sys
    
    # Parse command line arguments
    firstName = sys.argv[1] if len(sys.argv) > 1 else "Ime"
    lastName = sys.argv[2] if len(sys.argv) > 2 else "Prezime"
    memberNumber = sys.argv[3] if len(sys.argv) > 3 else "MBR-000001"
    joinDate = sys.argv[4] if len(sys.argv) > 4 else "2024-01-01"
    outputPath = sys.argv[5] if len(sys.argv) > 5 else "/tmp/card.pdf"
    logoPath = sys.argv[6] if len(sys.argv) > 6 else "./logo.png"
    
    # Generate card
    generator = MembershipCardGenerator(logo_path=logoPath)
    generator.generate_single_card(firstName, lastName, memberNumber, joinDate, outputPath)

