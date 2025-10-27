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
  maximumScale: 1,
  themeColor: '#0B2C49', // brand-navy
};

export const metadata: Metadata = {
  title: "Sindikat NCR Atleos",
  description: "Sindikat NCR Atleos - Zajedno smo jači | Together We Are Stronger",
  keywords: ["sindikat", "NCR", "Atleos", "Beograd", "workers union", "labor rights"],
  authors: [{ name: "Sindikat Radnika NCR Atleos" }],
  creator: "Sindikat NCR Atleos",
  publisher: "Sindikat NCR Atleos",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sindikat-ncr.vercel.app'),
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
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sindikat-ncr.vercel.app',
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
