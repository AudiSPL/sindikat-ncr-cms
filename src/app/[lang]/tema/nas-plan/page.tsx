import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailsLayout } from '@/components/DetailsLayout';
import { Language, getContent } from '@/lib/content';

interface NasPlanPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: NasPlanPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.ourPlan.title,
    description: content.ourPlan.steps[0].description,
    openGraph: {
      title: content.ourPlan.title,
      description: content.ourPlan.steps[0].description,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function NasPlanPage({ params }: NasPlanPageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  const relatedLinks = [
    { href: `/${lang}/tema/ko-smo-mi`, label: content.nav.whoWeAre },
    { href: `/${lang}/tema/benefiti`, label: content.nav.benefits },
    { href: `/${lang}/nova-pristupnica`, label: content.nav.join },
  ];

  return (
    <DetailsLayout 
      lang={lang as Language} 
      relatedLinks={relatedLinks}
    >
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{content.ourPlan.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === 'sr' 
              ? 'Četiri koraka ka jačoj poziciji zaposlenih kroz kolektivno pregovaranje'
              : 'Four steps towards stronger employee position through collective bargaining'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.ourPlan.steps.map((step, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">
                {lang === 'sr' ? 'Timeline' : 'Timeline'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'sr' 
                  ? 'Proces se odvija postupno, sa fokusom na poverljivost i sigurnost svih učesnika.'
                  : 'The process unfolds gradually, with focus on confidentiality and safety of all participants.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DetailsLayout>
  );
}
