'use client';

import Link from 'next/link';
import { Language, getContent } from '@/lib/content';

interface DonationsProps {
  lang: Language;
}

export function Donations({ lang }: DonationsProps) {
  const content = getContent(lang);
  const donations = content.donations;

  return (
    <section className="py-10 md:py-12 bg-[#F7FAFC] dark:bg-[#0F1419]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-5">
            {donations.title}
          </h2>
          
          <p className="text-base md:text-lg text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
            {donations.content}
          </p>
          
          <div className="flex justify-center">
            <Link href={donations.buttonLink}>
              <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand-blue text-brand-blue hover:bg-blue-50 font-semibold rounded-lg transition-all duration-300">
                {donations.buttonText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
