'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MessageSquare, Camera, CheckCircle, Info, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const content = {
  sr: {
    header: {
      title: 'Prijava primljena!',
      subtitle: 'Poslednji korak: Verifikujte da radite u NCR Atleos',
    },
    infoBanner: 'Ova verifikacija štiti sindikat od lažnih prijava. Izaberite jedan način - svi su sigurni i privatni.',
    methods: {
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
        riskNote: '⚠️ Napomena: Slanje sa poslovnog emaila može biti vidljivo IT-u kompanije. Za maksimalnu privatnost izaberite Teams ili fotografiju bedža.',
        button: 'Poslao/la sam email',
        sentMessage: '✅ Hvala! Proverićemo inbox i verifikovaćemo Vas automatski.',
      },
      teams: {
        title: 'Teams poruka potvrda',
        badge: 'Preporučeno',
        description: 'Organizator će Vas kontaktirati preko Teams-a',
        instructions: {
          title: '💬 Kako funkcioniše:',
          steps: [
            'Dobićete Teams poruku: "Da li ste upravo aplicirali za Sindikat NCR Atleos?"',
            'Dobićete Teams poruku: "Da li ste popunili online formular?"',
            'Odgovorite sa "da" da potvrdite',
            'Organizator će odmah verifikovati Vaše članstvo',
          ],
        },
        privacyNote: '🔒 Najprivatnija opcija - neutralna poruka, direktan ljudski kontakt',
        button: 'Izaberi Teams verifikaciju',
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
  },
  en: {
    header: {
      title: 'Application Received!',
      subtitle: 'Final step: Verify you work at NCR Atleos',
    },
    infoBanner: 'This verification protects the union from fake applications. Choose one method - all are secure and private.',
    methods: {
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
        riskNote: '⚠️ Note: Messages from company accounts may be visible to employer IT. For maximum privacy choose Teams or badge photo.',
        button: "I've sent the email",
        sentMessage: "✅ Thanks! We'll check the inbox and verify you automatically.",
      },
      teams: {
        title: 'Teams message confirmation',
        badge: 'Recommended',
        description: 'An organizer will contact you via Teams',
        instructions: {
          title: '💬 How it works:',
          steps: [
            "You'll receive a Teams message: \"Did you fill out the online form?\"",
            'Reply "yes" to confirm',
            'Organizer will verify your membership immediately',
          ],
        },
        privacyNote: '🔒 Most private option - neutral message, direct human contact',
        button: 'Choose Teams verification',
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
          
          {/* Teams Method (Recommended) */}
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
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {t.methods.teams.selectedMessage}
                    </div>
                    
                    <p className="text-xs text-gray-700">
                      {t.methods.teams.privacyNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Badge Method (Maximum Privacy) */}
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

          {/* Email Method (with Risk Warning) */}
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

        {/* Final Submit Button */}
        {selectedMethod && (
          <div className="mt-8 p-6 bg-brand-orange rounded-xl">
            <p className="text-white font-bold mb-4">
              Izabrana metoda: <strong>{selectedMethod === 'email' ? 'Email' : selectedMethod === 'teams' ? 'Teams poruka' : 'Fotografija bedža'}</strong>
            </p>
            <Button 
              className="w-full py-6 text-lg font-semibold bg-white text-brand-orange hover:bg-gray-100"
              disabled={
                (selectedMethod === 'email' && !emailSent) ||
                (selectedMethod === 'badge' && !uploaded)
              }
              onClick={handleSubmit}
            >
              Potvrdi izbor
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-[#1A1D23] border border-[#2D3139] rounded-lg text-center">
            <p className="text-sm text-gray-300">{t.footer}</p>
          </div>
          
          <p className="text-center text-sm text-gray-400">
            {t.contact}
          </p>
        </div>
      </div>
    </div>
  );
}


