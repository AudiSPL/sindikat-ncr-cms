import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendMail } from '@/lib/mailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function getGreeting(firstName: string): string {
  if (!firstName) return 'Ćao';
  
  const name = firstName.trim();
  
  // Kompletan dictionary sa vokativima (muška + ženska imena)
  const knownVocatives: Record<string, string> = {
    // MUŠKA IMENA - A
    'Aleksa': 'Aleksa',
    'Aleksandar': 'Aleksandre',
    'Aleksej': 'Alekseje',
    'Andrej': 'Andreje',
    'Andrija': 'Andrija',
    'Arsenije': 'Arsenije',
    
    // MUŠKA IMENA - B
    'Balša': 'Balša',
    'Bogdan': 'Bogdane',
    'Bojan': 'Bojane',
    'Boris': 'Borise',
    'Branislav': 'Branislave',
    'Branko': 'Branko',
    
    // MUŠKA IMENA - D
    'Dalibor': 'Dalibore',
    'Damjan': 'Damjane',
    'Danilo': 'Danilo',
    'Darijan': 'Darijane',
    'Darko': 'Darko',
    'David': 'Davide',
    'Denis': 'Denise',
    'Despot': 'Despote',
    'Dragan': 'Dragane',
    'Dušan': 'Dušane',
    'Đorđe': 'Đorđe',
    
    // MUŠKA IMENA - F
    'Filip': 'Filipe',
    
    // MUŠKA IMENA - G
    'Gavrilo': 'Gavrilo',
    'Goran': 'Gorane',
    
    // MUŠKA IMENA - H
    'Hamza': 'Hamzo',
    
    // MUŠKA IMENA - I
    'Igor': 'Igore',
    'Ignjat': 'Ignjate',
    'Ilija': 'Ilija',
    
    // MUŠKA IMENA - J
    'Jakov': 'Jakove',
    'Jakša': 'Jakša',
    'Janko': 'Janko',
    'Jovan': 'Jovane',
    
    // MUŠKA IMENA - K
    'Konstantin': 'Konstantine',
    'Kosta': 'Kosta',
    'Kristijan': 'Kristijane',
    
    // MUŠKA IMENA - L
    'Lav': 'Lave',
    'Lazar': 'Lazare',
    'Leon': 'Leone',
    'Luka': 'Luka',
    
    // MUŠKA IMENA - M
    'Maksim': 'Maksime',
    'Marko': 'Marko',
    'Matej': 'Mateje',
    'Mateo': 'Mateo',
    'Matija': 'Matija',
    'Mihajlo': 'Mihajlo',
    'Mihailo': 'Mihailo',
    'Mijat': 'Mijate',
    'Milan': 'Milane',
    'Milomir': 'Milomire',
    'Milorad': 'Milorade',
    'Miloslav': 'Miloslave',
    'Miloš': 'Miloše',
    'Momir': 'Momire',
    
    // MUŠKA IMENA - N
    'Nebojša': 'Nebojša',
    'Nemanja': 'Nemanja',
    'Nikola': 'Nikola',
    'Nikša': 'Nikša',
    'Noa': 'Noa',
    'Novak': 'Novače',
    
    // MUŠKA IMENA - O
    'Ognjen': 'Ognjene',
    'Omer': 'Omere',
    
    // MUŠKA IMENA - P
    'Pavle': 'Pavle',
    'Petar': 'Petre',
    'Predrag': 'Predraže',
    
    // MUŠKA IMENA - R
    'Rade': 'Rade',
    'Radoslav': 'Radoslave',
    'Radovan': 'Radovane',
    'Rastko': 'Rastko',
    'Ratko': 'Ratko',
    'Relja': 'Relja',
    
    // MUŠKA IMENA - S
    'Sava': 'Savo',
    'Saša': 'Saša',
    'Sergej': 'Sergeje',
    'Slađan': 'Slađane',
    'Slavko': 'Slavko',
    'Stanimir': 'Stanimire',
    'Stefan': 'Stefane',
    'Strahinja': 'Strahinja',
    
    // MUŠKA IMENA - T
    'Tadej': 'Tadeje',
    'Tadija': 'Tadija',
    'Teodor': 'Teodore',
    'Todor': 'Todore',
    'Tomislav': 'Tomislave',
    
    // MUŠKA IMENA - U
    'Uglješa': 'Uglješa',
    'Uroš': 'Uroše',
    
    // MUŠKA IMENA - V
    'Vanja': 'Vanja',
    'Vasilije': 'Vasilije',
    'Veljko': 'Veljko',
    'Vidak': 'Vidače',
    'Viktor': 'Viktore',
    'Vlade': 'Vlade',
    'Vladimir': 'Vladimire',
    'Vojin': 'Vojine',
    'Vuk': 'Vuče',
    'Vukan': 'Vukane',
    'Vukašin': 'Vukašine',
    
    // MUŠKA IMENA - Z
    'Zoran': 'Zorane',
    'Željko': 'Željko',
    
    // ŽENSKA IMENA - A
    'Ana': 'Ana',
    'Anđela': 'Anđela',
    'Angelina': 'Angelina',
    'Anika': 'Anika',
    'Aleksandra': 'Aleksandra',
    
    // ŽENSKA IMENA - B
    'Biljana': 'Biljana',
    'Bosa': 'Boso',
    'Branka': 'Branka',
    
    // ŽENSKA IMENA - D
    'Dana': 'Dano',
    'Danica': 'Danice',
    'Danijela': 'Danijela',
    'Darija': 'Darija',
    'Dorotea': 'Dorotea',
    'Dragana': 'Dragana',
    'Dragica': 'Dragice',
    'Draginja': 'Draginja',
    'Dunja': 'Dunja',
    'Dušica': 'Dušice',
    'Đurđina': 'Đurđina',
    
    // ŽENSKA IMENA - E
    'Ema': 'Ema',
    
    // ŽENSKA IMENA - G
    'Gordana': 'Gordana',
    
    // ŽENSKA IMENA - H
    'Hana': 'Hana',
    'Helena': 'Helena',
    
    // ŽENSKA IMENA - I
    'Iris': 'Iris',
    'Iskra': 'Iskra',
    'Ivana': 'Ivana',
    
    // ŽENSKA IMENA - J
    'Jadranka': 'Jadranka',
    'Jana': 'Jano',
    'Jelena': 'Jelena',
    
    // ŽENSKA IMENA - K
    'Kristina': 'Kristina',
    'Kruna': 'Kruno',
    
    // ŽENSKA IMENA - L
    'Lana': 'Lano',
    'Lara': 'Laro',
    'Lena': 'Leno',
    'Lenka': 'Lenko',
    'Leposava': 'Leposava',
    'Lejla': 'Lejla',
    'Ljiljana': 'Ljiljo',
    'Ljubica': 'Ljubice',
    'Luna': 'Luno',
    
    // ŽENSKA IMENA - M
    'Marija': 'Marija',
    'Marta': 'Marta',
    'Maša': 'Mašo',
    'Mia': 'Mia',
    'Mila': 'Mila',
    'Milica': 'Milice',
    'Minja': 'Minja',
    'Mirjana': 'Mirjana',
    'Miroslava': 'Miroslava',
    
    // ŽENSKA IMENA - N
    'Nađa': 'Nađo',
    'Nevenka': 'Nevenka',
    'Nika': 'Nika',
    'Nikolija': 'Nikolija',
    'Nikolina': 'Nikolina',
    'Nora': 'Nora',
    
    // ŽENSKA IMENA - O
    'Olivera': 'Olivera',
    
    // ŽENSKA IMENA - P
    'Petra': 'Petra',
    
    // ŽENSKA IMENA - R
    'Radmila': 'Radmila',
    'Ria': 'Rio',
    'Ružica': 'Ružice',
    
    // ŽENSKA IMENA - S
    'Sara': 'Saro',
    'Sladjana': 'Sladjana',
    'Slavica': 'Slavice',
    'Snežana': 'Snežana',
    'Sofija': 'Sofija',
    'Srna': 'Srno',
    'Svetlana': 'Svetlana',
    
    // ŽENSKA IMENA - T
    'Tara': 'Tara',
    'Tatjana': 'Tatjana',
    'Tea': 'Tea',
    'Teodora': 'Teodora',
    
    // ŽENSKA IMENA - U
    'Una': 'Una',
    
    // ŽENSKA IMENA - V
    'Verica': 'Verice',
    'Vesna': 'Vesna',
    'Violeta': 'Violeta',
    
    // ŽENSKA IMENA - Z
    'Zara': 'Zara',
    'Zorica': 'Zorice',
  };
  
  // Proveri da li je u listi poznatih
  if (knownVocatives[name]) {
    return `Ćao ${knownVocatives[name]}`;
  }
  
  // Za ostala ženska imena (završavaju se na a, e, i) -> ostaju ista
  const lastChar = name.slice(-1).toLowerCase();
  if (['a', 'e', 'i'].includes(lastChar)) {
    return `Ćao ${name}`;
  }
  
  // Za SVA OSTALA imena (nepoznata, strana) -> samo "Ćao"
  return 'Ćao';
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { memberIds, subject, message } = await req.json();

    if (!memberIds || memberIds.length === 0) {
      return NextResponse.json(
        { error: 'No members selected' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Fetch selected members
    const { data: members, error } = await supabase
      .from('members')
      .select('id, full_name, email')
      .in('id', memberIds);

    if (error || !members) {
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      );
    }

    // Helper function to wait
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Send emails with rate limiting (max 2 per second)
    const results = [];
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      
      try {
        const firstName = member.full_name?.split(' ')[0] || '';
        
        // Simple HTML template
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #E67E22 0%, #FF8C42 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Sindikat Radnika NCR Atleos - Beograd</h1>
            </div>

            <div style="background: white; padding: 30px 20px; border: 1px solid #e0e0e0; border-top: none;">
              <p style="font-size: 16px; margin: 0 0 20px 0;"><strong>${getGreeting(firstName)},</strong></p>
              
              <div style="font-size: 15px; line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="background: #fff9e6; border-left: 4px solid #E67E22; padding: 15px; margin: 25px 20px; border-radius: 4px;">
              <p style="font-size: 13px; color: #666; margin: 0 0 10px 0;">
                <strong>📌 Važno:</strong> Da ne biste propustili buduće poruke od sindikata:
              </p>
              <ol style="font-size: 13px; color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Ako je ovaj email stigao u folder "Obaveštenja" ili "Promocije", prevucite ga u "Primarno"</li>
                <li>Gmail će pitati: "Da li želite da uradite isto i za buduće poruke?" - Odaberite <strong>DA</strong></li>
                <li>Tako ćete dobijati sve važne informacije direktno u glavnom inbox-u</li>
              </ol>
            </div>

            <div style="text-align: center; background: #f8f9fa; padding: 25px 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
              <img src="https://sindikatncr.com/brand/logo-sindikat.png" alt="Sindikat Radnika NCR Atleos - Beograd" style="max-width: 150px; margin-bottom: 15px;">
              <p style="font-size: 13px; color: #666; margin: 10px 0 5px 0;">
                <strong>Sindikat Radnika NCR Atleos - Beograd</strong>
              </p>
              <p style="font-size: 13px; color: #666; margin: 5px 0;">
                Španskih boraca 75, Beograd
              </p>
              <p style="font-size: 13px; margin: 5px 0;">
                📧 <a href="mailto:office@sindikatncr.com" style="color: #E67E22; text-decoration: none;">office@sindikatncr.com</a><br>
                🌐 <a href="https://sindikatncr.com" style="color: #E67E22; text-decoration: none;">www.sindikatncr.com</a>
              </p>
            </div>
          </div>
        `;

        console.log(`[${i + 1}/${members.length}] Sending to ${member.email}...`);

        await sendMail({
          to: member.email,
          subject: subject,
          html: emailHtml,
          replyTo: 'office@sindikatncr.com',
          fromName: 'Milos Savin',
        });

        results.push({ email: member.email, success: true });
        console.log(`[${i + 1}/${members.length}] ✅ Sent to ${member.email}`);
        
        // Wait 600ms between emails (allows ~1.6 emails/sec, safely under 2/sec limit)
        if (i < members.length - 1) {
          await wait(600);
        }
        
      } catch (err) {
        console.error(`[${i + 1}/${members.length}] ❌ Failed to send to ${member.email}:`, err);
        results.push({ 
          email: member.email, 
          success: false, 
          error: String(err) 
        });
        
        // Still wait before next attempt to respect rate limit
        if (i < members.length - 1) {
          await wait(600);
        }
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    const failedEmails = results.filter(r => !r.success).map(r => r.email);

    console.log('\n========== BULK EMAIL SUMMARY ==========');
    console.log(`✅ Successfully sent: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    if (failCount > 0) {
      console.log('\n❌ Failed emails:');
      failedEmails.forEach(email => console.log(`   - ${email}`));
    }
    console.log('=========================================\n');

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
      failedEmails: failedEmails,
      results,
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}

