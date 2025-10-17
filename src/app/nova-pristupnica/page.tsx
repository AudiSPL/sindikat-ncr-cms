'use client';

import { useState, useMemo } from 'react';
import { useLanguage, useTranslations } from '@/lib/i18n';
import toast from 'react-hot-toast';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle } from 'lucide-react';

function PristupnicaInner() {
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
    agreeNewsletter: false,
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

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
    const loadingToast = toast.loading(lang === 'sr' ? 'Slanje prijave...' : 'Submitting application...');

    try {
      const token = executeRecaptcha ? await executeRecaptcha('submit_application') : '';
      const res = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, quicklookId: formData.quicklookId.toUpperCase(), recaptchaToken: token }),
      });

      if (res.ok) {
        toast.success(lang === 'sr' ? 'Prijava uspešno poslata!' : 'Application submitted successfully!');
        setSubmitted(true);
      } else if (res.status === 409) {
        const j = await res.json();
        const msg = lang === 'sr'
          ? 'Korisnik je već u bazi, kontaktirajte nas preko office@sindikatncr.com'
          : 'Unfortunately a user with these credentials is already registered. Please reach out to us on office@sindikatncr.com.';
        toast.error(msg);
        // Navigate to a simple duplicate notice page or show inline state
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(lang === 'sr' ? 'Došlo je do greške' : 'An error occurred');
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#F8FAFC] p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-[#22c55e] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('submitted.title')}</h2>
            <p className="text-gray-600">{t('submitted.subtitle')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F8FAFC] p-4">
      <div className="w-full max-w-2xl mx-auto py-6 px-3 sm:px-4">
        <div className="flex justify-end mb-3">
          <button onClick={() => history.back()} className="mr-auto inline-flex items-center gap-2 text-[#005B99] underline text-sm">
            <ArrowLeft className="h-4 w-4" />
            Nazad
          </button>
          <div className="inline-flex rounded overflow-hidden border">
            <button className={`px-3 py-1 text-sm ${lang==='sr' ? 'bg-[#005B99] text-white' : 'bg-white'}`} onClick={() => setLang('sr')}>{t('lang.sr')}</button>
            <button className={`px-3 py-1 text-sm ${lang==='en' ? 'bg-[#005B99] text-white' : 'bg-white'}`} onClick={() => setLang('en')}>{t('lang.en')}</button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#0B2C49]">{t('membership.application')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>{t('form.fullName')}</Label>
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div>
                <Label>{t('form.email')}</Label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <Label>
                  {t('form.quicklookId')}
                  <span className="text-[#6B7280] text-xs"> ({lang === 'sr' ? 'verifikacija zaposlenja u kompaniji' : 'employment verification'})</span>
                </Label>
                <Input
                  required
                  placeholder="AB123456"
                  value={formData.quicklookId}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setFormData({ ...formData, quicklookId: value });
                    validateQuicklookId(value);
                  }}
                />
                {quicklookError && (
                  <p className="text-sm text-[#C63B3B] mt-1">{quicklookError}</p>
                )}
              </div>

              <div>
                <Label>{t('form.city')}</Label>
                <Input
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>

              <div>
                <Label>{t('form.organization')}</Label>
                <Input
                  placeholder="FSC / Legal / HR / CSM / PS"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="join"
                    required
                    checked={formData.agreeJoin}
                    onCheckedChange={(checked) => setFormData({...formData, agreeJoin: !!checked})}
                  />
                  <Label htmlFor="join">{t('consents.acceptRules')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreeGDPR}
                    onCheckedChange={(checked) => setFormData({...formData, agreeGDPR: !!checked})}
                  />
                  <Label htmlFor="privacy">
                    <span>
                      {t('consents.privacy.prefix')} <a href="/politika-privatnosti" className="underline text-[#005B99]" target="_blank" rel="noopener noreferrer">{t('consents.privacy.link')}</a>.
                    </span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.agreeNewsletter}
                    onCheckedChange={(checked) => setFormData({...formData, agreeNewsletter: !!checked})}
                  />
                  <Label htmlFor="newsletter">{t('consents.newsletter')}</Label>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-[#F28C38] hover:bg-[#d97a2e] text-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('form.sending')}
                  </>
                ) : (
                  t('form.submit')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Privacy / Trust bar */}
        <div className="mt-6 text-[10.5px] sm:text-xs text-[#0B2C49]">
          <div className="flex flex-wrap md:flex-nowrap items-center gap-x-2 gap-y-1">
            <span>Prijava je anonimna do sticanja reprezentativnosti</span>
            <span className="hidden md:inline">•</span>
            <span>
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#005B99]">Privacy Policy</a>
              {' '}and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline text-[#005B99]">Terms of Service</a>
              {' '}apply
            </span>
            <span className="hidden md:inline">•</span>
            <span>2026 Sindikat NCR Atleos – Beograd.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NovaPristupnica() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey} scriptProps={{ async: true, defer: true, appendTo: 'head' }}>
      <PristupnicaInner />
    </GoogleReCaptchaProvider>
  );
}