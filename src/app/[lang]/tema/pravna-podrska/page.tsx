import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scale, Clock, AlertTriangle, Gift, Shield, Mail, FileText } from 'lucide-react';
import { Language, getContent } from '@/lib/content';
import Link from 'next/link';

interface PravnaPodrskaPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PravnaPodrskaPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: lang === 'sr' ? 'Pravna podrška' : 'Legal support',
    description: lang === 'sr' 
      ? 'Brz prvi odgovor od kolega, dobra priprema slučaja, i advokat kada zaista treba.'
      : 'Fast first response from peers, solid case prep, and a lawyer when it truly matters.',
    openGraph: {
      title: lang === 'sr' ? 'Pravna podrška' : 'Legal support',
      description: lang === 'sr' 
        ? 'Brz prvi odgovor od kolega, dobra priprema slučaja, i advokat kada zaista treba.'
        : 'Fast first response from peers, solid case prep, and a lawyer when it truly matters.',
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function PravnaPodrskaPage({ params }: PravnaPodrskaPageProps) {
  const { lang } = await params;

  // Content sections
  const sections = [
    {
      title: lang === 'sr' ? 'Kako funkcioniše (ukratko)' : 'How it works (short)',
      icon: Scale,
      bullets: lang === 'sr' ? [
        'Prvi kontakt: napiši nam problem i šta želiš da postigneš.',
        'Pomoć: Sindikat ti pomaze da mapiraš činjenice i korake.',
        'Priprema slučaja: sređujemo hronologiju, dokaze (mejlovi, pravilnici, ugovor), draft poruke/zahteva.',
        'Ako je složeno ili hitno: uključujemo partnersku advokatsku kancelariju (Skakić Law) uz povoljniju tarifu za članove (biće objavljeno).'
      ] : [
        'First contact: tell us the issue and your goal.',
        'Peer help: a colleague with HR/process know-how helps map facts and steps (no legal advising).',
        'Case prep: we structure the timeline, gather evidence (emails, policies, contract), and draft your message/request.',
        'If complex or urgent: we involve the partner law firm (Skakić Law) with a member rate (to be announced).'
      ]
    },
    {
      title: lang === 'sr' ? 'Za koje teme prvo pomažemo interno' : 'What we handle internally first',
      icon: Clock,
      bullets: lang === 'sr' ? [
        'raspored rada, hybrid/office pravila',
        'prekovremeni, godišnji/bolovanje (operativa)',
        'kako primeniti interne politike/procese',
        'priprema dopisa HR-u, menadžeru ili inspekciji'
      ] : [
        'scheduling, hybrid/office rules',
        'overtime, vacation/sick leave (operational)',
        'how to use internal policies/processes',
        'drafting to HR/manager/inspectorate'
      ]
    },
    {
      title: lang === 'sr' ? 'Kada odmah ide advokat (hitno)' : 'When to go straight to a lawyer (urgent)',
      icon: AlertTriangle,
      bullets: lang === 'sr' ? [
        'pretnja otkazom ili disciplinski akt',
        'spor oko zarade, degradacije, diskriminacije',
        'povreda privatnosti / nezakonita obrada podataka',
        'kratki rokovi (žalbe, sudski rokovi)'
      ] : [
        'termination threat or disciplinary notice',
        'pay dispute, demotion, discrimination',
        'privacy violations / unlawful data processing',
        'short deadlines (appeals, court terms)'
      ]
    },
    {
      title: lang === 'sr' ? 'Šta dobijaš kao član' : 'Member benefits',
      icon: Gift,
      bullets: lang === 'sr' ? [
        'Brzi prvi odgovor: okvirno oko 3 radna dana',
        'Checkliste & šabloni (dopis, prigovor, zahtev)',
        'uvid u vaša prava',
        'Povoljnija tarifa kod advokata (uskoro)'
      ] : [
        'Fast first response: approximately within 3 business days',
        'Checklists & templates (letters, appeals, requests)',
        'Single point of contact end-to-end',
        'Discounted lawyer rate (coming soon)'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F7FAFC] dark:bg-[#0F1419]">
      <div className="max-w-screen-xl mx-auto px-3 md:px-5 py-6 md:py-10">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            {lang === 'sr' ? 'Pravna podrška' : 'Legal support'}
          </h1>
        </div>

        {/* Intro Text */}
        <div className="text-center mb-10">
          <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {lang === 'sr' 
              ? 'Brz prvi odgovor od kolega, dobra priprema slučaja, i advokat kada zaista treba.'
              : 'Fast first response from peers, solid case prep, and a lawyer when it truly matters.'
            }
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {sections.slice(0, 4).map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-brand-orange" />
                    <CardTitle className="text-base md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed flex items-start">
                        <span className="text-brand-orange mr-2">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Partnership Box - Same as other boxes */}
        <div className="mb-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-brand-orange" />
                <CardTitle className="text-base md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'sr' ? 'Partnerstvo' : 'Partnership'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lang === 'sr' 
                    ? 'Pravna podrška od Skakić Law Firm - Za naš sindikat obezbedili smo stručnu pravnu podršku od renomirane advokatske kancelarije Skakić Law Firm, specijalizovane za radno pravo i internacionalno korporativno radno pravo. Sa velikim iskustvom i timom stručnih advokata, Skakić Law pruža vrhunsku pravnu zaštitu i savetovanje zaposlenima u složenim korporativnim i radnim pitanjima.'
                    : 'Legal support from Skakić Law Firm - For our union, we\'ve secured expert legal support from the renowned Skakić Law Firm, specializing in labor law and international corporate labor law. With extensive experience and a team of skilled attorneys, Skakić Law provides top-tier legal protection and advice to employees in complex corporate and labor matters.'
                  }
                </p>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lang === 'sr' 
                    ? 'Njihova ekspertiza obuhvata zaštitu prava radnika, pravnu pomoć prilikom kolektivnih ugovora, radnih sporova, reorganizacije i svih aspekata radnih odnosa. Partnerstvo sa Skakić Law osigurava da članovi sindikata dobiju pravnu sigurnost i podršku kada im je najpotrebnija.'
                    : 'Their expertise covers workers\' rights protection, legal assistance with collective agreements, labor disputes, reorganization, and all aspects of employment relations. Partnership with Skakić Law ensures that union members receive legal security and support when they need it most.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orange CTA Section */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-[#E67E22] to-[#F5A623] dark:from-[#D97E1F] dark:to-[#F28C38] border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <Link href={`/${lang}/nova-pristupnica`} className="flex-shrink-0">
                  <Button className="bg-white text-brand-orange hover:bg-white/90 px-5 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base">
                    <FileText className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    {lang === 'sr' ? 'Zatraži pomoć' : 'Get help'}
                  </Button>
                </Link>
                <div className="text-white text-sm md:text-base flex flex-wrap items-center justify-center gap-1 md:gap-2">
                  <span>{lang === 'sr' ? 'Piši nam:' : 'Email:'}</span>
                  <a 
                    href="mailto:office@ncrsindikat.com" 
                    className="text-white hover:text-white/80 transition-colors font-medium underline hover:no-underline"
                  >
                    office@ncrsindikat.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}