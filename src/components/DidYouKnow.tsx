'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, getContent } from '@/lib/content';

interface DidYouKnowProps {
  lang: Language;
}

export function DidYouKnow({ lang }: DidYouKnowProps) {
  const content = getContent(lang);
  const [currentIndex, setCurrentIndex] = useState(0);
  const statements = content.didYouKnowStatements;

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % statements.length);
    }, 3000);

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

  const currentStatement = statements[currentIndex];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#F7FAFC] dark:bg-[#0F1419] hidden lg:block">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {lang === 'sr' ? 'Da li ste znali?' : 'Did You Know?'}
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900/30 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-6 md:p-8 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 ease-out">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="flex-shrink-0"
                aria-label={lang === 'sr' ? 'Prethodna izjava' : 'Previous statement'}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 mx-6">
                <p className="text-lg md:text-xl text-slate-900 dark:text-white leading-relaxed">
                  {currentStatement.text}...
                </p>
                <div className="mt-4">
                  <Link href={currentStatement.link}>
                    <Button variant="outline" className="text-brand-blue dark:text-brand-orange hover:opacity-80">
                      {currentStatement.linkText} →
                    </Button>
                  </Link>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="flex-shrink-0"
                aria-label={lang === 'sr' ? 'Sledeća izjava' : 'Next statement'}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {statements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentIndex 
                      ? 'bg-brand-orange' 
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  aria-label={`${lang === 'sr' ? 'Idi na izjavu' : 'Go to statement'} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
