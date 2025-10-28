'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Language, getContent } from '@/lib/content';

interface FooterProps {
  lang: Language;
}

export function Footer({ lang }: FooterProps) {
  const content = getContent(lang);
  const pathname = usePathname();

  return (
    <footer className="border-t bg-brand-navy dark:bg-brand-navy">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Name */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-lg text-white">Sindikat Radnika NCR Atleos – Beograd</span>
            </div>
            <p className="text-sm text-white/90">
              {lang === 'sr' 
                ? 'Zaposleni koji zajedno štitimo svoja prava'
                : 'Employees protecting our rights together'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">{content.footer.quickLinks}</h3>
            <nav className="space-y-2">
              <Link href={`/${lang}`} className="block text-sm text-white/90 hover:text-white transition-colors">
                {content.nav.home}
              </Link>
              <Link href={`/${lang}/kontakt`} className="block text-sm text-white/90 hover:text-white transition-colors">
                {content.nav.contact}
              </Link>
              <Link href={`/${lang}/politika-privatnosti`} className="block text-sm text-white/90 hover:text-white transition-colors">
                {lang === 'sr' ? 'Politika privatnosti' : 'Privacy Policy'}
              </Link>
              <Link href={`/${lang}/dokumenti`} className="block text-sm text-white/90 hover:text-white transition-colors">
                {content.nav.documents}
              </Link>
            </nav>
          </div>

          {/* Contact and Logo */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">{content.footer.contact}</h3>
            <div className="space-y-2">
              <a 
                href="mailto:office@sindikatncr.com" 
                className="block text-sm text-white/90 hover:text-white transition-colors"
              >
                office@sindikatncr.com
              </a>
              <p className="text-sm text-white/90">Spanskih Boraca 75</p>
              <p className="text-sm text-white/90">{lang === 'sr' ? 'Beograd' : 'Belgrade'}</p>
              <p className="text-sm text-white/90">{lang === 'sr' ? 'Srbija' : 'Serbia'}</p>
            </div>
          </div>
        </div>

        {/* Simplified footer */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="text-center">
            <p className="text-sm text-white/80">
              © 2025 Sindikat NCR Atleos – Beograd
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
