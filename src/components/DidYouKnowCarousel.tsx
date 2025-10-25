'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/content';

interface DidYouKnowCarouselProps {
  lang: Language;
}

export function DidYouKnowCarousel({ lang }: DidYouKnowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const content = {
    sr: {
      title: "Da Li Ste Znali?",
      statements: [
        "Zakon ti garantuje pravo na sindikalno organizovanje bez odmazde.",
        "Članstvo je trenutno besplatno – a pruža ti zaštitu i glas.",
        "U toku je proces automatizacije određenih pozicija, što u praksi znači da će se deo poslova menjati ili nestajati.",
        "Sindikat postoji upravo da bismo zajedno mogli da reagujemo na promene, da tražimo prekvalifikacije, zaštitu radnih mesta i fer tretman.",
        "Na vreme reagovati znači da niko ne ostane bez podrške ili plana.",
        "Znaš li da… reprezentativnost (oko 15%) otvara vrata kolektivnom pregovaranju?",
        "Znaš li da… kao član utičeš na teme pregovora i prioritete (plate, uslovi, zaštita)?"
      ]
    },
    en: {
      title: "Did You Know?",
      statements: [
        "The law guarantees you the right to trade union organization without retaliation.",
        "Membership is currently free – and gives you protection and a voice.",
        "Automation of certain positions is underway, which in practice means some jobs will change or disappear.",
        "The union exists so we can respond together to changes, seek retraining, protect jobs, and get fair treatment.",
        "Responding in time means no one is left without support or a plan.",
        "Did you know… representativeness (around 15%) opens the door to collective bargaining?",
        "Did you know… as a member, you influence negotiation topics and priorities (wages, conditions, protection)?"
      ]
    }
  };

  const currentContent = content[lang];
  const statements = currentContent.statements;

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % statements.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [statements.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? statements.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % statements.length);
  };

  return (
    <section className="bg-black dark:bg-black py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">{currentContent.title}</h2>
        
        <div className="relative">
          {/* Statement Content */}
          <div className="flex items-center justify-center min-h-[200px] relative overflow-hidden">
            {/* Statement Content */}
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="flex-shrink-0 border-[#2D3139] text-gray-300 hover:bg-[#2D3139]"
                aria-label={lang === 'sr' ? 'Prethodna izjava' : 'Previous statement'}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 mx-6">
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-medium">
                  {statements[currentIndex]}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="flex-shrink-0 border-[#2D3139] text-gray-300 hover:bg-[#2D3139]"
                aria-label={lang === 'sr' ? 'Sledeća izjava' : 'Next statement'}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {statements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#E67E22]' 
                    : 'bg-gray-600'
                }`}
                aria-label={`${lang === 'sr' ? 'Idi na izjavu' : 'Go to statement'} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
