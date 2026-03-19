import {
  profileA, profileB, profileC,
  getQuotesForProfile, formatPrice,
  type QuoteData,
} from './mockData';
import type { MessagePart } from '@/components/advisor/ChatMessage';

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

export function getReturningFlow(): Flow {
  const all = getQuotesForProfile(profileA);
  const cheapestIdx = all.findIndex(q => q.insurerName !== 'KÖBE');
  const groupamaIdx = all.findIndex(q => q.insurerName === 'Groupama');
  const kobeIdx = all.findIndex(q => q.insurerName === 'KÖBE');

  const top3 = prepareQuotes(all, [
    { index: cheapestIdx, badge: { text: '#1 Legolcsóbb', variant: 'cheapest' }, assessment: 'A legalacsonyabb ár, de az ügyfélszolgálat vegyes értékeléseket kap.' },
    { index: groupamaIdx, badge: { text: '#2 Legjobb érték', variant: 'recommended' }, assessment: 'Kiváló érték asszisztenciával és gyors kárrendezéssel.' },
    { index: kobeIdx, badge: { text: '#3 Jelenlegi', variant: 'current' }, assessment: 'A jelenlegi biztosítója — az új kalkuláció alacsonyabb díjat mutat.' },
  ]);

  const groupamaPrice = all[groupamaIdx].yearlyPrice;
  const savings = profileA.currentPrice! - groupamaPrice;

  return [
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
}

export function getNewCustomerFlow(): Flow {
  const all = getQuotesForProfile(profileB);
  const kobeIdx = all.findIndex(q => q.insurerName === 'KÖBE');
  const genertelIdx = all.findIndex(q => q.insurerName === 'Genertel');
  const uniqaIdx = all.findIndex(q => q.insurerName === 'UNIQA');

  const top3 = prepareQuotes(all, [
    { index: kobeIdx, badge: { text: '#1 Legolcsóbb', variant: 'cheapest' }, assessment: 'A legolcsóbb opció, de a digitális szolgáltatások és az ügyfélszolgálat gyengébb.' },
    { index: genertelIdx, badge: { text: '#2 Népszerű', variant: 'popular' }, assessment: 'Jó ár kiváló online platformmal, de nincs asszisztencia.' },
    { index: uniqaIdx, badge: { text: '#3 Ajánlott', variant: 'recommended' }, assessment: 'Versenyképes ár asszisztenciával és remek digitális élménnyel.' },
  ]);

  return [
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
}

export function getAdvisoryFlow(): Flow {
  const all = getQuotesForProfile(profileC);
  const cheapestIdx = 0;
  const groupamaIdx = all.findIndex(q => q.insurerName === 'Groupama');
  const allianzIdx = all.findIndex(q => q.insurerName === 'Allianz');

  const top3 = prepareQuotes(all, [
    { index: cheapestIdx, badge: { text: '#1 Legolcsóbb', variant: 'cheapest' }, assessment: 'A legjobb ár alapszolgáltatásokkal.' },
    { index: groupamaIdx, badge: { text: '#2 Legjobb érték', variant: 'recommended' }, assessment: 'Jó egyensúly az ár és a szolgáltatásminőség között.' },
    { index: allianzIdx, badge: { text: '#3 Prémium', variant: 'popular' }, assessment: 'A legjobb szolgáltatáscsomag prémium áron.' },
  ]);

  const cheapestPrice = top3[0].yearlyPrice;
  const allianzPrice = top3[2].yearlyPrice;
  const diff = allianzPrice - cheapestPrice;

  return [
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
}

export function getFlow(id: string): Flow {
  switch (id) {
    case 'returning': return getReturningFlow();
    case 'new': return getNewCustomerFlow();
    case 'advisory': return getAdvisoryFlow();
    default: return getReturningFlow();
  }
}
