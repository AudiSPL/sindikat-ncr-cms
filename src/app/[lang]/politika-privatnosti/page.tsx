import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailsLayout } from '@/components/DetailsLayout';
import { Shield, Database, Clock, Users, FileText } from 'lucide-react';
import { Language, getContent } from '@/lib/content';

interface PolitikaPrivatnostiPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PolitikaPrivatnostiPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.privacy.title,
    description: content.privacy.sections[0].content,
    openGraph: {
      title: content.privacy.title,
      description: content.privacy.sections[0].content,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function PolitikaPrivatnostiPage({ params }: PolitikaPrivatnostiPageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  const relatedLinks = [
    { href: `/${lang}/tema/anonimnost`, label: content.nav.confidentiality },
    { href: `/${lang}/kontakt`, label: content.nav.contact },
  ];

  const icons = [Database, Users, Shield, FileText, Clock];

  return (
    <DetailsLayout 
      lang={lang as Language} 
      relatedLinks={relatedLinks}
    >
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{content.privacy.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === 'sr' 
              ? 'Kako prikupljamo, koristimo i štitimo vaše podatke'
              : 'How we collect, use and protect your data'
            }
          </p>
        </div>

        <div className="space-y-6">
          {content.privacy.sections.map((section, index) => {
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
                {lang === 'sr' ? 'Vaša prava' : 'Your rights'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'sr' 
                  ? 'Imate pravo na pristup, ispravku, brisanje i ograničavanje obrade vaših podataka u skladu sa GDPR.'
                  : 'You have the right to access, correct, delete and restrict processing of your data in accordance with GDPR.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DetailsLayout>
  );
}
