'use client';

import { AlertTriangle } from 'lucide-react';

type Language = 'sr' | 'en';

interface DisclaimerBannerProps {
  lang: Language;
}

const content = {
  sr: {
    title: "⚠️ Važno obaveštenje",
    text: "Svi benefiti i poboljšanja navedeni na ovom sajtu nisu garantovani i zavise od uspeha zajedničkih pregovora sa poslodavcem. Ishodi zavise od spremnosti kompanije da pregovara, zakonskih okvira i tvoje aktivne podrške."
  },
  en: {
    title: "⚠️ Important Notice",
    text: "All benefits and improvements described here are not guaranteed. They depend on successful collective negotiations with the employer. Outcomes depend on the company's willingness to negotiate, legal constraints, and active member participation."
  }
};

export default function DisclaimerBanner({ lang }: DisclaimerBannerProps) {
  const currentContent = content[lang] || content.sr;

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black py-12">
      <div className="bg-[#1A1D23] border-y-2 border-brand-orange p-6 md:p-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-brand-orange flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white text-lg mb-3">
                {currentContent.title}
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {currentContent.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

