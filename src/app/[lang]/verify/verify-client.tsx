'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MessageSquare, Camera, CheckCircle, Info, AlertTriangle, ArrowRight, Clock, Handshake, X, Lock, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const content = {
  sr: {
    header: {
      title: 'Prijava primljena!',
      subtitle: 'Poslednji korak: Verifikujte da radite u NCR Atleos',
    },
    infoBanner: 'Ova verifikacija štiti sindikat od lažnih prijava. Izaberite jedan način - svi su sigurni i privatni.',
    methods: {
      inperson: {
        title: 'Lični susret u kancelariji',
        badge: '🤝 Bez digitalnog traga - Dogovor',
        description: 'Najsigurniji način verifikacije bez ikakvog digitalnog traga.',
        instructions: {
          title: '👥 Kako funkcioniše:',
          steps: [
            'Pošalji email na office@sindikatncr.com sa lične email adrese',
            'Navedi: \'Želim da verifikujem članstvo lično\'',
            'Dogovorićemo kratak susret (10-15 minuta)',
            'Doneseš svoj ID ili drugu potvrdu zaposlenja',
            'Popuniš pristupnicu na licu mesta'
          ]
        },
        advantages: [
          'Apsolutno nema digitalnog traga',
          'IT ne može detektovati bilo kakvu aktivnost',
          'Direktan razgovor, pitanja na licu mesta'
        ],
        location: '📍 Lokacija: Campus Zgrada',
        timing: '⏱️ Vreme: Fleksibilno',
        button: 'Zakažite lični susret'
      },
      email: {
        title: 'Pošaljite email sa posla',
        badge: 'Najbrže - ~1h',
        description: 'Pošaljite email sa poslovnog email naloga na verifikacija926@gmail.com',
        instructions: {
          title: '📧 Uputstvo:',
          steps: [
            'Otvorite Vaš poslovni email',
            'Pošaljite email na: verifikacija926@gmail.com',
            'Naslov: Bilo koji (npr. \'Zdravo\')',
            'Tekst: Bilo šta (npr. \'hi\') - obavezno samo da potiče sa vašeg poslovnog emaila',
          ],
        },
        riskNote: '⚠️ Napomena: Slanje sa poslovnog emaila može biti vidljivo IT-u kompanije. Za maksimalnu privatnost izaberite direktnu poruku ili fotografiju bedža.',
        button: 'Poslao/la sam email',
        sentMessage: '✅ Hvala! Proverićemo inbox i verifikovaćemo Vas automatski.',
      },
      teams: {
        title: 'Potvrda putem direktne poruke',
        badge: '💬 Diskretno - ~2h',
        description: 'Organizator će te kontaktirati putem interne poslovne poruke',
        instructions: {
          title: '💬 Kako funkcioniše:',
          steps: [
            'Organizator će te kontaktirati putem interne poslovne poruke',
            'Dobićeš jednostavnu neutralnu poruku sa pitanjem',
            'Odgovori sa "da" ili "potvrdio/la"',
            'Organizator će verifikovati članstvo',
          ],
        },
        warningNote: '⚠️ Šta treba da znaš:\n\n- Interne poslovne poruke mogu biti vidljive IT timu\n- Koristimo neutralne formulacije bez eksplicitnih termina\n- Poruke se brišu nakon verifikacije\n- Dokazuje zaposlenje (samo zaposleni imaju pristup internim sistemima)',
        button: 'Izaberi potvrdu putem poruke',
        selectedMessage: '✅ Očekujte poruku u narednih 24-48 sati. Ako se niko ne javi, pišite nam sa lične adrese: office@sindikatncr.com',
      },
      badge: {
        title: 'Fotografija radne identifikacije',
        badge: 'Maksimalna privatnost',
        description: 'Pošaljite fotografiju Vaše NCR identifikacije',
        instructions: {
          title: '📸 Uputstvo:',
          steps: [
            'Slikajte NCR Atleos ID karticu tako da se vidi vaše ime i prezime',
            'Opciono: Zamaglite lice/fotografiju za dodatnu privatnost',
            'Upload fotografije ispod',
          ],
        },
        privacyNote: '🔒 Fotografija je enkriptovana i automatski se briše nakon 30 dana',
        uploadLabel: 'Izaberite fotografiju',
        button: 'Pošalji fotografiju',
        uploading: 'Šalje se...',
        uploadedMessage: '✅ Fotografija primljena! Pregledaćemo je u roku od 24-48 sati.',
      },
    },
    footer: '💡 Svi metodi su podjednako sigurni. Teams i fotografija bedža ne koriste nijedan NCR sistem.',
    securityNote: 'Ako želite veću privatnost, izaberite Teams ili fotografiju bedža. Slanje sa poslovnog emaila može biti vidljivo IT-u kompanije.',
    contact: 'Pitanja? Pišite nam sa lične adrese: office@sindikatncr.com',
    comparison: {
      title: '📊 Uporedi metode verifikacije',
      headers: {
        method: 'Metoda',
        privacy: 'Privatnost',
        speed: 'Brzina',
        trace: 'Digitalni trag'
      },
      rows: [
        {
          method: 'Lični susret',
          privacy: '🟢🟢🟢 Maksimalna',
          speed: 'Dogovor',
          trace: 'Nula'
        },
        {
          method: 'Fotografija bedža',
          privacy: '🟢🟢 Visoka',
          speed: '24-48h',
          trace: 'Van NCR sistema'
        },
        {
          method: 'Direktna poruka',
          privacy: '🟡 Srednja',
          speed: '~2h',
          trace: 'Interne poslovne poruke'
        },
        {
          method: 'Email sa posla',
          privacy: '🔴 Niska',
          speed: '~1h',
          trace: 'NCR email arhiva'
        }
      ]
    },
    explanation: {
      whyVerification: {
        title: 'Zašto zahtevamo verifikaciju zaposlenja?',
        content: 'Verifikacija štiti integritet sindikata od lažnih prijava, osigurava legalnu reprezentativnost (potrebno 15% zaposlenih), i garantuje da se članstvo dodaje samo zaposlenima NCR Atleos-a. Bez verifikacije ne možemo zaštititi prava članova niti pregovarati sa poslodavcem.'
      },
      membershipPhases: {
        title: 'Faze članstva i privatnost',
        content: 'Pre oko 335 članova: Članstvo je poverljivo, poslodavac ne može saznati da ste član. Nakon oko 335 članova: Sindikat postaje reprezentativan prema srpskom zakonu, poslodavac mora biti obavešten, ali predstavnici imaju zakonsku zaštitu od nepovoljnog tretmana.'
      }
    },
    emailModal: {
      title: 'Zakažite lični susret',
      to: 'office@sindikatncr.com',
      subject: 'Zahtev za lični susret - Verifikacija članstva',
      body: 'Poštovani,\n\nŽelim da verifikujem svoje članstvo lično.\n\nMolim vas da me kontaktirate radi dogovora termina.\n\nHvala,\n[Ime člana]',
      button: 'Otvori email klijent',
      close: 'Zatvori'
    },
  },
  en: {
    header: {
      title: 'Application Received!',
      subtitle: 'Final step: Verify you work at NCR Atleos',
    },
    infoBanner: 'This verification protects the union from fake applications. Choose one method - all are secure and private.',
    methods: {
      inperson: {
        title: 'In-person office meeting',
        badge: '🤝 No digital trace - Appointment',
        description: 'The most secure verification method with absolutely no digital footprint.',
        instructions: {
          title: '👥 How it works:',
          steps: [
            'Send email to office@sindikatncr.com from personal email',
            'State: \'I want to verify membership in person\'',
            'We\'ll arrange a brief meeting (10-15 minutes)',
            'Bring your ID or other proof of employment',
            'Complete membership form on-site'
          ]
        },
        advantages: [
          'Absolutely no digital trace',
          'IT cannot detect any activity',
          'Direct conversation, ask questions face-to-face'
        ],
        location: '📍 Location: Campus Building',
        timing: '⏱️ Time: Flexible',
        button: 'Schedule in-person meeting'
      },
      email: {
        title: 'Send email from work',
        badge: 'Fastest - ~1h',
        description: 'Send email from your work email account to verifikacija926@gmail.com',
        instructions: {
          title: '📧 Instructions:',
          steps: [
            'Open your work email',
            'Send email to: verifikacija926@gmail.com',
            'Subject: Any (e.g. \'Hello\')',
            'Body: Anything (e.g. \'hi\') - only requirement is it must come from your work email',
          ],
        },
        riskNote: '⚠️ Note: Messages from company accounts may be visible to employer IT. For maximum privacy choose direct message or badge photo.',
        button: "I've sent the email",
        sentMessage: "✅ Thanks! We'll check the inbox and verify you automatically.",
      },
      teams: {
        title: 'Direct message confirmation',
        badge: '💬 Discreet - ~2h',
        description: 'Organizer will contact you via internal business messaging',
        instructions: {
          title: '💬 How it works:',
          steps: [
            'Organizer will contact you via internal business messaging',
            "You'll receive a simple neutral message with a question",
            'Reply "yes" or "confirmed"',
            'Organizer verifies membership',
          ],
        },
        warningNote: '⚠️ What you should know:\n\n- Internal business messages may be visible to IT\n- We use neutral wording without explicit terms\n- Messages deleted after verification\n- Proves employment (only employees have access to internal systems)',
        button: 'Choose message confirmation',
        selectedMessage: "✅ Expect a message within 24-48 hours. If no one reaches out, email us from your personal address: office@sindikatncr.com",
      },
      badge: {
        title: 'Work badge photo',
        badge: 'Maximum privacy',
        description: 'Upload a photo of your NCR badge',
        instructions: {
          title: '📸 Instructions:',
          steps: [
            'Photograph your NCR Atleos ID card so your name and surname are visible',
            'Optional: Blur your face/photo for extra privacy',
            'Upload the photo below',
          ],
        },
        privacyNote: '🔒 Photo is encrypted and automatically deleted after 30 days',
        uploadLabel: 'Choose photo',
        button: 'Submit photo',
        uploading: 'Uploading...',
        uploadedMessage: '✅ Photo received! We\'ll review it within 24-48 hours.',
      },
    },
    footer: "💡 All methods are equally secure. Teams and badge photo don't use any NCR systems.",
    securityNote: 'For maximum privacy choose Teams or badge photo. Messages from company email may be visible to employer IT.',
    contact: 'Questions? Email us from your personal address: office@sindikatncr.com',
    comparison: {
      title: '📊 Compare Verification Methods',
      headers: {
        method: 'Method',
        privacy: 'Privacy',
        speed: 'Speed',
        trace: 'Digital Trace'
      },
      rows: [
        {
          method: 'In-person meeting',
          privacy: '🟢🟢🟢 Maximum',
          speed: 'Appointment',
          trace: 'None'
        },
        {
          method: 'Badge photo',
          privacy: '🟢🟢 High',
          speed: '24-48h',
          trace: 'Outside NCR system'
        },
        {
          method: 'Direct message',
          privacy: '🟡 Medium',
          speed: '~2h',
          trace: 'Internal business messages'
        },
        {
          method: 'Work email',
          privacy: '🔴 Low',
          speed: '~1h',
          trace: 'NCR email archive'
        }
      ]
    },
    explanation: {
      whyVerification: {
        title: 'Why do we require employment verification?',
        content: 'Verification protects union integrity from fake applications, ensures legal representativeness (requires 15% of employees), and guarantees membership is only granted to NCR Atleos employees. Without verification, we cannot protect member rights or negotiate with the employer.'
      },
      membershipPhases: {
        title: 'Membership Phases and Privacy',
        content: 'Before around 335 members: Membership is confidential, employer cannot know you are a member. After around 335 members: Union becomes representative per Serbian law, employer must be notified, but representatives have legal protection from unfavorable treatment.'
      }
    },
    emailModal: {
      title: 'Schedule in-person meeting',
      to: 'office@sindikatncr.com',
      subject: 'Request for in-person meeting - Membership verification',
      body: 'Dear Sir/Madam,\n\nI would like to verify my membership in person.\n\nPlease contact me to arrange a meeting time.\n\nThank you,\n[Member Name]',
      button: 'Open email client',
      close: 'Close'
    },
  },
};

