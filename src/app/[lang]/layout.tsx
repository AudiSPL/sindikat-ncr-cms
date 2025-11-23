import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StickyJoinCTA } from '@/components/StickyJoinCTA';
import { LanguagePersistence } from '@/components/LanguagePersistence';
import { Language, getContent } from '@/lib/content';
import type { Metadata } from 'next';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  
  if (lang !== 'sr' && lang !== 'en') {
    return {};
  }

  const content = getContent(lang as Language);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sindikatncr.com';
  
  return {
    title: lang === 'sr' ? 'Sindikat NCR Atleos' : 'NCR Atleos Union',
    description: lang === 'sr' 
      ? 'Sindikat NCR Atleos - Zajedno smo jači' 
      : 'NCR Atleos Union - Together We Are Stronger',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'sr': '/sr',
        'en': '/en',
      },
    },
    openGraph: {
      title: lang === 'sr' ? 'Sindikat NCR Atleos' : 'NCR Atleos Union',
      description: lang === 'sr' 
        ? 'Sindikat NCR Atleos - Zajedno smo jači' 
        : 'NCR Atleos Union - Together We Are Stronger',
      url: `${baseUrl}/${lang}`,
      siteName: 'Sindikat NCR Atleos',
      images: [
        {
          url: '/brand/logo-sindikat-blackonwhite.png',
          width: 1200,
          height: 630,
          alt: 'Sindikat NCR Atleos Logo',
        },
      ],
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: lang === 'sr' ? 'Sindikat NCR Atleos' : 'NCR Atleos Union',
      description: lang === 'sr' 
        ? 'Sindikat NCR Atleos - Zajedno smo jači' 
        : 'NCR Atleos Union - Together We Are Stronger',
      images: ['/brand/logo-sindikat-blackonwhite.png'],
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  
  // Validate language parameter
  if (lang !== 'sr' && lang !== 'en') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LanguagePersistence currentLang={lang as Language} />
      <Header lang={lang as Language} />
      <main role="main" className="flex-1">
        {children}
      </main>
      <Footer lang={lang as Language} />
      <StickyJoinCTA lang={lang as Language} />
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { lang: 'sr' },
    { lang: 'en' },
  ];
}
