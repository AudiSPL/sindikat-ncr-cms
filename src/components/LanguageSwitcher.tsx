'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Language } from '@/lib/content';

interface LanguageSwitcherProps {
  currentLang: Language;
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const targetLang = currentLang === 'sr' ? 'en' : 'sr';
    const newPath = pathname.replace(`/${currentLang}`, `/${targetLang}`);
    localStorage.setItem('preferred-language', targetLang);
    router.push(newPath);
  };

  // Show the opposite language as the button text
  const buttonText = currentLang === 'sr' ? 'EN' : 'SR';

  return (
    <button
      onClick={switchLanguage}
      className="px-3 py-2 border-2 border-brand-blue text-brand-blue rounded-lg font-semibold hover:bg-brand-blue/10 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
      aria-label={`Switch to ${currentLang === 'sr' ? 'English' : 'Serbian'} language`}
    >
      {buttonText}
    </button>
  );
}
