export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { memberId } = (await req.json().catch(() => ({}))) as { memberId?: string | number };
    if (!memberId) return NextResponse.json({ error: "Missing memberId" }, { status: 400 });

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

    // Generate PDF bytes
    const pdfBytes = await pdf.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    console.log('✅ Policy PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF as response (no filesystem save)
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="policy.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (e: any) {
    console.error('generate-policy fatal error:', e?.message || e);
    return NextResponse.json({ error: e?.message || "policy pdf error" }, { status: 500 });
  }
}


