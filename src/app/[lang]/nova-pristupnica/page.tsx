'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Info, Shield, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  full_name: string;
  email: string;
  quicklook_id: string;
  city: string;
  division: string;
  agreeJoin: boolean;
  agreeGDPR: boolean;
  isAnonymous: boolean;
};

const content = {
  sr: {
    title: 'Pristupnica – Sindikat NCR Atleos',
    subtitle: 'Diskretno članstvo. Lična email adresa. Verifikacija po vašem izboru.',
    infoBanner: {
      title: 'Brz proces u 2 koraka',
      step1: '1) Popunite formu (30 sek)',
      step2: '2) Verifikujte zaposlenje (email/Teams/bedž)',
      note: 'Nikad ne koristimo poslovnu adresu za sindikalnu komunikaciju.',
    },
    fields: {
      fullName: 'Ime i prezime',
      email: 'Email adresa',
      emailHelper: 'Koristite ličnu email adresu (npr. Gmail/Yahoo). Ne unosite @ncratleos.com.',
      qlid: 'Quicklook ID',
      city: 'Grad',
      division: 'Tvoj Tim',
    },
    consents: {
      sectionTitle: 'Potvrde i saglasnosti',
      joinTitle: 'Potvrđujem da sam pročitao/la Statut i pravila sindikata',
      privacyPrefix: 'Potvrđujem da sam pročitao/la',
      privacyLink: 'Politiku privatnosti',
      anonymousTitle: 'Želim da ostanem anoniman/na do sticanja reprezentativnosti',
      joinRequired: 'Morate potvrditi da ste pročitali Statut i pravila sindikata da biste nastavili.',
    },
    nextSteps: {
      title: 'Šta sledi?',
      step1: '1. Bićete preusmereni na Verifikaciju',
      step2: '2. Potvrda stiže na lični email',
      step3: '3. Članstvo aktivno nakon potvrde',
    },
    securityNote: 'Ako želite veću privatnost, izaberite Teams ili fotografiju bedža. Slanje sa poslovnog emaila može biti vidljivo IT-u kompanije.',
    contact: 'Pitanja? Pišite nam sa lične adrese: office@sindikatncr.com',
    submit: 'Dalje',
    submitting: 'Šalje se...',
  },
  en: {
    title: 'Membership Form – NCR Atleos Union',
    subtitle: 'Discreet membership. Personal email only. Choose your verification method.',
    infoBanner: {
      title: 'Fast 2-step process',
      step1: '1) Fill the form (30s)',
      step2: '2) Verify employment (email/Teams/badge)',
      note: 'We never use company email for union communications.',
    },
    fields: {
      fullName: 'Full Name',
      email: 'Email Address',
      emailHelper: 'Use your personal email (e.g., Gmail/Yahoo). Do not use @ncratleos.com.',
      qlid: 'Quicklook ID',
      city: 'City',
      division: 'Division',
    },
    consents: {
      sectionTitle: 'Confirmations and Consents',
      joinTitle: 'I confirm that I have read the Statute and union rules',
      privacyPrefix: 'I confirm that I have read the',
      privacyLink: 'Privacy Policy',
      anonymousTitle: 'I wish to remain anonymous until representative status is achieved',
      joinRequired: 'You must agree to the Statute and union rules to continue.',
    },
    nextSteps: {
      title: 'Next steps',
      step1: '1. You\'ll be redirected to Verification',
      step2: '2. Confirmation sent to your personal email',
      step3: '3. Membership active after confirmation',
    },
    securityNote: 'For maximum privacy choose Teams or badge photo. Messages from company email may be visible to employer IT.',
    contact: 'Questions? Email us from your personal address: office@sindikatncr.com',
    submit: 'Submit Application',
    submitting: 'Submitting...',
  },
};

