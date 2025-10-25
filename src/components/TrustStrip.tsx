import { Language, getContent } from '@/lib/content';

interface TrustStripProps {
  lang: Language;
}

export function TrustStrip({ lang }: TrustStripProps) {
  const content = getContent(lang);

  return (
    <section className="bg-[#F7FAFC] dark:bg-[#0F1419] py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {content.trustStrip}
          </p>
        </div>
      </div>
    </section>
  );
}
