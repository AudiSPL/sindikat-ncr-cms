'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder to avoid hydration mismatch
    return (
      <button 
        aria-label="Toggle theme" 
        className="px-3 py-2 border-2 border-brand-blue rounded-lg"
      />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Show the opposite theme icon
  const isLightMode = theme === 'light';
  const Icon = isLightMode ? Moon : Sun;
  const iconColor = isLightMode ? 'text-gray-500' : 'text-yellow-500';

  return (
    <button
      onClick={toggleTheme}
      className={`px-3 py-2 border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue/10 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2`}
      aria-label={`Switch to ${isLightMode ? 'dark' : 'light'} theme`}
    >
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </button>
  );
}


