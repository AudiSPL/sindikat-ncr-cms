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
  const isSerbian = lang === 'sr';
  
  const meta = isSerbian
    ? {
        title: 'Često Postavljena Pitanja - Sindikat NCR Atleos | FAQ',
        description: 'Sva pitanja o sindikatu NCR Atleos: članstvo, anonimnost, prava zaposlenih, kolektivno pregovaranje, zaštita radnika. 33 detaljnih odgovora na vaša pitanja.',
        keywords: 'NCR Atleos FAQ, pitanja o sindikatu, prava zaposlenih NCR, članstvo u sindikatu, zaštita radnika, kolektivno pregovaranje',
      }
    : {
        title: 'Frequently Asked Questions - NCR Atleos Union | FAQ',
        description: 'All questions about NCR Atleos Union: membership, anonymity, employee rights, collective bargaining, worker protection. 33 detailed answers to your questions.',
        keywords: 'NCR Atleos FAQ, union questions, NCR employee rights, union membership, worker protection, collective bargaining',
      };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
      url: `https://www.sindikatncr.com/${lang}/tema/faq`,
      images: [
        {
          url: 'https://www.sindikatncr.com/brand/logo-sindikat.png',
          width: 1200,
          height: 630,
          alt: 'NCR Atleos Union FAQ',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['https://www.sindikatncr.com/brand/logo-sindikat.png'],
    },
    alternates: {
      canonical: `/${lang}/tema/faq`,
      languages: {
        'sr': '/sr/tema/faq',
        'en': '/en/tema/faq',
      },
    },
  };
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  // Flatten all questions from categories for schema.org
  const allQuestions = content.faq.categories.flatMap(cat => cat.questions);
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": lang === 'sr' ? "Početna" : "Home",
        "item": `https://www.sindikatncr.com/${lang}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": content.nav.faq,
        "item": `https://www.sindikatncr.com/${lang}/tema/faq`
      }
    ]
  };
  
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

  // HowTo Schema #1: How to Document Workplace Violations
  const howToDocumentViolationsSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": lang === 'sr' 
      ? "Kako dokumentovati kršenje radnih prava"
      : "How to document workplace rights violations",
    "description": lang === 'sr'
      ? "Vodič za bezbedno i efikasno dokumentovanje kršenja vaših radnih prava"
      : "Guide to safely and effectively documenting workplace rights violations",
    "totalTime": "PT15M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": lang === 'sr' ? "Zabeležite sve detalje" : "Record all details",
        "text": lang === 'sr'
          ? "Dokumentujte datum, vreme, lokaciju, prisutne osobe i tačan opis šta se desilo. Budite što precizniji."
          : "Document date, time, location, people present, and exact description of what happened. Be as precise as possible."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": lang === 'sr' ? "Sačuvajte sve dokaze" : "Preserve all evidence",
        "text": lang === 'sr'
          ? "Napravite kopije svih relevantnih dokumenata, emailova, poruka. Čuvajte ih na LIČNOM uređaju, ne na službenom."
          : "Make copies of all relevant documents, emails, messages. Store them on PERSONAL devices, not work devices."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": lang === 'sr' ? "Identifikujte svedoke" : "Identify witnesses",
        "text": lang === 'sr'
          ? "Napišite imena kolega koji su bili prisutni. Ne kontaktirajte ih odmah - samo zapišite ko je video šta se dogodilo."
          : "Write down names of colleagues who were present. Don't contact them immediately - just note who witnessed what happened."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": lang === 'sr' ? "Koristite lične kanale" : "Use personal channels",
        "text": lang === 'sr'
          ? "Za skladištenje dokumenata koristite lični email (ne službeni). Koristite privatnu mrežu, ne korporativnu."
          : "Use personal email (not work email) to store documents. Use private network, not corporate network."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": lang === 'sr' ? "Kontaktirajte sindikat" : "Contact the union",
        "text": lang === 'sr'
          ? "Pošaljite dokumentaciju sindikatu na office@sindikatncr.com sa ličnog email naloga. Sindikat će proceniti sledeće korake."
          : "Send documentation to union at office@sindikatncr.com from personal email account. Union will assess next steps."
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": lang === 'sr' ? "Lični telefon ili računar" : "Personal phone or computer"
      },
      {
        "@type": "HowToTool",
        "name": lang === 'sr' ? "Lični email nalog" : "Personal email account"
      },
      {
        "@type": "HowToTool",
        "name": lang === 'sr' ? "Beležnica ili digitalni dokument" : "Notebook or digital document"
      }
    ]
  };

  // HowTo Schema #2: How to Request GDPR Data Deletion
  const howToGDPRDeletionSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": lang === 'sr' 
      ? "Kako povući saglasnost za korišćenje podataka po GDPR-u"
      : "How to withdraw consent for data use under GDPR",
    "description": lang === 'sr'
      ? "Koraci za povlačenje saglasnosti za korišćenje fotografija ili ličnih podataka od strane poslodavca"
      : "Steps to withdraw consent for use of photos or personal data by employer",
    "totalTime": "PT10M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": lang === 'sr' ? "Napišite formalni zahtev" : "Write formal request",
        "text": lang === 'sr'
          ? "Napišite kratak, jasan zahtev u kome navodite da želite da povučete saglasnost za korišćenje vaših ličnih podataka (fotografije, video snimci, lični podaci za marketing)."
          : "Write a brief, clear request stating you wish to withdraw consent for use of your personal data (photos, videos, personal information for marketing)."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": lang === 'sr' ? "Navedite pravnu osnovu" : "Cite legal basis",
        "text": lang === 'sr'
          ? "Referišite se na GDPR (član 7, stav 3) i Zakon o zaštiti podataka o ličnosti. Navedite da imate pravo da povučete saglasnost u bilo kom trenutku."
          : "Reference GDPR (Article 7, paragraph 3) and Data Protection Law. State that you have the right to withdraw consent at any time."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": lang === 'sr' ? "Pošaljite zahtev" : "Send the request",
        "text": lang === 'sr'
          ? "Pošaljite zahtev sa ličnog email naloga na zvaničnu HR adresu ili DPO (Data Protection Officer) vašeg poslodavca. Zadržite kopiju."
          : "Send request from personal email to official HR address or employer's DPO (Data Protection Officer). Keep a copy."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": lang === 'sr' ? "Sačekajte odgovor" : "Wait for response",
        "text": lang === 'sr'
          ? "Poslodavac ima obavezu da odgovori u roku od 30 dana. Ako ne odgovore ili odbiju, možete se obratiti Povereniku za informacije od javnog značaja."
          : "Employer must respond within 30 days. If they don't respond or refuse, you can contact the Commissioner for Information of Public Importance."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": lang === 'sr' ? "Eskalacija (ako je potrebno)" : "Escalation (if needed)",
        "text": lang === 'sr'
          ? "Ako poslodavac ne postupi, kontaktirajte sindikat za pravnu pomoć ili direktno podnesite pritužbu Povereniku."
          : "If employer doesn't comply, contact union for legal help or file complaint directly with Commissioner."
      }
    ]
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
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToDocumentViolationsSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToGDPRDeletionSchema),
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
