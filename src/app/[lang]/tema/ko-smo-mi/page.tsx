import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Language, getContent } from '@/lib/content';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);
  
  return {
    title: content.whoWeAre.title,
    description: content.whoWeAre.intro,
  };
}

export default async function AboutUsPage({ params }: PageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);
  const aboutUs = content.whoWeAre;

  const bulletPoints = [
    {
      sr: "Cilj ~15%: kad postanemo reprezentativni, ulazimo u zvanične procese i pregovore.",
      en: "Target ~15%: once representative, we enter formal processes and negotiations."
    },
    {
      sr: "Manje priče, više učinka: jasni zahtevi, rokovi, kontrola realizacije.",
      en: "Less talk, more outcomes: clear asks, timelines, and delivery control."
    },
    {
      sr: "Diskretno članstvo: EU hosting podataka, ograničen pristup, bez javnih spiskova.",
      en: "Discreet membership: EU data hosting, restricted access, no public lists."
    },
    {
      sr: "Promo: nema članarine do 31.3.",
      en: "Promo: no dues until 31 March."
    }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1419]">
      {/* Hero Section */}
      <section className="relative bg-[#2C5282] dark:bg-brand-navy py-12 md:py-20 px-4">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
            {lang === 'sr' ? 'Ko smo mi' : 'Who are we?'}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-9 md:py-14 px-4 bg-white dark:bg-[#0F1419]">
        <div className="container mx-auto max-w-4xl">
          {/* Intro */}
          <Card className="mb-9">
            <CardContent className="pt-4">
              <p className="text-base md:text-lg lg:text-xl font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                {aboutUs.intro}
              </p>
            </CardContent>
          </Card>

          {/* Section Title */}
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {lang === 'sr' ? 'Ukratko' : 'At a glance'}
            </h2>
          </div>

          {/* Bullet Points */}
          <div className="mb-9 grid grid-cols-1 gap-2">
            {bulletPoints.map((point, index) => (
              <Card key={index} className="border-l-4 border-brand-orange">
                <CardContent className="pt-4">
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {lang === 'sr' ? point.sr : point.en}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-5 bg-gradient-to-r from-[#E67E22] to-[#F5A623] dark:from-[#D97E1F] dark:to-[#F28C38] rounded-lg p-2 md:p-4 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            <h3 className="text-sm md:text-lg font-bold text-white mb-2 animate-pulse">
              {lang === 'sr' ? 'Spremni ste?' : 'Ready?'}
            </h3>
            <p className="text-xs md:text-sm text-white/90 mb-2">
              {lang === 'sr' 
                ? 'Pridružite se i budite deo naše zajednice.'
                : 'Join and be part of our community.'
              }
            </p>
            <Link href={lang === 'sr' ? '/sr/nova-pristupnica' : '/en/nova-pristupnica'}>
              <button className="px-4 py-2 bg-white text-brand-orange dark:text-brand-orange font-semibold rounded-lg hover:scale-110 transition-all duration-300 hover:shadow-lg active:scale-95 border-2 border-white hover:border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 text-xs">
                {lang === 'sr' ? 'Pridruži se' : 'Join us'} →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
