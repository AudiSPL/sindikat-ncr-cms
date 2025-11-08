import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Language, getContent } from '@/lib/content';

interface TeaserGridProps {
  lang: Language;
}

export function TeaserGrid({ lang }: TeaserGridProps) {
  const content = getContent(lang);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#0F1419]">
      <div className="container mx-auto px-5 md:px-10 lg:px-15 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {content.teasers.map((teaser, index) => {
            // Featured cards with orange borders (Anonimnost and Benefiti)
            const isFeatured = teaser.title.includes('Anonimnost') || teaser.title.includes('Benefiti') || teaser.title.includes('Confidentiality') || teaser.title.includes('Benefits');
            return (
              <Link key={index} href={teaser.href} className="block">
                <Card className={`group ${isFeatured ? 'featured' : ''}`}>
                  <CardHeader className="p-0 mb-3">
                    <CardTitle className={`text-lg md:text-xl ${isFeatured ? 'text-xl md:text-2xl' : ''}`}>
                      {teaser.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription className={`mb-4 text-sm md:text-base ${isFeatured ? 'text-base md:text-lg' : ''}`}>
                      {teaser.excerpt}
                    </CardDescription>
                    <span className={`text-sm md:text-base ${isFeatured ? 'text-base md:text-lg' : ''} text-[#2C5282] dark:text-[#E67E22] font-medium hover:opacity-80 hover:underline transition-opacity duration-200 inline-block whitespace-nowrap`}>
                      {lang === 'sr' ? 'Saznaj više →' : 'Learn more →'}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
