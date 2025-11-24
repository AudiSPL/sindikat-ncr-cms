'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getContent, type Language } from '@/lib/content';

interface FAQAccordionProps {
  lang: Language;
}

export function FAQAccordion({ lang }: FAQAccordionProps) {
  const content = getContent(lang);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const questionId = `${categoryId}-${questionIndex}`;
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  // Dynamic icon component getter
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.BookOpen;
  };

  return (
    <div className="space-y-8">
      {content.faq.categories.map((category) => {
        const IconComponent = getIconComponent(category.icon);
        
        return (
          <div key={category.id} className="space-y-4">
            {/* Category Header - Always Visible */}
            <div className="flex items-center gap-3 pb-2 border-b-2 border-[#005B99]">
              <IconComponent className="h-6 w-6 text-[#005B99] flex-shrink-0" />
              <h2 className="text-xl font-semibold text-foreground">
                {category.title}
              </h2>
            </div>

            {/* Questions in Category */}
            <div className="space-y-3">
              {category.questions.map((item, questionIndex) => {
                const questionId = `${category.id}-${questionIndex}`;
                const isOpen = openQuestion === questionId;

                return (
                  <div key={questionIndex} className="border rounded-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
                      onClick={() => toggleQuestion(category.id, questionIndex)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${questionId}`}
                    >
                      <span className="font-medium pr-4">{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      )}
                    </Button>
                    
                    {isOpen && (
                      <div 
                        id={`faq-answer-${questionId}`}
                        className="px-4 pb-4 text-muted-foreground leading-relaxed"
                        role="region"
                        aria-labelledby={`faq-question-${questionId}`}
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
