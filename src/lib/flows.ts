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
    { index: cheapestIdx, badge: { text: '#1 Cheapest', variant: 'cheapest' }, assessment: 'The lowest price, but customer service receives mixed reviews.' },
    { index: groupamaIdx, badge: { text: '#2 Best Value', variant: 'recommended' }, assessment: 'Excellent value with roadside assistance and fast claims processing.' },
    { index: kobeIdx, badge: { text: '#3 Current', variant: 'current' }, assessment: 'Your current insurer — the new calculation shows a lower premium.' },
  ]);

  const groupamaPrice = all[groupamaIdx].yearlyPrice;
  const savings = profileA.currentPrice! - groupamaPrice;

  return [
    {
      messages: [
        {
          parts: [{ type: 'text', content: `Hello! I can see that last year you took out mandatory car insurance with KÖBE for your Suzuki SX4 S-Cross at 38,000 HUF/year. Your anniversary is January 1st, so you can switch until November 2nd. 🔍 I've already compared all insurer offers with your data — let me show you what I found.` }],
          delay: 1500,
        },
        {
          parts: [
            { type: 'comparison', quotes: top3, recommended: 1 },
            { type: 'text', content: `I personally recommend Groupama: the price difference compared to ${top3[0].insurerName} is minimal, but the roadside assistance and claims quality are significantly better — in Budapest, this is especially important given the traffic conditions. Compared to your current KÖBE premium, you'd save ${formatPrice(savings)} HUF/year. What do you think?` },
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
            { type: 'text', content: 'Great! The switching details are shown above. Netrisk will handle the KÖBE cancellation and the Groupama contract signing. You don\'t need to do anything — we\'ll notify you when everything is done. Shall I start the switch?' },
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
              { label: 'Quote ✓' },
              { label: 'Switch started ✓' },
              { label: 'Old policy cancelled' },
              { label: 'New policy starts Jan 1' },
            ], footnote: 'Netrisk will notify you via email at every step.' },
            { type: 'text', content: 'Done! I\'ve initiated the switching process. I\'ll send the details via email. 📧 I\'ll keep monitoring offers next year too — if a better option comes up, I\'ll let you know. Any other questions?' },
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
    { index: kobeIdx, badge: { text: '#1 Cheapest', variant: 'cheapest' }, assessment: 'The cheapest option, but digital services and customer support are weaker.' },
    { index: genertelIdx, badge: { text: '#2 Popular', variant: 'popular' }, assessment: 'Good price with an excellent online platform, but no roadside assistance.' },
    { index: uniqaIdx, badge: { text: '#3 Recommended', variant: 'recommended' }, assessment: 'Competitive price with roadside assistance and great digital experience.' },
  ]);

  return [
    {
      messages: [{
        parts: [{ type: 'text', content: 'Hello! I\'m your personal insurance advisor at Netrisk. I\'ll help you find the best mandatory car insurance for your vehicle. 🚗 First, let me ask about your car — could you provide the license plate number? This way I can automatically fill in most of the details.' }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Thank you! A 2018 Volkswagen Golf VII, 1.4 TSI (110 kW) — is that correct? 👍 And are you the registered owner?' }],
        delay: 1200,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Great! Where do you live? This is important because insurance premiums vary by region.' }],
        delay: 800,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: 'Debrecen, got it. Last question: which bonus-malus category are you in? If you don\'t know off the top of your head, that\'s fine — the most common categories are: B10 (10+ years accident-free), A00 (new driver or first insurance). If you have the notice from your previous insurer, that\'s the most accurate.' }],
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
            { type: 'text', content: `As a new driver, prices are higher, but there are differences between insurers. In your situation, UNIQA offers the best balance: competitive price (${formatPrice(top3[2].yearlyPrice)} HUF/year), good digital management and roadside assistance in Debrecen. ${top3[0].insurerName} is cheaper, but customer service is only available online. What do you think?` },
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
          { type: 'text', content: 'The contract signing is done online, it only takes a few minutes. Netrisk handles all the administration. Shall I start?' },
        ],
        delay: 1200,
      }],
    },
    {
      messages: [{
        parts: [
          { type: 'timeline', currentStep: 1, steps: [
            { label: 'Quote ✓' },
            { label: 'Contract started ✓' },
            { label: 'Documents signed' },
            { label: 'Policy active Jan 1' },
          ], footnote: 'Netrisk will notify you via email at every step.' },
          { type: 'text', content: 'All done! I\'ve initiated the contract process. I\'ll send the details and next steps via email. 📧 Welcome to UNIQA! Any other questions?' },
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
    { index: cheapestIdx, badge: { text: '#1 Cheapest', variant: 'cheapest' }, assessment: 'The best price with basic services.' },
    { index: groupamaIdx, badge: { text: '#2 Best Value', variant: 'recommended' }, assessment: 'Good balance between price and service quality.' },
    { index: allianzIdx, badge: { text: '#3 Premium', variant: 'popular' }, assessment: 'The best service package at a premium price.' },
  ]);

  const cheapestPrice = top3[0].yearlyPrice;
  const allianzPrice = top3[2].yearlyPrice;
  const diff = allianzPrice - cheapestPrice;

  return [
    {
      messages: [{
        parts: [
          { type: 'comparison', quotes: top3, recommended: 1 },
          { type: 'text', content: 'Here\'s your comparison for the Opel Astra (Szeged, B06). Do you have any questions about the offers?' },
        ],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `Great question! Allianz is indeed ${formatPrice(diff)} HUF more expensive than the cheapest offer. There are several reasons for this:\n\n1️⃣ **Claims quality** — Allianz receives the best claims processing rating in the Hungarian market: faster handling, their own service network, and better replacement car terms.\n\n2️⃣ **Roadside assistance** — 24/7 roadside assistance is included in the base package, which most cheaper insurers only offer as an add-on.\n\n3️⃣ **Digital experience** — Allianz's app is among the best: online claims filing, real-time status tracking, and digital green card.\n\nIn your situation (B06, 74 kW, Szeged) the question is: is it worth paying ~${formatPrice(diff)} HUF/year more for these? If you drive rarely and have a low accident risk, probably not. If you commute daily, Allianz's extra protection is a sensible investment. 🤔 What do you think — is price or service more important to you?` }],
        delay: 1500,
      }],
    },
    {
      messages: [{
        parts: [{ type: 'text', content: `I understand! Based on that, I recommend Groupama: the ${formatPrice(top3[1].yearlyPrice)} HUF/year premium represents a good middle ground — you get roadside assistance and fast claims processing without paying the premium Allianz price. Would you like me to start the switch?` }],
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
