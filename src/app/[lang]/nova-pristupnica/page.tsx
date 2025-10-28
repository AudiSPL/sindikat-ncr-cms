'use client';

import { useState, useEffect } from 'react';
import { useLanguage, useTranslations } from '@/lib/i18n';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

declare global {
  interface Window {}
}

export default function NovaPristupnica() {
  const t = useTranslations();
  const { lang, setLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quicklookError, setQuicklookError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    quicklookId: '',
    city: '',
    organization: '',
    agreeJoin: false,
    agreeGDPR: false,
    isAnonymous: true,
  });

  // No reCAPTCHA/Turnstile

  const validateQuicklookId = (value: string) => {
    const regex = /^[A-Z]{2}\d{6}$/;
    if (!regex.test(value)) {
      setQuicklookError(lang === 'sr' ? 'Format: 2 slova + 6 cifara (npr. AB123456)' : 'Format: 2 letters + 6 digits (e.g., AB123456)');
      return false;
    }
    setQuicklookError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuicklookId(formData.quicklookId.toUpperCase())) {
      toast.error(lang === 'sr' ? 'Quicklook ID nije validan' : 'Quicklook ID is invalid');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          quicklookId: formData.quicklookId.toUpperCase()
        }),
      });

      console.log('📥 Response status:', res.status);
      const responseText = await res.text();
      console.log('📥 Response body:', responseText);

      if (res.ok) {
        toast.success(lang === 'sr' ? 'Prijava uspesno poslata!' : 'Application submitted successfully!');
        setSubmitted(true);
      } else if (res.status === 429) {
        toast.error(lang === 'sr' ? 'Previše zahteva. Pokušajte ponovo za minut.' : 'Too many requests. Please try again in a minute.');
      } else if (res.status === 409) {
        const j = JSON.parse(responseText);
        toast.error(lang === 'sr' ? 'Korisnik je vec u bazi, kontaktirajte nas preko office@sindikatncr.com' : 'User already registered. Contact us.');
      } else {
        throw new Error(`Server returned ${res.status}: ${responseText}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error(lang === 'sr' ? 'Doslo je do greske' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  // No token watcher

  if (submitted) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-[#0F1419] p-4">
        <Card className="max-w-md bg-[#1A1D23] border-[#2D3139]">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-[#E67E22] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">
              {lang === 'sr' ? 'Hvala sto si se prikljucio/la!' : 'Thanks for joining!'}
            </h2>
            <p className="text-[#9CA3AF]">
              {lang === 'sr' ? 'Ako zelis, mozes se ukljuciti u radne grupe. Kontaktiraj nas na ' : 'If you wish, you can join working groups. Contact us via email '}
              <a href="mailto:office@sindikatncr.com" className="text-[#E67E22] font-medium hover:underline">
                office@sindikatncr.com
              </a>
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '', email: '', quicklookId: '', city: '', organization: '',
                  agreeJoin: false, agreeGDPR: false, isAnonymous: true
                });
              }}
              className="mt-4 bg-[#E67E22] hover:bg-[#E67E22]/90 text-white"
            >
              {lang === 'sr' ? 'Nova prijava' : 'New application'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-[#0F1419] p-4">
      <div className="w-full max-w-2xl mx-auto py-6 px-3 sm:px-4">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => history.back()}
            className="mr-auto inline-flex items-center gap-2 text-[#E67E22] hover:opacity-80 underline text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === 'sr' ? 'Nazad' : 'Back'}
          </button>
          <div className="inline-flex rounded overflow-hidden border border-[#2D3139]">
            <button
              className={`px-3 py-1 text-sm transition-colors ${lang === 'sr' ? 'bg-[#E67E22] text-white' : 'bg-[#1A1D23] text-white hover:bg-[#2D3139]'}`}
              onClick={() => setLang('sr')}
              aria-label="Switch to Serbian"
            >
              {t('lang.sr')}
            </button>
            <button
              className={`px-3 py-1 text-sm transition-colors ${lang === 'en' ? 'bg-[#E67E22] text-white' : 'bg-[#1A1D23] text-white hover:bg-[#2D3139]'}`}
              onClick={() => setLang('en')}
              aria-label="Switch to English"
            >
              {t('lang.en')}
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#E67E22] to-[#FF8C42] p-8 text-center shadow-lg">
          <p className="text-white text-lg leading-relaxed font-semibold">
            {lang === 'sr' ? 'Pred vama je jednostavan korak ka boljoj buducnosti. Popunite formular poverljivo, bez straha od pritiska, i budite deo promene koja stiti sva vasa prava.' : 'A simple step towards a better future awaits you. Fill out the form confidentially, without fear of pressure, and be part of the change that protects all your rights.'}
          </p>
        </div>

        <Card className="bg-[#1A1D23] border-[#2D3139]">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{t('membership.application')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="fullName" className="text-white text-base">{t('form.fullName')}</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="bg-[#0F1419] border-[#2D3139] text-white placeholder:text-[#9CA3AF]"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white text-base">{t('form.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-[#0F1419] border-[#2D3139] text-white placeholder:text-[#9CA3AF]"
                />
              </div>

              <div>
                <Label htmlFor="quicklookId" className="text-white text-base">
                  {t('form.quicklookId')}
                  <span className="text-[#9CA3AF] text-xs"> ({lang === 'sr' ? 'verifikacija zaposlenja u kompaniji' : 'employment verification'})</span>
                </Label>
                <Input
                  id="quicklookId"
                  required
                  placeholder="AB123456"
                  value={formData.quicklookId}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setFormData({ ...formData, quicklookId: value });
                    validateQuicklookId(value);
                  }}
                  className="bg-[#0F1419] border-[#2D3139] text-white placeholder:text-[#9CA3AF]"
                  aria-invalid={quicklookError ? "true" : "false"}
                  aria-describedby={quicklookError ? "quicklook-error" : undefined}
                />
                {quicklookError && (
                  <p id="quicklook-error" className="text-sm text-red-400 mt-1" role="alert">{quicklookError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="city" className="text-white text-base">{t('form.city')}</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="bg-[#0F1419] border-[#2D3139] text-white placeholder:text-[#9CA3AF]"
                />
              </div>

              <div>
                <Label htmlFor="organization" className="text-white text-base">{t('form.organization')}</Label>
                <Input
                  id="organization"
                  placeholder="FSC / Legal / HR / CSM / PS"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="bg-[#0F1419] border-[#2D3139] text-white placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="space-y-5 pt-2">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="join"
                    required
                    checked={formData.agreeJoin}
                    onCheckedChange={(checked) => setFormData({...formData, agreeJoin: !!checked})}
                    className="mt-1.5 w-6 h-6 border-2 border-[#9CA3AF] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                  />
                  <div className="flex-1">
                    <Label htmlFor="join" className="cursor-pointer text-white text-base font-medium leading-relaxed">
                      {t('consents.acceptRules')} <span className="text-red-400">*</span>
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreeGDPR}
                    onCheckedChange={(checked) => setFormData({...formData, agreeGDPR: !!checked})}
                    className="mt-1.5 w-6 h-6 border-2 border-[#9CA3AF] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                  />
                  <div className="flex-1">
                    <Label htmlFor="privacy" className="cursor-pointer text-white text-base font-medium leading-relaxed">
                      <span>
                        {t('consents.privacy.prefix')}{' '}
                        <a 
                          href="/documents/Privacy%20Policy.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#005B99] hover:underline"
                        >
                          {t('consents.privacy.link')}
                        </a>.
                      </span>
                    </Label>
                  </div>
                </div>

                <div className={`border-2 rounded-xl p-4 transition-all duration-200 ${formData.isAnonymous ? 'border-[#E67E22] bg-[#E67E22]/5' : 'border-[#2D3139] bg-[#0F1419]'}`}>
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: !!checked })}
                      className="mt-1.5 w-6 h-6 border-2 border-[#9CA3AF] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                    />
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <Label htmlFor="anonymous" className="cursor-pointer text-white text-base font-semibold leading-relaxed">
                          {lang === 'sr' ? 'Zelim da ostanem anoniman/na do sticanja reprezentativnosti.' : 'I want to remain anonymous until representativeness is achieved.'}
                        </Label>
                        <Info className="w-5 h-5 text-[#E67E22] flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-sm text-[#9CA3AF] mt-2 leading-relaxed">
                        {lang === 'sr' ? 'Mozes uvek promeniti na vidljivo i ukljuciti se u radne grupe. Tvoj identitet ostaje zastićen dok to ne odlucis drugacije.' : 'You can switch to visible and join working groups at any time. Your identity remains protected until you decide otherwise.'}
                      </p>
                    </div>
                  </div>

                  {!formData.isAnonymous && (
                    <div className="mt-4 bg-[#E67E22]/10 border border-[#E67E22] rounded-lg p-3">
                      <p className="text-sm text-white font-medium">
                        {lang === 'sr' ? 'Bice ti omoguceno da se ukljucis u radne grupe i budes vidljiv/a drugim clanovima.' : 'You will be able to join working groups and be visible to other members.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-[#E67E22] hover:bg-[#E67E22]/90 text-white disabled:opacity-50 text-base py-6">
                {loading ? 'Slanje...' : 'Pošalji'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 bg-[#1A1D23] border border-[#2D3139] rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            {lang === 'sr' ? 'Sta sledi?' : "What's next?"}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E67E22] flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-white font-semibold">
                  {lang === 'sr' ? 'Popuniti prijavu' : 'Fill out the application'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E67E22] flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-white font-semibold">
                  {lang === 'sr' ? 'Cekirati obavezna polja' : 'Check required fields'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E67E22] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-white font-semibold">
                  {lang === 'sr' ? 'Potvrda vam stize na mail' : 'Confirmation arrives via email'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-[10.5px] sm:text-xs text-[#9CA3AF]">
          <div className="flex flex-wrap md:flex-nowrap items-center gap-x-2 gap-y-1">
            <span>
              {lang === 'sr' ? 'Prijava je anonimna do sticanja reprezentativnosti' : 'Application is anonymous until representativeness is achieved'}
            </span>
            <span className="hidden md:inline">•</span>
            <span>
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#E67E22] hover:opacity-80">Privacy Policy</a>
              {' '}and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline text-[#E67E22] hover:opacity-80">Terms of Service</a>
              {' '}apply
            </span>
            <span className="hidden md:inline">•</span>
            <span>© 2025 Sindikat NCR Atleos – Beograd</span>
          </div>
        </div>
      </div>
    </div>
  );
}
