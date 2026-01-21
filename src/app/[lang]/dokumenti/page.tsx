import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailsLayout } from '@/components/DetailsLayout';
import { FileText, Book, Shield, Clipboard, Eye, PenTool, Scale, FileCheck } from 'lucide-react';
import { Language } from '@/lib/content';

interface DokumentiPageProps {
  params: Promise<{ lang: string }>;
}

// Emoji icon component for DSM
const LightbulbEmoji = ({ className }: { className?: string }) => (
  <span className={className?.replace('h-6 w-6', 'text-2xl') || 'text-2xl'} role="img" aria-label="lightbulb">💡</span>
);

export async function generateMetadata({ params }: DokumentiPageProps): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: lang === 'sr' ? 'Dokumenti' : 'Documents',
    description: lang === 'sr' 
      ? 'Važni dokumenti i oficijalni materijali za članove sindikata NCR Atleos.'
      : 'Important documents and official materials for NCR Atleos union members.',
    openGraph: {
      title: lang === 'sr' ? 'Dokumenti' : 'Documents',
      description: lang === 'sr' 
        ? 'Važni dokumenti i oficijalni materijali za članove sindikata NCR Atleos.'
        : 'Important documents and official materials for NCR Atleos union members.',
      type: 'website',
      locale: lang === 'sr' ? 'sr_RS' : 'en_US',
    },
  };
}

