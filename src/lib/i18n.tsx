import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "hu" | "en";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Announcement bar
  "demo.mode": { hu: "Demo mód:", en: "Demo mode:" },
  "demo.new": { hu: "Új látogató", en: "New visitor" },
  "demo.returning": { hu: "Visszatérő ügyfél", en: "Returning customer" },

  // Nav
  "nav.insurance": { hu: "Biztosítás", en: "Insurance" },
  "nav.bank": { hu: "Bank", en: "Banking" },
  "nav.knowledge": { hu: "Tudástár", en: "Knowledge" },
  "nav.about": { hu: "Rólunk", en: "About us" },
  "nav.login": { hu: "Bejelentkezés", en: "Log in" },
  "nav.cta": { hu: "Díjat számolok", en: "Get a quote" },

  // Hero - New visitor
  "hero.badge": { hu: "Új! AI tanácsadó", en: "New! AI advisor" },
  "hero.title1": { hu: "A biztosítási tanácsadója,", en: "Your insurance advisor" },
  "hero.title2": { hu: "aki sosem alszik", en: "that never sleeps" },
  "hero.subtitle": {
    hu: "Nem kell kalkulátort kitöltenie. Mondja el, mire van szüksége, és a Netrisk AI megtalálja a legjobb ajánlatot — percek alatt, magyarul.",
    en: "No forms to fill out. Just tell us what you need, and Netrisk AI will find the best offer — in minutes.",
  },
  "hero.chip.kgfb": { hu: "Kötelező biztosítás váltás", en: "MTPL insurance switch" },
  "hero.chip.home": { hu: "Lakásbiztosítás", en: "Home insurance" },
  "hero.chip.travel": { hu: "Utasbiztosítás", en: "Travel insurance" },

  // Hero placeholders
  "hero.placeholder.0": { hu: "Írja be a rendszámát, vagy mondja el, miben segíthetek...", en: "Enter your license plate, or tell me how I can help..." },
  "hero.placeholder.1": { hu: "ABC-123", en: "ABC-123" },
  "hero.placeholder.2": { hu: "Mennyibe kerül a kötelező biztosítás?", en: "How much does MTPL insurance cost?" },
  "hero.placeholder.3": { hu: "Melyik a legjobb biztosító?", en: "Which is the best insurer?" },
  "hero.placeholder.4": { hu: "Szeretnék biztosítást váltani", en: "I want to switch my insurance" },

  // Hero - Returning
  "hero.returning.badge": { hu: "Visszatérő ügyfél", en: "Returning customer" },
  "hero.returning.title": { hu: "Üdvözöljük újra! 👋", en: "Welcome back! 👋" },
  "hero.returning.subtitle.pre": {
    hu: "A Suzuki SX4 S-Cross kötelező biztosítása január 1-jén jár le. Már összehasonlítottam az ajánlatokat — ",
    en: "Your Suzuki SX4 S-Cross MTPL insurance expires January 1st. I've already compared offers — ",
  },
  "hero.returning.subtitle.savings": { hu: "6 800 Ft-ot spórolhat évente.", en: "you can save 6,800 Ft/year." },
  "hero.returning.cta": { hu: "Mutasd az ajánlatokat", en: "Show me the offers" },
  "hero.returning.or": { hu: "vagy kérdezzen bármit a tanácsadótól", en: "or ask the advisor anything" },
  "hero.returning.placeholder": { hu: "Pl. miért drágább az Allianz?", en: "E.g. why is Allianz more expensive?" },

  // Returning dashboard
  "dashboard.kgfb": { hu: "Kötelező biztosítás", en: "MTPL Insurance" },
  "dashboard.expires": { hu: "Lejár: jan. 1.", en: "Expires: Jan 1" },
  "dashboard.recommended": { hu: "Ajánlott váltás", en: "Recommended switch" },
  "dashboard.savings": { hu: "Megtakarítás: 4 500 Ft", en: "Savings: 4,500 Ft" },
  "dashboard.switch": { hu: "Váltás →", en: "Switch →" },

  // Hero illustration bubbles
  "hero.bubble.plate": { hu: ""Rendszámom: ABC-123"", en: ""My plate: ABC-123"" },
  "hero.bubble.savings": { hu: ""31 200 Ft/év — 15% olcsóbb!"", en: ""31,200 Ft/yr — 15% cheaper!"" },

  // Social proof
  "stats.contracts": { hu: "napi szerződés", en: "daily contracts" },
  "stats.customers": { hu: "visszatérő ügyfél", en: "returning customers" },
  "stats.partners": { hu: "biztosító partner", en: "insurer partners" },
  "stats.years.suffix": { hu: " éve", en: " years" },
  "stats.years.label": { hu: "az Önök szolgálatában", en: "serving you" },

  // How it works
  "howit.title": { hu: "Hogyan működik a Netrisk AI tanácsadó?", en: "How does the Netrisk AI advisor work?" },
  "howit.step1.title": { hu: "Meséljen az igényeiről", en: "Tell us your needs" },
  "howit.step1.desc": {
    hu: "Nem kell űrlapokat kitöltenie. Egyszerűen írja le, mire van szüksége — a rendszámát, a helyzetét, vagy csak egy kérdést.",
    en: "No forms to fill. Just describe what you need — your plate number, your situation, or just a question.",
  },
  "howit.step2.title": { hu: "Az AI összehasonlít", en: "AI compares" },
  "howit.step2.desc": {
    hu: "A tanácsadó valós időben összehasonlítja mind a 22 biztosító ajánlatát, és kiválasztja az Ön helyzetére legjobbat.",
    en: "The advisor compares all 22 insurers' offers in real time and picks the best for your situation.",
  },
  "howit.step3.title": { hu: "Egy kattintás, kész", en: "One click, done" },
  "howit.step3.desc": {
    hu: "Válassza ki az ajánlatot, és a Netrisk intézi a váltást — felmondás, új szerződés, minden papírmunka.",
    en: "Choose the offer, and Netrisk handles the switch — cancellation, new contract, all paperwork.",
  },

  // Product grid
  "products.title": { hu: "Miben segíthetünk?", en: "How can we help?" },
  "products.kgfb": { hu: "Kötelező biztosítás (KGFB)", en: "MTPL Insurance (KGFB)" },
  "products.kgfb.desc": { hu: "Kötelező gépjármű felelősségbiztosítás összehasonlítás", en: "Mandatory motor vehicle liability insurance comparison" },
  "products.casco": { hu: "Casco", en: "Casco" },
  "products.casco.desc": { hu: "Teljes körű gépjármű biztosítás", en: "Comprehensive vehicle insurance" },
  "products.home": { hu: "Lakásbiztosítás", en: "Home insurance" },
  "products.home.desc": { hu: "Otthona védelme, személyre szabva", en: "Home protection, personalized" },
  "products.travel": { hu: "Utasbiztosítás", en: "Travel insurance" },
  "products.travel.desc": { hu: "Utazási biztosítás bárhová a világon", en: "Travel insurance anywhere in the world" },
  "products.loan": { hu: "Személyi kölcsön", en: "Personal loan" },
  "products.loan.desc": { hu: "A legjobb hitelajánlatok egy helyen", en: "The best loan offers in one place" },
  "products.health": { hu: "Egészségpénztár", en: "Health fund" },
  "products.health.desc": { hu: "Spóroljon az egészségügyi kiadásain", en: "Save on healthcare expenses" },
  "products.start": { hu: "Tanácsadó indítása →", en: "Start advisor →" },
  "products.soon": { hu: "Hamarosan!", en: "Coming soon!" },

  // Before/After
  "ba.title": { hu: "A biztosításkötés új kora", en: "The new era of insurance" },
  "ba.subtitle": { hu: "Hasonlítsa össze a régi és az új módszert", en: "Compare the old and the new way" },
  "ba.old.label": { hu: "Hagyományos mód", en: "Traditional way" },
  "ba.old.fields": { hu: "15-25 mező kitöltése", en: "Fill 15-25 fields" },
  "ba.old.time": { hu: "~8 perc", en: "~8 min" },
  "ba.new.label": { hu: "Netrisk AI tanácsadó", en: "Netrisk AI advisor" },
  "ba.new.fields": { hu: "3-4 kérdés, beszélgetés formájában", en: "3-4 questions, in conversation" },
  "ba.new.time": { hu: "~2 perc", en: "~2 min" },
  "ba.form.rendszam": { hu: "Rendszám", en: "License plate" },
  "ba.form.birth": { hu: "Születési dátum", en: "Date of birth" },
  "ba.form.address": { hu: "Lakcím", en: "Address" },
  "ba.form.bm": { hu: "Bonus-malus", en: "Bonus-malus" },
  "ba.form.payment": { hu: "Fizetési mód", en: "Payment method" },
  "ba.form.personal": { hu: "Személyes adatok", en: "Personal data" },
  "ba.chat.1": { hu: "Üdvözlöm! Mi a rendszáma?", en: "Hello! What's your license plate?" },
  "ba.chat.2": { hu: "ABC-123", en: "ABC-123" },
  "ba.chat.3": { hu: "2015-ös Opel Astra, stimmel? Hol lakik?", en: "2015 Opel Astra, correct? Where do you live?" },
  "ba.chat.4": { hu: "Szegeden", en: "In Szeged" },

  // Trust partners
  "trust.title": { hu: "22 biztosító, egy tanácsadó", en: "22 insurers, one advisor" },
  "trust.quote": {
    hu: "„Tavaly 14 000 Ft-ot spóroltak átlagosan a biztosítót váltó ügyfeleink."",
    en: '"Last year, our customers saved an average of 14,000 Ft by switching insurers."',
  },
  "trust.source": { hu: "— Netrisk KGFB Index, 2024", en: "— Netrisk KGFB Index, 2024" },

  // Footer
  "footer.insurance": { hu: "Biztosítás", en: "Insurance" },
  "footer.kgfb": { hu: "Kötelező", en: "MTPL" },
  "footer.casco": { hu: "Casco", en: "Casco" },
  "footer.home": { hu: "Lakás", en: "Home" },
  "footer.travel": { hu: "Utas", en: "Travel" },
  "footer.accident": { hu: "Baleset", en: "Accident" },
  "footer.help": { hu: "Segítség", en: "Help" },
  "footer.faq": { hu: "GYIK", en: "FAQ" },
  "footer.contact": { hu: "Kapcsolat", en: "Contact" },
  "footer.privacy": { hu: "Adatvédelem", en: "Privacy" },
  "footer.terms": { hu: "Felhasználási feltételek", en: "Terms of use" },
  "footer.netrisk": { hu: "Netrisk", en: "Netrisk" },
  "footer.aboutus": { hu: "Rólunk", en: "About us" },
  "footer.career": { hu: "Karrier", en: "Careers" },
  "footer.blog": { hu: "Blog", en: "Blog" },
  "footer.app": { hu: "Mobilapp", en: "Mobile app" },
  "footer.copyright": { hu: "© 1994-2026 Netrisk Magyarország Kft. Minden jog fenntartva.", en: "© 1994-2026 Netrisk Hungary Ltd. All rights reserved." },
  "footer.demo": { hu: "AI Tanácsadó — Prototype Demo", en: "AI Advisor — Prototype Demo" },

  // Overlay
  "overlay.title": { hu: "Netrisk AI Tanácsadó", en: "Netrisk AI Advisor" },
  "overlay.online": { hu: "Online", en: "Online" },
  "overlay.newmsg": { hu: "Új üzenet", en: "New message" },
  "overlay.input": { hu: "Írjon üzenetet...", en: "Type a message..." },
  "overlay.powered": { hu: "Powered by Netrisk AI", en: "Powered by Netrisk AI" },

  // FAB
  "fab.label": { hu: "AI Tanácsadó", en: "AI Advisor" },

  // Presenter
  "presenter.label": { hu: "🎯 Presenter Mode", en: "🎯 Presenter Mode" },
  "presenter.flow1": { hu: "Flow 1: Visszatérő ügyfél", en: "Flow 1: Returning customer" },
  "presenter.flow2": { hu: "Flow 2: Új ügyfél", en: "Flow 2: New customer" },
  "presenter.flow3": { hu: "Flow 3: Tanácsadás", en: "Flow 3: Advisory" },

  // Switching card
  "switch.confirm": { hu: "Megkezdem a váltást?", en: "Start the switch?" },
  "switch.thankyou": {
    hu: "Köszönöm a bizalmát! A Netrisk csapata hamarosan felveszi Önnel a kapcsolatot emailben. 🎉 Van még kérdése?",
    en: "Thank you for your trust! The Netrisk team will contact you by email shortly. 🎉 Any other questions?",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("hu");

  const t = useCallback(
    (key: string) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] ?? entry.hu ?? key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