interface VerifyClientProps {
  token: string;
  firstName: string;
  lang: string;
  currentMethod: string | null;
  currentStatus: string;
}

export default function VerifyClient({
  token,
  firstName,
  lang,
  currentMethod,
  currentStatus,
}: VerifyClientProps) {
  const router = useRouter();
  const t = content[lang as keyof typeof content];
  
  const [selectedMethod, setSelectedMethod] = useState<string | null>(currentMethod);
  const [emailSent, setEmailSent] = useState(false);
  const [badgeFile, setBadgeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleMethodSelect = async (method: string) => {
    setSelectedMethod(method);

    // Save method to database
    await fetch('/api/select-verification-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, method }),
    });
  };

  const handleBadgeUpload = async () => {
    if (!badgeFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('token', token);
    formData.append('file', badgeFile);

    const response = await fetch('/api/upload-badge', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setUploaded(true);
    }

    setUploading(false);
  };

  const handleSubmit = () => {
    // Redirect to success page with name parameter
    const nameParam = firstName ? `?name=${encodeURIComponent(firstName)}` : '';
    router.push(`/${lang}/verify/success${nameParam}`);
  };

  const handleOpenEmailClient = () => {
    const emailBody = t.emailModal.body.replace('[Ime člana]', firstName || '[Ime člana]').replace('[Member Name]', firstName || '[Member Name]');
    const mailtoLink = `mailto:${t.emailModal.to}?subject=${encodeURIComponent(t.emailModal.subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    setShowEmailModal(false);
    setEmailSent(true);
  };

  const getMethodDisplayName = (method: string) => {
    if (lang === 'sr') {
      switch (method) {
        case 'inperson': return 'Lični susret';
        case 'badge': return 'Fotografija bedža';
        case 'teams': return 'Direktna poruka';
        case 'email': return 'Email';
        default: return method;
      }
    } else {
      switch (method) {
        case 'inperson': return 'In-person meeting';
        case 'badge': return 'Badge photo';
        case 'teams': return 'Direct message';
        case 'email': return 'Email';
        default: return method;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1419] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t.header.title}
          </h1>
          <p className="text-lg text-gray-300">
            {t.header.subtitle}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {firstName && `👋 ${firstName}`}
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-brand-orange rounded-lg">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-white">{t.infoBanner}</p>
          </div>
        </div>

        {/* Verification Methods */}
        <div className="space-y-4">
          
          {/* In-Person Method (Highest Privacy) */}
          <div 
            className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedMethod === 'inperson' 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleMethodSelect('inperson')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Handshake className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {t.methods.inperson.title}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                    {t.methods.inperson.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {t.methods.inperson.description}
                </p>
                
                {selectedMethod === 'inperson' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-gray-900 mb-3">
                      {t.methods.inperson.instructions.title}
                    </p>
                    <ol className="space-y-2 text-sm text-gray-700 mb-4">
                      {t.methods.inperson.instructions.steps.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    
                    <div className="mb-4 space-y-2">
                      <p className="text-sm font-semibold text-gray-900">{t.methods.inperson.advantages[0]}</p>
                      <p className="text-sm font-semibold text-gray-900">{t.methods.inperson.advantages[1]}</p>
                      <p className="text-sm font-semibold text-gray-900">{t.methods.inperson.advantages[2]}</p>
                    </div>
                    
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700 mb-1">{t.methods.inperson.location}</p>
                      <p className="text-sm text-gray-700">{t.methods.inperson.timing}</p>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEmailModal(true);
                      }}
                    >
                      {t.methods.inperson.button}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Badge Method (High Privacy) */}
          <div 
            className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedMethod === 'badge' 
                ? 'border-green-500 shadow-lg' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => handleMethodSelect('badge')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {t.methods.badge.title}
                  </h3>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                    {t.methods.badge.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {t.methods.badge.description}
                </p>
                
                {selectedMethod === 'badge' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-gray-900 mb-3">
                      {t.methods.badge.instructions.title}
                    </p>
                    <ol className="space-y-2 text-sm text-gray-700 mb-4">
                      {t.methods.badge.instructions.steps.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>

                    {!uploaded ? (
                      <>
                        <Label className="block mb-2 text-sm font-medium">
                          {t.methods.badge.uploadLabel}
                        </Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setBadgeFile(e.target.files?.[0] || null)}
                          className="mb-3"
                        />
                        
                        {badgeFile && (
                          <p className="text-sm text-white mt-2">
                            📎 {lang === 'sr' ? 'Odabrana datoteka:' : 'Selected file:'} <strong>{badgeFile.name}</strong>
                          </p>
                        )}
                        
                        <Button 
                          className="w-full"
                          onClick={handleBadgeUpload}
                          disabled={!badgeFile || uploading}
                        >
                          {uploading ? t.methods.badge.uploading : t.methods.badge.button}
                          {!uploading && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                      </>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                        {t.methods.badge.uploadedMessage}
                      </div>
                    )}
                    
                    <p className="mt-3 text-xs text-gray-700">
                      {t.methods.badge.privacyNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Teams Method (Medium Privacy) */}
          <div 
            className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedMethod === 'teams' 
                ? 'border-purple-500 shadow-lg' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => handleMethodSelect('teams')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {t.methods.teams.title}
                  </h3>
                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                    {t.methods.teams.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {t.methods.teams.description}
                </p>
                
                {selectedMethod === 'teams' && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="font-medium text-gray-900 mb-3">
                      {t.methods.teams.instructions.title}
                    </p>
                    <ol className="space-y-2 text-sm text-gray-700 mb-4">
                      {t.methods.teams.instructions.steps.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    
                    {/* Warning Note */}
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                      <div className="text-sm text-yellow-800 whitespace-pre-line">
                        {t.methods.teams.warningNote}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {t.methods.teams.selectedMessage}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email Method (Lowest Privacy - with Risk Warning) */}
          <div 
            className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedMethod === 'email' 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleMethodSelect('email')}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {t.methods.email.title}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {t.methods.email.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {t.methods.email.description}
                </p>
                
                {selectedMethod === 'email' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    {/* Risk Warning */}
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          {t.methods.email.riskNote}
                        </p>
                      </div>
                    </div>

                    <p className="font-medium text-gray-900 mb-3">
                      {t.methods.email.instructions.title}
                    </p>
                    <ol className="space-y-2 text-sm text-gray-700 mb-4">
                      {t.methods.email.instructions.steps.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-bold">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    
                    {!emailSent ? (
                      <Button 
                        className="w-full"
                        onClick={() => setEmailSent(true)}
                      >
                        {t.methods.email.button}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                        {t.methods.email.sentMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Explanation Boxes */}
        <div className="space-y-6 mb-8">
          {/* Why Verification Box */}
          <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-[#005B99] rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-[#005B99] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#0B2C49] dark:text-white mb-2">
                  {t.explanation.whyVerification.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.explanation.whyVerification.content}
                </p>
              </div>
            </div>
          </div>

          {/* Membership Phases Box */}
          <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-[#F28C38] rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Scale className="w-6 h-6 text-[#F28C38] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#0B2C49] dark:text-white mb-2">
                  {t.explanation.membershipPhases.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.explanation.membershipPhases.content}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Submit Button */}
        {selectedMethod && (
          <div className="mt-8 p-6 bg-brand-orange rounded-xl">
            <p className="text-white font-bold mb-4">
              {lang === 'sr' ? 'Izabrana metoda:' : 'Selected method:'} <strong>{getMethodDisplayName(selectedMethod)}</strong>
            </p>
            <Button 
              className="w-full py-6 text-lg font-semibold bg-white text-brand-orange hover:bg-gray-100"
              disabled={
                (selectedMethod === 'email' && !emailSent) ||
                (selectedMethod === 'badge' && !uploaded) ||
                (selectedMethod === 'inperson' && !emailSent)
              }
              onClick={handleSubmit}
            >
              {lang === 'sr' ? 'Potvrdi izbor' : 'Confirm selection'}
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 space-y-4">
          <p className="text-center text-sm text-gray-400">
            {t.contact}
          </p>
        </div>
      </div>

      {/* Email Modal for In-Person Scheduling */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {t.emailModal.title}
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={t.emailModal.close}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {lang === 'sr' ? 'Za:' : 'To:'}
                </Label>
                <p className="text-sm text-gray-900 mt-1">{t.emailModal.to}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {lang === 'sr' ? 'Naslov:' : 'Subject:'}
                </Label>
                <p className="text-sm text-gray-900 mt-1">{t.emailModal.subject}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  {lang === 'sr' ? 'Tekst poruke:' : 'Message:'}
                </Label>
                <Textarea
                  value={t.emailModal.body.replace('[Ime člana]', firstName || '[Ime člana]').replace('[Member Name]', firstName || '[Member Name]')}
                  readOnly
                  className="min-h-32 text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => setShowEmailModal(false)}
                variant="outline"
                className="flex-1"
              >
                {t.emailModal.close}
              </Button>
              <Button
                onClick={handleOpenEmailClient}
                className="flex-1 bg-[#005B99] hover:bg-[#004080] text-white"
              >
                {t.emailModal.button}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


