import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateMembershipCard } from '@/lib/card-generator';

console.log('=== members/[id]/approve/route.ts LOADED ===');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate unique member ID: SIN-AT001
function generateMemberId(memberId: number, quicklookId: string): string {
  // Special mapping for specific QLIDs
  const qlidMappings: Record<string, string> = {
    'MS250616': 'SIN-AT001'
  };
  
  if (qlidMappings[quicklookId]) {
    return qlidMappings[quicklookId];
  }
  
  // Default: use database ID (3 digits: SIN-AT001, SIN-AT002, etc.)
  return `SIN-AT${String(memberId).padStart(3, '0')}`;
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

    // Parse override from request body
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body might be empty, that's okay
    }
    const { override, overrideReason } = body;

    // Fetch member first for audit logging
    const { data: member, error: fetchError } = await supabase
      .from('members')
      .select('verification_method, verification_status, full_name')
      .eq('id', memberId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Admin can approve regardless of verification status
    // Just log if verification was incomplete

    // Get full member data for approval process
    const { data: fullMember, error: fullMemberError } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single();

    if (fullMemberError || !fullMember) {
      console.error('Member not found:', fullMemberError);
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    console.log('Member found:', (fullMember as any).email);

    // Continue with approval...

    // 2. Generate member_id if not exists
    const quicklookId = (fullMember as any).quicklook_id;
    const memberNumber = (fullMember as any).member_id || generateMemberId((fullMember as any).id, quicklookId);
    console.log('Member number:', memberNumber);

    // 3. Prepare attachments array
    const attachments: Array<{ filename: string; content: Buffer | string; contentType?: string }> = [];
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.sindikatncr.com';

    // 4. Generate confirmation PDF (pristupnica) and add to attachments
    console.log('Generating confirmation PDF...');
    try {
      const confirmResponse = await fetch(`${baseUrl}/api/generate-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberId,
          memberData: {
            fullName: (fullMember as any).full_name,
            email: (fullMember as any).email,
            city: (fullMember as any).city,
            organization: (fullMember as any).division || (fullMember as any).organization,
            division: (fullMember as any).division,
            membershipNumber: memberNumber,
            status: 'active',
            joinDate: (fullMember as any).created_at,
          },
        }),
      });

      console.log('✅ Confirmation response status:', confirmResponse.status);

      if (!confirmResponse.ok) {
        console.error('Confirmation generation failed');
      } else {
        // Get PDF as buffer (not JSON)
        const pdfBuffer = await confirmResponse.arrayBuffer();
        
        attachments.push({
          filename: `confirmation-${memberNumber}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        });
        
        console.log('✅ Added confirmation PDF to attachments');
      }
    } catch (e) {
      console.warn('Error generating confirmation:', e);
    }

    // 5. Generate card PDF using generateMembershipCard() and add to attachments
    console.log('Generating card PDF via generateMembershipCard()...');
    try {
      // Parse full name into first and last name
      const nameParts = ((fullMember as any).full_name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Format join date as YYYY-MM-DD
      const joinDate = new Date((fullMember as any).created_at || new Date()).toISOString().split('T')[0];
      
      // Generate card PDF buffer
      const cardPdfBytes = await generateMembershipCard(
        firstName,
        lastName,
        memberNumber,
        joinDate
      );
      
      attachments.push({
        filename: `card-${memberNumber}.pdf`,
        content: cardPdfBytes,
        contentType: 'application/pdf',
      });
      
      console.log('✅ Added card PDF to attachments');
    } catch (e) {
      console.warn('Error generating card:', e);
    }

    console.log('📎 Attachments array:', attachments.length, attachments);

    // 6. Send approval email using Resend
    console.log('Sending approval email to:', (member as any).email);
    console.log('📎 Total attachments:', attachments.length);
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1a1a1a; margin-bottom: 15px;">✅ Vaše Članstvo je Odobreno</h2>
          
          <p style="color: #333; line-height: 1.6;">Poštovani/Poštovana <strong>${(fullMember as any).full_name}</strong>,</p>
          
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

    console.log('📧 Email being sent with attachments:', attachments);
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'office@sindikatncr.com',
      to: (fullMember as any).email,
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
    
    const updateData: {
      status: string;
      member_id: string;
      card_sent: boolean;
      approved_at: string;
      approved_by: string | undefined;
      notes?: string;
    } = {
      status: 'active',        // ← CHANGED from 'approved'
      member_id: memberNumber,
      card_sent: true,
      approved_at: new Date().toISOString(),
      approved_by: adminId,
    };

    if (override) {
      updateData.notes = `[OVERRIDE] ${overrideReason || 'Admin override - verification bypassed'}\n${member.notes || ''}`;
    }
    
    const { error: updateError } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', memberId);

    if (updateError) {
      console.error('Error updating member:', updateError);
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    // Add audit log entry for overrides
    if (override) {
      await supabase.from('audit_logs').insert({
        admin_id: adminId,
        action: 'override_approve_member',
        target_type: 'member',
        target_id: memberId.toString(),
        details: {
          member_name: member.full_name,
          verification_method: member.verification_method,
          verification_status: member.verification_status,
          override_reason: overrideReason
        }
      });
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