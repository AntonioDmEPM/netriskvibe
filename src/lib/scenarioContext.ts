import {
  profileA, profileB, profileC,
  getQuotesForProfile, getInsurerKnowledge, marketStats,
  type QuoteData, type Profile,
} from './mockData';
import type { Lang } from './i18n';

export interface ScenarioConfig {
  id: string;
  profile: Profile;
  quotes: QuoteData[];
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

export function getScenarioConfig(flowId: string, _lang: Lang): ScenarioConfig {
  switch (flowId) {
    case 'returning': return getReturningScenario();
    case 'new': return getNewCustomerScenario();
    case 'advisory': return getAdvisoryScenario();
    default: return getReturningScenario();
  }
}

function getReturningScenario(): ScenarioConfig {
  const all = getQuotesForProfile(profileA);

  const context = {
    scenario: 'returning_customer',
    currency: 'EUR',
    customer: {
      name: 'Anna Kovács',
      vehicle: `${profileA.vehicle.year} ${profileA.vehicle.make} ${profileA.vehicle.model} ${profileA.vehicle.variant}`,
      vehiclePlate: profileA.vehicle.plate,
      vehiclePowerKw: profileA.vehicle.power_kw,
      vehicleValueEur: profileA.vehicle.value_eur,
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

function getNewCustomerScenario(): ScenarioConfig {
  const all = getQuotesForProfile(profileB);

  const context = {
    scenario: 'new_customer',
    currency: 'EUR',
    customer: {
      vehicle: `${profileB.vehicle.year} ${profileB.vehicle.make} ${profileB.vehicle.model} ${profileB.vehicle.variant}`,
      vehiclePlate: profileB.vehicle.plate,
      vehiclePowerKw: profileB.vehicle.power_kw,
      vehicleValueEur: profileB.vehicle.value_eur,
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

function getAdvisoryScenario(): ScenarioConfig {
  const all = getQuotesForProfile(profileC);

  const context = {
    scenario: 'advisory_deep_dive',
    currency: 'EUR',
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
