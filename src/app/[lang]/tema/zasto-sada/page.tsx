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
    title: content.whyNow.title,
    description: content.whyNow.subtitle,
  };
}

export default async function WhyNowPage({ params }: PageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);
  const whyNow = content.whyNow;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1419]">
      {/* Hero Section */}
      <section className="relative bg-[#2C5282] dark:bg-brand-navy py-10 md:py-17 px-4">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            {whyNow.title}
          </h1>
          <p className="text-base md:text-lg text-white/90">
            {whyNow.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 md:py-17 px-4 bg-white dark:bg-[#0F1419]">
        <div className="container mx-auto max-w-4xl">
          {/* Intro */}
          <Card className="mb-10">
            <CardContent className="pt-5">
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
                {whyNow.intro}
              </p>
            </CardContent>
          </Card>

          {/* Content Sections */}
          <div className="space-y-5">
            {whyNow.sections.map((section, index) => (
              <Card key={index} className="border-l-4 border-brand-orange">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-7 bg-gradient-to-r from-[#E67E22] to-[#F5A623] dark:from-[#D97E1F] dark:to-[#F28C38] rounded-lg p-3 md:p-5 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            <h3 className="text-base md:text-xl font-bold text-white mb-2 animate-pulse">
              {lang === 'sr' ? 'Spremni ste?' : 'Ready?'}
            </h3>
            <p className="text-xs md:text-sm text-white/90 mb-3">
              {lang === 'sr' 
                ? 'Pridružite se drugim zaposlenima i budite deo promene koju očekujete.'
                : 'Join other employees and be part of the change you want to see.'
              }
            </p>
            <Link href={whyNow.ctaLink}>
              <button className="px-5 py-2 bg-white text-brand-orange dark:text-brand-orange font-semibold rounded-lg hover:scale-110 transition-all duration-300 hover:shadow-lg active:scale-95 border-2 border-white hover:border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm">
                {whyNow.cta} →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
