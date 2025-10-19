export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';

export async function GET(req: NextRequest) {
  const to = req.nextUrl.searchParams.get('to');
  if (!to) return NextResponse.json({ error: 'Add ?to=email@example.com' }, { status: 400 });

  try {
    const resp = await sendMail({
      to,
      subject: 'Test – Sindikat NCR',
      html: '<p>Ovo je test poruka preko Resend-a.</p>',
      bcc: 'sindikatncratleos@gmail.com' // optional archive
    });
    return NextResponse.json({ ok: true, resp });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'send failed' }, { status: 500 });
  }
}


