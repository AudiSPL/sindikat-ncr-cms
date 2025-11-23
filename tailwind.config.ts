import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand (from CSS variables)
        'brand-navy': 'hsl(var(--brand-navy))',
        'brand-blue': 'hsl(var(--brand-blue))',
        'brand-orange': 'hsl(var(--brand-orange))',
        'brand-red': 'hsl(var(--brand-red))',

        // Accessible primary colors (WCAG AA compliant)
        'accessible-blue': '#60A5FA',
        'accessible-navy': '#0D47A1',
        'accessible-red': '#C62828',

        // Form elements
        'form-border': '#475569',

        // Status colors (already accessible)
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',

        // Dark mode variants
        'dark-navy': '#1976D2',
        'dark-red': '#EF5350',

        // Theme tokens from CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        }
      },
      borderRadius: {
        '2xl': '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  safelist: [
    {
      pattern: /^dark:/,
    },
  ],
  plugins: [],
};

export default config;
