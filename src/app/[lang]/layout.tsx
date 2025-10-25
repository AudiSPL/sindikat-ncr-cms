import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StickyJoinCTA } from '@/components/StickyJoinCTA';
import { LanguagePersistence } from '@/components/LanguagePersistence';
import { Language } from '@/lib/content';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
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
      <main className="flex-1">
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
