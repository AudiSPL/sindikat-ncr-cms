export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMail } from '@/lib/mailer';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function buildAttachments(memberId: string) {
  const publicDir = path.join(process.cwd(), 'public', 'members', memberId);
  const attachments: Array<{ filename: string; content: Buffer }> = [];

  try {
    const cardPath = path.join(publicDir, 'card.pdf');
    if (fs.existsSync(cardPath)) {
      attachments.push({
        filename: 'clanska-kartica.pdf',
        content: fs.readFileSync(cardPath),
      });
    }

    const confirmationPath = path.join(publicDir, 'confirmation.pdf');
    if (fs.existsSync(confirmationPath)) {
      attachments.push({
        filename: 'potvrda-clanstva.pdf',
        content: fs.readFileSync(confirmationPath),
      });
    }

    const policyPath = path.join(publicDir, 'policy.pdf');
    if (fs.existsSync(policyPath)) {
      attachments.push({
        filename: 'statut.pdf',
        content: fs.readFileSync(policyPath),
      });
    }
  } catch (err) {
    console.error('Error reading PDFs:', err);
  }

  return attachments;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json(
        { error: 'Missing memberId' },
        { status: 400 }
      );
    }

    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    const firstName = member.full_name?.split(' ')[0] || 'Člane';

    const attachments = await buildAttachments(memberId);

    if (attachments.length === 0) {
      return NextResponse.json(
        { error: 'Nema PDF-ova za ovog člana' },
        { status: 404 }
      );
    }

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #E67E22 0%, #FF8C42 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Sindikat NCR Atleos</h1>
        </div>

        <div style="background: white; padding: 30px 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Poštovani/a <strong>${firstName}</strong>,</p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #555;">
            U prilogu ove poruke nalaze se vaši dokumenti članstva u Sindikatu radnika NCR Atleos Beograd.
          </p>

          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #E67E22; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;"><strong>📄 Dokumenta u prilogu:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
              <li>Članska kartica</li>
              <li>Potvrda o članstvu</li>
              <li>Statut sindikata</li>
            </ul>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            S poštovanjem,<br>
            <strong>Sindikat radnika NCR Atleos Beograd</strong>
          </p>
        </div>
      </div>
    `;

    await sendMail({
      to: member.email,
      subject: 'Vaša članska kartica - Sindikat NCR Atleos',
      html: emailHtml,
      attachments: attachments.map(a => ({
        filename: a.filename,
        content: a.content,
        contentType: 'application/pdf',
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resending card:', error);
    return NextResponse.json(
      { error: 'Greška pri slanju emaila' },
      { status: 500 }
    );
  }
}

