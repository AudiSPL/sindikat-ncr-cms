import { Metadata } from 'next';
import { DetailsLayout } from '@/components/DetailsLayout';
import { FAQAccordion } from '@/components/FAQAccordion';
import { Language, getContent } from '@/lib/content';
import FAQContactForm from './FAQContactForm';

interface FAQPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.nav.faq,
    description: content.faq[0].question,
    openGraph: {
      title: content.nav.faq,
      description: content.faq[0].question,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  const relatedLinks = [
    { href: `/${lang}/tema/anonimnost`, label: content.nav.confidentiality },
    { href: `/${lang}/tema/pravna-podrska`, label: content.nav.legalSupport },
    { href: `/${lang}/kontakt`, label: content.nav.contact },
  ];

  return (
    <DetailsLayout 
      lang={lang as Language} 
      relatedLinks={relatedLinks}
    >
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{content.nav.faq}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === 'sr' 
              ? 'Najčešća pitanja o sindikatu, članstvu i vašim pravima'
              : 'Most common questions about the union, membership and your rights'
            }
          </p>
        </div>

        <FAQAccordion lang={lang as Language} />

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">
            {lang === 'sr' ? 'Niste našli odgovor?' : 'Didn\'t find the answer?'}
          </h2>
          <p className="text-muted-foreground">
            {lang === 'sr' 
              ? 'Kontaktirajte nas direktno za dodatne informacije.'
              : 'Contact us directly for additional information.'
            }
          </p>
        </div>

        <FAQContactForm lang={lang} />
      </div>
    </DetailsLayout>
  );
}
