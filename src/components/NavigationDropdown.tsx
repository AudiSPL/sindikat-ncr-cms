'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Language, getContent } from '@/lib/content';

interface NavigationDropdownProps {
  lang: Language;
}

export function NavigationDropdown({ lang }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const content = getContent(lang);

  const aboutItems = [
    { label: content.nav.whoWeAre, href: `/${lang}#ko-smo-mi` },
    { label: content.nav.ourPlan, href: `/${lang}#nas-plan` },
    { label: content.nav.benefits, href: `/${lang}#benefiti` },
    { label: content.nav.confidentiality, href: `/${lang}#anonimnost` },
    { label: content.nav.legalSupport, href: `/${lang}#pravna-podrska` },
    { label: content.nav.faq, href: `/${lang}#faq` },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-white/10 transition-colors duration-200 font-medium"
        >
          {content.nav.aboutUs}
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white dark:bg-slate-900/30 border-2 border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm"
        align="start"
        sideOffset={8}
      >
        {aboutItems.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              href={item.href}
              className="w-full cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
