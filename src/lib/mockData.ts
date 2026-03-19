export interface Vehicle {
  plate: string;
  make: string;
  model: string;
  year: number;
  engine_cc: number;
  power_kw: number;
  fuel: string;
}

export interface Insurer {
  name: string;
  base_rate: number;
  claims_speed: number;
  digital_rating: number;
  roadside: boolean;
  satisfaction: number;
  color: string;
}

export const vehicles: Vehicle[] = [
  { plate: "ABC-123", make: "Opel", model: "Astra", year: 2015, engine_cc: 1398, power_kw: 74, fuel: "benzin" },
  { plate: "DEF-456", make: "Suzuki", model: "SX4 S-Cross", year: 2012, engine_cc: 1586, power_kw: 88, fuel: "benzin" },
  { plate: "GHI-789", make: "Volkswagen", model: "Golf VII", year: 2018, engine_cc: 1395, power_kw: 110, fuel: "benzin" },
  { plate: "JKL-012", make: "Suzuki", model: "Vitara", year: 2019, engine_cc: 1373, power_kw: 103, fuel: "benzin" },
  { plate: "MNO-345", make: "Škoda", model: "Octavia", year: 2016, engine_cc: 1598, power_kw: 81, fuel: "dízel" },
];

export const insurers: Insurer[] = [
  { name: "Genertel", base_rate: 28500, claims_speed: 3, digital_rating: 5, roadside: false, satisfaction: 3.8, color: "#E74C3C" },
  { name: "Groupama", base_rate: 30200, claims_speed: 5, digital_rating: 4, roadside: true, satisfaction: 4.3, color: "#27AE60" },
  { name: "K&H", base_rate: 31800, claims_speed: 4, digital_rating: 4, roadside: true, satisfaction: 4.1, color: "#2980B9" },
  { name: "Allianz", base_rate: 33500, claims_speed: 5, digital_rating: 5, roadside: true, satisfaction: 4.5, color: "#003781" },
  { name: "Generali", base_rate: 32000, claims_speed: 4, digital_rating: 3, roadside: false, satisfaction: 4.0, color: "#C0392B" },
  { name: "KÖBE", base_rate: 27800, claims_speed: 3, digital_rating: 2, roadside: false, satisfaction: 3.5, color: "#8E44AD" },
  { name: "Union", base_rate: 29500, claims_speed: 4, digital_rating: 3, roadside: true, satisfaction: 3.9, color: "#F39C12" },
  { name: "UNIQA", base_rate: 31000, claims_speed: 4, digital_rating: 4, roadside: true, satisfaction: 4.2, color: "#1ABC9C" },
];

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
  return Math.round(raw / 100) * 100;
}

export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function getInsuranceFeatures(insurer: Insurer): string[] {
  const f: string[] = [];
  if (insurer.claims_speed >= 4) f.push('Gyors kárrendezés');
  if (insurer.digital_rating >= 4) f.push('Online ügyintézés');
  if (insurer.roadside) f.push('Asszisztencia');
  if (insurer.satisfaction >= 4.0) f.push('Magas elégedettség');
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
}

export interface Profile {
  vehicle: Vehicle;
  bonus: string;
  region: Region;
  payment: Payment;
  currentInsurer?: string;
  currentPrice?: number;
}

export const profileA: Profile = {
  vehicle: vehicles[1],
  bonus: 'B10',
  region: 'budapest',
  payment: 'annual',
  currentInsurer: 'KÖBE',
  currentPrice: 38000,
};

export const profileB: Profile = {
  vehicle: vehicles[2],
  bonus: 'A00',
  region: 'county_seat',
  payment: 'quarterly',
};

export const profileC: Profile = {
  vehicle: vehicles[0],
  bonus: 'B06',
  region: 'county_seat',
  payment: 'annual',
};

export function getQuotesForProfile(profile: Profile): QuoteData[] {
  return insurers
    .map((ins) => {
      const yearly = calculatePremium(ins, profile.vehicle, profile.bonus, profile.region, profile.payment);
      return {
        insurerName: ins.name,
        insurerColor: ins.color,
        yearlyPrice: yearly,
        monthlyPrice: Math.round(yearly / 12),
        features: getInsuranceFeatures(ins),
        assessment: '',
        satisfaction: ins.satisfaction,
      };
    })
    .sort((a, b) => a.yearlyPrice - b.yearlyPrice);
}