export default async function DokumentiPage({ params }: DokumentiPageProps) {
  const { lang } = await params;
  const isSerbian = lang === 'sr';

  const coreDocuments = [
    {
      id: 'resenje-upisa',
      title: isSerbian ? 'Rešenje o upisu' : 'Ministry Registration',
      icon: FileCheck,
      description: isSerbian
        ? 'Oficijalno rešenje Ministarstva za rad, zapošljavanje, boračka i socijalna pitanja o upisu Sindikata NCR Atleos u Registar sindikata.'
        : 'Official resolution from the Ministry of Labor, Employment, Veterans and Social Affairs regarding the registration of Sindikat NCR Atleos in the Register of Trade Unions.',
      pdf: '/documents/Resenje o upisu.pdf',
      fullWidth: false
    },
    {
      id: 1,
      title: isSerbian ? 'STATUT' : 'Statute',
      icon: FileText,
      description: isSerbian 
        ? 'Osnovni dokument koji definiše ciljeve, strukturu, principe i način rada sindikata NCR Atleos. Sadrži sve informacije o organizaciji, donošenju odluka i upravljanju sindikatom.'
        : 'The founding document that defines the goals, structure, principles, and operations of the NCR Atleos Union. Contains all information about organization, decision-making, and union management.',
      pdf: '/documents/СТАТУТ.pdf',
      fullWidth: false
    },
    {
      id: 2,
      title: isSerbian ? 'Pravilnik Sindikata' : 'Membership Rules',
      icon: Book,
      description: isSerbian
        ? 'Definiše uslove i procedure članstva, prava i obaveze članova sindikata. Obavezna literatura za sve nove članove.'
        : 'Defines the conditions and procedures for membership, as well as member rights and responsibilities. Essential reading for all new members.',
      pdf: '/documents/Правилник Синдиката (ср).pdf',
      fullWidth: false
    },
    {
      id: 3,
      title: isSerbian ? 'Politika Privatnosti' : 'Privacy Policy',
      icon: Shield,
      description: isSerbian
        ? 'Objašnjava kako sindikat obrađuje, čuva i štiti vaše lične podatke, u skladu sa GDPR i lokalnim propisima.'
        : 'Explains how the union processes, stores, and protects your personal data in compliance with GDPR and local regulations.',
      pdf: '/documents/Privacy Policy.pdf',
      fullWidth: false
    },
    {
      id: 'dsm',
      title: isSerbian ? 'Metodologija Digitalnog Sindikata (DSM™)' : 'Digital Syndicate Methodology (DSM™)',
      icon: LightbulbEmoji,
      description: isSerbian
        ? 'Registrovana metodologija za digitalno organizovanje sindikata. Autorsko delo deponovano u Zavodu za intelektualnu svojinu Republike Srbije. Broj potvrde: 10.309.'
        : 'Registered methodology for digital union organizing. Copyright work deposited with the Intellectual Property Office of the Republic of Serbia. Certificate number: 10.309.',
      pdf: '/documents/DSM_Metodologija.pdf',
      fullWidth: true
    }
  ];

  const forms = isSerbian ? [
    {
      id: 'b1',
      title: 'Pristupnica',
      icon: Clipboard,
      description: 'Obrazac za članstvo u sindikatu. Popunite i pošaljite za registraciju.',
      pdf: '/documents/B1_Pristupnica_SR.pdf'
    },
    {
      id: 'b2',
      title: 'Pristanak na Vidljivost',
      icon: Eye,
      description: 'Obrazac za pristanak na javnu vidljivost člana u registru sindikata.',
      pdf: '/documents/B2_OptIn_Visibility_SR.pdf'
    },
    {
      id: 'b3',
      title: 'Punomoćje',
      icon: PenTool,
      description: 'Obrazac punomoćja za predstavljanje ispred sindikata.',
      pdf: '/documents/B3_Punomocje_SR.pdf'
    },
    {
      id: 'b4',
      title: 'Prigovor',
      icon: Scale,
      description: 'Obrazac za podnošenje prigovora na odluke sindikata.',
      pdf: '/documents/B4_Prigovor_SR.pdf'
    }
  ] : [
    {
      id: 'b1',
      title: 'Membership Application',
      icon: Clipboard,
      description: 'Application form for union membership. Complete and submit for registration.',
      pdf: '/documents/B1_Pristupnica_EN.pdf'
    },
    {
      id: 'b2',
      title: 'Visibility Consent',
      icon: Eye,
      description: 'Consent form for public visibility as a union member.',
      pdf: '/documents/B2_OptIn_Visibility_EN.pdf'
    },
    {
      id: 'b3',
      title: 'Power of Attorney',
      icon: PenTool,
      description: 'Power of attorney form for union representation.',
      pdf: '/documents/B3_PowerOfAttorney_EN.pdf'
    },
    {
      id: 'b4',
      title: 'Complaint Form',
      icon: Scale,
      description: 'Form for submitting complaints or objections to union decisions.',
      pdf: '/documents/B4_Complaint_EN.pdf'
    }
  ];

  return (
    <DetailsLayout lang={lang as Language}>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B2C49] dark:text-white">
            {isSerbian ? 'Dokumenti' : 'Documents'}
          </h1>
        </div>

        {/* Section 1: Core Documents */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2C49] dark:text-white mb-6 pb-3 border-b-2 border-[#F28C38]">
            {isSerbian ? 'Osnovni Dokumenti' : 'Core Documents'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreDocuments.map((doc) => (
              <Card 
                key={doc.id} 
                className={`hover:shadow-lg transition-all duration-300 flex flex-col bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 ${doc.fullWidth ? 'col-span-1 md:col-span-2 lg:col-span-4' : ''}`}
              >
                <CardHeader className={`flex-grow ${doc.fullWidth ? 'pb-2' : 'pb-3'}`}>
                  <div className={`flex items-center space-x-3 ${doc.fullWidth ? 'mb-2' : 'mb-3'}`}>
                    <doc.icon className="h-6 w-6 text-[#F28C38]" />
                    <CardTitle className="text-base md:text-lg font-bold text-[#0B2C49] dark:text-white">
                      {doc.title}
                    </CardTitle>
                  </div>
                  <p className={`text-sm text-gray-600 dark:text-gray-300 ${doc.fullWidth ? 'leading-snug' : 'leading-relaxed'}`}>
                    {doc.description}
                  </p>
                </CardHeader>
                <CardContent className={`pt-0 ${doc.fullWidth ? 'pb-2' : 'pb-4'}`}>
                  <a 
                    href={doc.pdf} 
                    download
                    className="block w-full bg-[#F28C38] hover:bg-[#E67E22] text-white text-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:ring-offset-2"
                  >
                    {isSerbian ? 'Preuzmi PDF' : 'Download PDF'}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 2: Forms & Templates */}
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2C49] dark:text-white mb-6 pb-3 border-b-2 border-[#F28C38]">
            {isSerbian ? 'Obrazci' : 'Forms & Templates'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-all duration-300 flex flex-col bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex-grow pb-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <form.icon className="h-6 w-6 text-[#005B99]" />
                    <CardTitle className="text-base font-bold text-[#0B2C49] dark:text-white">
                      {form.title}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {form.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <a 
                    href={form.pdf} 
                    download
                    className="block w-full bg-[#F28C38] hover:bg-[#E67E22] text-white text-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F28C38] focus:ring-offset-2"
                  >
                    {isSerbian ? 'Preuzmi PDF' : 'Download PDF'}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DetailsLayout>
  );
}
