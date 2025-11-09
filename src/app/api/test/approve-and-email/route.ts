export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { sendMail } from '@/lib/mailer';

type Member = {
  id: number | string;
  full_name: string;
  email: string;
  quicklook_id?: string;
  city?: string;
  organization?: string;
  member_id?: string;
  joined_at?: string;
  status?: string;
};

async function generateCard(member: Member, baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/generate-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberId: member.id,
      memberData: {
        id: String(member.id),
        fullName: member.full_name,
        email: member.email,
        quicklookId: member.quicklook_id || '',
        city: member.city || '',
        organization: member.organization || '',
        membershipNumber: member.member_id || '',
        status: member.status || 'active',
        joinDate: member.joined_at || new Date().toISOString(),
      },
    }),
  });
  if (!res.ok) throw new Error(`Card generation failed: ${res.status}`);
  const data = await res.json();
  return data?.pdfUrl as string;
}

async function generateConfirmation(member: Member, baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/generate-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberId: member.id,
      memberData: {
        fullName: member.full_name,
        email: member.email,
        quicklookId: member.quicklook_id || '',
        city: member.city || '',
        organization: member.organization || '',
        membershipNumber: member.member_id || '',
        joinDate: member.joined_at || new Date().toISOString(),
      },
    }),
  });
  if (!res.ok) throw new Error(`Confirmation generation failed: ${res.status}`);
  const data = await res.json();
  return data?.pdfUrl as string;
}

async function readPublicFile(relativePath: string): Promise<Buffer> {
  const filePath = path.join(process.cwd(), 'public', relativePath.replace(/^\//, ''));
  return fs.readFile(filePath);
}

export async function POST(req: NextRequest) {
  try {
    const { memberId } = await req.json();
    const baseUrl = req.nextUrl.origin;
    if (!memberId) {
      return NextResponse.json({ success: false, error: 'Missing memberId' }, { status: 400 });
    }

    console.log('[APPROVE] Starting approval for member', memberId, 'baseUrl:', baseUrl);

    // Load member from a simple source: try public folder stub or minimal payload
    // In a real flow, this would query Supabase for member data
    const member: Member = {
      id: memberId,
      full_name: 'Test Member',
      email: 'savinmilos@yahoo.com',
      quicklook_id: 'QL-TEST',
      city: 'Beograd',
      organization: 'NCR Atleos',
      member_id: String(memberId),
      joined_at: new Date().toISOString(),
      status: 'active',
    };

    // 1) Generate PDFs
    let cardUrl: string;
    try {
      cardUrl = await generateCard(member, baseUrl);
      console.log('[APPROVE] Generated card PDF:', cardUrl);
    } catch (e: any) {
      console.error('[APPROVE] Card generation failed:', e?.message || e);
      return NextResponse.json({ success: false, stage: 'generate-card', error: e?.message || String(e) }, { status: 500 });
    }

    let confirmationUrl: string;
    try {
      confirmationUrl = await generateConfirmation(member, baseUrl);
      console.log('[APPROVE] Generated confirmation PDF:', confirmationUrl);
    } catch (e: any) {
      console.error('[APPROVE] Confirmation generation failed:', e?.message || e);
      return NextResponse.json({ success: false, stage: 'generate-confirmation', error: e?.message || String(e) }, { status: 500 });
    }

    // 2) Read files into memory for attachments
    let cardBuf: Buffer;
    let confBuf: Buffer;
    try {
      cardBuf = await readPublicFile(cardUrl);
    } catch (e: any) {
      console.error('[APPROVE] Read card file failed:', e?.message || e);
      return NextResponse.json({ success: false, stage: 'read-card', file: cardUrl, error: e?.message || String(e) }, { status: 500 });
    }
    try {
      confBuf = await readPublicFile(confirmationUrl);
    } catch (e: any) {
      console.error('[APPROVE] Read confirmation file failed:', e?.message || e);
      return NextResponse.json({ success: false, stage: 'read-confirmation', file: confirmationUrl, error: e?.message || String(e) }, { status: 500 });
    }

    // 3) Update member status, skipped Supabase integration in this test endpoint
    console.log('[APPROVE] Member status updated to \"active\" (test, no DB update)');

    // 4) Send mail with attachments
    console.log('[APPROVE] Sending email with attachments via Resend');
    try {
      await sendMail({
      to: member.email,
      subject: '✅ Vaša članska kartica i potvrda',
      html: '<p>U prilogu su vaša članska kartica i potvrda o članstvu.</p>',
      bcc: 'sindikatncratleos@gmail.com',
      attachments: [
        { filename: 'clanska-kartica.pdf', content: cardBuf, contentType: 'application/pdf' },
        { filename: 'potvrda-o-clanstvu.pdf', content: confBuf, contentType: 'application/pdf' },
      ],
      });
    } catch (e: any) {
      console.error('[APPROVE] Email send failed:', e?.message || e);
      return NextResponse.json({ success: false, stage: 'email-send', error: e?.message || String(e) }, { status: 500 });
    }

    console.log('[APPROVE] Email sent to:', member.email);

    return NextResponse.json({
      success: true,
      message: 'Card and confirmation generated, email sent.',
      attachments: { cardUrl, confirmationUrl },
    });
  } catch (error: any) {
    console.error('[/api/test/approve-and-email] ERROR:', error?.message || error);
    return NextResponse.json({ success: false, error: error?.message || 'Unknown error' }, { status: 500 });
  }
}


