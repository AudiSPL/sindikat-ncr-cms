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
  // Ensure theme class is applied to document.documentElement
  useEffect(() => {
    const applyThemeToDocument = () => {
      const theme = localStorage.getItem(props.storageKey || 'theme') || 'system';
      const htmlElement = document.documentElement;
      
      // Remove existing theme classes
      htmlElement.classList.remove('light', 'dark');
      
      // Apply new theme class
      if (theme === 'dark') {
        htmlElement.classList.add('dark');
      } else if (theme === 'light') {
        htmlElement.classList.add('light');
      }
    };

    // Apply theme on mount
    applyThemeToDocument();

    // Listen for theme changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === (props.storageKey || 'theme')) {
        applyThemeToDocument();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [props.storageKey]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={props.defaultTheme ?? 'system'}
      enableSystem={props.enableSystem ?? true}
      disableTransitionOnChange={props.disableTransitionOnChange ?? true}
      storageKey={props.storageKey || 'theme'}
    >
      {children}
    </NextThemesProvider>
  );
}