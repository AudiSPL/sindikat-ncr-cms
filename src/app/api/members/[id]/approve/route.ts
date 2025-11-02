import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    // 5. Generate card PDF and add to attachments
    console.log('Generating card PDF...');
    try {
      const cardResponse = await fetch(`${baseUrl}/api/generate-card`, {
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

      if (!cardResponse.ok) {
        console.error('Card generation failed');
      } else {
        const cardBuffer = await cardResponse.arrayBuffer();
        
        attachments.push({
          filename: `card-${memberNumber}.pdf`,
          content: Buffer.from(cardBuffer),
          contentType: 'application/pdf',
        });
        
        console.log('✅ Added card PDF to attachments');
      }
    } catch (e) {
      console.warn('Error generating card:', e);
    }

    // 6. Generate policy PDF (optional) and add to attachments
    console.log('Generating policy PDF...');
    try {
      const policyResponse = await fetch(`${baseUrl}/api/generate-policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberId,
          memberData: {
            fullName: (member as any).full_name,
            email: (member as any).email,
            membershipNumber: memberNumber,
          },
        }),
      });

      if (policyResponse.ok) {
        const policyBuffer = await policyResponse.arrayBuffer();
        
        attachments.push({
          filename: `policy-${memberNumber}.pdf`,
          content: Buffer.from(policyBuffer),
          contentType: 'application/pdf',
        });
        
        console.log('✅ Added policy PDF to attachments');
      } else {
        console.log('Policy PDF not available or generation failed');
      }
    } catch (e) {
      console.warn('Error generating policy (optional):', e);
    }

    console.log('📎 Attachments array:', attachments.length, attachments);

    // 7. Send approval email using Resend
    console.log('Sending approval email to:', (member as any).email);
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

    console.log('📧 Email being sent with attachments:', attachments);
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

    // 8. Update member in database
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