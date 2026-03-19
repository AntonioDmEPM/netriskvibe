import {
  profileA, profileB, profileC,
  getQuotesForProfile, formatPrice, getInsurerKnowledge, marketStats,
  type QuoteData, type Profile,
} from './mockData';
import type { Lang } from './i18n';

export interface ScenarioStage {
  /** Structured UI parts to inject (comparison cards, switching cards, etc.) */
  structuredParts?: any[];
  /** Context hint for the AI about what to say at this stage */
  aiHint: string;
  /** Whether the AI should generate text for this stage */
  aiGenerate: boolean;
}

export interface ScenarioConfig {
  id: string;
  profile: Profile;
  quotes: QuoteData[];
  top3: QuoteData[];
  stages: ScenarioStage[];
  /** Full context object sent to the AI */
  context: Record<string, any>;
}

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

export function getScenarioConfig(flowId: string, lang: Lang): ScenarioConfig {
  switch (flowId) {
    case 'returning': return getReturningScenario(lang);
    case 'new': return getNewCustomerScenario(lang);
    case 'advisory': return getAdvisoryScenario(lang);
    default: return getReturningScenario(lang);
  }
}

function getReturningScenario(lang: Lang): ScenarioConfig {
  const all = getQuotesForProfile(profileA, lang);
  const cheapestIdx = all.findIndex(q => q.insurerName !== 'KÖBE');
  const groupamaIdx = all.findIndex(q => q.insurerName === 'Groupama');
  const kobeIdx = all.findIndex(q => q.insurerName === 'KÖBE');

  const top3 = prepareQuotes(all, [
    { index: cheapestIdx, badge: { text: lang === 'hu' ? '#1 Legolcsóbb' : '#1 Cheapest', variant: 'cheapest' }, assessment: '' },
    { index: groupamaIdx, badge: { text: lang === 'hu' ? '#2 Legjobb érték' : '#2 Best value', variant: 'recommended' }, assessment: '' },
    { index: kobeIdx, badge: { text: lang === 'hu' ? '#3 Jelenlegi' : '#3 Current', variant: 'current' }, assessment: '' },
  ]);

  const groupamaPrice = all[groupamaIdx].yearlyPrice;
  const savings = profileA.currentPrice! - groupamaPrice;

  const context = {
    scenario: 'returning_customer',
    customer: {
      name: 'Kovács Anna',
      vehicle: `${profileA.vehicle.year} ${profileA.vehicle.make} ${profileA.vehicle.model} ${profileA.vehicle.variant}`,
      vehiclePlate: profileA.vehicle.plate,
      vehiclePowerKw: profileA.vehicle.power_kw,
      vehicleValueHuf: profileA.vehicle.value_huf,
      currentInsurer: profileA.currentInsurer,
      currentPrice: profileA.currentPrice,
      bonusCategory: profileA.bonus,
      region: profileA.region,
      location: profileA.location,
      paymentFrequency: profileA.payment,
      paymentMethod: profileA.paymentMethod,
      anniversaryDate: profileA.anniversaryDate,
      isReturningCustomer: true,
      yearsAsNetriskCustomer: profileA.yearsAsCustomer,
    },
    topQuotes: top3.map(q => ({
      insurer: q.insurerName,
      yearlyPrice: q.yearlyPrice,
      badge: q.badge?.text,
      features: q.features,
      satisfaction: q.satisfaction,
      claimsSpeedDays: q.claimsSpeedDays,
      digitalRating: q.digitalRating,
      roadsideAssistance: q.roadsideAssistance,
    })),
    allInsurerKnowledge: getInsurerKnowledge(),
    marketStats,
    recommendedInsurer: 'Groupama',
    potentialSavings: savings,
  };

  return {
    id: 'returning',
    profile: profileA,
    quotes: all,
    top3,
    context,
    stages: [
      {
        aiHint: 'Greet the returning customer. Mention you can see their current policy (KÖBE, Suzuki SX4 S-Cross, 38,000 Ft/year, renewal Jan 1). Say you\'ve already compared all insurers. Be warm and proactive.',
        aiGenerate: true,
      },
      {
        structuredParts: [{ type: 'comparison', quotes: top3, recommended: 1 }],
        aiHint: `Present the comparison results. Recommend Groupama — explain the price vs service trade-off compared to the cheapest option (${top3[0].insurerName}). Mention savings of ${formatPrice(savings)} Ft vs current KÖBE premium. Ask for their opinion.`,
        aiGenerate: true,
      },
      {
        structuredParts: [{ type: 'switching', from: { name: 'KÖBE', price: profileA.currentPrice! }, to: { name: 'Groupama', price: groupamaPrice } }],
        aiHint: 'The user agreed to switch. Show enthusiasm. Explain that Netrisk handles everything — KÖBE cancellation and Groupama contract. They don\'t need to do anything. Ask if they want to proceed.',
        aiGenerate: true,
      },
      {
        structuredParts: [{ type: 'timeline', currentStep: 1, steps: [
          { label: lang === 'hu' ? 'Kalkuláció ✓' : 'Calculation ✓' },
          { label: lang === 'hu' ? 'Váltás indítva ✓' : 'Switch initiated ✓' },
          { label: lang === 'hu' ? 'Régi biztosítás felmondva' : 'Old policy cancelled' },
          { label: lang === 'hu' ? 'Új biztosítás indul jan. 1.' : 'New policy starts Jan 1' },
        ], footnote: lang === 'hu' ? 'A Netrisk értesíti Önt emailben minden lépésnél.' : 'Netrisk will notify you by email at each step.' }],
        aiHint: 'Confirm the switch is initiated. Mention email notifications for each step. Offer to monitor offers next year too. Ask if they have other questions.',
        aiGenerate: true,
      },
    ],
  };
}

