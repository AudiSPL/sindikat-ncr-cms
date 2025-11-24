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
  const firstQuestion = content.faq.categories[0]?.questions[0]?.question || content.nav.faq;

  return {
    title: content.nav.faq,
    description: firstQuestion,
    openGraph: {
      title: content.nav.faq,
      description: firstQuestion,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  // Flatten all questions from categories for schema.org
  const allQuestions = content.faq.categories.flatMap(cat => cat.questions);
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQuestions.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
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

        {/* Legal Disclaimer */}
        <div className="mt-12 p-6 bg-muted/30 border-l-4 border-yellow-500 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <svg 
              className="h-5 w-5 text-yellow-600" 
              fill="none" 
              strokeWidth="2" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            {lang === 'sr' ? 'Pravno obaveštenje' : 'Legal Notice'}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lang === 'sr' 
              ? 'Informacije sadržane na ovoj stranici imaju isključivo informativni karakter i ne predstavljaju pravni savet. Tumačenje i primena prava zavisi od okolnosti konkretnog slučaja, kao i od važećih propisa u trenutku primene. Sindikat ne snosi odgovornost za odluke koje pojedinci donesu oslanjajući se isključivo na ovaj tekst, bez dodatne stručne konsultacije.'
              : 'The information on this page is provided for general information purposes only and does not constitute legal advice. The interpretation and application of the law depends on the specific facts of each case and on the regulations in force at the relevant time. The union cannot be held liable for decisions made by individuals who rely solely on this text without seeking additional professional advice.'
            }
          </p>
        </div>

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
