'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './theme-toggle';
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
          <LanguageSwitcher currentLang={lang} />
          
          {/* Theme Button */}
          <ThemeToggle />

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
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 bg-[#0F1419] dark:bg-[#0F1419] border-l border-[#2D3139] shadow-2xl z-50 lg:hidden animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2D3139]">
                <h2 className="text-xl font-bold text-white">
                  {lang === 'sr' ? 'Menj' : 'Menu'}
                </h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-white hover:bg-[#1A1D23] rounded-md transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-white hover:bg-[#1A1D23] hover:text-[#E67E22] rounded-lg transition-all duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-[#2D3139]">
                <p className="text-sm text-[#9CA3AF] text-center">
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
