'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Language, getContent } from '@/lib/content';

interface ContactFormProps {
  lang: Language;
}

export function ContactForm({ lang }: ContactFormProps) {
  const content = getContent(lang);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Contact form error:', error);
      alert(lang === 'sr' 
        ? 'Greška pri slanju poruke. Molimo pokušajte ponovo.' 
        : 'Error sending message. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">
            {lang === 'sr' ? 'Poruka poslata!' : 'Message sent!'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {lang === 'sr' 
              ? 'Hvala vam na poruci. Odgovor šaljemo samo ako ste ostavili kontakt informacije.'
              : 'Thank you for your message. We only send replies if you provided contact information.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{content.contact.title}</CardTitle>
        <CardDescription>{content.contact.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{lang === 'sr' ? 'Vaše Ime' : 'Your Name'}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={lang === 'sr' ? 'Vaše ime' : 'Your name'}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{content.contact.form.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={lang === 'sr' ? 'vaš@email.com' : 'your@email.com'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{content.contact.form.subject}</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder={lang === 'sr' ? 'Tema poruke' : 'Message subject'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{content.contact.form.message}</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder={lang === 'sr' ? 'Vaša poruka...' : 'Your message...'}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting 
              ? (lang === 'sr' ? 'Šalje se...' : 'Sending...')
              : content.contact.form.submit
            }
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold mb-2">{content.footer.contact}</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{content.contact.info.email}</p>
            <p>{content.contact.info.location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
