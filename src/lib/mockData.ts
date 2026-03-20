export interface Vehicle {
  plate: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  engine_cc: number;
  power_kw: number;
  fuel: string;
  value_eur: number;
  color: string;
}

export interface Insurer {
  id: string;
  name: string;
  short_name: string;
  base_rate: number;
  claims_speed: number;
  claims_speed_days: number;
  digital_rating: number;
  roadside: boolean;
  satisfaction: number;
  color: string;
  market_share_pct: number;
  strengths: string[];
  weaknesses: string[];
  strengths_en: string;
  weaknesses_en: string;
  products: string[];
}

export const vehicles: Vehicle[] = [
  { plate: "ABC-123", make: "Opel", model: "Astra", variant: "1.4 Turbo", year: 2015, engine_cc: 1398, power_kw: 74, fuel: "petrol", value_eur: 8000, color: "silver" },
  { plate: "DEF-456", make: "Suzuki", model: "SX4 S-Cross", variant: "1.6 VVT", year: 2012, engine_cc: 1586, power_kw: 88, fuel: "petrol", value_eur: 7000, color: "white" },
  { plate: "GHI-789", make: "Volkswagen", model: "Golf VII", variant: "1.4 TSI", year: 2018, engine_cc: 1395, power_kw: 110, fuel: "petrol", value_eur: 13750, color: "grey" },
  { plate: "JKL-012", make: "Suzuki", model: "Vitara", variant: "1.4 BoosterJet", year: 2019, engine_cc: 1373, power_kw: 103, fuel: "petrol", value_eur: 14500, color: "red" },
  { plate: "MNO-345", make: "Škoda", model: "Octavia", variant: "1.6 TDI", year: 2016, engine_cc: 1598, power_kw: 81, fuel: "diesel", value_eur: 10250, color: "blue" },
  { plate: "PQR-678", make: "Toyota", model: "Corolla", variant: "1.8 Hybrid", year: 2021, engine_cc: 1798, power_kw: 90, fuel: "hybrid", value_eur: 18000, color: "white" },
  { plate: "STU-901", make: "Ford", model: "Focus", variant: "1.0 EcoBoost", year: 2017, engine_cc: 999, power_kw: 92, fuel: "petrol", value_eur: 9500, color: "blue" },
  { plate: "VWX-234", make: "Renault", model: "Clio", variant: "0.9 TCe", year: 2020, engine_cc: 898, power_kw: 66, fuel: "petrol", value_eur: 8750, color: "orange" },
  { plate: "YZA-567", make: "Dacia", model: "Duster", variant: "1.5 dCi", year: 2019, engine_cc: 1461, power_kw: 84, fuel: "diesel", value_eur: 11250, color: "brown" },
  { plate: "BCD-890", make: "Hyundai", model: "i30", variant: "1.4 T-GDI", year: 2022, engine_cc: 1353, power_kw: 103, fuel: "petrol", value_eur: 17000, color: "white" },
];

