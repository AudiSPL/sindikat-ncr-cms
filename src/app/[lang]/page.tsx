import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { TeaserGrid } from '@/components/TeaserGrid';
import { IconSection } from '@/components/IconSection';
import { DidYouKnowCarousel } from '@/components/DidYouKnowCarousel';
import { Donations } from '@/components/Donations';
import { TrustStrip } from '@/components/TrustStrip';
import VoiceSection from '@/components/VoiceSection';
import { Language, getContent } from '@/lib/content';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.hero.title,
    description: content.hero.lead,
    openGraph: {
      title: content.hero.title,
      description: content.hero.lead,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.hero.title,
      description: content.hero.lead,
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return (
    <>
      <Hero lang={lang as Language} />
      <TeaserGrid lang={lang as Language} />
      
      {/* Section Divider */}
      <div className="border-t border-transparent dark:border-brand-blue my-10"></div>
      
      <IconSection lang={lang as Language} />
      
      {/* Section Divider */}
      <div className="border-t border-transparent dark:border-brand-blue my-10"></div>
      
      <DidYouKnowCarousel lang={lang as Language} />
      <Donations lang={lang as Language} />
      
      {/* Section Divider */}
      <div className="border-t border-transparent dark:border-brand-blue my-10"></div>
      
      {/* Voice Section */}
      <VoiceSection />
      
      <TrustStrip lang={lang as Language} />
      
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-navy text-white px-4 py-2 rounded z-50"
      >
        {lang === 'sr' ? 'Preskoči na glavni sadržaj' : 'Skip to main content'}
      </a>
    </>
  );
}
