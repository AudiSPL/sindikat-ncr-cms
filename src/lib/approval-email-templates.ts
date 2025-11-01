export const approvalEmailTemplates = {
  sr: (memberName: string, memberId: string, approvalDate: string, isAnonymous: boolean) => ({
    subject: 'Dobrodošli u Sindikat — članstvo odobreno ✅',
    preheader: 'Vaše članstvo je aktivno. U prilogu je članska karta (PDF).',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #E67E22 0%, #FF8C42 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Dobrodošli u Sindikat! ✔</h1>
        </div>

        <!-- Body -->
        <div style="background: white; padding: 30px 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Zdravo <strong>${memberName}</strong>,</p>

          <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #E67E22; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #666;"><strong>✔ Tvoje članstvo je odobreno!</strong></p>
            <p style="margin: 0 0 15px 0; color: #666;">Datum odobravanja: <strong>${approvalDate}</strong></p>
            <p style="margin: 0; font-size: 18px;"><strong>Tvoj članski broj: <span style="color: #E67E22;">${memberId}</span></strong></p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 20px 0;">
            U prilogu ove poruke pronalazite <strong>člansku karticu (PDF)</strong> sa tvojim podacima i QR kodom.
          </p>

          <!-- Anonymity Section -->
          <div style="background: #fffbf0; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #E67E22;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #333;">🔒 Anonimnost do reprezentativnosti</p>
            ${isAnonymous ? `
              <p style="margin: 0 0 10px 0; color: #555; font-size: 14px;">
                Tvoj identitet je dostupan isključivo predsedniku sindikata, uz stroge mere zaštite.
              </p>
            ` : ''}
            <p style="margin: 0; color: #555; font-size: 14px;">
              Ako želiš, možeš se izjasniti kao vidljiv i aktivan član i učestvovati u rastu našeg sindikata. Posla ima preko glave!
            </p>
          </div>

          <!-- Support Section -->
          <div style="background: #f0f7ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #0B2C49;">📋 Ažuriranje podataka / Zahtevi</p>
            <p style="margin: 0; color: #555; font-size: 14px;">
              Ako želiš da ispraviš ili obrišeš podatke, podneses prigovor ili tražiš pristup, kontaktiraj nas:
            </p>
            <p style="margin: 10px 0 0 0; text-align: center;">
              <a href="mailto:office@sindikatncr.com" style="color: #E67E22; text-decoration: none; font-weight: bold; font-size: 15px;">office@sindikatncr.com</a>
            </p>
          </div>

          <!-- Footer Info -->
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
          
          <p style="font-size: 13px; color: #777; margin: 0 0 10px 0;">
            <strong>Sindikat Radnika NCR Atleos – Beograd</strong><br/>
            Adresa: Španskih boraca 75, 11070 Novi Beograd
          </p>

          <p style="font-size: 12px; color: #999; margin: 15px 0; line-height: 1.5; font-style: italic;">
            Nismo povezani sa NCR Atleos ili NCR Voyix korporacijom, niti ih predstavljamo.<br/>
            Ovaj email služi informisanju članova i ne predstavlja pravni savet.
          </p>

          <p style="font-size: 12px; color: #999; margin: 15px 0 0 0;">
            <a href="https://app.sindikatncr.com/documents/Privacy%20Policy.pdf" style="color: #E67E22; text-decoration: none;">Politika privatnosti</a> | 
            <a href="https://app.sindikatncr.com/documents/Pravilnik%20Sindikata%20(sr).pdf" style="color: #E67E22; text-decoration: none;">Pravila članstva</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f5f5f5; padding: 15px 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #999;">
          <p style="margin: 0;">© 2025 Sindikat Radnika NCR Atleos — Beograd</p>
        </div>
      </div>
    `
  }),

  en: (memberName: string, memberId: string, approvalDate: string, isAnonymous: boolean) => ({
    subject: 'Welcome to the Union — Membership approved ✅',
    preheader: 'Your membership is active. Membership card (PDF) attached.',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #E67E22 0%, #FF8C42 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to the Union! ✔</h1>
        </div>

        <!-- Body -->
        <div style="background: white; padding: 30px 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Hello <strong>${memberName}</strong>,</p>

          <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #E67E22; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #666;"><strong>✔ Your membership has been approved!</strong></p>
            <p style="margin: 0 0 15px 0; color: #666;">Approval date: <strong>${approvalDate}</strong></p>
            <p style="margin: 0; font-size: 18px;"><strong>Your membership number: <span style="color: #E67E22;">${memberId}</span></strong></p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #555; margin: 20px 0;">
            Attached to this email is your <strong>membership card (PDF)</strong> with your details and QR code.
          </p>

          <!-- Anonymity Section -->
          <div style="background: #fffbf0; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #E67E22;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #333;">🔒 Privacy Until Full Representation</p>
            ${isAnonymous ? `
              <p style="margin: 0 0 10px 0; color: #555; font-size: 14px;">
                Your identity is available only to the union president, with strict protective measures in place.
              </p>
            ` : ''}
            <p style="margin: 0; color: #555; font-size: 14px;">
              If you wish, you can become visible and an active member to participate in growing our union. We have plenty of work to do!
            </p>
          </div>

          <!-- Support Section -->
          <div style="background: #f0f7ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #0B2C49;">📋 Data Updates / Requests</p>
            <p style="margin: 0; color: #555; font-size: 14px;">
              If you need to correct or delete your data, file a complaint, or request access, please contact us:
            </p>
            <p style="margin: 10px 0 0 0; text-align: center;">
              <a href="mailto:office@sindikatncr.com" style="color: #E67E22; text-decoration: none; font-weight: bold; font-size: 15px;">office@sindikatncr.com</a>
            </p>
          </div>

          <!-- Footer Info -->
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
          
          <p style="font-size: 13px; color: #777; margin: 0 0 10px 0;">
            <strong>NCR Atleos Workers Union – Belgrade</strong><br/>
            Address: Španskih boraca 75, 11070 New Belgrade, Serbia
          </p>

          <p style="font-size: 12px; color: #999; margin: 15px 0; line-height: 1.5; font-style: italic;">
            We are not affiliated with NCR Atleos or NCR Voyix corporation, nor do we represent them.<br/>
            This email is for member information purposes and does not constitute legal advice.
          </p>

          <p style="font-size: 12px; color: #999; margin: 15px 0 0 0;">
            <a href="https://app.sindikatncr.com/documents/Privacy%20Policy.pdf" style="color: #E67E22; text-decoration: none;">Privacy Policy</a> | 
            <a href="https://app.sindikatncr.com/documents/Union%20Rules%20(en).pdf" style="color: #E67E22; text-decoration: none;">Union Rules</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f5f5f5; padding: 15px 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #999;">
          <p style="margin: 0;">© 2025 NCR Atleos Workers Union — Belgrade</p>
        </div>
      </div>
    `
  })
};



