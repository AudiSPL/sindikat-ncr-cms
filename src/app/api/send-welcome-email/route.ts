export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
// Use dynamic import to avoid build-time resolution issues if dependency isn't installed yet

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
  ccSelf?: boolean;
  ccUnion?: boolean;
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
    const nodemailer = (await import("nodemailer")).default;
    const body = (await req.json()) as Body;
    const to = ensureString(body.to);
    const m = body.memberData;
    const type = body.type || "initial";
    if (!to || !m?.email) {
      return NextResponse.json({ success: false, error: "Missing 'to' or 'memberData.email'." }, { status: 400 });
    }

    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const user = process.env.EMAIL_USER || "";
    const pass = process.env.EMAIL_PASS || "";
    const union = process.env.UNION_EMAIL || "";

    if (!user || !pass) {
      return NextResponse.json({ success: false, error: "EMAIL_USER or EMAIL_PASS not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({ host, port: 587, secure: false, auth: { user, pass } });

    const subject =
      type === "activation"
        ? `Aktivacija članstva – ${m.fullName || ""}`
        : type === "admin-notify"
        ? `ADMIN – Nova prijava / akcija – ${m.fullName || ""}`
        : `Prijava primljena – Sindikat radnika NCR Atleos Beograd`;

    const attachments = (body.attachFiles && m?.id) ? await buildAttachments(m.id) : [];

    const mailOptions = {
      from: `"Sindikat NCR Atleos" <${user}>`,
      to,
      subject,
      html: renderHtml(type, m),
      attachments: attachments.length ? attachments : undefined,
    };

    // CC i BCC
    const cc: string[] = [];
    if (body.ccUnion && union) cc.push(union);
    if (body.ccSelf && m.email && m.email !== to) cc.push(m.email);
    if (cc.length) (mailOptions as any).cc = cc.join(",");
    else delete (mailOptions as any).cc; // Explicitly remove if empty

    const bcc: string[] = [];
    if (body.bccUnion && union) bcc.push(union);
    if (body.bcc) bcc.push(...(Array.isArray(body.bcc) ? body.bcc : [body.bcc]));
    if (bcc.length) (mailOptions as any).bcc = bcc.join(",");
    else delete (mailOptions as any).bcc; // Explicitly remove if empty

    // Also ensure attachments is properly set
    if (!attachments.length) delete (mailOptions as any).attachments;

    const info = await transporter.sendMail(mailOptions);

    // Make sure info is serializable
    const response = {
      success: true,
      messageId: info.messageId || '',
      accepted: Array.isArray(info.accepted) ? info.accepted : [],
      attachments: attachments.map(a => a.filename),
    };

    return NextResponse.json(response);
  } catch (e: any) {
    console.error('Email error:', e);
    return NextResponse.json(
      { success: false, error: e?.message || 'Email sending failed' },
      { status: 500 }
    );
  }
}
