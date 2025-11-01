'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Language } from '@/lib/content';

interface LanguagePersistenceProps {
  currentLang: Language;
}

export function LanguagePersistence({ currentLang }: LanguagePersistenceProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has a preferred language stored
    const preferredLang = localStorage.getItem('preferred-language') as Language;
    
    if (preferredLang && preferredLang !== currentLang) {
      // If preferred language differs from current, redirect to preferred language
      const newPath = pathname.replace(`/${currentLang}`, `/${preferredLang}`);
      router.push(newPath);
    } else if (!preferredLang) {
      // If no preferred language is stored, save current language
      localStorage.setItem('preferred-language', currentLang);
    }
  }, [currentLang, pathname, router]);

  // This component doesn't render anything
  return null;
}



