'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/content';

interface StickyJoinCTAProps {
  lang: Language;
}

export function StickyJoinCTA({ lang }: StickyJoinCTAProps) {
  const ctaText = lang === 'sr' ? 'Pridruži se' : 'Join';

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Button asChild size="lg" className="rounded-full shadow-lg bg-brand-orange hover:bg-brand-orange/90">
        <Link href={`/${lang}/pristupnica`}>
          {ctaText}
        </Link>
      </Button>
    </div>
  );
}
