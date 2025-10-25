import { Metadata } from 'next';
import { DetailsLayout } from '@/components/DetailsLayout';
import { ContactForm } from '@/components/ContactForm';
import { Language, getContent } from '@/lib/content';

interface KontaktPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: KontaktPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.contact.title,
    description: content.contact.description,
    openGraph: {
      title: content.contact.title,
      description: content.contact.description,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function KontaktPage({ params }: KontaktPageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return (
    <DetailsLayout lang={lang as Language}>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{content.contact.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.contact.description}
          </p>
        </div>

        <ContactForm lang={lang as Language} />
      </div>
    </DetailsLayout>
  );
}
