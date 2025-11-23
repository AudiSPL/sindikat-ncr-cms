'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface FAQContactFormProps {
  lang: string;
}

export default function FAQContactForm({ lang }: FAQContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      console.log('🟧 FAQ contact form submit', { name, email, subject, message });
      await new Promise((r) => setTimeout(r, 400));
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('❌ FAQ contact form error', err);
    } finally {
      setSubmitting(false);
    }
  };

  const label = (sr: string, en: string) => (lang === 'sr' ? sr : en);

  return (
    <section className="mt-2 flex justify-center px-2">
      <div className="w-full max-w-md rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/30 backdrop-blur-sm shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 text-center text-slate-900 dark:text-white">
          {label('Kontaktirajte nas', 'Additional Questions?')}
        </h3>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-white">
              {label('Ime', 'Name')}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder={label('Vaše ime', 'Your name')}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-brand-orange dark:focus:ring-brand-orange/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-brand-orange dark:focus:ring-brand-orange/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-slate-900 dark:text-white">
              {label('Naslov', 'Subject')}
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
              placeholder={label('Kratak naslov', 'Short subject')}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-brand-orange dark:focus:ring-brand-orange/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-slate-900 dark:text-white">
              {label('Poruka', 'Message')}
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder={label('Vaša poruka...', 'Your message...')}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-brand-orange dark:focus:ring-brand-orange/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {submitting ? label('Slanje...', 'Sending...') : label('Pošalji', 'Send')}
          </button>
        </form>
      </div>
    </section>
  );
}