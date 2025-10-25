'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './theme-toggle';
import { Logo } from './Logo';
import { Language, getContent } from '@/lib/content';

interface HeaderProps {
  lang: Language;
}

export function Header({ lang }: HeaderProps) {
  const content = getContent(lang);

  const navItems = [
    { label: content.nav.home, href: `/${lang}` },
    { label: content.nav.join, href: `/${lang}/pristupnica` },
    { label: content.nav.documents, href: `/${lang}/dokumenti` },
    { label: content.nav.contact, href: `/${lang}/kontakt` },
    { label: content.nav.faq, href: `/${lang}/tema/faq` },
  ];

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity duration-200">
          <Logo className="h-6 w-6 md:h-8 md:w-8" />
          <span className="font-bold text-sm md:text-lg text-slate-900 dark:text-white hidden sm:block">Sindikat Radnika NCR Atleos – Beograd</span>
          <span className="font-bold text-sm md:text-lg text-slate-900 dark:text-white sm:hidden">Sindikat NCR</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-100 hover:text-brand-blue hover:bg-brand-blue/10 rounded-md transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Header Right Side - Language and Theme Buttons */}
        <div className="flex items-center gap-2">
          {/* Language Button */}
          <LanguageSwitcher currentLang={lang} />
          
          {/* Theme Button */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
