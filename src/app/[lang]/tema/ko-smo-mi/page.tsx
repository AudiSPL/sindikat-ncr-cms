import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Language, getContent } from '@/lib/content';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const content = getContent(lang as Language);
  
  return {
    title: content.whoWeAre.title,
    description: content.whoWeAre.intro,
  };
}

export default async function AboutUsPage({ params }: PageProps) {
  const { lang } = await params;
  const content = getContent(lang as Language);

  const mainContent = {
    sr: {
      intro: {
        title: "Ko smo mi?",
        text: "Mi smo tvoje kolege koje su pokrenule priču o sindikatu. Registrovani smo u ministarstvu da bismo zajedno obezbedili bolje uslove rada i zastupanje interesa zaposlenih.",
        bullets: [
          "Gradimo prostor za konstruktivan dijalog sa poslodavcem",
          "Radimo na transparentnim procesima i jasnoj komunikaciji",
          "Podržavamo jedni druge u profesionalnom okruženju",
          "Težimo fer odnosima i jasnim pravilima"
        ]
      },
      whatIsUnion: {
        title: "Šta je sindikat?",
        text: "Sindikat je zajednica zaposlenih koji žele da učestvuju u odlukama koje ih se tiču. Ali mi nismo onaj staromodni sindikat sa papirimama, pečatima i parolama.",
        highlight: "Mi smo digitalna generacija zaposlenih koja želi da radi u zdravom sistemu, da zna svoja prava, da ima glas, i da se o promenama razgovara otvoreno i konstruktivno.",
        tools: "Umesto zastava i parola, naši alati su informacija, solidarnost i profesionalnost. Ne bežimo od promena, samo želimo da one budu transparentne i da svi budemo uključeni u procese koji nas se tiču."
      },
      whyExists: {
        title: "Zašto postoji ovaj sindikat?",
        text: "Mi nismo političari, ni revolucionari. Mi smo zaposleni, ljudi koji svakog dana daju svoj maksimum, rešavaju probleme, spašavaju situacije u poslednji čas i rade sve da sistem funkcioniše.",
        feeling: "Ali već dugo osećamo da postoji prostor za poboljšanje.",
        experience: "Često smo čuli fraze koje ostavljaju malo prostora za dijalog. Videli smo situacije gde je nedostatak transparentnosti stvarao nesigurnost i frustraciju. Zato želimo da izgradimo strukturu za konstruktivan razgovor.",
        modern: "Ovo što gradimo nije klasičan sindikat kakav pamtimo iz starih vremena. Ovo je moderna zajednica zaposlenih, osnovana da nas povezuje i omogući da zajedno učestvujemo u procesima koji utiču na naše radne uslove.",
        ending: "Bez straha, bez politike, bez etiketa."
      },
      principles: {
        title: "Naša tri principa",
        intro: "Sve što radimo počiva na tri jednostavne ideje:",
        items: [
          { emoji: "1️⃣", title: "Poštovanje i sigurnost", text: "Svako zaslužuje dostojanstvo na radnom mestu i jasnu komunikaciju." },
          { emoji: "2️⃣", title: "Transparentan dijalog", text: "O promenama treba razgovarati otvoreno, uz uvažavanje različitih perspektiva." },
          { emoji: "3️⃣", title: "Uključenost u odluke", text: "Verujemo da odluke treba donositi uz uvažavanje konteksta i uticaja na ljude." }
        ]
      },
      goal: {
        title: "Šta je naš cilj?",
        text: "Zato postoji ovaj sindikat. Da bismo imali pravnu i kolektivnu zaštitu, da bismo zajedno gradili sigurnost, i da bismo jednog dana potpisali kolektivni ugovor koji znači fer odnose, jasna pravila i zdravo radno okruženje.",
        ending: "Ne radimo ovo protiv ikoga, radimo to za sve nas. Za one koji dolaze, za one koji su otišli, i za one koji još uvek veruju da se poštenim radom može doći do poštovanja."
      },
      howToJoin: {
        title: "Kako se pridružiti?",
        text: "Ako želiš da pomogneš da ovo zaživi, dovoljno je da se priključiš. Diskretno, sigurno, i bez obaveze, ali sa željom da jednom, kad budemo spremni, svi zajedno stanemo iza svojih imena i kažemo:",
        quote: '„Zaslužujemo bolje."'
      }
    },
    en: {
      intro: {
        title: "Who We Are?",
        text: "We are your colleagues who started this union conversation. We are officially registered with the ministry to collectively secure better working conditions and represent employee interests.",
        bullets: [
          "Build space for constructive dialogue with the employer",
          "Work on transparent processes and clear communication",
          "Support each other in a professional environment",
          "Strive for fair relationships and clear rules"
        ]
      },
      whatIsUnion: {
        title: "What is a union?",
        text: "A union is a community of employees who want to participate in decisions that affect them. But we are not the old-fashioned union with paperwork, stamps, and slogans.",
        highlight: "We are a digital generation of workers who want to work in a healthy system, to know our rights, to have a voice, and to discuss changes openly and constructively.",
        tools: "Instead of flags and slogans, our tools are information, solidarity, and professionalism. We don't run from change, we just want it to be transparent and for everyone to be included in processes that affect us."
      },
      whyExists: {
        title: "Why does this union exist?",
        text: "We are not politicians, nor revolutionaries. We are employees, people who give their maximum every day, solve problems, save situations at the last moment, and do everything to make the system work.",
        feeling: "But we have long felt that there is room for improvement.",
        experience: "We often heard phrases that leave little room for dialogue. We saw situations where lack of transparency created insecurity and frustration. That's why we want to build a structure for constructive conversation.",
        modern: "What we are building is not the classic union we remember from old times. This is a modern community of employees, founded to connect us and enable us to participate together in processes that affect our working conditions.",
        ending: "Without fear, without politics, without labels."
      },
      principles: {
        title: "Our Three Principles",
        intro: "Everything we do is based on three simple ideas:",
        items: [
          { emoji: "1️⃣", title: "Respect and Security", text: "Everyone deserves dignity in the workplace and clear communication." },
          { emoji: "2️⃣", title: "Transparent Dialogue", text: "Changes should be discussed openly, respecting different perspectives." },
          { emoji: "3️⃣", title: "Inclusion in Decisions", text: "We believe decisions should be made with consideration of context and impact on people." }
        ]
      },
      goal: {
        title: "What is Our Goal?",
        text: "That's why this union exists. To have legal and collective protection, to build security together, and to one day sign a collective agreement that means fair relationships, clear rules, and a healthy work environment.",
        ending: "We are not doing this against anyone, we are doing this for all of us. For those who are coming, for those who have left, and for those who still believe that honest work can lead to respect."
      },
      howToJoin: {
        title: "How to Join?",
        text: "If you want to help make this happen, all you need to do is join. Discreetly, securely, and without obligation, but with the desire that one day, when we are ready, we all stand together behind our names and say:",
        quote: '"We deserve better."'
      }
    }
  };

  const currentContent = lang === 'sr' ? mainContent.sr : mainContent.en;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F1419]">
      {/* Hero Section */}
      <section className="relative bg-[#2C5282] dark:bg-brand-navy py-12 md:py-20 px-4">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
            {currentContent.intro.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-9 md:py-14 px-4 bg-white dark:bg-[#0F1419]">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Intro Section */}
          <Card className="mb-6">
            <CardContent className="pt-6 pb-6">
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {currentContent.intro.text}
              </p>
              <p className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                {lang === 'sr' ? 'Osnovali smo sindikat jer znamo da pojedinačni glasovi često ostanu nečujni, zajedno možemo više:' : 'We founded this union because we know that individual voices often go unheard, together we can achieve more:'}
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300">
                {currentContent.intro.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
              <p className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 mt-4">
                {lang === 'sr' ? 'Zajedništvo i transparentnost su naša osnova.' : 'Unity and transparency are our foundation.'}
              </p>
            </CardContent>
          </Card>

          {/* What is a union? */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#60a5fa] mb-4">
              {currentContent.whatIsUnion.title}
            </h2>
            <Card className="mb-6">
              <CardContent className="pt-6 pb-6">
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {currentContent.whatIsUnion.text}
                </p>
                <p className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  {currentContent.whatIsUnion.highlight}
                </p>
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentContent.whatIsUnion.tools}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why does this union exist? */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#60a5fa] mb-4">
              {currentContent.whyExists.title}
            </h2>
            <Card className="mb-6">
              <CardContent className="pt-6 pb-6">
                <p className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {currentContent.whyExists.text}
                </p>
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {currentContent.whyExists.feeling}
                </p>
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {currentContent.whyExists.experience}
                </p>
                <p className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {currentContent.whyExists.modern}
                </p>
                <p className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentContent.whyExists.ending}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Three Principles */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#60a5fa] mb-4">
              {currentContent.principles.title}
            </h2>
            <Card className="mb-6">
              <CardContent className="pt-6 pb-6">
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {currentContent.principles.intro}
                </p>
                <div className="space-y-4">
                  {currentContent.principles.items.map((item, index) => (
                    <div key={index} className="border-l-4 border-brand-orange pl-4">
                      <p className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {item.emoji} {item.title}
                      </p>
                      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What is Our Goal? */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#60a5fa] mb-4">
              {currentContent.goal.title}
            </h2>
            <Card className="mb-6">
              <CardContent className="pt-6 pb-6">
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {currentContent.goal.text}
                </p>
                <p className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentContent.goal.ending}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How to Join? */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#60a5fa] mb-4">
              {currentContent.howToJoin.title}
            </h2>
            <Card className="mb-6">
              <CardContent className="pt-6 pb-6">
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {currentContent.howToJoin.text}
                </p>
                <p className="text-base md:text-lg font-bold text-brand-orange dark:text-brand-orange leading-relaxed text-center italic">
                  {currentContent.howToJoin.quote}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-5 bg-gradient-to-r from-[#E67E22] to-[#F5A623] dark:from-[#D97E1F] dark:to-[#F28C38] rounded-lg p-2 md:p-4 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            <h3 className="text-sm md:text-lg font-bold text-white mb-2 animate-pulse">
              {lang === 'sr' ? 'Spremni ste?' : 'Ready?'}
            </h3>
            <p className="text-xs md:text-sm text-white/90 mb-2">
              {lang === 'sr' 
                ? 'Pridružite se i budite deo naše zajednice.'
                : 'Join and be part of our community.'
              }
            </p>
            <Link href={lang === 'sr' ? '/sr/nova-pristupnica' : '/en/nova-pristupnica'}>
              <button className="px-4 py-2 bg-white text-brand-orange dark:text-brand-orange font-semibold rounded-lg hover:scale-110 transition-all duration-300 hover:shadow-lg active:scale-95 border-2 border-white hover:border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 text-xs">
                {lang === 'sr' ? 'Pridruži se' : 'Join us'} →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