function getNewCustomerScenario(lang: Lang): ScenarioConfig {
  const all = getQuotesForProfile(profileB, lang);
  const kobeIdx = all.findIndex(q => q.insurerName === 'KÖBE');
  const genertelIdx = all.findIndex(q => q.insurerName === 'Genertel');
  const uniqaIdx = all.findIndex(q => q.insurerName === 'UNIQA');

  const top3 = prepareQuotes(all, [
    { index: kobeIdx, badge: { text: lang === 'hu' ? '#1 Legolcsóbb' : '#1 Cheapest', variant: 'cheapest' }, assessment: '' },
    { index: genertelIdx, badge: { text: lang === 'hu' ? '#2 Népszerű' : '#2 Popular', variant: 'popular' }, assessment: '' },
    { index: uniqaIdx, badge: { text: lang === 'hu' ? '#3 Ajánlott' : '#3 Recommended', variant: 'recommended' }, assessment: '' },
  ]);

  const context = {
    scenario: 'new_customer',
    customer: {
      vehicle: `${profileB.vehicle.year} ${profileB.vehicle.make} ${profileB.vehicle.model} ${profileB.vehicle.variant}`,
      vehiclePlate: profileB.vehicle.plate,
      vehiclePowerKw: profileB.vehicle.power_kw,
      vehicleValueHuf: profileB.vehicle.value_huf,
      bonusCategory: profileB.bonus,
      region: profileB.region,
      location: profileB.location,
      paymentMethod: profileB.paymentMethod,
      isNewDriver: true,
    },
    topQuotes: top3.map(q => ({
      insurer: q.insurerName,
      yearlyPrice: q.yearlyPrice,
      badge: q.badge?.text,
      features: q.features,
      satisfaction: q.satisfaction,
      claimsSpeedDays: q.claimsSpeedDays,
      digitalRating: q.digitalRating,
      roadsideAssistance: q.roadsideAssistance,
    })),
    allInsurerKnowledge: getInsurerKnowledge(),
    marketStats,
    recommendedInsurer: 'UNIQA',
  };

  return {
    id: 'new',
    profile: profileB,
    quotes: all,
    top3,
    context,
    stages: [
      {
        aiHint: 'Greet a new customer. Introduce yourself as the Netrisk AI advisor. Ask for their license plate number to get started.',
        aiGenerate: true,
      },
      {
        aiHint: 'The user provided their plate. You found it\'s a 2018 VW Golf VII, 1.4 TSI (110 kW). Confirm the vehicle details and ask if they are the registered keeper.',
        aiGenerate: true,
      },
      {
        aiHint: 'Ask where they live — explain that premiums vary by region.',
        aiGenerate: true,
      },
      {
        aiHint: 'They said Debrecen. Ask about their bonus-malus category. Explain B10 = 10+ years accident-free, A00 = new driver.',
        aiGenerate: true,
      },
      {
        structuredParts: [{ type: 'comparison', quotes: top3, recommended: 2 }],
        aiHint: `They are A00 (new driver). You've compared all 8 insurers. Present results. Recommend UNIQA for best balance: competitive price (${formatPrice(top3[2].yearlyPrice)} Ft/year), good digital service, roadside assistance in Debrecen. Note ${top3[0].insurerName} is cheaper but online-only support. Ask opinion.`,
        aiGenerate: true,
      },
      {
        structuredParts: [{ type: 'switching', to: { name: 'UNIQA', price: top3[2].yearlyPrice } }],
        aiHint: 'User agreed. Explain the contract is done online in minutes. Netrisk handles all paperwork. Ask to start.',
        aiGenerate: true,
      },
      {
        structuredParts: [{ type: 'timeline', currentStep: 1, steps: [
          { label: lang === 'hu' ? 'Kalkuláció ✓' : 'Calculation ✓' },
          { label: lang === 'hu' ? 'Szerződés indítva ✓' : 'Contract initiated ✓' },
          { label: lang === 'hu' ? 'Dokumentumok aláírva' : 'Documents signed' },
          { label: lang === 'hu' ? 'Kötvény indul jan. 1.' : 'Policy starts Jan 1' },
        ], footnote: lang === 'hu' ? 'A Netrisk értesíti Önt emailben minden lépésnél.' : 'Netrisk will notify you by email at each step.' }],
        aiHint: 'Contract process started. You\'ll send details by email. Welcome them to UNIQA. Ask if they have other questions.',
        aiGenerate: true,
      },
    ],
  };
}

