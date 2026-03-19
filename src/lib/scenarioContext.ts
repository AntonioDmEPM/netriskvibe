import {
  profileA, profileB, profileC,
  getQuotesForProfile, getInsurerKnowledge, marketStats,
  type QuoteData, type Profile,
} from './mockData';
import type { Lang } from './i18n';

export interface ScenarioConfig {
  id: string;
  profile: Profile;
  /** All pre-computed quotes for insurer name → QuoteData lookup */
  quotes: QuoteData[];
  /** Full context object sent to the AI */
  context: Record<string, any>;
}

function buildTopQuoteSummary(quotes: QuoteData[]): any[] {
  return quotes.map(q => ({
    insurer: q.insurerName,
    yearlyPrice: q.yearlyPrice,
    monthlyPrice: q.monthlyPrice,
    features: q.features,
    satisfaction: q.satisfaction,
    claimsSpeedDays: q.claimsSpeedDays,
    digitalRating: q.digitalRating,
    roadsideAssistance: q.roadsideAssistance,
    marketSharePct: q.marketSharePct,
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
    allQuotes: buildTopQuoteSummary(all),
    allInsurerKnowledge: getInsurerKnowledge(),
    marketStats,
    dataComplete: true,
  };

  return { id: 'returning', profile: profileA, quotes: all, context };
}

function getNewCustomerScenario(lang: Lang): ScenarioConfig {
  const all = getQuotesForProfile(profileB, lang);

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
    allQuotes: buildTopQuoteSummary(all),
    allInsurerKnowledge: getInsurerKnowledge(),
    marketStats,
    dataComplete: true,
  };

  return { id: 'new', profile: profileB, quotes: all, context };
}

function getAdvisoryScenario(lang: Lang): ScenarioConfig {
  const all = getQuotesForProfile(profileC, lang);

  const context = {
    scenario: 'advisory_deep_dive',
    customer: {
      vehicle: `${profileC.vehicle.year} ${profileC.vehicle.make} ${profileC.vehicle.model} ${profileC.vehicle.variant}`,
      vehiclePlate: profileC.vehicle.plate,
      vehiclePowerKw: profileC.vehicle.power_kw,
      currentInsurer: profileC.currentInsurer,
      currentPrice: profileC.currentPrice,
      bonusCategory: profileC.bonus,
      region: profileC.region,
      location: profileC.location,
      paymentFrequency: profileC.payment,
      paymentMethod: profileC.paymentMethod,
    },
    allQuotes: buildTopQuoteSummary(all),
    allInsurerKnowledge: getInsurerKnowledge(),
    marketStats,
    dataComplete: true,
  };

  return { id: 'advisory', profile: profileC, quotes: all, context };
}
