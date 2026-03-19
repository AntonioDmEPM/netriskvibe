import {
  profileA, profileB, profileC,
  getQuotesForProfile, formatPrice,
  type QuoteData,
} from './mockData';
import type { MessagePart } from '@/components/advisor/ChatMessage';
import type { Lang } from './i18n';

export interface AgentMessage {
  parts: MessagePart[];
  delay?: number;
}

export type AgentTurn = { messages: AgentMessage[] };
export type Flow = AgentTurn[];

let _id = 0;
export function genId() { return `msg-${++_id}-${Date.now()}`; }

function prepareQuotes(
  allQuotes: QuoteData[],
  selections: { index: number; badge: { text: string; variant: 'cheapest' | 'recommended' | 'current' | 'popular' }; assessment: string }[],
): QuoteData[] {
  return selections.map((s) => ({
    ...allQuotes[s.index],
    badge: s.badge,
    assessment: s.assessment,
  }));
}

export function getReturningFlow(lang: Lang = 'hu'): Flow {
  const all = getQuotesForProfile(profileA, lang);
  const cheapestIdx = all.findIndex(q => q.insurerName !== 'KÖBE');
  const groupamaIdx = all.findIndex(q => q.insurerName === 'Groupama');
  const kobeIdx = all.findIndex(q => q.insurerName === 'KÖBE');

  const top3 = prepareQuotes(all, [
    {
      index: cheapestIdx,
      badge: { text: lang === 'hu' ? '#1 Legolcsóbb' : '#1 Cheapest', variant: 'cheapest' },
      assessment: lang === 'hu'
        ? 'A legalacsonyabb ár, de az ügyfélszolgálat vegyes értékeléseket kap.'
        : 'The lowest price, but customer service gets mixed reviews.',
    },
    {
      index: groupamaIdx,
      badge: { text: lang === 'hu' ? '#2 Legjobb érték' : '#2 Best value', variant: 'recommended' },
      assessment: lang === 'hu'
        ? 'Kiváló érték asszisztenciával és gyors kárrendezéssel.'
        : 'Excellent value with roadside assistance and fast claims.',
    },
    {
      index: kobeIdx,
      badge: { text: lang === 'hu' ? '#3 Jelenlegi' : '#3 Current', variant: 'current' },
      assessment: lang === 'hu'
        ? 'A jelenlegi biztosítója — az új kalkuláció alacsonyabb díjat mutat.'
        : 'Your current insurer — the new calculation shows a lower premium.',
    },
  ]);

  const groupamaPrice = all[groupamaIdx].yearlyPrice;
  const savings = profileA.currentPrice! - groupamaPrice;

  const hu: Flow = [
    {
      messages: [
        {
          parts: [{ type: 'text', content: `Üdvözlöm! Látom, hogy tavaly a KÖBE-nél kötött kötelező biztosítást a Suzuki SX4 S-Cross-ra, évi 38 000 Ft-ért. Az évfordulója január 1-jén lesz. 🔍 Már összehasonlítottam az összes biztosító ajánlatát — mutatom, mit találtam.` }],
          delay: 1500,
        },
        {
          parts: [
            { type: 'comparison', quotes: top3, recommended: 1 },
            { type: 'text', content: `Személyesen a Groupama-t javaslom: az árkülönbség a ${top3[0].insurerName}-hez képest minimális, de az asszisztencia és a kárrendezés minősége lényegesen jobb — Budapesten ez a forgalmi viszonyok miatt különösen fontos. A jelenlegi KÖBE díjához képest ${formatPrice(savings)} Ft-ot spórolna évente. Mi a véleménye?` },
          ],
          delay: 1200,
        },
      ],
    },
    {
      messages: [
        {
          parts: [
            { type: 'switching', from: { name: 'KÖBE', price: profileA.currentPrice! }, to: { name: 'Groupama', price: groupamaPrice } },
            { type: 'text', content: 'Nagyszerű! A Netrisk intézi a KÖBE felmondását és a Groupama szerződés megkötését. Önnek semmit nem kell tennie — értesítjük, ha minden kész. Megkezdem a váltást?' },
          ],
          delay: 1200,
        },
      ],
    },
    {
      messages: [
        {
          parts: [
            { type: 'timeline', currentStep: 1, steps: [
              { label: 'Kalkuláció ✓' },
              { label: 'Váltás indítva ✓' },
              { label: 'Régi biztosítás felmondva' },
              { label: 'Új biztosítás indul jan. 1.' },
            ], footnote: 'A Netrisk értesíti Önt emailben minden lépésnél.' },
            { type: 'text', content: 'Kész! A váltási folyamatot elindítottam. A részleteket emailben küldöm. 📧 Jövőre is figyelni fogom az ajánlatokat — ha jobb lehetőség adódik, szólok. Van más kérdése?' },
          ],
          delay: 800,
        },
      ],
    },
  ];

  const en: Flow = [
    {
      messages: [
        {
          parts: [{ type: 'text', content: `Hello! I can see you had MTPL insurance with KÖBE last year for your Suzuki SX4 S-Cross at 38,000 Ft/year. Your renewal date is January 1st. 🔍 I've already compared all insurers' offers — here's what I found.` }],
          delay: 1500,
        },
        {
          parts: [
            { type: 'comparison', quotes: top3, recommended: 1 },
            { type: 'text', content: `I personally recommend Groupama: the price difference compared to ${top3[0].insurerName} is minimal, but the roadside assistance and claims quality are significantly better — especially important in Budapest given traffic conditions. Compared to your current KÖBE premium, you'd save ${formatPrice(savings)} Ft per year. What do you think?` },
          ],
          delay: 1200,
        },
      ],
    },
    {
      messages: [
        {
          parts: [
            { type: 'switching', from: { name: 'KÖBE', price: profileA.currentPrice! }, to: { name: 'Groupama', price: groupamaPrice } },
            { type: 'text', content: 'Great! Netrisk will handle the KÖBE cancellation and the new Groupama contract. You don\'t need to do anything — we\'ll notify you when everything is done. Shall I start the switch?' },
          ],
          delay: 1200,
        },
      ],
    },
    {
      messages: [
        {
          parts: [
            { type: 'timeline', currentStep: 1, steps: [
              { label: 'Calculation ✓' },
              { label: 'Switch initiated ✓' },
              { label: 'Old policy cancelled' },
              { label: 'New policy starts Jan 1' },
            ], footnote: 'Netrisk will notify you by email at each step.' },
            { type: 'text', content: 'Done! I\'ve started the switching process. I\'ll send the details by email. 📧 I\'ll keep monitoring offers next year too — if a better option comes up, I\'ll let you know. Any other questions?' },
          ],
          delay: 800,
        },
      ],
    },
  ];

  return lang === 'en' ? en : hu;
}

