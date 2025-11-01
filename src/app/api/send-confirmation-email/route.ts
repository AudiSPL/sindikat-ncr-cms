import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailContent = {
  sr: {
    subject: 'Završite prijavljivanje - Sindikat NCR Atleos',
    preheader: 'Još samo jedan korak do članstva',
    greeting: (name: string) => `Poštovani/a ${name},`,
    intro: 'Hvala što ste aplicirali za članstvo u Sindikatu Radnika NCR Atleos! Vaša prijava je primljena.',
    nextStepTitle: '📋 Sledeći korak: Verifikacija zaposlenja',
    nextStepIntro: 'Da bismo zaštitili sindikat od lažnih prijava, molimo Vas da verifikujete da radite u NCR Atleos. <strong>Izaberite JEDAN od tri jednostavna načina:</strong>',
    methods: {
      teams: {
        title: '💬 Opcija 1: Teams poruka potvrda',
        badge: 'Preporučeno',
        description: 'Organizator će Vas kontaktirati preko Teams-a',
        instructions: [
          'Dobićete Teams poruku: "Da li ste upravo aplicirali za Sindikat?"',
          'Odgovorite sa "da" da potvrdite',
          'Organizator će odmah verifikovati Vaše članstvo',
        ],
        note: '🔒 <strong>Najprivatnija opcija</strong> - neutralna poruka, direktan ljudski kontakt',
      },
      badge: {
        title: '📸 Opcija 2: Fotografija radne identifikacije',
        badge: 'Maksimalna privatnost',
        description: 'Pošaljite fotografiju Vaše NCR identifikacije',
        instructions: [
          'Fotografišite radnu identifikaciju tako da je Vaše ime vidljivo',
          'Opciono: Zamaglite lice/fotografiju za dodatnu privatnost',
          'Upload fotografije preko linka ispod',
        ],
        note: '🔒 <strong>Fotografija je enkriptovana</strong> i automatski se briše nakon 30 dana',
      },
      email: {
        title: '✉️ Opcija 3: Pošaljite email sa posla',
        badge: 'Najbrže - ~1h',
        description: 'Automatska verifikacija kroz poslovnu email adresu',
        instructions: [
          'Otvorite Vaš poslovni email',
          'Pošaljite email na: <code>verifikacija926@gmail.com</code>',
          'Naslov: <code>Ja sam</code>',
          'Tekst može biti prazan ili samo "hi"',
        ],
        note: '⚠️ <strong>Napomena:</strong> Slanje sa poslovnog emaila može biti vidljivo IT-u kompanije. Za maksimalnu privatnost izaberite Teams ili fotografiju bedža.',
      },
    },
    ctaButton: 'Završi verifikaciju sada →',
    deadline: '⏰ <strong>Važno:</strong> Molimo Vas da završite verifikaciju u roku od <strong>7 dana</strong>. Nakon verifikacije dobijate:',
    benefits: [
      '✅ Službenu potvrdu članstva',
      '✅ Pristup resursima za članove',
      '✅ Informacije o sastancima i akcijama',
    ],
    faqTitle: '❓ Često postavljana pitanja',
    faqs: [
      {
        q: 'Zašto je potrebna verifikacija?',
        a: 'Da zaštitimo sindikat od lažnih prijava koje mogu poslati anti-sindikalni zaposleni.',
      },
      {
        q: 'Da li je ovo bezbedno? Može li kompanija saznati?',
        a: 'Da, potpuno bezbedno. Sve tri metode su dizajnirane da zaštite Vašu privatnost. Teams i fotografija identifikacije ne koriste nijedan NCRA sistem. Poslovni email metod koristi generičku adresu bez sindikatskih ključnih reči.',
      },
      {
        q: 'Koja metoda je najbolja?',
        a: 'Sve su podjednako sigurne! Izaberite na osnovu preferencija:<br>→ Želite lični kontakt? <strong>Teams</strong><br>→ Želite maksimalnu privatnost? <strong>Fotografija</strong><br>→ Želite brzo? <strong>Email</strong>',
      },
      {
        q: 'Šta ako ne završim verifikaciju?',
        a: 'Vaša prijava će ostati na čekanju 7 dana. Nakon toga ćete morati ponovo da aplicirate.',
      },
    ],
    questions: 'Pitanja? Odgovorite na ovaj email ili nas kontaktirajte na:',
    contactEmail: 'office@sindikatncr.com',
    closing: '<strong>Zajedno smo jači! 💪</strong>',
    signature: 'Sindikat Radnika NCR Atleos',
    footer: 'Ovaj email je poslat na Vašu LIČNU email adresu. Nikada ne šaljemo sindikalne materijale na poslovne email adrese.',
  },
  en: {
    subject: 'Complete Your Registration – Worker`s Union NCR Atleos Belgrade',
    preheader: 'Just one more step to membership',
    greeting: (name: string) => `Dear ${name},`,
    intro: 'Thank you for applying to join Worker`s Union NCR Atleos Belgrade! Your application has been received.',
    nextStepTitle: '📋 Next Step: Verify Your Employment',
    nextStepIntro: 'To protect the union from fake applications, please verify you work at NCR Atleos. <strong>Choose ONE of three simple methods:</strong>',
    methods: {
      teams: {
        title: '💬 Option 1: Teams Message Confirmation',
        badge: 'Recommended',
        description: 'An organizer will contact you via Teams',
        instructions: [
          "You'll receive a Teams message: \"Did you just apply to NCR Atleos Union?\"",
          'Reply "yes" to confirm',
          'Organizer will verify your membership immediately',
        ],
        note: '🔒 <strong>Most private option</strong> - neutral message, direct human contact',
      },
      badge: {
        title: '📸 Option 2: Work Badge Photo',
        badge: 'Maximum Privacy',
        description: 'Upload a photo of your NCRA badge',
        instructions: [
          'Take a photo of your work badge with your name visible',
          'Optional: Blur your face/photo for extra privacy',
          'Upload the photo via the link below',
        ],
        note: '🔒 <strong>Photo is encrypted</strong> and automatically deleted after 30 days',
      },
      email: {
        title: '✉️ Option 3: Send Email from Work',
        badge: 'Fastest - ~1h',
        description: 'Automatic verification through company email',
        instructions: [
          'Open your work email',
          'Send email to: <code>verifikacija926@gmail.com</code>',
          'Subject: <code>It`s me</code>',
          'Body can be blank or just "hi"',
        ],
        note: '⚠️ <strong>Note:</strong> Messages from company email may be visible to employer IT. For maximum privacy choose Teams or badge photo.',
      },
    },
    ctaButton: 'Complete Verification Now →',
    deadline: '⏰ <strong>Important:</strong> Please complete verification within <strong>7 days</strong>. After verification you get:',
    benefits: [
      '✅ Official membership confirmation',
      '✅ Access to member resources',
      '✅ Information about meetings and actions',
    ],
    faqTitle: '❓ Frequently Asked Questions',
    faqs: [
      {
        q: 'Why is verification needed?',
        a: 'To protect the union from fake applications.',
      },
      {
        q: "Is this safe? Can the company find out?",
        a: "Yes, completely safe. All three methods are designed to protect your privacy. Teams and badge photo don't use any NCR systems. Work email method uses a generic address with no union keywords.",
      },
      {
        q: 'Which method is best?',
        a: 'All are equally secure! Choose based on preference:<br>→ Want personal contact? <strong>Teams</strong><br>→ Want maximum privacy? <strong>Badge photo</strong><br>→ Want it fast? <strong>Email</strong>',
      },
      {
        q: "What if I don't complete verification?",
        a: "Your application will remain pending for 7 days. After that, you'll need to reapply.",
      },
    ],
    questions: 'Questions? Reply to this email or contact us at:',
    contactEmail: 'office@sindikatncr.com',
    closing: '<strong>Together we are stronger! 💪</strong>',
    signature: 'Worker`s Union NCR Atleos Belgrade',
    footer: 'This email was sent to your PERSONAL email address. We never send union materials to company email addresses.',
  },
} as const;