export const insurers: Insurer[] = [
  { id: "allianz", name: "Allianz Hungária", short_name: "Allianz", base_rate: 84, claims_speed: 5, claims_speed_days: 8, digital_rating: 5, roadside: true, satisfaction: 4.5, color: "#003781", market_share_pct: 14, products: ["mtpl","casco","home","travel"], strengths: ["Best claims handling","Own repair network","Digital green card"], weaknesses: ["Higher premiums","Fewer payment discounts"], strengths_en: "Top claims rating in the Hungarian market: faster processing, own repair network, and better courtesy car terms. Allianz app is among the best: online claims filing, real-time tracking, digital green card.", weaknesses_en: "Premiums are typically 10-15% above market average. Fewer individual discounts for payment method." },
  { id: "generali", name: "Generali Biztosító", short_name: "Generali", base_rate: 80, claims_speed: 4, claims_speed_days: 12, digital_rating: 3, roadside: false, satisfaction: 4.0, color: "#C0392B", market_share_pct: 12, products: ["mtpl","casco","home","travel"], strengths: ["Stable background","Wide product range","MFO products"], weaknesses: ["Slower digital development","Roadside only as add-on"], strengths_en: "International backing, stable insurer. Wide product range, especially strong home insurance portfolio.", weaknesses_en: "Digital services lag behind competitors. Roadside assistance only available as an add-on." },
  { id: "genertel", name: "Genertel Biztosító", short_name: "Genertel", base_rate: 71, claims_speed: 3, claims_speed_days: 15, digital_rating: 5, roadside: false, satisfaction: 3.8, color: "#E74C3C", market_share_pct: 10, products: ["mtpl","casco","home"], strengths: ["Lowest prices","Fully online","Fast signup"], weaknesses: ["Online-only support","Slower claims","No roadside"], strengths_en: "Generali's online subsidiary, specifically low premiums. Fully digital service.", weaknesses_en: "Customer service exclusively online/phone. Claims processing is slower on average." },
  { id: "groupama", name: "Groupama Biztosító", short_name: "Groupama", base_rate: 76, claims_speed: 5, claims_speed_days: 9, digital_rating: 4, roadside: true, satisfaction: 4.3, color: "#27AE60", market_share_pct: 11, products: ["mtpl","casco","home","travel"], strengths: ["Excellent claims","Roadside included","Good value"], weaknesses: ["Less known brand","Fewer casco options"], strengths_en: "One of the best value-for-money insurers. Fast claims, roadside assistance included in the base package.", weaknesses_en: "Lower brand awareness. Casco product range is narrower." },
  { id: "kh", name: "K&H Biztosító", short_name: "K&H", base_rate: 80, claims_speed: 4, claims_speed_days: 11, digital_rating: 4, roadside: true, satisfaction: 4.1, color: "#2980B9", market_share_pct: 15, products: ["mtpl","casco","home","travel"], strengths: ["Flexible payments","Bank integration","Wide network"], weaknesses: ["Average online experience","Higher rural prices"], strengths_en: "K&H Bank subsidiary, with banking integration benefits. Flexible payment options and wide branch network.", weaknesses_en: "Online interface is functional but not the most modern. Rural region premiums can be higher." },
  { id: "kobe", name: "KÖBE Biztosító", short_name: "KÖBE", base_rate: 70, claims_speed: 3, claims_speed_days: 18, digital_rating: 2, roadside: false, satisfaction: 3.5, color: "#8E44AD", market_share_pct: 8, products: ["mtpl","casco"], strengths: ["Low prices","Simple products","Member system"], weaknesses: ["Limited digital","Slower claims","Narrow range"], strengths_en: "As a cooperative insurer, offers low premiums, especially for accident-free drivers.", weaknesses_en: "Digital services significantly lag behind. Claims handling is slower, customer service harder to reach." },
  { id: "union", name: "Union Biztosító", short_name: "Union", base_rate: 74, claims_speed: 4, claims_speed_days: 13, digital_rating: 3, roadside: true, satisfaction: 3.9, color: "#F39C12", market_share_pct: 7, products: ["mtpl","casco","home","travel"], strengths: ["Competitive prices","Roadside included","Casco Trend"], weaknesses: ["Smaller presence","Less known"], strengths_en: "Competitive pricing, roadside assistance in the base package. Innovative Casco Trend product.", weaknesses_en: "Smaller market presence, less known brand." },
  { id: "uniqa", name: "UNIQA Biztosító", short_name: "UNIQA", base_rate: 78, claims_speed: 4, claims_speed_days: 10, digital_rating: 4, roadside: true, satisfaction: 4.2, color: "#1ABC9C", market_share_pct: 9, products: ["mtpl","casco","home","travel"], strengths: ["Good value","Multi Casco Plus","Strong travel products"], weaknesses: ["Medium awareness","Online claims WIP"], strengths_en: "Good balance between price and service. Multi Casco Plus is one of the most flexible casco offers.", weaknesses_en: "Brand awareness in the medium category. Online claims system still under development." },
  { id: "signal", name: "Signal Biztosító", short_name: "Signal", base_rate: 73, claims_speed: 3, claims_speed_days: 14, digital_rating: 3, roadside: false, satisfaction: 3.7, color: "#3498DB", market_share_pct: 5, products: ["mtpl","casco"], strengths: ["Good youth prices","Ominimo casco"], weaknesses: ["Narrow range","Limited network"], strengths_en: "Competitive premiums for young drivers. Ominimo casco product offers a simplified option.", weaknesses_en: "Product range is narrower. Repair partner network is limited." },
  { id: "alfa", name: "Alfa Biztosító", short_name: "Alfa", base_rate: 72, claims_speed: 3, claims_speed_days: 14, digital_rating: 3, roadside: false, satisfaction: 3.8, color: "#9B59B6", market_share_pct: 6, products: ["mtpl","casco","home","travel"], strengths: ["Kupola MFO home insurance","Competitive MTPL"], weaknesses: ["Smaller market share","Slower online development"], strengths_en: "Alfa Kupola MFO is one of the highest-rated home insurance products. MTPL prices are competitive.", weaknesses_en: "Smaller market share. Online services under development." },
  { id: "granit", name: "Gránit Biztosító", short_name: "Gránit", base_rate: 68, claims_speed: 3, claims_speed_days: 16, digital_rating: 2, roadside: false, satisfaction: 3.6, color: "#2C3E50", market_share_pct: 4, products: ["mtpl","casco","home"], strengths: ["Lowest prices","Simple products"], weaknesses: ["Smallest player","Limited support"], strengths_en: "One of the lowest-premium insurers. Simple, transparent products.", weaknesses_en: "One of the smallest market players, customer service capacity is limited." },
  { id: "magyar_posta", name: "Magyar Posta Biztosító", short_name: "Magyar Posta", base_rate: 76, claims_speed: 2, claims_speed_days: 17, digital_rating: 2, roadside: false, satisfaction: 3.4, color: "#E67E22", market_share_pct: 3, products: ["mtpl","casco"], strengths: ["Postal network","Simple service"], weaknesses: ["Least digital","Slowest claims"], strengths_en: "Accessible through the Hungarian Postal network in person.", weaknesses_en: "Digital services are the most limited. Claims processing is the slowest." },
];

