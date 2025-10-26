import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DetailsLayout } from '@/components/DetailsLayout';
import { Shield, Megaphone, Handshake, Lock, HelpCircle, TrendingUp } from 'lucide-react';
import { Language, getContent } from '@/lib/content';

interface BenefitiPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: BenefitiPageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);

  return {
    title: content.benefits.title,
    description: content.benefits.cards[0].description,
    openGraph: {
      title: content.benefits.title,
      description: content.benefits.cards[0].description,
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function BenefitiPage({ params }: BenefitiPageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  const relatedLinks = [
    { href: `/${lang}/tema/ko-smo-mi`, label: content.nav.whoWeAre },
    { href: `/${lang}/tema/nas-plan`, label: content.nav.ourPlan },
    { href: `/${lang}/tema/anonimnost`, label: content.nav.confidentiality },
    { href: `/${lang}/nova-pristupnica`, label: content.nav.join },
  ];

  const icons = [Shield, Megaphone, Handshake, Lock, HelpCircle, TrendingUp];

  return (
    <DetailsLayout 
      lang={lang as Language} 
      relatedLinks={relatedLinks}
    >
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{content.benefits.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === 'sr' 
              ? 'Evo šta dobijaš kao član našeg sindikata'
              : 'Here\'s what you get as a member of our union'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.benefits.cards.map((card, index) => {
            const Icon = icons[index] || Shield;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-brand-blue" />
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-[#E67E22] to-[#F5A623] dark:from-[#D97E1F] dark:to-[#F28C38] rounded-lg p-4 md:p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
          <h3 className="text-lg md:text-2xl font-bold text-white mb-3 animate-pulse">
            {lang === 'sr' ? 'Spremni da se pridružite?' : 'Ready to join?'}
          </h3>
          <p className="text-sm md:text-base text-white/90 mb-4">
            {lang === 'sr' 
              ? 'Pridružite se našoj zajednici i budite deo promene koja štiti sva vaša prava.'
              : 'Join our community and be part of the change that protects all your rights.'
            }
          </p>
          <Link href={`/${lang}/nova-pristupnica`}>
            <button className="px-6 py-2 bg-white text-brand-orange dark:text-brand-orange font-semibold rounded-lg hover:scale-110 transition-all duration-300 hover:shadow-lg active:scale-95 border-2 border-white hover:border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50">
              {lang === 'sr' ? 'Pridruži se' : 'Join us'} →
            </button>
          </Link>
        </div>
      </div>
    </DetailsLayout>
  );
}