function generateEmailHTML(lang: 'sr' | 'en', name: string, verifyUrl: string) {
  const t = emailContent[lang];

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Sindikat NCR Atleos
              </h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 16px;">
                ${t.preheader}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <p style="margin: 0 0 20px; font-size: 16px;">
                ${t.greeting(name)}
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px;">
                ${t.intro}
              </p>
              
              <!-- Next Steps -->
              <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 0 0 30px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px; color: #065f46; font-size: 20px;">
                  ${t.nextStepTitle}
                </h2>
                <p style="margin: 0; font-size: 15px; color: #047857;">
                  ${t.nextStepIntro}
                </p>
              </div>
              
              <!-- Method 1: Teams -->
              <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 0 0 20px; background: #faf5ff;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <h3 style="margin: 0; color: #1f2937; font-size: 18px;">
                    ${t.methods.teams.title}
                  </h3>
                  <span style="display: inline-block; background: #8b5cf6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                    ${t.methods.teams.badge}
                  </span>
                </div>
                <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px;">
                  ${t.methods.teams.description}
                </p>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 0 0 15px;">
                  <p style="margin: 0 0 10px; font-weight: bold; font-size: 14px;">📝 ${lang === 'sr' ? 'Kako funkcioniše:' : 'How it works:'}</p>
                  <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563;">
                    ${t.methods.teams.instructions.map(step => `<li style="margin: 8px 0;">${step}</li>`).join('')}
                  </ol>
                </div>
                
                <p style="margin: 0; font-size: 13px; color: #6b7280;">
                  ${t.methods.teams.note}
                </p>
              </div>
              
              <!-- Method 2: Badge -->
              <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 0 0 20px; background: #f0fdf4;">
                <div style="display: flex; align_items: center; justify-content: space-between; margin-bottom: 12px;">
                  <h3 style="margin: 0; color: #1f2937; font-size: 18px;">
                    ${t.methods.badge.title}
                  </h3>
                  <span style="display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                    ${t.methods.badge.badge}
                  </span>
                </div>
                <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px;">
                  ${t.methods.badge.description}
                </p>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 0 0 15px;">
                  <p style="margin: 0 0 10px; font-weight: bold; font-size: 14px;">📝 ${lang === 'sr' ? 'Uputstvo:' : 'Instructions:'}</p>
                  <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563;">
                    ${t.methods.badge.instructions.map(step => `<li style="margin: 8px 0;">${step}</li>`).join('')}
                  </ol>
                </div>
                
                <p style="margin: 0; font_size: 13px; color: #6b7280;">
                  ${t.methods.badge.note}
                </p>
              </div>
              
              <!-- Method 3: Email -->
              <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 0 0 30px; background: #eff6ff;">
                <div style="display: flex; align-items: center; justify-content: space_between; margin-bottom: 12px;">
                  <h3 style="margin: 0; color: #1f2937; font-size: 18px;">
                    ${t.methods.email.title}
                  </h3>
                  <span style="display: inline-block; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                    ${t.methods.email.badge}
                  </span>
                </div>
                <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px;">
                  ${t.methods.email.description}
                </p>
                
                <!-- Risk Warning -->
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 0 0 15px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 13px; color: #92400e;">
                    ${t.methods.email.note}
                  </p>
                </div>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px;">
                  <p style="margin: 0 0 10px; font-weight: bold; font-size: 14px;">📝 ${lang === 'sr' ? 'Uputstvo:' : 'Instructions:'}</p>
                  <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563;">
                    ${t.methods.email.instructions.map(step => `<li style="margin: 8px 0;">${step}</li>`).join('')}
                  </ol>
                </div>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 0 0 30px;">
                <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  ${t.ctaButton}
                </a>
              </div>
              
              <!-- Deadline -->
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 0 0 30px; border-radius: 4px;">
                <p style="margin: 0 0 15px; font-size: 15px;">
                  ${t.deadline}
                </p>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                  ${t.benefits.map(benefit => `<li style="margin: 8px 0;">${benefit}</li>`).join('')}
                </ul>
              </div>
              
              <!-- FAQ -->
              <h3 style="margin: 0 0 20px; color: #1f2937; font-size: 20px;">
                ${t.faqTitle}
              </h3>
              
              ${t.faqs.map(faq => `
                <div style="margin: 0 0 20px;">
                  <p style="margin: 0 0 8px; font-weight: bold; font-size: 15px; color: #1f2937;">
                    ${faq.q}
                  </p>
                  <p style="margin: 0; font-size: 14px; color: #6b7280; padding-left: 15px;">
                    ${faq.a}
                  </p>
                </div>
              `).join('')}
              
              <!-- Contact -->
              <div style="margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                  ${t.questions}
                </p>
                <a href="mailto:${t.contactEmail}" style="color: #667eea; text-decoration: none; font-weight: bold; font-size: 15px;">
                  ${t.contactEmail}
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 16px;">
                ${t.closing}
              </p>
              
              <p style="margin: 20px 0 0; font-size: 16px; color: #6b7280;">
                ${t.signature}
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                ${t.footer}
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function generatePlainText(lang: 'sr' | 'en', name: string, verifyUrl: string) {
  const t = emailContent[lang];
  
  return `
${t.greeting(name)}

${t.intro}

${t.nextStepTitle}
${t.nextStepIntro}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${t.methods.teams.title} [${t.methods.teams.badge}]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${t.methods.teams.description}

${t.methods.teams.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

${t.methods.teams.note}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${t.methods.badge.title} [${t.methods.badge.badge}]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${t.methods.badge.description}

${t.methods.badge.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

${t.methods.badge.note}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${t.methods.email.title} [${t.methods.email.badge}]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${t.methods.email.description}

⚠️ ${t.methods.email.note}

${t.methods.email.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLETE VERIFICATION:
${verifyUrl}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${t.deadline}
${t.benefits.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${t.faqTitle}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${t.faqs.map(faq => `Q: ${faq.q}\nA: ${faq.a.replace(/<br>/g, '\n   ')}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${t.questions}
${t.contactEmail}

${t.closing}

${t.signature}

---
${t.footer}
  `.trim();
}

export async function POST(request: Request) {
  try {
    const { email, name, token, lang } = await request.json();

    if (!email || !name || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/verify?token=${token}`;
    const t = emailContent[lang as 'sr' | 'en'];

    const { data, error } = await resend.emails.send({
      from: 'office@sindikatncr.com',
      to: email,
      bcc: 'sindikatncratleos@gmail.com',
      subject: t.subject,
      html: generateEmailHTML(lang as 'sr' | 'en', name, verifyUrl),
      text: generatePlainText(lang as 'sr' | 'en', name, verifyUrl),
    });

    if (error) {
      console.error('Resend error:', error);
      throw error as any;
    }

    return NextResponse.json({ success: true, messageId: (data as any)?.id });

  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}