function getAdvisoryScenario(lang: Lang): ScenarioConfig {
  const all = getQuotesForProfile(profileC, lang);
  const cheapestIdx = 0;
  const groupamaIdx = all.findIndex(q => q.insurerName === 'Groupama');
  const allianzIdx = all.findIndex(q => q.insurerName === 'Allianz');

  const top3 = prepareQuotes(all, [
    { index: cheapestIdx, badge: { text: lang === 'hu' ? '#1 Legolcsóbb' : '#1 Cheapest', variant: 'cheapest' }, assessment: '' },
    { index: groupamaIdx, badge: { text: lang === 'hu' ? '#2 Legjobb érték' : '#2 Best value', variant: 'recommended' }, assessment: '' },
    { index: allianzIdx, badge: { text: lang === 'hu' ? '#3 Prémium' : '#3 Premium', variant: 'popular' }, assessment: '' },
  ]);

  const diff = top3[2].yearlyPrice - top3[0].yearlyPrice;

  const context = {
    scenario: 'advisory_deep_dive',
    customer: {
      vehicle: `${profileC.vehicle.year} ${profileC.vehicle.make} ${profileC.vehicle.model}`,
      bonusCategory: profileC.bonus,
      region: profileC.region,
    },
    topQuotes: top3.map(q => ({
      insurer: q.insurerName,
      yearlyPrice: q.yearlyPrice,
      badge: q.badge?.text,
      features: q.features,
      satisfaction: q.satisfaction,
    })),
    priceDifference: diff,
    recommendedInsurer: 'Groupama',
  };

  return {
    id: 'advisory',
    profile: profileC,
    quotes: all,
    top3,
    context,
    stages: [
      {
        structuredParts: [{ type: 'comparison', quotes: top3, recommended: 1 }],
        aiHint: `Present the top 3 offers for the Opel Astra (Szeged, B06). Invite questions about the offers.`,
        aiGenerate: true,
      },
      {
        aiHint: `The user asks why Allianz is more expensive. Give a detailed explanation: 1) Claims quality — best in Hungarian market, faster processing, own repair network, better courtesy car. 2) Roadside assistance — 24/7 included vs add-on for cheaper insurers. 3) Digital experience — best app, online claims, real-time tracking, digital green card. The price difference is ${formatPrice(diff)} Ft. Advise that daily commuters benefit from Allianz; occasional drivers may not need it. Ask what matters more — price or service.`,
        aiGenerate: true,
      },
      {
        aiHint: `User prefers balanced option. Recommend Groupama at ${formatPrice(top3[1].yearlyPrice)} Ft/year as a good middle ground — roadside assistance and fast claims without premium Allianz price. Ask if they want to start the switch.`,
        aiGenerate: true,
      },
    ],
  };
}
