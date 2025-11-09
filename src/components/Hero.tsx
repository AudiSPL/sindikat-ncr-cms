import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Language, getContent } from '@/lib/content';

interface HeroProps {
  lang: Language;
}

export function Hero({ lang }: HeroProps) {
  const content = getContent(lang);

  return (
    <section className="relative overflow-hidden">
      {/* Background - Light mode: dark teal, Dark mode: brand navy */}
      <div className="absolute inset-0 bg-[#2C5282] dark:bg-[#2C5282]"></div>
      
      {/* Dark overlay - Light mode: subtle, Dark mode: stronger */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 lg:py-24">
        <div className="max-w-full mx-auto text-center space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            {content.hero.title}
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white/90 dark:text-gray-200 max-w-4xl mx-auto">
            {content.hero.lead}
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
            {/* Primary Button - Light mode: orange, Dark mode: brand orange */}
            <Button asChild className="bg-[#E67E22] hover:opacity-90 text-white px-6 py-3 rounded-lg transition-all duration-200 ease-out font-semibold w-full md:w-auto dark:bg-brand-orange">
              <Link href={`/${lang}/nova-pristupnica`}>
                {content.hero.ctaPrimary} →
              </Link>
            </Button>

            {/* Secondary Button - Light mode: white, Dark mode: white */}
            <Button asChild className="bg-white text-[#2C5282] border-2 border-white px-6 py-3 rounded-lg hover:bg-white/90 transition-all duration-200 ease-out font-semibold w-full md:w-auto dark:bg-white dark:text-brand-navy dark:border-white dark:hover:bg-white/90">
              <Link href={`/${lang}/tema/ko-smo-mi`}>
                {content.hero.ctaSecondary}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements - Light mode: white/opacity, Dark mode: unchanged */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/3 rounded-full"></div>
    </section>
  );
}
