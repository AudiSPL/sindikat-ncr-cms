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
  faq: {
    categories: Array<{
      id: string;
      title: string;
      icon: string;
      questions: Array<{
        question: string;
        answer: string;
      }>;
    }>;
  };
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
    faq: {
      categories: [
        {
          id: "basic",
          title: "📌 Osnovna pitanja o sindikatu",
          icon: "BookOpen",
          questions: [
            {
              question: "Šta je sindikat i zašto mi treba?",
              answer: "Sindikat je organizacija zaposlenih koja štiti vaša prava kroz kolektivno pregovaranje i zastupanje, u skladu sa važećim propisima Republike Srbije."
            },
            {
              question: "Da li je članstvo stvarno anonimno?",
              answer: "Anonimnost traje do trenutka kada zakon zahteva identifikaciju radi utvrđivanja reprezentativnosti ili vođenja postupaka. Tada se primenjuju posebne zakonske zaštite."
            },
            {
              question: "Koliko košta članstvo?",
              answer: "Nema članarine do marta/aprila 2026. Nakon sticanja reprezentativnosti, članarina se može uvesti glasanjem članova."
            },
            {
              question: "Gde se čuvaju moji podaci?",
              answer: "Podaci se čuvaju u EU (Supabase Ireland), u skladu sa GDPR i Zakonom o zaštiti podataka o ličnosti. Sindikat će sprovesti brisanje bez nepotrebnog odlaganja, najčešće u roku od 30 dana, osim ako postoji zakonska obaveza dužeg čuvanja (npr. računovodstvena ili sudska dokumentacija)."
            },
            {
              question: "Kako mogu da se pridružim?",
              answer: "Kliknite na \"Pridruži se\" i popunite formular. Izaberite način verifikacije u zavisnosti od toga da li želite da budete anonimni ili ne."
            },
            {
              question: "Da li moram da obavestim poslodavca da sam član?",
              answer: "Ne. Članstvo u sindikatu je privatno i ne prijavljuje se poslodavcu, osim ako to sami izričito želite ili ako je neophodno u okviru zakonom propisanih postupaka."
            }
          ]
        },
        {
          id: "legal",
          title: "⚖️ Pravna prava i zaštita",
          icon: "Scale",
          questions: [
            {
              question: "Da li poslodavac može da zabrani sindikalno organizovanje i da li u mom ugovoru može da stoji da ne mogu da budem član sindikata?",
              answer: "Ne, poslodavac ne može zabraniti sindikalno organizovanje niti staviti klauzulu protiv učlanjenja u sindikat u ugovor o radu. Ovo pravo je garantovano Ustavom Republike Srbije (član 56) i Zakonom o radu (član 206-215), što znači da bilo kakva odredba u ugovoru o radu koja ograničava ovo pravo je pravno nevalidna i ne proizvodi pravno dejstvo. U praksi to znači da čak i ako ste potpisali ugovor koji sadrži takvu klauzulu, ona se ne može primeniti. Ako poslodavac pokuša da vas spreči da se učlanite u sindikat ili vam zapreti zbog toga, to predstavlja kršenje fundamentalnih radničkih prava. Možete kontaktirati sindikat za besplatnu konsultaciju ili prijaviti slučaj Inspektoratu za rad."
            },
            {
              question: "Da li mogu biti kažnjen zbog sindikalne aktivnosti ili protesta?",
              answer: "Ne, ne možete biti kažnjeni zbog zakonite sindikalne aktivnosti ili protesta. Zakon o radu (član 206) i Ustav Republike Srbije (član 56) garantuju slobodu sindikalnog organizovanja i zabranjuju odmazdu protiv zaposlenih zbog sindikalne aktivnosti. Ako poslodavac pokuša da vas kazni, degradira, ili na bilo koji način diskriminiše zbog učlanjenja u sindikat ili učešća u zakonitim sindikalnim aktivnostima, to predstavlja teško kršenje radnog prava. U slučaju odmazde, imate pravo da podnesete prigovor Inspektoratu za rad u roku od 15 dana. Sindikat može pružiti besplatnu pravnu pomoć i zastupanje u ovom postupku."
            },
            {
              question: "Da li poslodavac može da me otpusti zbog članstva u sindikatu?",
              answer: "Ne, poslodavac ne može da vas otpusti isključivo zbog članstva u sindikatu. Otpustanje zbog sindikalnog članstva predstavlja teško kršenje Zakona o radu (član 206, stav 2) i Ustava Republike Srbije (član 56). Takav otpust je pravno nevažeći i predstavlja diskriminaciju na osnovu sindikalnog članstva, što je eksplicitno zabranjeno. Ako ste otpušteni zbog članstva u sindikatu, imate pravo da podnesete zahtev za vraćanje na posao i naknadu štete. Postupak se pokreće pred Inspektoratom za rad u roku od 15 dana od otkaza, a zatim se može nastaviti pred sudom. Sindikat pruža besplatnu pravnu pomoć i zastupanje u ovakvim slučajevima."
            },
            {
              question: "Šta ako me menadžer upozori da ne pričam o sindikatu?",
              answer: "Takvo upozorenje je protivno Zakonu o radu i može predstavljati pokušaj sprečavanja sindikalnog organizovanja, što je zabranjeno. Zakon o radu (član 206) garantuje slobodu sindikalnog organizovanja i zabranjuje poslodavcu da spreči, ograniči ili utiče na sindikalne aktivnosti zaposlenih. Upozorenje menadžera da ne pričate o sindikatu može biti protivzakonito, posebno ako je praćeno pretnjama ili pritiskom. Imate pravo da razgovarate o sindikatu sa kolegama tokom pauza i van radnog vremena. Ako menadžer nastavi sa pritiskom ili pretnjama, dokumentujte sve i kontaktirajte sindikat. Možete anonimno prijaviti slučaj, a sindikat će proceniti da li je reč o kršenju radnog prava i kako dalje postupiti."
            },
            {
              question: "Mogu li da prijavim kršenja anonimno?",
              answer: 'Da, možete prijaviti kršenja anonimno putem sindikata. Sindikat omogućava anonimno prijavljivanje kršenja radnih prava, a Zakon o zaštiti uzbunjivača („Službeni glasnik RS", br. 128/2014) garantuje posebnu zaštitu onima koji prijave kršenja u javnom interesu. Ova zaštita se primenjuje kada prijavljujete kršenja koja se odnose na radna prava, bezbednost na radu, ili druge javne interese. Za anonimnu prijavu, kontaktirajte sindikat na office@sindikatncr.com sa ličnog email naloga. Možete ostaviti samo opšte informacije o problemu bez otkrivanja identiteta. Sindikat će proceniti slučaj i, ako je potrebno, pomoći vam da podnesete formalnu prijavu Inspektoratu za rad ili drugim nadležnim organima.'
            },
            {
              question: "Šta se dešava u prvoj godini članstva?",
              answer: "Odmah po učlanjenju dobijate pristup uslugama sindikata: savetovanju, informacijama, anonimnim kanalima za prijavu i mogućnosti učešća u sastancima, anketama i glasanju, u skladu sa Statutom sindikata."
            }
          ]
        },
        {
          id: "privacy",
          title: "🔐 Digitalna privatnost",
          icon: "Lock",
          questions: [
            {
              question: "Da li poslodavac može da vidi da sam posetio sajt sindikata?",
              answer: "Ne, ako pristupate sa ličnih uređaja ili preko privatne/mobilne mreže. Preporučuje se da za sindikalnu komunikaciju koristite lične uređaje i privatne naloge."
            },
            {
              question: "Da li sindikat koristi kolačiće trećih strana?",
              answer: "Koristimo samo tehničke kolačiće neophodne za funkcionisanje sajta, bez marketinškog praćenja ili profilisanja korisnika."
            },
            {
              question: "Da li mogu da napustim sindikat i šta se dešava sa mojim podacima?",
              answer: "Možete istupiti iz sindikata u svakom trenutku. Podaci se brišu bez nepotrebnog odlaganja, najčešće u roku od 30 dana od obrade zahteva, osim ako postoji zakonska obaveza da se određeni podaci čuvaju duže (npr. finansijska dokumentacija ili podaci u toku sudskog postupka). Istupanjem prestaje pravo na podršku i beneficije sindikata."
            }
          ]
        },
        {
          id: "participation",
          title: "🙋 Učešće u sindikatu",
          icon: "Users",
          questions: [
            {
              question: "Kako mogu da učestvujem ako želim da ostanem anoniman?",
              answer: "Možete učestvovati putem anonimnog glasanja, predloga, anketa i drugih digitalnih kanala, bez obaveze da javno otkrivate identitet."
            },
            {
              question: "Da li mogu da predložim temu za pregovaranje?",
              answer: "Da. Svaki član može predložiti problem ili inicijativu koja će biti razmotrena u skladu sa internim procedurama sindikata."
            },
            {
              question: "Mogu li da se priključim radnim grupama?",
              answer: "Da. Učešće u radnim grupama je dobrovoljno i zasniva se na vašem interesovanju i stručnosti."
            },
            {
              question: "Šta ako ne želim javnu aktivnost?",
              answer: "Možete ostati neaktivni član i učestvovati isključivo putem anonimnog glasanja i digitalnih kanala, bez javnog eksponiranja."
            }
          ]
        },
        {
          id: "bargaining",
          title: "📝 Kolektivno pregovaranje i ugovori",
          icon: "FileText",
          questions: [
            {
              question: "Šta je kolektivni ugovor i kako se pregovara?",
              answer: "Kolektivni ugovor je pisani sporazum između sindikata i poslodavca koji definiše plate, radno vreme, beneficije i druge uslove rada. Pregovore vodi tim sindikata na osnovu prioriteta članova, a nacrt ugovora se usvaja glasanjem članova, u skladu sa Zakonom o radu."
            },
            {
              question: "Koliko traje proces pregovaranja prvog ugovora?",
              answer: "Proces zaključenja prvog kolektivnog ugovora često zahteva približno 12–18 meseci, u zavisnosti od složenosti tema i toka pregovora. U tom periodu primenjuju se postojeći uslovi rada, osim ako se ne dogovori nešto drugačije."
            },
            {
              question: "Ko odlučuje šta će biti u kolektivnom ugovoru?",
              answer: "Članovi odlučuju o ključnim pitanjima u skladu sa Statutom sindikata. Prioriteti se prikupljaju kroz ankete i sastanke, a konačna verzija ugovora se usvaja većinom glasova članova koji učestvuju u glasanju."
            }
          ]
        },
        {
          id: "strikes",
          title: "🤝 Štrajkovi i kolektivne akcije",
          icon: "Megaphone",
          questions: [
            {
              question: "Kada sindikat može da organizuje štrajk?",
              answer: "Štrajk se razmatra kao poslednje sredstvo, nakon pokušaja pregovora i drugih mirnih rešenja. Neophodno je glasanje članova, obaveštenje poslodavcu i poštovanje procedura propisanih Zakonom o štrajku."
            },
            {
              question: "Da li moram da učestvujem u štrajku?",
              answer: "Ne možete biti prinuđeni da učestvujete u štrajku. Učešće je dobrovoljno, ali što više članova učestvuje u zakonski organizovanom štrajku, to su efekti sindikalne akcije snažniji. Poslodavac zakonito ne sme da vas kažnjava zbog učešća u zakonski organizovanom štrajku."
            }
          ]
        },
        {
          id: "restructuring",
          title: "💼 Poslodavac i restrukturiranje",
          icon: "Briefcase",
          questions: [
            {
              question: "Kako me sindikat štiti tokom restrukturiranja kompanije?",
              answer: "Kolektivni ugovor može da predvidi procedure kod otpuštanja, prava prvenstva prilikom ponovnog zapošljavanja i zaštitu od proizvoljnih odluka. Sindikat se zalaže za transparentne i pravične kriterijume u skladu sa zakonom."
            },
            {
              question: "Da li poslodavac mora da konsultuje sindikat za velike promene?",
              answer: "Ako postoji kolektivni ugovor ili reprezentativan sindikat, poslodavac je dužan da pregovara o relevantnim promenama, posebno o masovnim otpuštanjima ili značajnoj izmeni uslova rada, u skladu sa Zakonom o radu."
            },
            {
              question: "Šta ako poslodavac ne poštuje kolektivni ugovor?",
              answer: "Možete pokrenuti pitanje preko sindikata. Sindikat može preduzeti korake pred nadležnim organima (inspekcija rada, mirno rešavanje sporova, sud) radi zaštite prava članova, u skladu sa važećim propisima."
            }
          ]
        },
        {
          id: "representativeness",
          title: "📊 Reprezentativnost i status sindikata",
          icon: "BarChart3",
          questions: [
            {
              question: "Šta znači reprezentativnost i zašto je važna?",
              answer: "Reprezentativnost znači da sindikat predstavlja zakonom propisan minimalni procenat zaposlenih (15%) i time stiče zakonsko ovlašćenje da pregovara sa poslodavcem u vaše ime."
            },
            {
              question: "Šta se dešava ako sindikat ne postigne reprezentativnost?",
              answer: "Sindikat i dalje pruža podršku, informacije i savetovanje članovima, ali nema zakonsko pregovaračko ovlašćenje prema poslodavcu."
            },
            {
              question: "Šta se dešava nakon postizanja reprezentativnosti?",
              answer: "Sindikat dobija pravo na kolektivno pregovaranje, formalno učešće u procesima odlučivanja o radnim uslovima i mogućnost uvođenja članarine, u skladu sa zakonom i Statutom."
            }
          ]
        },
        {
          id: "finance",
          title: "💰 Finansije i transparentnost",
          icon: "Wallet",
          questions: [
            {
              question: "Kako se troše sredstva sindikata?",
              answer: "Budžet odobravaju članovi u skladu sa Statutom i koristi se za pravnu pomoć, administraciju, obuku, komunikaciju i kampanje. Ključne informacije o troškovima redovno se objavljuju članstvu."
            },
            {
              question: "Ko nadgleda finansije sindikata?",
              answer: "Finansije nadgleda nadzorni odbor izabran od članova, uz periodične izveštaje i, po potrebi, reviziju, u skladu sa propisima i Statutom sindikata."
            },
            {
              question: "Mogu li da vidim kako se koriste moje članarine?",
              answer: "Da. Članovi imaju pravo uvida u finansijske izveštaje sindikata, uključujući zbirne prikaze prihoda i rashoda, nakon uvođenja članarine."
            }
          ]
        }
      ]
    },
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
    faq: {
      categories: [
        {
          id: "basic",
          title: "📌 Basic union questions",
          icon: "BookOpen",
          questions: [
            {
              question: "What is a union and why do I need it?",
              answer: "A union is an employee organization that protects your rights through collective bargaining and representation, in line with applicable Serbian law."
            },
            {
              question: "Is membership really anonymous?",
              answer: "Anonymity is maintained until the law requires identification for representativeness or legal proceedings. At that point, specific legal protections apply."
            },
            {
              question: "How much does membership cost?",
              answer: "There are no membership fees until March/April 2026. After the union becomes representative, fees may be introduced by a vote of the members."
            },
            {
              question: "Where is my data stored?",
              answer: "Data is stored in the EU (Supabase Ireland), in accordance with GDPR and Serbian data protection law. The union will delete your data without undue delay, typically within 30 days, unless there is a legal obligation to retain it longer (e.g. accounting or court-related records)."
            },
            {
              question: "How can I join?",
              answer: "Click \"Join our story\" and complete the form. Choose the verification method depending on whether you want to remain anonymous or not."
            },
            {
              question: "Do I have to inform my employer that I'm a member?",
              answer: "No. Union membership is private and is not reported to the employer, unless you explicitly choose to do so or it is necessary in specific legal procedures."
            }
          ]
        },
        {
          id: "legal",
          title: "⚖️ Legal rights & protection",
          icon: "Scale",
          questions: [
            {
              question: "Can my employer prohibit union organizing or include a clause that I cannot join a union?",
              answer: "No. The right to organize in a union is guaranteed by the Constitution and labor law, and an employment contract cannot lawfully restrict it."
            },
            {
              question: "Can I be punished for union activity or protests?",
              answer: "No, as long as the activities are lawful. Retaliation for lawful union activity may constitute a breach of labor law and give grounds for legal protection."
            },
            {
              question: "Can my employer dismiss me because of union membership?",
              answer: "No. Termination solely due to union membership is a serious violation of labor law and may justify legal action, including claims for reinstatement and compensation, subject to the decision of the competent authority."
            },
            {
              question: "What if my manager warns me not to talk about the union?",
              answer: "Such a warning may conflict with labor law and other regulations. You have the right to discuss the union with colleagues during breaks and outside working hours, in line with internal rules and applicable law."
            },
            {
              question: "Can I report violations anonymously?",
              answer: "Yes. The union allows anonymous reporting, and specific whistleblower protection may apply under the Serbian Whistleblower Protection Act."
            },
            {
              question: "What happens in the first year of membership?",
              answer: "From the moment you join, you gain access to union services: advice, information, anonymous reporting channels and the opportunity to take part in meetings, surveys and voting, in line with the union's Statute."
            }
          ]
        },
        {
          id: "privacy",
          title: "🔐 Digital privacy",
          icon: "Lock",
          questions: [
            {
              question: "Can my employer see that I visited the union website?",
              answer: "No, if you access it from personal devices or private/mobile networks. It is recommended that you use personal devices and accounts for union-related communication."
            },
            {
              question: "Does the union use third-party cookies?",
              answer: "We use only technical cookies necessary for the functioning of the site and do not use marketing tracking or user profiling."
            },
            {
              question: "Can I leave the union and what happens to my data?",
              answer: "You can leave the union at any time. Your data will be deleted without undue delay, typically within 30 days of processing your request, unless there is a legal obligation to retain certain data longer (e.g. financial records or data used in ongoing legal proceedings). Once you leave, you no longer have access to union support and benefits."
            }
          ]
        },
        {
          id: "participation",
          title: "🙋 Participation in the union",
          icon: "Users",
          questions: [
            {
              question: "How can I participate if I want to remain anonymous?",
              answer: "You can participate through anonymous voting, proposals, surveys and other digital channels, without having to disclose your identity publicly."
            },
            {
              question: "Can I propose topics for negotiation?",
              answer: "Yes. Any member can propose an issue or initiative, which will be reviewed in line with the union's internal procedures."
            },
            {
              question: "Can I join working groups?",
              answer: "Yes. Participation in working groups is voluntary and based on your interest and expertise."
            },
            {
              question: "What if I don't want public activity?",
              answer: "You can remain a non-active member and participate only through anonymous voting and digital channels, without any public exposure."
            }
          ]
        },
        {
          id: "bargaining",
          title: "📝 Collective bargaining & agreements",
          icon: "FileText",
          questions: [
            {
              question: "What is a collective agreement and how is it negotiated?",
              answer: "A collective agreement is a written contract between the union and the employer that sets out wages, working hours, benefits and other working conditions. Negotiations are conducted by the union team based on member priorities, and the draft agreement is adopted by a vote of the members, in line with labor law."
            },
            {
              question: "How long does it take to negotiate the first agreement?",
              answer: "Negotiating the first collective agreement often takes around 12–18 months, depending on the complexity of the issues and the course of negotiations. During that period, existing working conditions apply unless otherwise agreed."
            },
            {
              question: "Who decides what goes into the collective agreement?",
              answer: "Members decide on key issues in accordance with the union's Statute. Priorities are collected through surveys and meetings, and the final version of the agreement is adopted by a majority of members who participate in the vote."
            }
          ]
        },
        {
          id: "strikes",
          title: "🤝 Strikes & collective actions",
          icon: "Megaphone",
          questions: [
            {
              question: "When can the union organize a strike?",
              answer: "A strike is considered a last resort, after attempts at negotiation and other peaceful solutions. A member vote is required, the employer must be notified, and all procedures set by the Strike Act must be followed."
            },
            {
              question: "Do I have to take part in a strike?",
              answer: "You cannot be forced to participate in a strike. Participation is voluntary, but the more members join a lawfully organized strike, the stronger its impact. The employer is not legally allowed to punish you for taking part in a lawfully organized strike."
            }
          ]
        },
        {
          id: "restructuring",
          title: "💼 Employer & restructuring",
          icon: "Briefcase",
          questions: [
            {
              question: "How does the union protect me during company restructuring?",
              answer: "A collective agreement may set out procedures for redundancies, re-employment priorities and safeguards against arbitrary decisions. The union advocates for transparent and fair criteria in line with the law."
            },
            {
              question: "Does the employer have to consult the union on major changes?",
              answer: "Where there is a collective agreement or a representative union, the employer is required to negotiate relevant changes, especially mass redundancies or significant changes to working conditions, in line with labor law."
            },
            {
              question: "What if the employer does not comply with the collective agreement?",
              answer: "You can raise the issue through the union. The union may take action before the competent authorities (labor inspection, dispute resolution bodies, courts) to protect members' rights, in accordance with applicable regulations."
            }
          ]
        },
        {
          id: "representativeness",
          title: "📊 Representativeness & union status",
          icon: "BarChart3",
          questions: [
            {
              question: "What does representativeness mean and why is it important?",
              answer: "Representativeness means the union represents at least the minimum percentage of employees required by law (15%) and thereby obtains the legal authority to negotiate with the employer on your behalf."
            },
            {
              question: "What happens if the union does not become representative?",
              answer: "The union continues to provide support, information and advice to members but does not have statutory bargaining rights with the employer."
            },
            {
              question: "What happens after representativeness is achieved?",
              answer: "The union gains the right to engage in collective bargaining, take part formally in decisions on working conditions and introduce membership fees, in accordance with the law and the union's Statute."
            }
          ]
        },
        {
          id: "finance",
          title: "💰 Finance & transparency",
          icon: "Wallet",
          questions: [
            {
              question: "How are union funds spent?",
              answer: "The budget is approved by members in line with the Statute and is used for legal support, administration, training, communication and campaigns. Key information on expenditures is regularly shared with members."
            },
            {
              question: "Who oversees the union's finances?",
              answer: "Finances are overseen by a supervisory body elected by the members, with periodic reports and, where appropriate, audits, in line with regulations and the union's Statute."
            },
            {
              question: "Can I see how my membership fees are used?",
              answer: "Yes. Members have the right to access the union's financial reports, including summary income and expenditure overviews, once membership fees are introduced."
            }
          ]
        }
      ]
    },
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
