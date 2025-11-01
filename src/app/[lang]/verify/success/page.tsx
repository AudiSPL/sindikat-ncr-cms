'use client';

export const dynamic = 'force-dynamic';

import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const content = {
  sr: {
    title: 'Hvala! Vaša prijava je primljena i čeka se odobravanja od administratora.',
    subtitle: 'Dobićete email kada vaše članstvo bude odobreno.',
    contact: 'Pitanja? Pišite nam: office@sindikatncr.com',
  },
  en: {
    title: 'Thank you! Your application has been received and is awaiting administrator approval.',
    subtitle: 'You will receive an email once your membership is approved.',
    contact: 'Questions? Email us: office@sindikatncr.com',
  },
};

export default function VerifySuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = (params.lang as string) || 'sr';
  const t = content[lang as keyof typeof content];
  const name = searchParams.get('name');

  return (
    <div className="min-h-screen bg-[#0F1419] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {name && `👋 ${name}, `}
            ✅ {lang === 'sr' ? 'Uspešno!' : 'Success!'}
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            {t.title}
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-6 bg-brand-blue/10 border border-brand-blue rounded-xl text-center">
          <p className="text-white font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-center p-6 bg-[#1A1D23] border border-[#2D3139] rounded-xl">
          <p className="text-sm text-gray-400">
            {t.contact}
          </p>
        </div>
      </div>
    </div>
  );
}

