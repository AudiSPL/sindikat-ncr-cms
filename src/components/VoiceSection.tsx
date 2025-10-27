'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

export default function VoiceSection() {
  const { lang } = useLanguage();
  
  return (
    <section className="w-full bg-[#E67E22] py-7 md:py-10 lg:py-13">
      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Content */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          
          {/* Heading */}
          <h2 className="
            text-2xl sm:text-3xl md:text-3xl lg:text-4xl 
            font-bold font-sans
            text-white
            leading-tight tracking-tight
            max-w-4xl
          ">
            Tvoj Glas je Važan
          </h2>

          {/* Subtitle */}
          <p className="
            text-sm sm:text-base md:text-base lg:text-base
            font-normal
            text-white/90
            leading-relaxed
            max-w-3xl
          ">
            Pridruži se poverljivo i budi deo promene koja počinje danas.
          </p>

          {/* CTA Button */}
          <Link href={`/${lang}/nova-pristupnica`}>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A2332] hover:bg-[#0F1419] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Priključi se poverljivo
              <span className="text-base sm:text-base md:text-base lg:text-base ml-1">→</span>
            </button>
          </Link>

        </div>
      </div>
    </section>
  );
}