export function getNewCustomerFlow(lang: Lang = 'hu'): Flow {
  const all = getQuotesForProfile(profileB, lang);
  const kobeIdx = all.findIndex(q => q.insurerName === 'KÖBE');
  const genertelIdx = all.findIndex(q => q.insurerName === 'Genertel');
  const uniqaIdx = all.findIndex(q => q.insurerName === 'UNIQA');

  const top3 = prepareQuotes(all, [
    {
      index: kobeIdx,
      badge: { text: lang === 'hu' ? '#1 Legolcsóbb' : '#1 Cheapest', variant: 'cheapest' },
      assessment: lang === 'hu'
        ? 'A legolcsóbb opció, de a digitális szolgáltatások és az ügyfélszolgálat gyengébb.'
        : 'The cheapest option, but digital services and customer support are weaker.',
    },
    {
      index: genertelIdx,
      badge: { text: lang === 'hu' ? '#2 Népszerű' : '#2 Popular', variant: 'popular' },
      assessment: lang === 'hu'
        ? 'Jó ár kiváló online platformmal, de nincs asszisztencia.'
        : 'Good price with excellent online platform, but no roadside assistance.',
    },
    {
      index: uniqaIdx,
      badge: { text: lang === 'hu' ? '#3 Ajánlott' : '#3 Recommended', variant: 'recommended' },
      assessment: lang === 'hu'
        ? 'Versenyképes ár asszisztenciával és remek digitális élménnyel.'
        : 'Competitive price with roadside assistance and great digital experience.',
    },
  ]);

  const hu: Flow = [
    {
      messages: [{
        parts: [{ type: 'text', content: 'Üdvözlöm! A Netrisk AI tanácsadója vagyok. Segítek megtalálni a legjobb kötelező biztosítást. 🚗 Meg tudná adni a rendszámot?' }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Köszönöm! Egy 2018-as Volkswagen Golf VII, 1.4 TSI (110 kW) — stimmel? 👍 Ön az üzembentartó?' }],
        delay: 1200,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Hol lakik? Ez azért fontos, mert a díj régiónként eltérő.' }],
        delay: 800,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Debrecen, rendben. Melyik bonus-malus kategóriába tartozik? A leggyakoribb: B10 (10+ éve balesetmentes) vagy A00 (új sofőr). Ha van a korábbi biztosítójától értesítő, az a legpontosabb.' }],
        delay: 1000,
      }],
    },
    {
      messages: [
        {
          parts: [{ type: 'text', content: 'Értem, A00 — első biztosítás vagy új sofőr. Most összehasonlítom mind a 8 biztosító ajánlatát...' }],
          delay: 1000,
        },
        {
          parts: [
            { type: 'comparison', quotes: top3, recommended: 2 },
            { type: 'text', content: `Új sofőrként az árak magasabbak, de a biztosítók között van különbség. Az Ön helyzetében az UNIQA kínálja a legjobb egyensúlyt: versenyképes ár (${formatPrice(top3[2].yearlyPrice)} Ft/év), jó digitális ügyintézés és asszisztencia Debrecenben. A ${top3[0].insurerName} olcsóbb, de az ügyfélszolgálat csak online érhető el. Mi a véleménye?` },
          ],
          delay: 2000,
        },
      ],
    },
    {
      messages: [{
        parts: [
          { type: 'switching', to: { name: 'UNIQA', price: top3[2].yearlyPrice } },
          { type: 'text', content: 'A szerződéskötés online történik, mindössze pár percet vesz igénybe. A Netrisk intéz minden adminisztrációt. Indítsam?' },
        ],
        delay: 1200,
      }],
    },
    {
      messages: [{
        parts: [
          { type: 'timeline', currentStep: 1, steps: [
            { label: 'Kalkuláció ✓' },
            { label: 'Szerződés indítva ✓' },
            { label: 'Dokumentumok aláírva' },
            { label: 'Kötvény indul jan. 1.' },
          ], footnote: 'A Netrisk értesíti Önt emailben minden lépésnél.' },
          { type: 'text', content: 'Minden kész! A szerződési folyamatot elindítottam. A részleteket és a következő lépéseket emailben küldöm. 📧 Üdvözöljük az UNIQA-nál! Van más kérdése?' },
        ],
        delay: 800,
      }],
    },
  ];

  const en: Flow = [
    {
      messages: [{
        parts: [{ type: 'text', content: 'Hello! I\'m the Netrisk AI advisor. I\'ll help you find the best MTPL insurance. 🚗 Could you give me your license plate number?' }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Thank you! A 2018 Volkswagen Golf VII, 1.4 TSI (110 kW) — correct? 👍 Are you the registered keeper?' }],
        delay: 1200,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Where do you live? This matters because premiums vary by region.' }],
        delay: 800,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Debrecen, got it. What\'s your bonus-malus category? The most common: B10 (10+ years accident-free) or A00 (new driver). If you have a notice from your previous insurer, that\'s the most accurate.' }],
        delay: 1000,
      }],
    },
    {
      messages: [
        {
          parts: [{ type: 'text', content: 'I see, A00 — first insurance or new driver. Let me compare all 8 insurers\' offers now...' }],
          delay: 1000,
        },
        {
          parts: [
            { type: 'comparison', quotes: top3, recommended: 2 },
            { type: 'text', content: `As a new driver, prices are higher, but there are differences between insurers. In your situation, UNIQA offers the best balance: competitive price (${formatPrice(top3[2].yearlyPrice)} Ft/year), good digital service, and roadside assistance in Debrecen. ${top3[0].insurerName} is cheaper, but customer service is only available online. What do you think?` },
          ],
          delay: 2000,
        },
      ],
    },
    {
      messages: [{
        parts: [
          { type: 'switching', to: { name: 'UNIQA', price: top3[2].yearlyPrice } },
          { type: 'text', content: 'The contract is done online and takes just a few minutes. Netrisk handles all the paperwork. Shall I start?' },
        ],
        delay: 1200,
      }],
    },
    {
      messages: [{
        parts: [
          { type: 'timeline', currentStep: 1, steps: [
            { label: 'Calculation ✓' },
            { label: 'Contract initiated ✓' },
            { label: 'Documents signed' },
            { label: 'Policy starts Jan 1' },
          ], footnote: 'Netrisk will notify you by email at each step.' },
          { type: 'text', content: 'All done! I\'ve started the contract process. I\'ll send the details and next steps by email. 📧 Welcome to UNIQA! Any other questions?' },
        ],
        delay: 800,
      }],
    },
  ];

  return lang === 'en' ? en : hu;
}

