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

  const faqSchema =
    lang === 'sr'
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Šta je sindikat i zašto mi treba?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sindikat je organizacija zaposlenih koja štiti vaša prava kroz kolektivno pregovaranje. Kroz sindikat možete uticati na uslove rada, plate, benefite i druge aspekte radnog odnosa.',
              },
            },
            {
              '@type': 'Question',
              name: 'Da li je članstvo stvarno anonimno?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Anonimnost je dostupna do trenutka kada zakon zahteva drugačije (npr. u postupcima reprezentativnosti). Tada važe posebne zakonske zaštite za učesnike i predstavnike.',
              },
            },
            {
              '@type': 'Question',
              name: 'Koliko košta članstvo?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Nema članarine do marta/aprila 2026. Nakon dostizanja reprezentativnosti, članarina se uvodi glasanjem svih članova (obično oko 1% plate).',
              },
            },
            {
              '@type': 'Question',
              name: 'Gde se čuvaju moji podaci?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Podaci se čuvaju u EU (Supabase Ireland) u skladu sa GDPR. Imamo audit logove svih pristupa i možemo obrisati vaše podatke u roku od 30 dana po zahtevu.',
              },
            },
            {
              '@type': 'Question',
              name: 'Šta ako me poslodavac pita o članstvu?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Poslodavac nema pravo da traži informacije o vašem članstvu u sindikatu, osim u slučajevima propisanim zakonom. Vaše članstvo je privatna stvar.',
              },
            },
            {
              '@type': 'Question',
              name: 'Kako mogu da se pridružim?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Kliknite na "Pridruži se našoj priči" dugme i popunite formular. Možete ostaviti samo email za komunikaciju, ostalo može biti anonimno.',
              },
            },
          ],
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is a union and why do I need it?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A union is an organization of employees that protects your rights through collective bargaining. Through the union you can influence working conditions, wages, benefits and other aspects of employment.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is membership really anonymous?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Anonymity is available until the law requires otherwise (e.g., in representativeness procedures). Then special legal protections apply for participants and representatives.',
              },
            },
            {
              '@type': 'Question',
              name: 'How much does membership cost?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No membership fees until March/April 2026. After reaching representativeness, membership fees are introduced by voting of all members (usually about 1% of salary).',
              },
            },
            {
              '@type': 'Question',
              name: 'Where is my data stored?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Data is stored in the EU (Supabase Ireland) in accordance with GDPR. We have audit logs of all access and can delete your data within 30 days upon request.',
              },
            },
            {
              '@type': 'Question',
              name: 'What if my employer asks about membership?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The employer has no right to request information about your union membership, except in cases prescribed by law. Your membership is a private matter.',
              },
            },
            {
              '@type': 'Question',
              name: 'How can I join?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Click the "Join our story" button and fill out the form. You can leave only email for communication, everything else can be anonymous.',
              },
            },
          ],
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
