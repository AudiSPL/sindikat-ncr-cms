'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/content';

interface DetailsLayoutProps {
  children: React.ReactNode;
  lang: Language;
  backHref?: string;
  backLabel?: string;
  relatedLinks?: Array<{
    href: string;
    label: string;
  }>;
}

export function DetailsLayout({ 
  children, 
  lang, 
  backHref = `/${lang}`, 
  backLabel,
  relatedLinks 
}: DetailsLayoutProps) {
  const defaultBackLabel = lang === 'sr' ? 'Nazad na početnu' : 'Back to home';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href={backHref} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {backLabel || defaultBackLabel}
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {children}
      </div>

      {/* Related Links */}
      {relatedLinks && relatedLinks.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">
            {lang === 'sr' ? 'Povezane teme' : 'Related topics'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <Button key={link.href} variant="outline" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