export function getInsurerById(id: string): Insurer | undefined {
  return insurers.find(i => i.id === id);
}

export function getVehicleByPlate(plate: string): Vehicle | undefined {
  return vehicles.find(v => v.plate === plate);
}

export function getPowerMultiplier(kw: number): number {
  if (kw <= 50) return 0.7;
  if (kw <= 75) return 0.85;
  if (kw <= 100) return 1.0;
  if (kw <= 130) return 1.15;
  return 1.4;
}

const bonusMap: Record<string, number> = {
  B10: 0.50, B09: 0.55, B08: 0.60, B07: 0.65, B06: 0.70,
  B05: 0.75, B04: 0.80, B03: 0.85, B02: 0.90, B01: 0.95,
  A00: 1.00, M01: 1.50, M02: 2.00,
};

export function getBonusMultiplier(bonus: string): number {
  return bonusMap[bonus] ?? 1.0;
}

export type Region = 'budapest' | 'county_seat' | 'rural';

export function getRegionMultiplier(region: Region): number {
  if (region === 'budapest') return 1.15;
  if (region === 'county_seat') return 1.00;
  return 0.85;
}

export function getAgeMultiplier(year: number): number {
  const age = 2026 - year;
  if (age <= 3) return 1.1;
  if (age <= 7) return 1.0;
  if (age <= 12) return 0.9;
  return 0.85;
}

export type Payment = 'annual' | 'semi' | 'quarterly';

export function getPaymentMultiplier(payment: Payment): number {
  if (payment === 'annual') return 0.85;
  if (payment === 'semi') return 0.95;
  return 1.0;
}

export function calculatePremium(
  insurer: Insurer,
  vehicle: Vehicle,
  bonus: string,
  region: Region,
  payment: Payment,
): number {
  const raw =
    insurer.base_rate *
    getPowerMultiplier(vehicle.power_kw) *
    getBonusMultiplier(bonus) *
    getRegionMultiplier(region) *
    getAgeMultiplier(vehicle.year) *
    getPaymentMultiplier(payment);
  return Math.round(raw);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("en-US");
}

export function formatEur(price: number): string {
  return `€${price.toLocaleString("en-US")}`;
}

