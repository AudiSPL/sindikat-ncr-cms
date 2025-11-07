import { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { TeaserGrid } from '@/components/TeaserGrid';
import { IconSection } from '@/components/IconSection';
import { DidYouKnowCarousel } from '@/components/DidYouKnowCarousel';
import { Donations } from '@/components/Donations';
import VoiceSection from '@/components/VoiceSection';
import { Language, getContent } from '@/lib/content';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);
  const isSerbian = lang === 'sr';
  const meta = isSerbian
    ? {
        title: 'Sindikat Radnika NCR Atleos – Zaposleni na istoj strani',
        description:
          'Pridruži se nezavisnom sindikatu NCR Atleos. Kolektivno pregovaranje, pravna podrška i zaštita radničkih prava. Poverljivo, sigurno, zajedno i digitalno.',
      }
    : {
        title: 'NCR Atleos Union – Employees United',
        description:
          'Join the independent NCR Atleos Union. Collective bargaining, legal support, and worker rights protection. Confidential, secure, united.',
      };

  const shareImage = 'https://www.sindikatncr.com/brand/logo-sindikat.png';

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [shareImage],
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
      <IconSection lang={lang as Language} />
      <DidYouKnowCarousel lang={lang as Language} />
      <Donations lang={lang as Language} />
      <VoiceSection />
      
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
