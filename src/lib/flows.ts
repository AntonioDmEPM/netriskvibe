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
    { index: cheapestIdx, badge: { text: '#1 Legolcsóbb', variant: 'cheapest' }, assessment: 'A legkedvezőbb ár, de az ügyfélszolgálat vegyes értékeléseket kap.' },
    { index: groupamaIdx, badge: { text: '#2 Legjobb érték', variant: 'recommended' }, assessment: 'Kiváló ár-érték arány asszisztenciával és gyors kárrendezéssel.' },
    { index: kobeIdx, badge: { text: '#3 Jelenlegi', variant: 'current' }, assessment: 'Az Ön jelenlegi biztosítója — az új kalkuláció alacsonyabb díjat mutat.' },
  ]);

  const groupamaPrice = all[groupamaIdx].yearlyPrice;
  const savings = profileA.currentPrice! - groupamaPrice;

  return [
    {
      messages: [
        {
          parts: [{ type: 'text', content: `Üdvözlöm! Látom, hogy tavaly a KÖBE-nél kötött kötelező biztosítást a Suzuki SX4 S-Cross-ra, évi 38 000 Ft-ért. Az évfordulója január 1-jén lesz, tehát november 2-ig válthat. 🔍 Már összehasonlítottam az összes biztosító ajánlatát az Ön adataival — mutatom, mit találtam.` }],
          delay: 1500,
        },
        {
          parts: [
            { type: 'comparison', quotes: top3, recommended: 1 },
            { type: 'text', content: `Személyesen a Groupama-t javaslom: az árkülönbség a ${top3[0].insurerName}-hoz képest minimális, de az asszisztencia-szolgáltatás és a kárrendezés minősége lényegesen jobb — Budapesten ez különösen fontos a forgalmi helyzet miatt. A jelenlegi KÖBE díjához képest évi ${formatPrice(savings)} Ft-ot takarít meg. Mi a véleménye?` },
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
            { type: 'text', content: 'Rendben! A váltás részletei fent láthatók. A Netrisk intézi a KÖBE felmondását és a Groupama szerződés megkötését. Semmit nem kell tennie — értesítjük, ha minden kész. Megkezdem a váltást?' },
          ],
          delay: 1200,
        },
      ],
    },
    {
      messages: [
        {
          parts: [{ type: 'text', content: 'Kész! A váltási folyamatot elindítottam. Emailben küldöm a részleteket. 📧 Jövőre is figyelem az ajánlatokat — ha jobb lehetőség adódik, szólok. Van még kérdése?' }],
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
    { index: kobeIdx, badge: { text: '#1 Legolcsóbb', variant: 'cheapest' }, assessment: 'A legolcsóbb, de a digitális kiszolgálás és ügyfélszolgálat gyengébb.' },
    { index: genertelIdx, badge: { text: '#2 Népszerű', variant: 'popular' }, assessment: 'Jó ár kiváló online felülettel, de nincs asszisztencia.' },
    { index: uniqaIdx, badge: { text: '#3 Ajánlott', variant: 'recommended' }, assessment: 'Versenyképes ár, asszisztencia és jó digitális élmény.' },
  ]);

  return [
    {
      messages: [{
        parts: [{ type: 'text', content: 'Üdvözlöm! A Netrisk személyes biztosítási tanácsadója vagyok. Segítek megtalálni a legjobb kötelező biztosítást az autójára. 🚗 Először az autójáról kérdeznék — meg tudná adni a rendszámot? Így a legtöbb adatot automatikusan ki tudom tölteni.' }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Köszönöm! Egy 2018-as Volkswagen Golf VII, 1.4 TSI (110 kW) — stimmel? 👍 És Ön az üzembentartó?' }],
        delay: 1200,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Remek! Hol lakik? Ez azért fontos, mert a biztosítási díj régiónként eltérő.' }],
        delay: 800,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Debrecen, rendben. Utolsó kérdés: melyik bonus-malus kategóriába tartozik? Ha nem tudja fejből, az sem baj — a leggyakoribb kategóriák: B10 (10+ éve balesetmentes), A00 (új sofőr vagy első biztosítás). Ha az előző biztosítója értesítéséből tudja, az a legpontosabb.' }],
        delay: 1000,
      }],
    },
    {
      messages: [
        {
          parts: [{ type: 'text', content: 'Értem, A00 — első biztosítás vagy friss sofőr. Most összehasonlítom mind a 8 biztosító ajánlatát...' }],
          delay: 1000,
        },
        {
          parts: [
            { type: 'comparison', quotes: top3, recommended: 2 },
            { type: 'text', content: `Új sofőrként az árak magasabbak, de van különbség a biztosítók között. Az Ön helyzetében az UNIQA kínálja a legjobb egyensúlyt: versenyképes ár (${formatPrice(top3[2].yearlyPrice)} Ft/év), jó digitális ügyintézés és asszisztencia-szolgáltatás Debrecenben. A ${top3[0].insurerName} olcsóbb, de az ügyfélszolgálat csak online elérhető. Mit gondol?` },
          ],
          delay: 2000,
        },
      ],
    },
    {
      messages: [{
        parts: [
          { type: 'switching', to: { name: 'UNIQA', price: top3[2].yearlyPrice } },
          { type: 'timeline', currentStep: 1 },
          { type: 'text', content: 'A szerződéskötés online zajlik, néhány perc az egész. A Netrisk intézi a teljes adminisztrációt. Indítsam?' },
        ],
        delay: 1200,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Elkészült! A szerződéskötési folyamatot elindítottam. Emailben küldöm a részleteket és a következő lépéseket. 📧 Üdvözöljük a UNIQA ügyfelei között! Van még kérdése?' }],
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
    { index: cheapestIdx, badge: { text: '#1 Legolcsóbb', variant: 'cheapest' }, assessment: 'A legkedvezőbb ár alapszintű szolgáltatásokkal.' },
    { index: groupamaIdx, badge: { text: '#2 Legjobb érték', variant: 'recommended' }, assessment: 'Jó egyensúly ár és szolgáltatás között.' },
    { index: allianzIdx, badge: { text: '#3 Prémium', variant: 'popular' }, assessment: 'A legjobb szolgáltatáscsomag, prémium áron.' },
  ]);

  const cheapestPrice = top3[0].yearlyPrice;
  const allianzPrice = top3[2].yearlyPrice;
  const diff = allianzPrice - cheapestPrice;

  return [
    {
      messages: [{
        parts: [
          { type: 'comparison', quotes: top3, recommended: 1 },
          { type: 'text', content: 'Íme az Ön összehasonlítása az Opel Astra-ra (Szeged, B06). Van kérdése az ajánlatokkal kapcsolatban?' },
        ],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `Jó kérdés! Az Allianz valóban ${formatPrice(diff)} Ft-tal drágább, mint a legolcsóbb ajánlat. Ennek több oka van:\n\n1️⃣ **Kárrendezési minőség** — Az Allianz a magyar piac legjobb kárrendezési értékelését kapja: gyorsabb ügyintézés, saját szervízhálózat, és kedvezőbb helyettesítő autó feltételek.\n\n2️⃣ **Asszisztencia** — Az alapcsomagban benne van az éjjel-nappali közúti segítségnyújtás, amit a legtöbb olcsóbb biztosító csak kiegészítőként kínál.\n\n3️⃣ **Digitális élmény** — Az Allianz applikációja a legjobbak között van: online kárbejelentés, valós idejű státuszkövetés, és digitális zöldkártya.\n\nAz Ön helyzetében (B06, 74 kW, Szeged) a kérdés: megéri-e évi ~${formatPrice(diff)} Ft-ot fizetni ezekért? Ha ritkán vezet és alacsony a kárgyakoriság kockázata, valószínűleg nem. Ha napi szinten ingázik, az Allianz extra védelme értelmes befektetés. 🤔 Mit gondol — inkább az ár vagy a szolgáltatás a fontosabb?` }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `Értem! Ennek alapján a Groupama-t javaslom: a ${formatPrice(top3[1].yearlyPrice)} Ft/év-es díj jó középutat képvisel — megkapja az asszisztenciát és a gyors kárrendezést, anélkül hogy a prémium Allianz árat fizetné. Szeretné, ha elindítanám a váltást?` }],
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
