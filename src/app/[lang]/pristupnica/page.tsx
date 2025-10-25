import { Metadata } from 'next';
import { PristupnicaInner } from './PristupnicaInner';
import { Language, getContent } from '@/lib/content';

interface PristupnicaPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PristupnicaPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.pristupnica.title,
    description: content.pristupnica.content,
    openGraph: {
      title: content.pristupnica.title,
      description: content.pristupnica.content,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function PristupnicaPage({ params }: PristupnicaPageProps) {
  const { lang } = await params;

  return <PristupnicaInner lang={lang as Language} />;
}