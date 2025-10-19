import { Resend } from 'resend';
import { randomUUID } from 'node:crypto';

type MailInput = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  bcc?: string | string[];
  replyTo?: string;
  fromName?: string;
};

export async function sendMail({
  to,
  subject,
  html,
  text,
  bcc,
  replyTo = 'office@sindikatncr.com',
  fromName = 'Sindikat NCR',
}: MailInput) {
  if (process.env.MAIL_ENABLED !== 'true') {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[MAIL SKIPPED]', { to, subject });
    }
    return { skipped: true } as const;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY missing');

  const resend = new Resend(apiKey);
  const from = `${fromName} <no.reply@sindikatncr.com>`;

  const resp = await resend.emails.send({
    from,
    to,
    bcc,
    subject,
    html,
    text,
    replyTo: replyTo,
    headers: { 'X-Request-ID': randomUUID() },
  } as any);

  if ((resp as any)?.error) {
    throw new Error(`Resend error: ${(resp as any).error.message}`);
  }
  return resp;
}


