import { createContext, useContext, useCallback, type ReactNode } from "react";

export type Lang = "en";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, string> = {
  // Nav
  "nav.insurance": "Insurance",
  "nav.bank": "Banking",
  "nav.knowledge": "Knowledge",
  "nav.about": "About us",
  "nav.login": "Log in",
  "nav.cta": "Get a quote",

  // Demo
  "demo.mode": "Demo mode:",
  "demo.new": "New visitor",
  "demo.returning": "Returning customer",

  // Hero - New visitor
  "hero.badge": "New! AI advisor",
  "hero.title1": "Your insurance advisor",
  "hero.title2": "that never sleeps",
  "hero.subtitle": "No forms to fill out. Just tell us what you need, and Netrisk AI will find the best offer — in minutes.",
  "hero.chip.kgfb": "MTPL insurance switch",
  "hero.chip.home": "Home insurance",
  "hero.chip.travel": "Travel insurance",

  // Hero placeholders
  "hero.placeholder.0": "Enter your license plate, or tell me how I can help...",
  "hero.placeholder.1": "ABC-123",
  "hero.placeholder.2": "How much does MTPL insurance cost?",
  "hero.placeholder.3": "Which is the best insurer?",
  "hero.placeholder.4": "I want to switch my insurance",

  // Hero - Returning
  "hero.returning.badge": "Returning customer",
  "hero.returning.title": "Welcome back! 👋",
  "hero.returning.subtitle.pre": "Your Suzuki SX4 S-Cross MTPL insurance expires January 1st. I've already compared offers — ",
  "hero.returning.subtitle.savings": "you can save €17/year.",
  "hero.returning.cta": "Show me the offers",
  "hero.returning.or": "or ask the advisor anything",
  "hero.returning.placeholder": "E.g. why is Allianz more expensive?",

  // Returning dashboard
  "dashboard.kgfb": "MTPL Insurance",
  "dashboard.expires": "Expires: Jan 1",
  "dashboard.recommended": "Recommended switch",
  "dashboard.savings": "Savings: €11",
  "dashboard.switch": "Switch →",

  // Hero illustration bubbles
  "hero.bubble.plate": "\u201CMy plate: ABC-123\u201D",
  "hero.bubble.savings": "\u201C€78/yr — 15% cheaper!\u201D",

  // Social proof
  "stats.contracts": "daily contracts",
  "stats.customers": "returning customers",
  "stats.partners": "insurer partners",
  "stats.years.suffix": " years",
  "stats.years.label": "serving you",

  // How it works
  "howit.title": "How does the Netrisk AI advisor work?",
  "howit.step1.title": "Tell us your needs",
  "howit.step1.desc": "No forms to fill. Just describe what you need — your plate number, your situation, or just a question.",
  "howit.step2.title": "AI compares",
  "howit.step2.desc": "The advisor compares all 22 insurers' offers in real time and picks the best for your situation.",
  "howit.step3.title": "One click, done",
  "howit.step3.desc": "Choose the offer, and Netrisk handles the switch — cancellation, new contract, all paperwork.",

  // Product grid
  "products.title": "How can we help?",
  "products.kgfb": "MTPL Insurance (KGFB)",
  "products.kgfb.desc": "Mandatory motor vehicle liability insurance comparison",
  "products.casco": "Casco",
  "products.casco.desc": "Comprehensive vehicle insurance",
  "products.home": "Home insurance",
  "products.home.desc": "Home protection, personalized",
  "products.travel": "Travel insurance",
  "products.travel.desc": "Travel insurance anywhere in the world",
  "products.loan": "Personal loan",
  "products.loan.desc": "The best loan offers in one place",
  "products.health": "Health fund",
  "products.health.desc": "Save on healthcare expenses",
  "products.start": "Start advisor →",
  "products.soon": "Coming soon!",

  // Before/After
  "ba.title": "The new era of insurance",
  "ba.subtitle": "Compare the old and the new way",
  "ba.old.label": "Traditional way",
  "ba.old.fields": "Fill 15-25 fields",
  "ba.old.time": "~8 min",
  "ba.new.label": "Netrisk AI advisor",
  "ba.new.fields": "3-4 questions, in conversation",
  "ba.new.time": "~2 min",
  "ba.form.rendszam": "License plate",
  "ba.form.birth": "Date of birth",
  "ba.form.address": "Address",
  "ba.form.bm": "Bonus-malus",
  "ba.form.payment": "Payment method",
  "ba.form.personal": "Personal data",
  "ba.chat.1": "Hello! What's your license plate?",
  "ba.chat.2": "ABC-123",
  "ba.chat.3": "2015 Opel Astra, correct? Where do you live?",
  "ba.chat.4": "In Szeged",

  // Trust partners
  "trust.title": "22 insurers, one advisor",
  "trust.quote": "\u201CLast year, our customers saved an average of €35 by switching insurers.\u201D",
  "trust.source": "— Netrisk KGFB Index, 2024",

  // Footer
  "footer.insurance": "Insurance",
  "footer.kgfb": "MTPL",
  "footer.casco": "Casco",
  "footer.home": "Home",
  "footer.travel": "Travel",
  "footer.accident": "Accident",
  "footer.help": "Help",
  "footer.faq": "FAQ",
  "footer.contact": "Contact",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms of use",
  "footer.netrisk": "Netrisk",
  "footer.aboutus": "About us",
  "footer.career": "Careers",
  "footer.blog": "Blog",
  "footer.app": "Mobile app",
  "footer.copyright": "© 1994-2026 Netrisk Hungary Ltd. All rights reserved.",
  "footer.demo": "AI Advisor — Prototype Demo",

  // Overlay
  "overlay.title": "Netrisk AI Advisor",
  "overlay.online": "Online",
  "overlay.newmsg": "New message",
  "overlay.input": "Type a message...",
  "overlay.powered": "Powered by Netrisk AI",

  // FAB
  "fab.label": "AI Advisor",

  // Presenter
  "presenter.label": "🎯 Presenter Mode",
  "presenter.flow1": "Flow 1: Returning customer",
  "presenter.flow2": "Flow 2: New customer",
  "presenter.flow3": "Flow 3: Advisory",

  // Switching card
  "switch.confirm": "Start the switch?",
  "switch.thankyou": "Thank you for your trust! The Netrisk team will contact you by email shortly. 🎉 Any other questions?",

  // Quote card
  "quote.claims": "Claims",
  "quote.satisfaction": "Satisfaction",
  "quote.select": "Select this →",

  // Comparison panel
  "comparison.title": "Recommended offers",

  // Switching card labels
  "switch.previous": "Previous",
  "switch.new": "New",
  "switch.savings": "Savings",
  "switch.confirmed": "✓ Netrisk handles it!",
  "switch.start": "Start switch →",

  // Timeline card
  "timeline.title": "Switching process",
  "timeline.today": "Today",
  "timeline.calc": "Calculation",
  "timeline.offer": "Offer ready",
  "timeline.compare": "Comparison",
  "timeline.deadline": "30-day deadline",
  "timeline.cancel": "Cancellation",
  "timeline.newstart": "New policy starts",
  "timeline.contract": "Contract",

  // Savings banner
  "savings.label": "Savings",

  // Insurance features
  "feature.fastclaims": "Fast claims",
  "feature.online": "Online service",
  "feature.roadside": "Roadside assist",
  "feature.highsat": "High satisfaction",

  // Profile data labels
  "data.estvalue": "Est. value",
  "data.insurer": "Insurer",
  "data.annual": "Annual",
  "data.location": "Location",
  "data.yr": "yr",
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang: Lang = "en";

  const t = useCallback(
    (key: string) => {
      return translations[key] ?? key;
    },
    []
  );

  const setLang = useCallback(() => {
    // No-op — English only
  }, []);

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