export function getInsuranceFeatures(insurer: Insurer): string[] {
  const f: string[] = [];
  if (insurer.claims_speed >= 4) f.push('Fast claims');
  if (insurer.digital_rating >= 4) f.push('Online service');
  if (insurer.roadside) f.push('Roadside assist');
  if (insurer.satisfaction >= 4.0) f.push('High satisfaction');
  return f;
}

export interface QuoteData {
  insurerName: string;
  insurerColor: string;
  yearlyPrice: number;
  monthlyPrice: number;
  badge?: { text: string; variant: 'cheapest' | 'recommended' | 'current' | 'popular' };
  features: string[];
  assessment: string;
  satisfaction: number;
  claimsSpeedDays?: number;
  digitalRating?: number;
  roadsideAssistance?: boolean;
  marketSharePct?: number;
}

export interface Profile {
  vehicle: Vehicle;
  bonus: string;
  region: Region;
  payment: Payment;
  currentInsurer?: string;
  currentPrice?: number;
  location?: string;
  isReturningCustomer?: boolean;
  yearsAsCustomer?: number;
  anniversaryDate?: string;
  paymentMethod?: string;
}

// Returning customer — Suzuki SX4, Budapest, B10, KÖBE
export const profileA: Profile = {
  vehicle: vehicles[1],
  bonus: 'B10',
  region: 'budapest',
  payment: 'annual',
  currentInsurer: 'KÖBE',
  currentPrice: 95, // €95/yr
  location: 'Budapest',
  isReturningCustomer: true,
  yearsAsCustomer: 3,
  anniversaryDate: 'January 1',
  paymentMethod: 'bank transfer',
};

// New customer — VW Golf VII, Debrecen, A00
export const profileB: Profile = {
  vehicle: vehicles[2],
  bonus: 'A00',
  region: 'county_seat',
  payment: 'annual',
  location: 'Debrecen',
  paymentMethod: 'credit card',
};

// Advisory — Opel Astra, Szeged, B06
export const profileC: Profile = {
  vehicle: vehicles[0],
  bonus: 'B06',
  region: 'county_seat',
  payment: 'quarterly',
  currentInsurer: 'Generali',
  currentPrice: 111, // €111/yr
  location: 'Szeged',
  isReturningCustomer: true,
  paymentMethod: 'cheque',
};

export function getQuotesForProfile(profile: Profile): QuoteData[] {
  return insurers
    .map((ins) => {
      const yearly = calculatePremium(ins, profile.vehicle, profile.bonus, profile.region, profile.payment);
      return {
        insurerName: ins.short_name,
        insurerColor: ins.color,
        yearlyPrice: yearly,
        monthlyPrice: Math.round(yearly / 12),
        features: getInsuranceFeatures(ins),
        assessment: '',
        satisfaction: ins.satisfaction,
        claimsSpeedDays: ins.claims_speed_days,
        digitalRating: ins.digital_rating,
        roadsideAssistance: ins.roadside,
        marketSharePct: ins.market_share_pct,
      };
    })
    .sort((a, b) => a.yearlyPrice - b.yearlyPrice);
}

/** Full insurer knowledge for AI context */
export function getInsurerKnowledge(): Record<string, any>[] {
  return insurers.map(ins => ({
    id: ins.id,
    name: ins.name,
    short_name: ins.short_name,
    claims_speed_days: ins.claims_speed_days,
    digital_rating: ins.digital_rating,
    customer_satisfaction: ins.satisfaction,
    roadside_assistance: ins.roadside,
    market_share_kgfb_pct: ins.market_share_pct,
    strengths: ins.strengths_en,
    weaknesses: ins.weaknesses_en,
    products: ins.products,
  }));
}

/** Market stats for AI context */
export const marketStats = {
  kgfb_avg_premium_2025_q1_eur: 148,
  kgfb_avg_savings_on_switch_eur: 35,
  netrisk_daily_contracts: 2000,
  netrisk_returning_customers: 1000000,
  netrisk_insurer_partners: 22,
  netrisk_years_in_operation: 30,
  b10_share_of_switchers_pct: 82,
  annual_payment_share_pct: 63,
};
