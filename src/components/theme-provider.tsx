'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: 'class' | 'data-theme' | 'data-mode';
  defaultTheme?: 'light' | 'dark' | 'system';
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force dark theme always
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Always ensure dark class is present
    const ensureDark = () => {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
    };
    
    ensureDark();
    
    // Re-apply every 100ms to fight any changes
    const interval = setInterval(ensureDark, 100);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
      disableTransitionOnChange={props.disableTransitionOnChange ?? true}
      storageKey="theme-locked"
    >
      {children}
    </NextThemesProvider>
  );
}