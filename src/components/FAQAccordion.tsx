'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, getContent } from '@/lib/content';

interface FAQAccordionProps {
  lang: Language;
}

export function FAQAccordion({ lang }: FAQAccordionProps) {
  const content = getContent(lang);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {content.faq.map((item, index) => (
        <div key={index} className="border rounded-lg">
          <Button
            variant="ghost"
            className="w-full justify-between p-6 h-auto text-left"
            onClick={() => toggleItem(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="font-medium">{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="h-4 w-4 flex-shrink-0 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />
            )}
          </Button>
          
          {openIndex === index && (
            <div 
              id={`faq-answer-${index}`}
              className="px-6 pb-6 text-muted-foreground"
              role="region"
              aria-labelledby={`faq-question-${index}`}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
