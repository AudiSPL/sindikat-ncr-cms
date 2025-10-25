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
  attachments?: Array<{ filename: string; content: Buffer | string; contentType?: string }>;
};

export async function sendMail({
  to,
  subject,
  html,
  text,
  bcc,
  replyTo = 'office@sindikatncr.com',
  fromName = 'Sindikat NCR',
  attachments,
}: MailInput) {
  console.log('[MAILER] MAIL_ENABLED:', process.env.MAIL_ENABLED);
  console.log('[MAILER] RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
  
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
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: typeof a.content === 'string' ? a.content : (a.content as Buffer).toString('base64'),
      content_type: a.contentType || 'application/pdf',
    })),
  } as any);

  console.log('[MAILER] Resend response:', JSON.stringify(resp, null, 2));

  if ((resp as any)?.error) {
    console.error('[MAILER] Resend error details:', JSON.stringify((resp as any).error, null, 2));
    throw new Error(`Resend error: ${(resp as any).error.message}`);
  }
  return resp;
}


