import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailsLayout } from '@/components/DetailsLayout';
import { Shield, Lock, Eye, Users } from 'lucide-react';
import { Language, getContent } from '@/lib/content';

interface AnonimnostPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AnonimnostPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.confidentiality.title,
    description: content.confidentiality.sections[0].content,
    openGraph: {
      title: content.confidentiality.title,
      description: content.confidentiality.sections[0].content,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function AnonimnostPage({ params }: AnonimnostPageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

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
        "name": content.nav.confidentiality,
        "item": `https://www.sindikatncr.com/${lang}/tema/anonimnost`
      }
    ]
  };

  const relatedLinks = [
    { href: `/${lang}/tema/pravna-podrska`, label: content.nav.legalSupport },
    { href: `/${lang}/tema/faq`, label: content.nav.faq },
    { href: `/${lang}/politika-privatnosti`, label: lang === 'sr' ? 'Politika privatnosti' : 'Privacy Policy' },
  ];

  const icons = [Shield, Lock, Eye, Users];

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
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{content.confidentiality.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === 'sr' 
              ? 'Poverljivost u skladu sa zakonom. Poslodavac nema legitiman osnov da traži podatke.'
              : 'Confidentiality in accordance with the law. Employer has no legitimate basis to request data.'
            }
          </p>
        </div>

        <div className="space-y-6">
          {content.confidentiality.sections.map((section, index) => {
            const Icon = icons[index] || Shield;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-brand-blue" />
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">
                {lang === 'sr' ? 'Vaša sigurnost je naš prioritet' : 'Your safety is our priority'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'sr' 
                  ? 'Sve što radimo je u skladu sa najvišim standardima bezbednosti i zakonskim zahtevima.'
                  : 'Everything we do is in accordance with the highest security standards and legal requirements.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DetailsLayout>
  );
}
