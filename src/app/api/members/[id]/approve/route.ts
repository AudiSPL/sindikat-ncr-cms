import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { promisify } from 'util';
import { exec } from 'child_process';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const execAsync = promisify(exec);

console.log('=== members/[id]/approve/route.ts LOADED ===');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate unique member ID: SIN-AT0001
function generateMemberId(memberId: number, quicklookId: string): string {
  // Special mapping for specific QLIDs
  const qlidMappings: Record<string, string> = {
    'MS250616': 'SIN-AT0001'
  };
  
  if (qlidMappings[quicklookId]) {
    return qlidMappings[quicklookId];
  }
  
  // Default: use database ID
  return `SIN-AT${String(memberId).padStart(4, '0')}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('=== Member Approval Started ===');

  try {
    const session = await getServerSession(authOptions);
    const { id: memberId } = await params;
    console.log('Approving member:', memberId);

    // 1. Get member data
    const { data: member, error: fetchError } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single();

    if (fetchError || !member) {
      console.error('Member not found:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    console.log('Member found:', member.email);

    // 2. Generate member_id if not exists
    const quicklookId = (member as any).quicklook_id;
    const memberNumber = (member as any).member_id || generateMemberId((member as any).id, quicklookId);
    console.log('Member number:', memberNumber);

    // 3. Generate membership card PDF using Python script
    console.log('Generating membership card via Python...');
    const cardOutputPath = path.join(process.cwd(), 'public', 'members', String(memberId), 'card.pdf');
    
    // Ensure directory exists
    const cardDir = path.dirname(cardOutputPath);
    if (!fs.existsSync(cardDir)) {
      fs.mkdirSync(cardDir, { recursive: true });
    }
    
    let cardAttachment: { filename: string; content: Buffer } | null = null;
    
    try {
      // Extract first and last name
      const nameParts = ((member as any).full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Format join date as YYYY-MM-DD
      const joinDate = new Date((member as any).created_at || new Date()).toISOString().split('T')[0];
      
      // Logo path
      const logoPath = path.join(process.cwd(), 'public', 'brand', 'logo-sindikat-union.png');
      
      // Call Python script
      const pythonScript = path.join(process.cwd(), 'public', 'scripts', 'card_generator.py');
      const command = `python "${pythonScript}" "${firstName}" "${lastName}" "${memberNumber}" "${joinDate}" "${cardOutputPath}" "${logoPath}"`;
      
      try {
        await execAsync(command);
        console.log('✅ Card generated via Python:', cardOutputPath);
      } catch (execErr: any) {
        // Python command may fail due to encoding warnings, but file might still be created
        console.warn('⚠️ Python command warning:', execErr.message);
      }
      
      // Check if file exists (even if Python command reported an error)
      if (!fs.existsSync(cardOutputPath)) {
        // File wasn't created, it's a real error
        console.error('❌ Card PDF not created');
        cardAttachment = null;
      } else {
        // File exists despite the error message, continue
        console.log('✅ Card PDF created (encoding warning ignored)');
        const cardBuffer = await fsPromises.readFile(cardOutputPath);
        cardAttachment = {
          filename: `membership-card-${memberNumber}.pdf`,
          content: cardBuffer,
        };
        console.log('✅ Card attachment prepared');
      }
    } catch (pythonErr: any) {
      console.error('❌ Card generation error:', pythonErr);
      // Continue anyway - don't fail the approval if card fails
      cardAttachment = null;
    }

    // 4. Generate confirmation PDF (pristupnica)
    console.log('Generating confirmation PDF...');
    let confirmationPdfUrl: string | null = null;
    try {
      const confirmResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberId,
          memberData: {
            fullName: (member as any).full_name,
            email: (member as any).email,
            city: (member as any).city,
            organization: (member as any).division || (member as any).organization,
            division: (member as any).division,
            membershipNumber: memberNumber,
            status: 'active',
            joinDate: (member as any).created_at,
          },
        }),
      });

      if (confirmResponse.ok) {
        const confirmData = await confirmResponse.json();
        confirmationPdfUrl = confirmData.pdfUrl;
        console.log('✅ Confirmation PDF generated:', confirmationPdfUrl);
      } else {
        console.warn('Confirmation generation failed');
      }
    } catch (e) {
      console.warn('Error generating confirmation:', e);
    }

    // 5. Prepare attachments for Resend (base64 encoded)
    const attachments: Array<{ filename: string; content: string }> = [];

    // Prepare confirmation attachment
    let confirmationAttachment = null;
    if (confirmationPdfUrl) {
      try {
        const confirmPath = path.join(process.cwd(), 'public', confirmationPdfUrl);
        const confirmBuffer = await fsPromises.readFile(confirmPath);
        confirmationAttachment = {
          filename: `confirmation-${memberNumber}.pdf`,
          content: confirmBuffer.toString('base64'),
        };
        console.log('✅ Confirmation attachment prepared');
      } catch (e) {
        console.warn('Error reading confirmation PDF:', e);
      }
    }

    // Prepare card attachment (convert to base64)
    let cardAttachmentForResend = null;
    if (cardAttachment) {
      cardAttachmentForResend = {
        filename: cardAttachment.filename,
        content: cardAttachment.content.toString('base64'),
      };
      console.log('✅ Card attachment converted to base64');
    }

    // Add attachments to array
    if (confirmationAttachment) {
      attachments.push(confirmationAttachment);
    }

    if (cardAttachmentForResend) {
      attachments.push(cardAttachmentForResend);
    }

    // 6. Send approval email using Resend
    console.log('Sending approval email to:', (member as any).email);
    console.log('📎 Confirmation ready?', confirmationAttachment ? 'YES' : 'NO');
    console.log('📎 Card ready?', cardAttachmentForResend ? 'YES' : 'NO');
    console.log('📎 Total attachments:', attachments.length);
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1a1a1a; margin-bottom: 15px;">✅ Vaše Članstvo je Odobreno</h2>
          
          <p style="color: #333; line-height: 1.6;">Poštovani/Poštovana <strong>${(member as any).full_name}</strong>,</p>
          
          <p style="color: #333; line-height: 1.6;">
            Sa zadovoljstvom vam javljamo da je vaša prijava za članstvo u Sindikat Radnika NCR Atleos Beograd <strong>odobreno</strong>.
          </p>

          <div style="background-color: #f0f8ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Članski broj:</strong> ${memberNumber}</p>
            <p style="margin: 5px 0;"><strong>Datum odobravanja:</strong> ${new Date().toLocaleDateString('sr-RS')}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Aktivan</p>
          </div>

          <p style="color: #333; line-height: 1.6;">
            Priloženi dokumenti su:
          </p>
          <ul style="color: #333;">
            <li>📋 Potvrda o članstvu (Pristupnica)</li>
            <li>🎫 Članska kartice</li>
          </ul>

          <p style="color: #333; line-height: 1.6;">
            Ako imate bilo kakva pitanja ili trebate dodatne informacije, molimo vas da nam se obratite na email ili telefonom.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              S poštovanjem,<br>
              <strong>Sindikat Radnika NCR Atleos Beograd</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'office@sindikatncr.com',
      to: (member as any).email,
      bcc: 'sindikatncratleos@gmail.com',
      subject: 'Sindikat Radnika NCR Atleos - Članstvo Odobreno',
      html: emailHtml,
      attachments: attachments,
    });

    if (emailError) {
      console.error('❌ Resend email error:', emailError);
      throw emailError;
    }

    const pdfsSent = attachments.length;
    const attachmentText = pdfsSent === 0 ? 'no attachments' : 
                           pdfsSent === 1 ? '1 attachment' : 
                           `${pdfsSent} attachments`;
    console.log(`✅ Approval email sent with ${attachmentText}. Message ID:`, emailData?.id);

    // 7. Update member in database
    const adminId = (session?.user as any)?.id; // Get admin UUID from session
    
    const { error: updateError } = await supabase
      .from('members')
      .update({
        status: 'active',        // ← CHANGED from 'approved'
        member_id: memberNumber,
        card_sent: true,
        approved_at: new Date().toISOString(),
        approved_by: adminId,
      })
      .eq('id', memberId);

    if (updateError) {
      console.error('Error updating member:', updateError);
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    console.log('✅ Member approved successfully');

    return NextResponse.json({
      success: true,
      message: 'Member approved and email sent',
      memberNumber,
      pdfsSent: attachments.length,
    });
  } catch (error) {
    console.error('=== ERROR in member approval ===');
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}