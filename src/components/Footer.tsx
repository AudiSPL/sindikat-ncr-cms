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
    <footer role="contentinfo" className="border-t bg-brand-navy dark:bg-brand-navy">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Logo and Name */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Logo className="h-10 w-10" />
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
          <div className="space-y-2">
            <h3 className="font-semibold text-white">{content.footer.quickLinks}</h3>
            <nav aria-label="Footer links" role="navigation" className="space-y-1">
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
          <div className="space-y-2">
            <h3 className="font-semibold text-white">{content.footer.contact}</h3>
            <div className="space-y-2">
              <a 
                href="mailto:office@sindikatncr.com" 
                className="block text-sm text-white/90 hover:text-white transition-colors"
              >
                office@sindikatncr.com
              </a>
              <p className="text-sm text-white/90">Španskih Boraca 75</p>
              <p className="text-sm text-white/90">{lang === 'sr' ? 'Beograd' : 'Belgrade'}</p>
              <p className="text-sm text-white/90">{lang === 'sr' ? 'Srbija' : 'Serbia'}</p>
            </div>
          </div>
        </div>

        {/* Copyright footer */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm text-white/80 leading-relaxed">
              {lang === 'sr' ? (
                <>
                  © {new Date().getFullYear()} Sindikat Zaposlenih NCR Atleos – Beograd. Nezavisna organizacija zaposlenih; nismo povezani sa NCR Atleos korporacijom, NCR ATM d.o.o. Beograd, niti NCR Voyix, niti predstavljamo njihove stavove. Sadržaj je informativne prirode i ne predstavlja pravni savet. Rukovalac podacima (GDPR): Pravo na pristup/ispravku/brisanje: obratite se na{' '}
                  <a 
                    href="mailto:office@sindikatncr.com" 
                    className="text-white hover:text-brand-orange transition-colors underline"
                  >
                    navedenu adresu e-pošte
                  </a>
                  .
                </>
              ) : (
                <>
                  © {new Date().getFullYear()} Sindikat Zaposlenih NCR Atleos - Beograd. Independent workers&apos; organization; not affiliated with NCR Atleos Corporation, NCR ATM d.o.o. Belgrade, or NCR Voyix, and does not represent employer views. Content is for information only and does not constitute legal advice. Data Controller (GDPR): To exercise access/rectification/erasure rights, contact{' '}
                  <a 
                    href="mailto:office@sindikatncr.com" 
                    className="text-white hover:text-brand-orange transition-colors underline"
                  >
                    the email above
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
