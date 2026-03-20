import {
  profileA, profileB, profileC,
  getQuotesForProfile, formatEur,
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

export function getReturningFlow(_lang: Lang = 'en'): Flow {
  const all = getQuotesForProfile(profileA);
  const cheapestIdx = all.findIndex(q => q.insurerName !== 'KÖBE');
  const groupamaIdx = all.findIndex(q => q.insurerName === 'Groupama');
  const kobeIdx = all.findIndex(q => q.insurerName === 'KÖBE');

  const top3 = prepareQuotes(all, [
    {
      index: cheapestIdx,
      badge: { text: '#1 Cheapest', variant: 'cheapest' },
      assessment: 'The lowest price, but customer service gets mixed reviews.',
    },
    {
      index: groupamaIdx,
      badge: { text: '#2 Best value', variant: 'recommended' },
      assessment: 'Excellent value with roadside assistance and fast claims.',
    },
    {
      index: kobeIdx,
      badge: { text: '#3 Current', variant: 'current' },
      assessment: 'Your current insurer — the new calculation shows a lower premium.',
    },
  ]);

  const groupamaPrice = all[groupamaIdx].yearlyPrice;
  const savings = profileA.currentPrice! - groupamaPrice;

  return [
    {
      messages: [
        {
          parts: [{ type: 'text', content: `Hello! I can see you had MTPL insurance with KÖBE last year for your Suzuki SX4 S-Cross at ${formatEur(profileA.currentPrice!)}/year. Your renewal date is January 1st. 🔍 I've already compared all insurers' offers — here's what I found.` }],
          delay: 1500,
        },
        {
          parts: [
            { type: 'comparison', quotes: top3, recommended: 1 },
            { type: 'text', content: `I personally recommend Groupama: the price difference compared to ${top3[0].insurerName} is minimal, but the roadside assistance and claims quality are significantly better — especially important in Budapest given traffic conditions. Compared to your current KÖBE premium, you'd save ${formatEur(Math.abs(savings))} per year. What do you think?` },
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
}

export function getNewCustomerFlow(_lang: Lang = 'en'): Flow {
  const all = getQuotesForProfile(profileB);
  const kobeIdx = all.findIndex(q => q.insurerName === 'KÖBE');
  const genertelIdx = all.findIndex(q => q.insurerName === 'Genertel');
  const uniqaIdx = all.findIndex(q => q.insurerName === 'UNIQA');

  const top3 = prepareQuotes(all, [
    {
      index: kobeIdx,
      badge: { text: '#1 Cheapest', variant: 'cheapest' },
      assessment: 'The cheapest option, but digital services and customer support are weaker.',
    },
    {
      index: genertelIdx,
      badge: { text: '#2 Popular', variant: 'popular' },
      assessment: 'Good price with excellent online platform, but no roadside assistance.',
    },
    {
      index: uniqaIdx,
      badge: { text: '#3 Recommended', variant: 'recommended' },
      assessment: 'Competitive price with roadside assistance and great digital experience.',
    },
  ]);

  return [
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
            { type: 'text', content: `As a new driver, prices are higher, but there are differences between insurers. In your situation, UNIQA offers the best balance: competitive price (${formatEur(top3[2].yearlyPrice)}/year), good digital service, and roadside assistance in Debrecen. ${top3[0].insurerName} is cheaper, but customer service is only available online. What do you think?` },
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
}

export function getAdvisoryFlow(_lang: Lang = 'en'): Flow {
  const all = getQuotesForProfile(profileC);
  const cheapestIdx = 0;
  const groupamaIdx = all.findIndex(q => q.insurerName === 'Groupama');
  const allianzIdx = all.findIndex(q => q.insurerName === 'Allianz');

  const top3 = prepareQuotes(all, [
    {
      index: cheapestIdx,
      badge: { text: '#1 Cheapest', variant: 'cheapest' },
      assessment: 'The best price with basic services.',
    },
    {
      index: groupamaIdx,
      badge: { text: '#2 Best value', variant: 'recommended' },
      assessment: 'Good balance between price and service quality.',
    },
    {
      index: allianzIdx,
      badge: { text: '#3 Premium', variant: 'popular' },
      assessment: 'The best service package at a premium price.',
    },
  ]);

  const cheapestPrice = top3[0].yearlyPrice;
  const allianzPrice = top3[2].yearlyPrice;
  const diff = allianzPrice - cheapestPrice;

  return [
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
        parts: [{ type: 'text', content: `Great question! Allianz is indeed ${formatEur(diff)} more expensive than the cheapest offer. Here's why:\n\n1️⃣ **Claims quality** — Allianz has the best claims rating in the Hungarian market: faster processing, own repair network, and better courtesy car terms.\n\n2️⃣ **Roadside assistance** — 24/7 roadside assistance included in the base package, which most cheaper insurers only offer as an add-on.\n\n3️⃣ **Digital experience** — Allianz's app is among the best: online claims filing, real-time status tracking, digital green card.\n\nIn your situation (B06, 74 kW, Szeged), the question is: is it worth paying ~${formatEur(diff)} more per year for these? If you rarely drive and have low accident risk, probably not. If you commute daily, Allianz's extra protection is a sensible investment. 🤔 What matters more to you — price or service?` }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `Got it! Then I recommend Groupama: at ${formatEur(top3[1].yearlyPrice)}/year it's a good middle ground — you get roadside assistance and fast claims without paying the premium Allianz price. Shall I start the switch?` }],
        delay: 1200,
      }],
    },
  ];
}

export function getFlow(flowId: string, lang: Lang = 'en'): Flow {
  switch (flowId) {
    case 'returning': return getReturningFlow(lang);
    case 'new': return getNewCustomerFlow(lang);
    case 'advisory': return getAdvisoryFlow(lang);
    default: return getReturningFlow(lang);
  }
}
