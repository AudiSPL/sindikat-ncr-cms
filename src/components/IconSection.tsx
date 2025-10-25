import { Language } from '@/lib/content';

interface IconSectionProps {
  lang: Language;
}

export function IconSection({ lang }: IconSectionProps) {
  const content = {
    sr: {
      items: [
        {
          title: "1. Poverljiva Prijava",
          description: "Tvoji podaci su zaštićeni. Možeš se prijaviti i anonimno."
        },
        {
          title: "2. Gradimo Zajednicu", 
          description: "Zajedno smo jači. Svaki član doprinosi snazi zajednice."
        },
        {
          title: "3. Ostvarimo Ciljeve",
          description: "Nakon 15%, kolektivno pregovaranje za bolje uslove."
        }
      ]
    },
    en: {
      items: [
        {
          title: "1. Confidential Application",
          description: "Your data is protected. You can apply anonymously."
        },
        {
          title: "2. Building Community",
          description: "Together we are stronger. Every member contributes to community strength."
        },
        {
          title: "3. Achieving Goals", 
          description: "After 15%, collective bargaining for better conditions."
        }
      ]
    }
  };

  const currentContent = content[lang];

  return (
    <section className="bg-[#0F1419] dark:bg-[#0F1419] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Item 1 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-[#E67E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {/* Shield icon */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold mb-2">{currentContent.items[0].title}</h3>
            <p className="text-gray-400 text-sm">{currentContent.items[0].description}</p>
          </div>

          {/* Item 2 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-[#E67E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {/* People icon */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold mb-2">{currentContent.items[1].title}</h3>
            <p className="text-gray-400 text-sm">{currentContent.items[1].description}</p>
          </div>

          {/* Item 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-[#E67E22]" fill="currentColor" viewBox="0 0 24 24">
                {/* Heart icon */}
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 className="text-white font-bold mb-2">{currentContent.items[2].title}</h3>
            <p className="text-gray-400 text-sm">{currentContent.items[2].description}</p>
          </div>

        </div>
      </div>
    </section>
  );
}
