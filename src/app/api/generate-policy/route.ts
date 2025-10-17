import { NextResponse } from "next/server";
import path from "path";
import { promises as fsp } from "fs";

async function ensureDir(d: string) {
  try {
    await fsp.mkdir(d, { recursive: true });
  } catch {}
}

export async function POST(req: Request) {
  try {
    const { memberId } = (await req.json().catch(() => ({}))) as { memberId?: string | number };
    if (!memberId) return NextResponse.json({ error: "Missing memberId" }, { status: 400 });

    const dir = path.join(process.cwd(), "public", "members", String(memberId));
    await ensureDir(dir);
    const filePath = path.join(dir, "policy.pdf");

    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595.28, 841.89]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const toAscii = (s: string) => (s || '')
      .replace(/č/g, 'c').replace(/ć/g, 'c').replace(/ž/g, 'z').replace(/š/g, 's').replace(/đ/g, 'dj')
      .replace(/Č/g, 'C').replace(/Ć/g, 'C').replace(/Ž/g, 'Z').replace(/Š/g, 'S').replace(/Đ/g, 'DJ');

    page.drawText(toAscii("Sindikat radnika NCR Atleos Beograd"), { x: 120, y: 790, size: 16, font: bold, color: rgb(0.07, 0.23, 0.35) });
    page.drawText(toAscii("Pravilnik o članstvu (sažetak)"), { x: 48, y: 740, size: 14, font: bold });

    const bullets = [
      toAscii("Članstvo je dobrovoljno; podaci se obrađuju u skladu sa propisima RS i GDPR."),
      toAscii("Prvih 6 meseci od osnivanja ili do sticanja reprezentativnosti – članarina je besplatna; iznos se utvrđuje na sednici."),
      toAscii("Član ima pravo na informacije, učešće u aktivnostima i zaštitu radnih prava."),
      toAscii("Član poštuje Statut i odluke organa sindikata."),
      toAscii("Aktivno učešće je opciono i dobrodošlo."),
    ];

    let y = 710;
    bullets.forEach((b) => {
      page.drawText(`• ${b}`, { x: 48, y, size: 11, font, color: rgb(0.07, 0.09, 0.15) });
      y -= 18;
    });

    let bytes: Uint8Array;
    try {
      bytes = await pdf.save();
    } catch (e: any) {
      console.error('generate-policy save() error:', e?.message || e);
      throw e;
    }
    try {
      await fsp.writeFile(filePath, bytes);
    } catch (e: any) {
      console.error('generate-policy writeFile error:', e?.message || e);
      throw e;
    }
    return NextResponse.json({ url: `/members/${memberId}/policy.pdf` });
  } catch (e: any) {
    console.error('generate-policy fatal error:', e?.message || e);
    return NextResponse.json({ error: e?.message || "policy pdf error" }, { status: 500 });
  }
}


