export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";

import { NextResponse } from "next/server";
import { sendMail } from '@/lib/mailer';
import path from "path";
import { promises as fs } from "fs";

type Member = {
  id: string;
  fullName: string;
  email: string;
  quicklookId?: string;
  city?: string;
  organization?: string;
  status?: string;
  joinDate?: string;
  membershipNumber?: string;
  level?: string;
};

type Body = {
  to: string;
  memberData: Member;
  type?: "initial" | "activation" | "admin-notify";
  attachFiles?: boolean;
  bccUnion?: boolean;
  bcc?: string | string[];
};

function ensureString(x: any) { return (typeof x === "string" && x.trim().length > 0) ? x.trim() : ""; }

function renderHtml(type: Body["type"], m: Member) {
  const nm = ensureString(m.fullName) || "Poštovani/a";
  if (type === "activation") {
    return `
      <div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#111;line-height:1.6">
        <h2 style="margin:0 0 8px 0;color:#0a3a59">Potvrda aktivacije članstva</h2>
        <p>Poštovani/a ${nm},</p>
        <p>Vaše članstvo je <b>uspešno aktivirano</b>.</p>
        <ul>
          <li>U prilogu: potvrda o članstvu (PDF)</li>
          <li>U prilogu: članska kartica sa QR kodom (PDF)</li>
        </ul>
        <p>Članski broj: <b>${ensureString(m.membershipNumber) || "-"}</b></p>
        <p>S poštovanjem,<br/>Sindikat radnika NCR Atleos Beograd</p>
      </div>`;
  }
  if (type === "admin-notify") {
    return `
      <div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#111;line-height:1.6">
        <h3>ADMIN obaveštenje</h3>
        <ul>
          <li>Ime i prezime: <b>${nm}</b></li>
          <li>Email: ${ensureString(m.email)}</li>
          <li>Quicklook ID: ${ensureString(m.quicklookId) || "-"}</li>
          <li>Organizacija: ${ensureString(m.organization) || "-"}</li>
          <li>Status: ${ensureString(m.status) || "-"}</li>
        </ul>
      </div>`;
  }
  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#111;line-height:1.6">
      <h2 style="margin:0 0 8px 0;color:#0a3a59">Prijava primljena</h2>
      <p>Poštovani/a ${nm},</p>
      <p>Vaša prijava za članstvo je primljena i biće obrađena u najkraćem roku.</p>
      <p>S poštovanjem,<br/>Sindikat radnika NCR Atleos Beograd</p>
    </div>`;
}

async function buildAttachments(memberId: string | number) {
  const base = path.join(process.cwd(), "public", "members", String(memberId));
  const wanted = [
    { file: "confirmation.pdf", name: "Potvrda o članstvu.pdf" },
    { file: "card.pdf",         name: "Clanska kartica.pdf"   },
    { file: "policy.pdf",       name: "Pravilnik o članstvu.pdf" },
  ];
  const out: Array<{ filename: string; content: Buffer }> = [];
  for (const w of wanted) {
    try {
      const fp = path.join(base, w.file);
      const buf = await fs.readFile(fp);
      out.push({ filename: w.name, content: buf });
    } catch {}
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const to = ensureString(body.to);
    const m = body.memberData;
    const type = body.type || "initial";
    if (!to || !m?.email) {
      return NextResponse.json({ success: false, error: "Missing 'to' or 'memberData.email'." }, { status: 400 });
    }

    const subject =
      type === "activation"
        ? `Aktivacija članstva – ${m.fullName || ""}`
        : type === "admin-notify"
        ? `ADMIN – Nova prijava / akcija – ${m.fullName || ""}`
        : `Prijava primljena – Sindikat radnika NCR Atleos Beograd`;

    // Build BCC list (no CC usage)
    const bcc: string[] = [];
    if (body.bccUnion) bcc.push('office@sindikatncr.com');
    if (body.bcc) bcc.push(...(Array.isArray(body.bcc) ? body.bcc : [body.bcc]));

    // Build attachments if requested and type is activation
    let attachments: Array<{ filename: string; content: Buffer }> = [];
    if (body.attachFiles && type === 'activation' && m.id) {
      try {
        attachments = await buildAttachments(m.id);
        console.log(`✅ Prepared ${attachments.length} attachments for email`);
      } catch (attachErr) {
        console.warn('⚠️ Failed to build attachments:', attachErr);
        // Continue without attachments - don't fail the email
      }
    }

    const resp = await sendMail({
      to,
      subject,
      html: renderHtml(type, m),
      bcc: bcc.length > 0 ? bcc : undefined,
      attachments: attachments.length > 0 ? attachments.map(a => ({
        filename: a.filename,
        content: a.content,
        contentType: 'application/pdf',
      })) : undefined,
    });

    return NextResponse.json({
      success: true,
      messageId: (resp as any)?.id || '',
      attachments: attachments.map(a => a.filename),
    });
  } catch (e: any) {
    console.error('Email error:', e);
    return NextResponse.json(
      { success: false, error: e?.message || 'Email sending failed' },
      { status: 500 }
    );
  }
}
