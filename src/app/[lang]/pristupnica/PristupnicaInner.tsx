'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DetailsLayout } from '@/components/DetailsLayout';
import { Language, getContent } from '@/lib/content';

interface PristupnicaInnerProps {
  lang: Language;
}

export function PristupnicaInner({ lang }: PristupnicaInnerProps) {
  const content = getContent(lang);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeJoin || !formData.agreeGDPR) {
      toast.error(lang === 'sr' ? 'Morate prihvatiti sve obavezne uslove' : 'You must accept all required terms');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quicklookId: formData.quicklookId.toUpperCase(),
        }),
      });

      const result = await response.json();

      if (result.ok) {
        setSubmitted(true);
        toast.success(lang === 'sr' ? 'Uspešno ste se prijavili!' : 'Successfully applied!');
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(lang === 'sr' ? 'Greška pri prijavi. Pokušajte ponovo.' : 'Submission error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#EBF2F9] dark:bg-transparent">
        <DetailsLayout lang={lang}>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-4xl font-bold text-brand-navy dark:text-white">
              {lang === 'sr' ? 'Uspešno ste se prijavili!' : 'Successfully applied!'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {lang === 'sr' 
                ? 'Vaša prijava je zabeležena. Kontaktiraćemo vas uskoro.'
                : 'Your application has been recorded. We will contact you soon.'
              }
            </p>
          </div>
        </div>
        </DetailsLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF2F9] dark:bg-transparent">
      <DetailsLayout lang={lang}>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Steps */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">
              {lang === 'sr' ? 'Šta sledi?' : 'What happens next?'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {content.pristupnica.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reassurance */}
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              {content.pristupnica.content}
            </p>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="shadow-md border border-[#E5E7EB] dark:border-[#3B5998] bg-blue-50 dark:bg-[#1A2847]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#111827] dark:text-[#F1F5F9]">
              {lang === 'sr' ? 'Pridruži se našoj priči' : 'Join our story'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#111827] dark:text-[#F1F5F9]">
                    {lang === 'sr' ? 'Ime i prezime' : 'Full Name'}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                    className="bg-white dark:bg-[#0F1729] border-[#E5E7EB] dark:border-[#3B5998] text-[#111827] dark:text-[#F1F5F9] placeholder:text-muted-foreground focus:border-[#F28C38] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#F28C38]/30 dark:focus:ring-[#3B82F6]/30 transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#111827] dark:text-[#F1F5F9]">
                    {lang === 'sr' ? 'Email adresa' : 'Email Address'}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="bg-white dark:bg-[#0F1729] border-[#E5E7EB] dark:border-[#3B5998] text-[#111827] dark:text-[#F1F5F9] placeholder:text-muted-foreground focus:border-[#F28C38] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#F28C38]/30 dark:focus:ring-[#3B82F6]/30 transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quicklookId" className="text-[#111827] dark:text-[#F1F5F9]">
                    {lang === 'sr' ? 'Quicklook ID' : 'Quicklook ID'}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="quicklookId"
                    value={formData.quicklookId}
                    onChange={(e) => handleInputChange('quicklookId', e.target.value.toUpperCase())}
                    placeholder="AB123456"
                    required
                    className="bg-white dark:bg-[#0F1729] border-[#E5E7EB] dark:border-[#3B5998] text-[#111827] dark:text-[#F1F5F9] placeholder:text-muted-foreground focus:border-[#F28C38] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#F28C38]/30 dark:focus:ring-[#3B82F6]/30 transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[#111827] dark:text-[#F1F5F9]">
                    {lang === 'sr' ? 'Grad' : 'City'}
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-white dark:bg-[#0F1729] border-[#E5E7EB] dark:border-[#3B5998] text-[#111827] dark:text-[#F1F5F9] placeholder:text-muted-foreground focus:border-[#F28C38] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#F28C38]/30 dark:focus:ring-[#3B82F6]/30 transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="organization" className="text-[#111827] dark:text-[#F1F5F9]">
                    {lang === 'sr' ? 'Organizacija' : 'Organization'}
                  </Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    className="bg-white dark:bg-[#0F1729] border-[#E5E7EB] dark:border-[#3B5998] text-[#111827] dark:text-[#F1F5F9] placeholder:text-muted-foreground focus:border-[#F28C38] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#F28C38]/30 dark:focus:ring-[#3B82F6]/30 transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="isAnonymous"
                    checked={formData.isAnonymous}
                    onCheckedChange={(checked) => handleInputChange('isAnonymous', checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="isAnonymous" className="text-sm font-medium leading-none text-[#111827] dark:text-[#F1F5F9] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {lang === 'sr' ? 'Želim da budem anoniman član' : 'I want to be an anonymous member'}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {lang === 'sr' 
                        ? 'Vaši podaci će biti poverljivi i neće biti javno dostupni'
                        : 'Your data will be confidential and not publicly available'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeJoin"
                    checked={formData.agreeJoin}
                    onCheckedChange={(checked) => handleInputChange('agreeJoin', checked as boolean)}
                    required
                  />
                  <Label htmlFor="agreeJoin" className="text-sm font-medium leading-none text-[#111827] dark:text-[#F1F5F9] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {lang === 'sr' ? 'Prihvatam Statut i Pravila' : 'I accept the Statute and Rules'}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeGDPR"
                    checked={formData.agreeGDPR}
                    onCheckedChange={(checked) => handleInputChange('agreeGDPR', checked as boolean)}
                    required
                  />
                  <Label htmlFor="agreeGDPR" className="text-sm font-medium leading-none text-[#111827] dark:text-[#F1F5F9] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {lang === 'sr' ? 'Prihvatam obradu podataka u skladu sa GDPR' : 'I accept data processing in accordance with GDPR'}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F28C38] hover:bg-[#da7d30] dark:bg-[#3B82F6] dark:hover:bg-[#2f6fd4] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {lang === 'sr' ? 'Šalje se...' : 'Submitting...'}
                  </>
                ) : (
                  lang === 'sr' ? 'Pridruži se' : 'Join'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      </DetailsLayout>
    </div>
  );
}