export default function NovaPristupnicaPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) || 'sr';
  const t = content[lang as keyof typeof content];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      agreeJoin: false,
      agreeGDPR: false,
      isAnonymous: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!data.agreeJoin) {
      setError(t.consents.joinRequired);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        
        if (result.error === 'duplicate') {
          setError('Član je već u bazi podataka. U slučaju problema, kontaktirajte nas na office@sindikatncr.com');
        } else {
          setError(result.error || 'Submission failed');
        }
        setIsSubmitting(false);
        return;
      }

      const result = await response.json();

      // Redirect to verification page with token
      router.push(`/${lang}/verify?token=${result.token}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1419] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-gray-300">
            {t.subtitle}
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-5 bg-[#1A1D23] border-2 border-brand-blue rounded-xl">
          <div className="flex gap-3">
            <Info className="w-6 h-6 text-brand-blue flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-2">
                {t.infoBanner.title}
              </h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>{t.infoBanner.step1} · {t.infoBanner.step2}</p>
                <p className="text-brand-blue font-medium mt-2">
                  {t.infoBanner.note}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1A1D23] border border-[#2D3139] rounded-xl shadow-lg p-8 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-base font-medium text-white">
              {t.fields.fullName} *
            </Label>
            <Input
              id="full_name"
              {...register('full_name', { required: true })}
              className={errors.full_name ? 'border-brand-red' : ''}
            />
            {errors.full_name && (
              <p className="text-sm text-brand-red flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This field is required
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium text-white">
              {t.fields.email} *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@gmail.com"
              {...register('email', { 
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
              className={errors.email ? 'border-brand-red' : ''}
            />
            <p className="text-xs text-gray-400 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-brand-blue" />
              <span>{t.fields.emailHelper}</span>
            </p>
            {errors.email && (
              <p className="text-sm text-brand-red flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Valid email required
              </p>
            )}
          </div>

          {/* Quicklook ID */}
          <div className="space-y-2">
            <Label htmlFor="quicklook_id" className="text-base font-medium flex items-center gap-2 text-white">
              <Shield className="h-4 w-4 text-brand-blue" />
              {t.fields.qlid} *
            </Label>
            <Input
              id="quicklook_id"
              placeholder="AB123123"
              required
              pattern="^[A-Z]{2}[0-9]{6}$"
              title="Format must be: 2 capital letters + 6 digits (e.g., AB123123)"
              {...register('quicklook_id', { 
                required: true,
                pattern: {
                  value: /^[A-Z]{2}[0-9]{6}$/,
                  message: 'QLID must be exactly: 2 capital letters + 6 digits (e.g., AB123123)'
                }
              })}
              className={errors.quicklook_id ? 'border-brand-red' : ''}
            />
            {errors.quicklook_id && (
              <p className="text-sm text-brand-red flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.quicklook_id.message || 'QLID must be exactly: 2 capital letters + 6 digits (e.g., AB123123)'}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-base font-medium text-white">
              {t.fields.city} *
            </Label>
            <Input
              id="city"
              {...register('city', { required: true })}
              className={errors.city ? 'border-brand-red' : ''}
            />
            {errors.city && (
              <p className="text-sm text-brand-red flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This field is required
              </p>
            )}
          </div>

          {/* Division */}
          <div className="space-y-2">
            <Label htmlFor="division" className="text-base font-medium text-white">
              Tvoj Tim *
            </Label>
            <Input
              id="division"
              placeholder="FSC/HR/CSM/Marketing/PS"
              className={errors.division ? 'border-brand-red' : ''}
              {...register('division', { required: true })}
            />
            {errors.division && (
              <p className="text-sm text-brand-red flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This field is required
              </p>
            )}
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4 p-5 bg-[#1A1D23] border border-[#2D3139] rounded-lg">
            <h3 className="text-base font-semibold text-white mb-3">{t.consents.sectionTitle}</h3>
            
            {/* Agree Join */}
            <div className="flex items-start gap-3">
              <Controller
                name="agreeJoin"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Checkbox
                    id="agreeJoin"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.agreeJoin ? 'border-brand-red' : ''}
                  />
                )}
              />
              <Label htmlFor="agreeJoin" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                Potvrđujem da sam pročitao/la{' '}
                <a href="/documents/СТАТУТ.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-orange underline hover:text-brand-orange/80">Statut</a>
                {' '}i{' '}
                <a href="/documents/Правилник Синдиката (ср).pdf" target="_blank" rel="noopener noreferrer" className="text-brand-orange underline hover:text-brand-orange/80">Pravila</a>
                {' '}sindikata *
              </Label>
            </div>
            {errors.agreeJoin && (
              <p className="text-sm text-brand-red flex items-center gap-1 ml-7">
                <AlertCircle className="h-3 w-3" />
                This field is required
              </p>
            )}

            {/* Agree GDPR */}
            <div className="flex items-start gap-3">
              <Controller
                name="agreeGDPR"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Checkbox
                    id="agreeGDPR"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.agreeGDPR ? 'border-brand-red' : ''}
                  />
                )}
              />
              <Label htmlFor="agreeGDPR" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                {t.consents.privacyPrefix} <a href={`/${lang}/politika-privatnosti`} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline hover:text-brand-orange">{t.consents.privacyLink}</a> *
              </Label>
            </div>
            {errors.agreeGDPR && (
              <p className="text-sm text-brand-red flex items-center gap-1 ml-7">
                <AlertCircle className="h-3 w-3" />
                This field is required
              </p>
            )}

            {/* Is Anonymous */}
          </div>

          {/* Anonymous Checkbox - Orange Box */}
          <div className="p-5 bg-[#F28C38] border-2 border-[#F28C38] rounded-xl">
            <div className="flex items-start space-x-4">
              <Controller
                name="isAnonymous"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isAnonymous"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1.5 w-6 h-6 border-2 border-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#F28C38]"
                  />
                )}
              />
              <div className="flex-1">
                <Label
                  htmlFor="isAnonymous"
                  className="cursor-pointer text-white text-base font-bold"
                >
                  🔒 {t.consents.anonymousTitle}
                </Label>
                <p className="text-sm text-white/90 mt-2">
                  {lang === 'sr' ? 'Možeš uvek promeniti na vidljivo i uključiti se u radne grupe.' : 'You can always change to visible and join working groups.'}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps Panel */}
          <div className="p-5 bg-[#1A1D23] border-2 border-brand-blue rounded-xl">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-blue" />
              {t.nextSteps.title}
            </h3>
            <ol className="space-y-2 text-sm text-gray-300">
              <li>{t.nextSteps.step1}</li>
              <li>{t.nextSteps.step2}</li>
              <li>{t.nextSteps.step3}</li>
            </ol>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-600/20 border border-red-500 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 text-lg font-semibold"
          >
            {isSubmitting ? t.submitting : t.submit}
          </Button>

          {/* Contact */}
          <p className="text-center text-sm text-gray-400">
            {t.contact}
          </p>
        </form>
      </div>
    </div>
  );
}