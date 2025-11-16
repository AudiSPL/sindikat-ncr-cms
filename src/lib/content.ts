export type Language = 'sr' | 'en';

export interface Content {
  hero: {
    title: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  nav: {
    home: string;
    aboutUs: string;
    join: string;
    login: string;
    documents: string;
    contact: string;
    whoWeAre: string;
    ourPlan: string;
    benefits: string;
    confidentiality: string;
    legalSupport: string;
    faq: string;
  };
  teasers: Array<{
    title: string;
    excerpt: string;
    href: string;
  }>;
  didYouKnowStatements: Array<{
    id: number;
    text: string;
    link: string;
    linkText: string;
  }>;
  donations: {
    title: string;
    content: string;
    buttonText: string;
    buttonLink: string;
  };
  trustStrip: string;
  whoWeAre: {
    title: string;
    intro: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  whyNow: {
    title: string;
    subtitle: string;
    intro: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
    cta: string;
    ctaLink: string;
  };
  ourPlan: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  benefits: {
    title: string;
    cards: Array<{
      title: string;
      description: string;
    }>;
  };
  confidentiality: {
    title: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  legalSupport: {
    title: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  pristupnica: {
    title: string;
    content: string;
    steps: string[];
    cta: string;
  };
  contact: {
    title: string;
    description: string;
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      submit: string;
    };
    info: {
      email: string;
      location: string;
    };
  };
  documents: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      status: string;
    }>;
  };
  privacy: {
    title: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
  footer: {
    rights: string;
    quickLinks: string;
    contact: string;
    disclaimer: string;
    recaptcha: string;
  };
}

export const content: Record<Language, Content> = {
  sr: {
    hero: {
      title: "Zaposleni na istoj strani.",
      lead: "Pridruži se poverljivo i učestvuj u promenama koje te se tiču.",
      ctaPrimary: "Pridruži se našoj priči",
      ctaSecondary: "Saznaj više"
    },
    nav: {
      home: "Početna",
      aboutUs: "O nama",
      join: "Pristupnica",
      login: "Prijava",
      documents: "Dokumenti",
      contact: "Kontakt",
      whoWeAre: "Ko smo mi",
      ourPlan: "Naš plan",
      benefits: "Šta dobijaš",
      confidentiality: "Anonimnost",
      legalSupport: "Pravna podrška",
      faq: "FAQ"
    },
    teasers: [
      {
        title: "Zašto da se priključiš",
        excerpt: "Sigurniji u grupi, jači u pregovorima, pravna podrška kad zatreba.",
        href: "/sr/tema/zasto-sada"
      },
      {
        title: "Kako da se priključiš",
        excerpt: "3 koraka: e-pristupnica → verifikacija → potvrda i podrška.",
        href: "/sr/nova-pristupnica"
      },
      {
        title: "Ko smo mi",
        excerpt: "Grupa zaposlenih koja želi pravila koja važe za sve i normalne uslove rada.",
        href: "/sr/tema/ko-smo-mi"
      },
      {
        title: "Naš plan",
        excerpt: "Četiri koraka ka jačoj poziciji...",
        href: "/sr/tema/nas-plan"
      },
      {
        title: "Pravna podrška",
        excerpt: "Stručna pomoć od Skakić Law Firm...",
        href: "/sr/tema/pravna-podrska"
      },
      {
        title: "Zašto vredi",
        excerpt: "Glas zaštićen, prava jača, budućnost sigurnija...",
        href: "/sr/tema/benefiti"
      }
    ],
    didYouKnowStatements: [
      {
        id: 1,
        text: "U mnogim firmama zaposleni dobijaju 13. platu i regres – zašto mi ne?",
        link: "/sr/tema/benefiti",
        linkText: "Saznaj više"
      },
      {
        id: 2,
        text: "Zakon ti garantuje pravo na sindikalno organizovanje bez odmazde.",
        link: "/sr/tema/ko-smo-mi",
        linkText: "Saznaj više"
      },
      {
        id: 3,
        text: "Članstvo je trenutno besplatno – a pruža ti zaštitu i glas.",
        link: "/sr/tema/benefiti",
        linkText: "Saznaj više"
      },
      {
        id: 4,
        text: "Strani menadžer po zakonu ne sme da bude rukovodilac zaposlenih u Srbiji.",
        link: "/sr/tema/pravna-podrska",
        linkText: "Saznaj više"
      },
      {
        id: 5,
        text: "Topli obrok i druge naknade su tvoje pravo, a ne privilegija.",
        link: "/sr/tema/benefiti",
        linkText: "Saznaj više"
      },
      {
        id: 6,
        text: "U toku je proces automatizacije određenih pozicija, što u praksi znači da će se deo poslova menjati ili nestajati.",
        link: "/sr/tema/nas-plan",
        linkText: "Saznaj više"
      },
      {
        id: 7,
        text: "Sindikat postoji upravo da bismo zajedno mogli da reagujemo na takve promene, da tražimo prekvalifikacije, zaštitu radnih mesta i fer tretman.",
        link: "/sr/tema/nas-plan",
        linkText: "Saznaj više"
      },
      {
        id: 8,
        text: "Na vreme reagovati znači da niko ne ostane bez podrške ili plana.",
        link: "/sr/kontakt",
        linkText: "Saznaj više"
      }
    ],
    donations: {
      title: "Članarina i Donacije – Zajedno Gradimo Budućnost",
      content: "Započeli smo priču o sindikatu NCR ATM doo sa mnogo sati truda i sopstvenim troškovima, ali da bismo trajali i rasli, potrebna nam je tvoja pomoć. Svaka donacija, ma koliko mala, pomaže nam da nastavimo borbu za pravnu sigurnost, popuste i bolje uslove rada. Tvoj doprinos čini nas jačima! Kontaktiraj nas za više detalja…",
      buttonText: "Podrži Sindikat",
      buttonLink: "mailto:office@sindikatncr.com?subject=Donacija - Sindikat NCR ATM doo"
    },
    trustStrip: "",
    whoWeAre: {
      title: "Ko smo mi",
      intro: "Grupa zaposlenih koja želi pravila koja važe za sve i normalne uslove rada. Nismo jos jedan poster - mi smo MREZA podrske koja ti cuva ledja na poslu!",
      sections: [
        {
          title: "Ukratko",
          content: "Cilj ~15%: kad postanemo reprezentativni, ulazimo u zvanične procese i pregovore."
        },
        {
          title: "Manje priče, više učinka",
          content: "Jasni zahtevi, rokovi, kontrola realizacije."
        },
        {
          title: "Diskretno članstvo",
          content: "EU hosting podataka, ograničen pristup, bez javnih spiskova."
        },
        {
          title: "Promo",
          content: "Nema članarine do 31.3."
        }
      ]
    },
    whyNow: {
      title: "Zašto sada?",
      subtitle: "Što se pre organizujemo, to više dobijamo za sve.",
      intro: "Sindikat Zaposlenih NCR Atleos-Beograd je organizacija zaposlenih koja štiti vaša prava i gradi bolje radno okruženje. Sada je vreme da se pridružite i budete deo promene.",
      sections: [
        {
          title: "Vreme je sada",
          content: "Što se pre organizujemo, to više dobijamo za sve. Što kasnije čekamo, to manje vremena imamo da uticemo na ključne odluke."
        },
        {
          title: "Rani članovi postavljaju standarde",
          content: "Prve ankete određuju prioritete. Kao rani član, tvoj glas direktno utiče na to šta će sindikat zagovarati."
        },
        {
          title: "Manje troška, više koristi",
          content: "Promo period bez članarine do 31.3. Bez rizika, bez obaveza, samo prednosti. Kasnije: obična članarina (oko 1% plate)."
        },
        {
          title: "Momentum zajednice",
          content: "Lakše je kad krene lavina, ti je pokrećeš. Kada dostignemo 15%, automatski ulazimo u kolektivne pregovore."
        }
      ],
      cta: "Pridruži se za 2 min",
      ctaLink: "/sr/nova-pristupnica"
    },
    ourPlan: {
      title: "Naš plan",
      steps: [
        {
          title: "Kolektiv (cilj: ~15%)",
          description: "Skupimo oko 15% zaposlenih da postanemo reprezentativni i pregovaramo kao jedan."
        },
        {
          title: "Reprezentativnost",
          description: "Sa statusom reprezentativnosti poslodavac je dužan da nas uključi pre svake izmene pravilnika i pravila rada."
        },
        {
          title: "Pregovori",
          description: "Na osnovu glasova članova pregovaramo o platama, uslovima rada, karijeri i zaštiti, pre objave bilo kakvih promena."
        },
        {
          title: "Sporazumi i primena",
          description: "Potpisujemo dogovore, definišemo rokove, pratimo ispunjenje i izveštavamo članove."
        }
      ]
    },
    benefits: {
      title: "Šta dobijaš",
      cards: [
        {
          title: "Pravna podrška",
          description: "1-1 konsultacije; po potrebi zastupanje preko partnerske kancelarije."
        },
        {
          title: "Tvoj glas u pravilima",
          description: "Kada postanemo reprezentativni (~15%), poslodavac mora da nas uključi pre svake promene."
        },
        {
          title: "Bolji uslovi",
          description: "Pregovaramo o platama, uslovima rada, karijeri i zaštiti"
        },
        {
          title: "Diskretno članstvo",
          description: "Nema javnih spiskova; ograničen pristup; verifikacija samo radi potvrde zaposlenja."
        },
        {
          title: "Brza pomoć",
          description: "Kratki odgovori, jasni sledeći koraci, pomoć oko dopisa kad zatreba."
        },
        {
          title: "Karijera & veštine",
          description: "Guramo fer napredovanje i podršku u doba automatizacije."
        }
      ]
    },
    confidentiality: {
      title: "Anonimnost i zaštita",
      sections: [
        {
          title: "Poverljivost podataka",
          content: "Tvoji podaci su poverljivi i obrađuju se u skladu sa GDPR i ZZPL. Poslodavac nema legitiman osnov da traži podatke o članstvu, osim ako je to izričito propisano zakonom (npr. postupak utvrđivanja reprezentativnosti)."
        },
        {
          title: "Anonimna prijava",
          content: "Anonimna prijava je moguća (bez imena); možeš ostaviti samo email radi komunikacije. Sve ostalo ostaje potpuno poverljivo."
        },
        {
          title: "Nakon reprezentativnosti",
          content: "Nakon reprezentativnosti: poverljivost u internim evidencijama ostaje; za javnu reprezentaciju i pregovore predstavnici se identifikuju; predstavnici imaju posebnu zaštitu (npr. zaštita od nepovoljnog tretmana)."
        },
        {
          title: "Tehnička zaštita",
          content: "Koristimo enkripciju, RBAC kontrolu pristupa, audit logove sa vremenskim oznakama, i EU hosting (Supabase Ireland). Dva-čovek pravilo za kritične operacije."
        }
      ]
    },
    legalSupport: {
      title: "Pravna podrška",
      sections: [
        {
          title: "Konsultacije",
          content: "Besplatne pravne konsultacije za sve članove sindikata. Možeš pitati o bilo kom pitanju vezanom za radno pravo, prava zaposlenih, ili postupke u kompaniji."
        },
        {
          title: "Zastupanje",
          content: "Profesionalno zastupanje u postupcima pred nadležnim organima, uključujući inspekciju rada, sudove, i druge institucije."
        },
        {
          title: "Partnerstvo",
          content: "Pravna podrška od Skakić Law Firm - Za naš sindikat obezbedili smo stručnu pravnu podršku od renomirane advokatske kancelarije Skakić Law Firm, specijalizovane za radno pravo i internacionalno korporativno radno pravo. Sa velikim iskustvom i timom stručnih advokata, Skakić Law pruža vrhunsku pravnu zaštitu i savetovanje zaposlenima u složenim korporativnim i radnim pitanjima. Njihova ekspertiza obuhvata zaštitu prava radnika, pravnu pomoć prilikom kolektivnih ugovora, radnih sporova, reorganizacije i svih aspekata radnih odnosa. Partnerstvo sa Skakić Law osigurava da članovi sindikata dobiju pravnu sigurnost i podršku kada im je najpotrebnija."
        }
      ]
    },
    faq: [
      {
        question: "Šta je sindikat i zašto mi treba?",
        answer: "Sindikat je organizacija zaposlenih koja štiti vaša prava kroz kolektivno pregovaranje. Kroz sindikat možete uticati na uslove rada, plate, benefite i druge aspekte radnog odnosa."
      },
      {
        question: "Da li je članstvo stvarno anonimno?",
        answer: "Anonimnost je dostupna do trenutka kada zakon zahteva drugačije (npr. u postupcima reprezentativnosti). Tada važe posebne zakonske zaštite za učesnike i predstavnike."
      },
      {
        question: "Koliko košta članstvo?",
        answer: "Nema članarine do marta/aprila 2026. Nakon dostizanja reprezentativnosti, članarina se uvodi glasanjem svih članova (obično oko 1% plate)."
      },
      {
        question: "Gde se čuvaju moji podaci?",
        answer: "Podaci se čuvaju u EU (Supabase Ireland) u skladu sa GDPR. Imamo audit logove svih pristupa i možemo obrisati vaše podatke u roku od 30 dana po zahtevu."
      },
      {
        question: "Šta ako me poslodavac pita o članstvu?",
        answer: "Poslodavac nema pravo da traži informacije o vašem članstvu u sindikatu, osim u slučajevima propisanim zakonom. Vaše članstvo je privatna stvar."
      },
      {
        question: "Kako mogu da se pridružim?",
        answer: "Kliknite na 'Pridruži se našoj priči' dugme i popunite formular. Možete ostaviti samo email za komunikaciju, ostalo može biti anonimno."
      }
    ],
    pristupnica: {
      title: "Pridruži se našoj priči",
      content: "Pred vama je jednostavan korak ka boljoj budućnosti. Popunite formular poverljivo, bez straha od pritiska, i budite deo promene koja štiti sva vaša prava.",
      steps: [
        "Popuniti prijavu",
        "Čekirati obavezna polja",
        "Potvrda vam stiže na mail"
      ],
      cta: "Popuni formular"
    },
    contact: {
      title: "Kontakt",
      description: "Imate pitanja? Trebate savet? Kontaktirajte nas poverljivo. Odgovor šaljemo samo ako ostavite kontakt.",
      form: {
        name: "Ime (opciono)",
        email: "Email (opciono)",
        subject: "Tema",
        message: "Poruka",
        submit: "Pošalji"
      },
      info: {
        email: "office@sindikatncr.com",
        location: "Beograd, Srbija"
      }
    },
    documents: {
      title: "Dokumenti",
      description: "Važni dokumenti i materijali za članove sindikata.",
      items: [
        {
          title: "Statut sindikata",
          description: "Osnovni dokument koji definiše ciljeve, strukturu i način rada sindikata.",
          status: "uskoro PDF"
        },
        {
          title: "Pravila članstva",
          description: "Uslovi članstva, prava i obaveze članova sindikata.",
          status: "uskoro PDF"
        },
        {
          title: "Kolektivni ugovor",
          description: "Dokument koji definiše uslove rada za sve zaposlene u kompaniji.",
          status: "uskoro PDF"
        },
        {
          title: "Pravni saveti",
          description: "Korisni pravni saveti i objašnjenja za zaposlene.",
          status: "uskoro PDF"
        }
      ]
    },
    privacy: {
      title: "Politika privatnosti",
      sections: [
        {
          title: "Prikupljanje podataka",
          content: "Prikupljamo samo potrebne podatke za funkcionisanje sindikata: ime, email, grad, organizacija. Anonimna prijava je moguća."
        },
        {
          title: "Korišćenje podataka",
          content: "Podatke koristimo za komunikaciju, organizaciju aktivnosti, i zastupanje vaših interesa. Ne delimo podatke sa trećim stranama bez vaše saglasnosti."
        },
        {
          title: "Beleženje pristupa",
          content: "Sve pristupe podacima beležimo sa vremenskim oznakama. Implementirano je dva-čovek pravilo za kritične operacije."
        },
        {
          title: "Procesori podataka",
          content: "Procesori: Supabase (EU), Vercel, email servis (DPA potpisane). Svi podaci se čuvaju u EU u skladu sa GDPR."
        },
        {
          title: "Zadržavanje podataka",
          content: "Brisanje ili anonimizacija u roku od 30 dana po zahtevu/istupu. Audit logovi se čuvaju 2 godine za sigurnosne svrhe."
        }
      ]
    },
    footer: {
      rights: "© Sindikat Zaposlenih NCR Atleos-Beograd. Sva prava zadržana.",
      quickLinks: "Brze veze",
      contact: "Kontakt",
      disclaimer: "Sindikat NCR Atleos – Beograd je nezavisno udruženje zaposlenih. Nismo povezani, niti na bilo koji način zastupamo kompanije NCR Atleos ili NCR Voyix; stavovi objavljeni ovde ne predstavljaju stavove poslodavca.",
      recaptcha: "Sajt je zaštićen reCAPTCHA tehnologijom; primenjuju se Google Privacy Policy i Terms of Service."
    }
  },
  en: {
    hero: {
      title: "Employees on the same side.",
      lead: "Join confidentially and participate in changes that matter to you.",
      ctaPrimary: "Join our story",
      ctaSecondary: "Learn more"
    },
    nav: {
      home: "Home",
      aboutUs: "About Us",
      join: "Join",
      login: "Login",
      documents: "Documents",
      contact: "Contact",
      whoWeAre: "Who We Are",
      ourPlan: "Our Plan",
      benefits: "What You Get",
      confidentiality: "Confidentiality",
      legalSupport: "Legal Support",
      faq: "FAQ"
    },
    teasers: [
      {
        title: "Why join",
        excerpt: "Safer in a group, stronger in negotiations, legal backup when needed.",
        href: "/en/tema/zasto-sada"
      },
      {
        title: "How to join",
        excerpt: "3 steps: e-application → verification → confirmation & support.",
        href: "/en/nova-pristupnica"
      },
      {
        title: "About us",
        excerpt: "A group of employees who want rules that apply to everyone, and normal working conditions. We're not just another poster, we're a support network that has your back at work!",
        href: "/en/tema/ko-smo-mi"
      },
      {
        title: "Our Plan",
        excerpt: "Four steps toward stronger position...",
        href: "/en/tema/nas-plan"
      },
      {
        title: "Legal Support",
        excerpt: "Professional support from Skakić Law Firm...",
        href: "/en/tema/pravna-podrska"
      },
      {
        title: "Why it matters",
        excerpt: "Your voice protected, rights stronger...",
        href: "/en/tema/benefiti"
      }
    ],
    didYouKnowStatements: [
      {
        id: 1,
        text: "In many companies employees receive 13th salary and bonuses – why don't we?",
        link: "/en/tema/benefiti",
        linkText: "Learn more"
      },
      {
        id: 2,
        text: "The law guarantees you the right to unionize without retaliation.",
        link: "/en/tema/ko-smo-mi",
        linkText: "Learn more"
      },
      {
        id: 3,
        text: "Membership is currently free – and provides you protection and voice.",
        link: "/en/tema/benefiti",
        linkText: "Learn more"
      },
      {
        id: 4,
        text: "Foreign managers by law cannot be supervisors of employees in Serbia.",
        link: "/en/tema/pravna-podrska",
        linkText: "Learn more"
      },
      {
        id: 5,
        text: "Meal allowances and other benefits are your right, not a privilege.",
        link: "/en/tema/benefiti",
        linkText: "Learn more"
      },
      {
        id: 6,
        text: "There is an ongoing process of automation of certain positions, which in practice means that some jobs will change or disappear.",
        link: "/en/tema/nas-plan",
        linkText: "Learn more"
      },
      {
        id: 7,
        text: "The union exists precisely so we can together respond to such changes, seek retraining, job protection and fair treatment.",
        link: "/en/tema/nas-plan",
        linkText: "Learn more"
      },
      {
        id: 8,
        text: "Reacting in time means no one is left without support or a plan.",
        link: "/en/kontakt",
        linkText: "Learn more"
      }
    ],
    donations: {
      title: "Membership Fees & Donations – Building the Future Together",
      content: "We started the story of NCR ATM doo union with many hours of effort and our own costs, but to sustain and grow, we need your help. Every donation, no matter how small, helps us continue the fight for legal security, discounts and better working conditions. Your contribution makes us stronger! Contact us for more details…",
      buttonText: "Help us",
      buttonLink: "mailto:office@sindikatncr.com?subject=Donation - NCR ATM doo Union"
    },
    trustStrip: "",
    whoWeAre: {
      title: "About us",
      intro: "A group of employees who want rules that apply to everyone, and normal working conditions. We're not just another poster, we're a support network that has your back at work!",
      sections: [
        {
          title: "At a glance",
          content: "Target ~15%: once representative, we enter formal processes and negotiations."
        },
        {
          title: "Less talk, more outcomes",
          content: "Clear asks, timelines, and delivery control."
        },
        {
          title: "Discreet membership",
          content: "EU data hosting, restricted access, no public lists."
        },
        {
          title: "Promo",
          content: "No dues until 31 March."
        }
      ]
    },
    whyNow: {
      title: "Why Now?",
      subtitle: "The sooner we organize, the more we all gain.",
      intro: "The Employee Union NCR Atleos-Belgrade is an organization of employees who protect your rights and build a better work environment. It's time to join and be part of the change.",
      sections: [
        {
          title: "Now is the time",
          content: "The sooner we organize, the more we all gain. The longer we wait, the less time we have to influence key decisions."
        },
        {
          title: "Early members set the standards",
          content: "The first surveys define priorities. As an early member, your voice directly influences what the union will advocate for."
        },
        {
          title: "Less cost, more value",
          content: "Promo period with no dues until 31 March. No risk, no obligations, just benefits. Later: standard membership fee (around 1% of salary)."
        },
        {
          title: "Community momentum",
          content: "Change moves faster once it starts, you kick it off. Once we reach 15%, we automatically enter collective negotiations."
        }
      ],
      cta: "Join in 2 minutes",
      ctaLink: "/en/nova-pristupnica"
    },
    ourPlan: {
      title: "Our Plan",
      steps: [
        {
          title: "Collective (target: ~15%)",
          description: "\"Let's reach about 15% of employees to become representative and negotiate as one.\""
        },
        {
          title: "Representativeness",
          description: "\"With representativeness, the employer is legally required to involve us before changing rulebooks or workplace policies.\""
        },
        {
          title: "Negotiations",
          description: "\"Based on member input we negotiate pay, working conditions, career paths, protection, before anything goes live.\""
        },
        {
          title: "Agreements & delivery",
          description: "\"We sign agreements, set timelines, track delivery, and report to members.\""
        }
      ]
    },
    benefits: {
      title: "What You Get",
      cards: [
        {
          title: "Legal Support",
          description: "1-on-1 consultations; representation through partner law firms when needed."
        },
        {
          title: "Your Voice in Decisions",
          description: "Once we're representative (~15%), the employer must include us before any changes."
        },
        {
          title: "Better Conditions",
          description: "We negotiate on wages, working conditions, careers, and protection."
        },
        {
          title: "Discreet Membership",
          description: "No public lists; restricted access; verification only to confirm employment."
        },
        {
          title: "Fast Support",
          description: "Quick answers, clear next steps, help with documentation when you need it."
        },
        {
          title: "Career & Skills",
          description: "We push for fair advancement and support during times of automation."
        }
      ]
    },
    confidentiality: {
      title: "Confidentiality & Protection",
      sections: [
        {
          title: "Data Confidentiality",
          content: "Your data is confidential and processed in accordance with GDPR and labor laws. The employer has no legitimate basis to request membership data, except when explicitly required by law (e.g., representativeness determination procedures)."
        },
        {
          title: "Anonymous Application",
          content: "Anonymous application is possible (without name); you can leave only email for communication. Everything else remains completely confidential."
        },
        {
          title: "After Representativeness",
          content: "After representativeness: confidentiality in internal records remains; for public representation and negotiations representatives are identified; representatives have special protection (e.g., protection from unfavorable treatment)."
        },
        {
          title: "Technical Protection",
          content: "We use encryption, RBAC access control, audit logs with timestamps, and EU hosting (Supabase Ireland). Two-person rule for critical operations."
        }
      ]
    },
    legalSupport: {
      title: "Legal Support",
      sections: [
        {
          title: "Consultations",
          content: "Free legal consultations for all union members. You can ask about any question related to labor law, employee rights, or company procedures."
        },
        {
          title: "Representation",
          content: "Professional representation in procedures before competent authorities, including labor inspection, courts, and other institutions."
        },
        {
          title: "Education",
          content: "Regular education about your rights, new laws, and best practices in employment relations."
        },
        {
          title: "Partnership",
          content: "We work with Skakić Law Firm which has long-term experience in labor law and employee representation. Key rights: freedom of association, representative protection, collective bargaining, protection in contract/work condition change procedures."
        }
      ]
    },
    faq: [
      {
        question: "What is a union and why do I need it?",
        answer: "A union is an organization of employees that protects your rights through collective bargaining. Through the union you can influence working conditions, wages, benefits and other aspects of employment."
      },
      {
        question: "Is membership really anonymous?",
        answer: "Anonymity is available until the law requires otherwise (e.g., in representativeness procedures). Then special legal protections apply for participants and representatives."
      },
      {
        question: "How much does membership cost?",
        answer: "No membership fees until March/April 2026. After reaching representativeness, membership fees are introduced by voting of all members (usually about 1% of salary)."
      },
      {
        question: "Where is my data stored?",
        answer: "Data is stored in the EU (Supabase Ireland) in accordance with GDPR. We have audit logs of all access and can delete your data within 30 days upon request."
      },
      {
        question: "What if my employer asks about membership?",
        answer: "The employer has no right to request information about your union membership, except in cases prescribed by law. Your membership is a private matter."
      },
      {
        question: "How can I join?",
        answer: "Click the 'Join our story' button and fill out the form. You can leave only email for communication, everything else can be anonymous."
      }
    ],
    pristupnica: {
      title: "Join our story",
      content: "A simple step towards a better future awaits you. Fill out the form confidentially, without fear of pressure, and be part of the change that protects all your rights.",
      steps: [
        "Fill out the application",
        "Check required fields",
        "Confirmation sent to your email"
      ],
      cta: "Fill out form"
    },
    contact: {
      title: "Contact",
      description: "Have questions? Need advice? Contact us confidentially. We only send a reply if you provide contact information.",
      form: {
        name: "Name (optional)",
        email: "Email (optional)",
        subject: "Subject",
        message: "Message",
        submit: "Send"
      },
      info: {
        email: "office@sindikatncr.com",
        location: "Belgrade, Serbia"
      }
    },
    documents: {
      title: "Documents",
      description: "Important documents and materials for union members.",
      items: [
        {
          title: "Union Statute",
          description: "Basic document that defines the goals, structure and way of union operation.",
          status: "PDF coming soon"
        },
        {
          title: "Membership Rules",
          description: "Membership conditions, rights and obligations of union members.",
          status: "PDF coming soon"
        },
        {
          title: "Collective Agreement",
          description: "Document that defines working conditions for all employees in the company.",
          status: "PDF coming soon"
        },
        {
          title: "Legal Advice",
          description: "Useful legal advice and explanations for employees.",
          status: "PDF coming soon"
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          title: "Data Collection",
          content: "We collect only necessary data for union operation: name, email, city, organization. Anonymous application is possible."
        },
        {
          title: "Data Use",
          content: "We use data for communication, organizing activities, and representing your interests. We do not share data with third parties without your consent."
        },
        {
          title: "Access Logging",
          content: "We log all data access with timestamps. Two-person rule is implemented for critical operations."
        },
        {
          title: "Data Processors",
          content: "Processors: Supabase (EU), Vercel, email service (DPA signed). All data is stored in EU in accordance with GDPR."
        },
        {
          title: "Data Retention",
          content: "Deletion or anonymization within 30 days upon request/exit. Audit logs are kept for 2 years for security purposes."
        }
      ]
    },
    footer: {
      rights: "© Employees' Union NCR Atleos-Belgrade. All rights reserved.",
      quickLinks: "Quick Links",
      contact: "Contact",
      disclaimer: "NCR Atleos – Belgrade Employees' Union is an independent employees' organization. We are not affiliated with, nor do we represent, NCR Atleos or NCR Voyix in any manner; the views expressed herein do not reflect the employer's positions.",
      recaptcha: "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."
    }
  }
};

export function getContent(lang: Language): Content {
  return content[lang];
}

export function getLocalizedPath(path: string, lang: Language): string {
  return `/${lang}${path}`;
}
