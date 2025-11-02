'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
// import { ThemeToggle } from './theme-toggle';
import { Logo } from './Logo';
import { Language, getContent } from '@/lib/content';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  lang: Language;
}

export function Header({ lang }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const content = getContent(lang);

  const navItems = [
    { label: content.nav.home, href: `/${lang}` },
    { label: content.nav.join, href: `/${lang}/nova-pristupnica` },
    { label: content.nav.documents, href: `/${lang}/dokumenti` },
    { label: content.nav.contact, href: `/${lang}/kontakt` },
    { label: content.nav.faq, href: `/${lang}/tema/faq` },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity duration-200" onClick={closeMobileMenu}>
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

        {/* Header Right Side - Language, Theme, and Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Language Button */}
          <div className="ml-auto">
            <LanguageSwitcher currentLang={lang} />
          </div>
          
          {/* Theme Button - Disabled */}
          {/* <ThemeToggle /> */}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 shadow-2xl z-[60] lg:hidden overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {lang === 'sr' ? 'Meni' : 'Menu'}
                </h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {lang === 'sr' ? 'Sindikat NCR Atleos' : 'NCR Atleos Union'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
