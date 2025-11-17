import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Language, getContent } from '@/lib/content';

interface PolitikaPrivatnostiPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PolitikaPrivatnostiPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.privacy.title,
    description: lang === 'sr' 
      ? 'Kako prikupljamo, koristimo i štitimo vaše podatke'
      : 'How we collect, use, and protect your data',
    openGraph: {
      title: content.privacy.title,
      description: lang === 'sr' 
        ? 'Kako prikupljamo, koristimo i štitimo vaše podatke'
        : 'How we collect, use, and protect your data',
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function PolitikaPrivatnostiPage({ params }: PolitikaPrivatnostiPageProps) {
  const { lang } = await params;
  const langTyped = lang as 'sr' | 'en';
  const content = getContent(lang as Language);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1419]">
      {/* Hero Section */}
      <section className="relative bg-[#2C5282] dark:bg-brand-navy py-10 md:py-17 px-4">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            {langTyped === 'sr' ? 'Politika privatnosti' : 'Privacy Policy'}
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-2">
            {langTyped === 'sr' 
              ? 'Kako prikupljamo, koristimo i štitimo vaše podatke' 
              : 'How we collect, use, and protect your data'}
          </p>
          <p className="text-sm text-white/80">
            {langTyped === 'sr' 
              ? 'Verzija 1.4 | Važi od: 15. novembar 2025.' 
              : 'Version 1.4 | Effective: November 15, 2025'}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 md:py-17 px-4 bg-white dark:bg-[#0F1419]">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Section 1: Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Prikupljanje podataka' : 'Data Collection'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {langTyped === 'sr'
                  ? 'Prikupljamo samo podatke neophodne za funkcionisanje sindikata:'
                  : 'We collect only data necessary for union operation:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300 mb-4">
                <li>{langTyped === 'sr' ? 'Ime i prezime' : 'Full name'}</li>
                <li>{langTyped === 'sr' ? 'Quicklook ID (QLID)' : 'Quicklook ID (QLID)'}</li>
                <li>{langTyped === 'sr' ? 'Grad' : 'City'}</li>
                <li>{langTyped === 'sr' ? 'Organizacija/jedinica (opciono)' : 'Organization/unit (optional)'}</li>
              </ul>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {langTyped === 'sr' ? 'Anonimna prijava je moguća.' : 'Anonymous application is possible.'}
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Verification Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Metode verifikacije' : 'Verification Methods'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {langTyped === 'sr'
                  ? 'Nudimo više načina za prijavljivanje, sa različitim nivoima privatnosti:'
                  : 'We offer multiple application methods with different privacy levels:'}
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-300">
                <li>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    ✅ {langTyped === 'sr' 
                      ? 'Lična prijava kod predstavnika – najbezbednije, bez digitalnog traga'
                      : 'In-person application with representative – most secure, no digital trace'}
                  </span>
                </li>
                <li>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    ✅ {langTyped === 'sr'
                      ? 'Upload dokaza zaposlenja – dokument se odmah briše nakon verifikacije'
                      : 'Upload proof of employment – document deleted immediately after verification'}
                  </span>
                </li>
                <li>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                    ⚠️ {langTyped === 'sr'
                      ? 'Interni chat sistem – može biti vidljivo IT službi poslodavca'
                      : 'Internal chat system – may be visible to employer IT department'}
                  </span>
                </li>
                <li>
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                    ⚠️ {langTyped === 'sr'
                      ? 'Službeni email – poslodavac može videti komunikaciju'
                      : 'Work email – employer may see communication'}
                  </span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Section 3: Privacy Warning */}
          <Card className="border-l-4 border-[#C63B3B]">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Upozorenje o privatnosti' : 'Privacy Warning'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-base text-slate-700 dark:text-slate-300">
                <p className="font-semibold">
                  ⚠️ {langTyped === 'sr' ? 'Važno:' : 'Important:'}
                </p>
                <p>
                  {langTyped === 'sr'
                    ? 'Ne preporučujemo korišćenje poslovnih sistema (email, chat, službeni laptop) za sindikalne aktivnosti jer poslodavac može videti vašu komunikaciju.'
                    : 'We do not recommend using corporate systems (email, chat, work laptop) for union activities as your employer may see your communication.'}
                </p>
                <p className="font-semibold">
                  {langTyped === 'sr' ? 'Preporučujemo:' : 'We recommend:'}
                </p>
                <p>
                  {langTyped === 'sr'
                    ? 'Ličnu prijavu kod predstavnika ili upload dokumenta sa ličnog uređaja.'
                    : 'In-person application with representative or upload document from personal device.'}
                </p>
                <p className="italic">
                  {langTyped === 'sr'
                    ? 'Koristite poslovne sisteme isključivo na sopstveni rizik.'
                    : 'Use corporate systems at your own risk only.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Korišćenje podataka' : 'Data Usage'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {langTyped === 'sr' 
                  ? 'Podatke koristimo isključivo za:' 
                  : 'We use data exclusively for:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300 mb-4">
                <li>{langTyped === 'sr' ? 'Komunikaciju sa članovima' : 'Communication with members'}</li>
                <li>{langTyped === 'sr' ? 'Organizaciju sindikalnih aktivnosti' : 'Organizing union activities'}</li>
                <li>{langTyped === 'sr' ? 'Zastupanje vaših radničkih interesa' : 'Representing your worker interests'}</li>
              </ul>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {langTyped === 'sr'
                  ? 'Ne delimo podatke sa trećim stranama bez vaše izričite saglasnosti.'
                  : 'We do not share data with third parties without your explicit consent.'}
              </p>
            </CardContent>
          </Card>

          {/* Section 5: Access Logging */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Beleženje pristupa' : 'Access Logging'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {langTyped === 'sr' 
                  ? 'Sve pristupe podacima beležimo sa:' 
                  : 'We log all data access with:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300">
                <li>{langTyped === 'sr' ? 'Vremenskim oznakama' : 'Timestamps'}</li>
                <li>{langTyped === 'sr' ? 'Audit tragom' : 'Audit trail'}</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: Data Processors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Procesori podataka' : 'Data Processors'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {langTyped === 'sr'
                  ? 'Koristimo sledeće procesore sa potpisanim ugovorima o zaštiti podataka (DPA):'
                  : 'We use the following processors with signed Data Processing Agreements (DPA):'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300 mb-4">
                <li>
                  <strong>Supabase</strong> (EU) – {langTyped === 'sr' 
                    ? 'baza podataka, autentifikacija, serverless funkcije' 
                    : 'database, authentication, serverless functions'}
                </li>
                <li>
                  <strong>Vercel</strong> (EU) – {langTyped === 'sr' 
                    ? 'hosting, CDN, edge servisi' 
                    : 'hosting, CDN, edge services'}
                </li>
                <li>
                  <strong>Resend</strong> (EU) – {langTyped === 'sr' 
                    ? 'email servis (transakcione poruke)' 
                    : 'email service (transactional messages)'}
                </li>
                <li>
                  <strong>Plausible</strong> (EU) – {langTyped === 'sr' 
                    ? 'cookieless analitika (bez identifikacije korisnika)' 
                    : 'cookieless analytics (no user identification)'}
                </li>
                <li>
                  <strong>Hostinger</strong> (EU) – {langTyped === 'sr' 
                    ? 'email i hosting servisi' 
                    : 'email and hosting services'}
                </li>
              </ul>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="font-semibold text-slate-900 dark:text-white mb-2">
                  {langTyped === 'sr' ? 'Transfer podataka:' : 'Data Transfer:'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                  {langTyped === 'sr'
                    ? 'Svi podaci se čuvaju isključivo u EU. Za slučajne transfere van EU, primenjuju se standardne ugovorne klauzule (SCC) i procena uticaja (TIA) prema Zakonu o zaštiti podataka o ličnosti ("Sl. glasnik RS", br. 87/2018).'
                    : 'All data is stored exclusively in the EU. For any transfers outside EU, Standard Contractual Clauses (SCC) and Transfer Impact Assessment (TIA) apply according to the Personal Data Protection Act ("Official Gazette RS", No. 87/2018).'}
                </p>
                <p className="font-semibold text-slate-900 dark:text-white mb-2">
                  {langTyped === 'sr' ? 'Bezbednost:' : 'Security:'}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {langTyped === 'sr'
                    ? 'Svi procesori imaju potpisane ugovore o zaštiti podataka (DPA) i poštuju standarde GDPR-a.'
                    : 'All processors have signed Data Processing Agreements (DPA) and comply with GDPR standards.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Zadržavanje podataka' : 'Data Retention'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300">
                <li>
                  <strong>{langTyped === 'sr' ? 'Podaci o članstvu:' : 'Membership data:'}</strong>{' '}
                  {langTyped === 'sr'
                    ? 'Brisanje ili anonimizacija u roku od 30 dana po vašem zahtevu ili istupanju'
                    : 'Deletion or anonymization within 30 days of your request or exit'}
                </li>
                <li>
                  <strong>{langTyped === 'sr' ? 'Verifikacioni materijali:' : 'Verification materials:'}</strong>{' '}
                  {langTyped === 'sr'
                    ? 'Brišu se automatski nakon 15 dana'
                    : 'Automatically deleted after 15 days'}
                </li>
                <li>
                  <strong>{langTyped === 'sr' ? 'Audit logovi:' : 'Audit logs:'}</strong>{' '}
                  {langTyped === 'sr'
                    ? 'Čuvaju se 2 godine radi bezbednosti i transparentnosti'
                    : 'Kept for 2 years for security and transparency'}
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 8: Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Vaša prava' : 'Your Rights'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {langTyped === 'sr' ? 'Imate pravo na:' : 'You have the right to:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300 mb-4">
                <li>{langTyped === 'sr' ? 'Pristup vašim podacima' : 'Access your data'}</li>
                <li>{langTyped === 'sr' ? 'Ispravku netačnih podataka' : 'Rectification of inaccurate data'}</li>
                <li>{langTyped === 'sr' ? 'Brisanje ("pravo na zaborav")' : 'Erasure ("right to be forgotten")'}</li>
                <li>{langTyped === 'sr' ? 'Ograničavanje obrade' : 'Restriction of processing'}</li>
                <li>{langTyped === 'sr' ? 'Prenosivost podataka' : 'Data portability'}</li>
                <li>{langTyped === 'sr' ? 'Prigovor na obradu' : 'Object to processing'}</li>
              </ul>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>{langTyped === 'sr' ? 'Zahteve pošaljite na:' : 'Send requests to:'}</strong>{' '}
                <a href="mailto:office@sindikatncr.com" className="text-[#005B99] dark:text-[#60a5fa] hover:underline">
                  office@sindikatncr.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Section 9: Complaint */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Prigovor' : 'Complaint'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {langTyped === 'sr'
                  ? 'Ako smatrate da je vaše pravo na zaštitu podataka narušeno, možete podneti pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti:'
                  : 'If you believe your data protection rights have been violated, you can file a complaint with the Commissioner for Information of Public Importance and Personal Data Protection:'}
              </p>
              <p className="text-base text-slate-700 dark:text-slate-300">
                📧 <a href="mailto:office@poverenik.rs" className="text-[#005B99] dark:text-[#60a5fa] hover:underline">
                  office@poverenik.rs
                </a>
                <br />
                📞 +381 11 3408 900
              </p>
            </CardContent>
          </Card>

          {/* Section 10: Contact */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {langTyped === 'sr' ? 'Kontakt' : 'Contact'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-base text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-semibold">Sindikat NCR Atleos – Beograd</p>
                <p>Španskih Boraca 75, 11070 Novi Beograd</p>
                <p>
                  <a href="mailto:office@sindikatncr.com" className="text-[#005B99] dark:text-[#60a5fa] hover:underline">
                    office@sindikatncr.com
                  </a>
                  {' '} | {' '}
                  <a href="tel:+381661380034" className="text-[#005B99] dark:text-[#60a5fa] hover:underline">
                    +381 66 138 034
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Topics */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {langTyped === 'sr' ? 'Povezane teme' : 'Related topics'}
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/${lang}/tema/anonimnost`}
                className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-[#005B99] text-[#005B99] dark:text-[#60a5fa] rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#005B99] focus:ring-offset-2"
              >
                {content.nav.confidentiality}
              </Link>
              <Link 
                href={`/${lang}/tema/pravna-podrska`}
                className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-[#005B99] text-[#005B99] dark:text-[#60a5fa] rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#005B99] focus:ring-offset-2"
              >
                {content.nav.legalSupport}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