export function getAdvisoryFlow(lang: Lang = 'hu'): Flow {
  const all = getQuotesForProfile(profileC, lang);
  const cheapestIdx = 0;
  const groupamaIdx = all.findIndex(q => q.insurerName === 'Groupama');
  const allianzIdx = all.findIndex(q => q.insurerName === 'Allianz');

  const top3 = prepareQuotes(all, [
    {
      index: cheapestIdx,
      badge: { text: lang === 'hu' ? '#1 Legolcsóbb' : '#1 Cheapest', variant: 'cheapest' },
      assessment: lang === 'hu'
        ? 'A legjobb ár alapszolgáltatásokkal.'
        : 'The best price with basic services.',
    },
    {
      index: groupamaIdx,
      badge: { text: lang === 'hu' ? '#2 Legjobb érték' : '#2 Best value', variant: 'recommended' },
      assessment: lang === 'hu'
        ? 'Jó egyensúly az ár és a szolgáltatásminőség között.'
        : 'Good balance between price and service quality.',
    },
    {
      index: allianzIdx,
      badge: { text: lang === 'hu' ? '#3 Prémium' : '#3 Premium', variant: 'popular' },
      assessment: lang === 'hu'
        ? 'A legjobb szolgáltatáscsomag prémium áron.'
        : 'The best service package at a premium price.',
    },
  ]);

  const cheapestPrice = top3[0].yearlyPrice;
  const allianzPrice = top3[2].yearlyPrice;
  const diff = allianzPrice - cheapestPrice;

  const hu: Flow = [
    {
      messages: [{
        parts: [
          { type: 'comparison', quotes: top3, recommended: 1 },
          { type: 'text', content: 'Itt a 3 legjobb ajánlat az Opel Astra-ra (Szeged, B06). Van kérdése az ajánlatokkal kapcsolatban?' },
        ],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `Remek kérdés! Az Allianz valóban ${formatPrice(diff)} Ft-tal drágább, mint a legolcsóbb ajánlat. Ennek több oka van:\n\n1️⃣ **Kárrendezés minősége** — Az Allianz a magyar piacon a legjobb kárrendezési értékelést kapja: gyorsabb ügyintézés, saját szervizháló és jobb csereautó feltételek.\n\n2️⃣ **Asszisztencia** — 0-24 közúti segélyszolgálat az alapcsomagban, amit a legtöbb olcsóbb biztosító csak kiegészítőként kínál.\n\n3️⃣ **Digitális élmény** — Az Allianz applikációja a legjobbak közé tartozik: online kárbejelentés, valós idejű állapotkövetés, digitális zöldkártya.\n\nAz Ön helyzetében (B06, 74 kW, Szeged) a kérdés: megéri-e ~${formatPrice(diff)} Ft-tal többet fizetni évente ezekért? Ha ritkán autózik és alacsony a baleseti kockázata, valószínűleg nem. Ha naponta ingázik, az Allianz extra védelme ésszerű befektetés. 🤔 Mi a fontosabb Önnek — az ár vagy a szolgáltatás?` }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `Értem! Akkor a Groupama-t javaslom: a ${formatPrice(top3[1].yearlyPrice)} Ft/év díj jó középutat jelent — asszisztenciát és gyors kárrendezést kap anélkül, hogy a prémium Allianz árat fizetné. Megkezdem a váltást?` }],
        delay: 1200,
      }],
    },
  ];

  const en: Flow = [
    {
      messages: [{
        parts: [
          { type: 'comparison', quotes: top3, recommended: 1 },
          { type: 'text', content: 'Here are the top 3 offers for the Opel Astra (Szeged, B06). Any questions about the offers?' },
        ],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `Great question! Allianz is indeed ${formatPrice(diff)} Ft more expensive than the cheapest offer. Here's why:\n\n1️⃣ **Claims quality** — Allianz has the best claims rating in the Hungarian market: faster processing, own repair network, and better courtesy car terms.\n\n2️⃣ **Roadside assistance** — 24/7 roadside assistance included in the base package, which most cheaper insurers only offer as an add-on.\n\n3️⃣ **Digital experience** — Allianz's app is among the best: online claims filing, real-time status tracking, digital green card.\n\nIn your situation (B06, 74 kW, Szeged), the question is: is it worth paying ~${formatPrice(diff)} Ft more per year for these? If you rarely drive and have low accident risk, probably not. If you commute daily, Allianz's extra protection is a sensible investment. 🤔 What matters more to you — price or service?` }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `Got it! Then I recommend Groupama: at ${formatPrice(top3[1].yearlyPrice)} Ft/year it's a good middle ground — you get roadside assistance and fast claims without paying the premium Allianz price. Shall I start the switch?` }],
        delay: 1200,
      }],
    },
  ];

  return lang === 'en' ? en : hu;
}

export function getFlow(id: string, lang: Lang = 'hu'): Flow {
  switch (id) {
    case 'returning': return getReturningFlow(lang);
    case 'new': return getNewCustomerFlow(lang);
    case 'advisory': return getAdvisoryFlow(lang);
    default: return getReturningFlow(lang);
  }
}
