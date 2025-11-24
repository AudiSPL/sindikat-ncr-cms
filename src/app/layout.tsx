import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // Removed maximumScale to allow users to zoom (WCAG 2.0-2.2 Level AA requirement)
  themeColor: '#0B2C49', // brand-navy
};

export const metadata: Metadata = {
  title: "Sindikat NCR Atleos",
  description: "Sindikat NCR Atleos - Zajedno smo jači | Together We Are Stronger",
  keywords: [
    // Generic labor/union terms (SAFE)
    "sindikat", "radnički sindikat", "workers union", "labor union Serbia",
    "workers rights Belgrade", "employee union", "labor rights",
    
    // Descriptive use (FAIR USE - identifying employer)
    "sindikat zaposlenih", "union for employees",
    "payment technology workers", "ATM industry union",
    "Belgrade tech workers union",
    
    // Misspellings users might search (NEUTRAL)
    "sindikat beograd", "labor union beograd",
    
    // Services offered (SAFE)
    "collective bargaining", "legal support workers",
    "employee protection", "workplace rights",
    "union membership Serbia", "anonymous union"
  ],
  authors: [{ name: "Sindikat Radnika NCR Atleos" }],
  creator: "Sindikat NCR Atleos",
  publisher: "Sindikat NCR Atleos",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sindikatncr.com'),
  alternates: {
    canonical: '/',
    languages: {
      'sr': '/sr',
      'en': '/en',
    },
  },
  openGraph: {
    title: "Sindikat NCR Atleos",
    description: "Sindikat NCR Atleos - Zajedno smo jači | Together We Are Stronger",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sindikatncr.com',
    siteName: "Sindikat NCR Atleos",
    images: [
      {
        url: '/brand/logo-sindikat-blackonwhite.png',
        width: 1200,
        height: 630,
        alt: 'Sindikat NCR Atleos Logo',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sindikat NCR Atleos",
    description: "Sindikat NCR Atleos - Zajedno smo jači | Together We Are Stronger",
    images: ['/brand/logo-sindikat-blackonwhite.png'],
    creator: '@sindikatncr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/brand/logo-sindikat.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Sindikat NCR Atleos",
              "alternateName": [
                "NCR Atleos Union",
                "Atleos Union",
                "Atlios Union",
                "Sindikat ATM DOO",
                "Worker's Union NCR Atleos"
              ],
              "url": "https://www.sindikatncr.com",
              "logo": "https://www.sindikatncr.com/logo-white.svg",
              "description": "Independent labor union representing NCR Atleos employees in Serbia, providing legal support and worker protection.",
              "foundingDate": "2025",
              "areaServed": {
                "@type": "Country",
                "name": "Serbia"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@sindikatncr.com",
                "availableLanguage": ["Serbian", "English"],
                "areaServed": "RS"
              },
              "knowsAbout": [
                "Labor Law",
                "Worker Rights",
                "Employment Law",
                "Collective Bargaining"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Sindikat NCR Atleos",
              "alternateName": ["NCR Atleos Union", "Atlios Union", "Atleos Union"],
              "url": "https://www.sindikatncr.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.sindikatncr.com/sr/tema/faq?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "inLanguage": ["sr", "en"],
              "audience": {
                "@type": "Audience",
                "audienceType": "NCR Atleos employees"
              },
              "keywords": "NCR Atleos union, atlios, atleos, workers rights, collective bargaining, labor union Serbia"
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
          disableTransitionOnChange
          storageKey="theme-disabled"
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
