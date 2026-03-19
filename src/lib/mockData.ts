export interface Vehicle {
  plate: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  engine_cc: number;
  power_kw: number;
  fuel: string;
  value_huf: number;
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
  strengths_hu: string;
  weaknesses_hu: string;
  products: string[];
}

export const vehicles: Vehicle[] = [
  { plate: "ABC-123", make: "Opel", model: "Astra", variant: "1.4 Turbo", year: 2015, engine_cc: 1398, power_kw: 74, fuel: "benzin", value_huf: 3200000, color: "ezüst" },
  { plate: "DEF-456", make: "Suzuki", model: "SX4 S-Cross", variant: "1.6 VVT", year: 2012, engine_cc: 1586, power_kw: 88, fuel: "benzin", value_huf: 2800000, color: "fehér" },
  { plate: "GHI-789", make: "Volkswagen", model: "Golf VII", variant: "1.4 TSI", year: 2018, engine_cc: 1395, power_kw: 110, fuel: "benzin", value_huf: 5500000, color: "szürke" },
  { plate: "JKL-012", make: "Suzuki", model: "Vitara", variant: "1.4 BoosterJet", year: 2019, engine_cc: 1373, power_kw: 103, fuel: "benzin", value_huf: 5800000, color: "piros" },
  { plate: "MNO-345", make: "Škoda", model: "Octavia", variant: "1.6 TDI", year: 2016, engine_cc: 1598, power_kw: 81, fuel: "dízel", value_huf: 4100000, color: "kék" },
  { plate: "PQR-678", make: "Toyota", model: "Corolla", variant: "1.8 Hybrid", year: 2021, engine_cc: 1798, power_kw: 90, fuel: "hybrid", value_huf: 7200000, color: "fehér" },
  { plate: "STU-901", make: "Ford", model: "Focus", variant: "1.0 EcoBoost", year: 2017, engine_cc: 999, power_kw: 92, fuel: "benzin", value_huf: 3800000, color: "kék" },
  { plate: "VWX-234", make: "Renault", model: "Clio", variant: "0.9 TCe", year: 2020, engine_cc: 898, power_kw: 66, fuel: "benzin", value_huf: 3500000, color: "narancssárga" },
  { plate: "YZA-567", make: "Dacia", model: "Duster", variant: "1.5 dCi", year: 2019, engine_cc: 1461, power_kw: 84, fuel: "dízel", value_huf: 4500000, color: "barna" },
  { plate: "BCD-890", make: "Hyundai", model: "i30", variant: "1.4 T-GDI", year: 2022, engine_cc: 1353, power_kw: 103, fuel: "benzin", value_huf: 6800000, color: "fehér" },
];

export const insurers: Insurer[] = [
  { id: "allianz", name: "Allianz Hungária", short_name: "Allianz", base_rate: 33500, claims_speed: 5, claims_speed_days: 8, digital_rating: 5, roadside: true, satisfaction: 4.5, color: "#003781", market_share_pct: 14, products: ["kgfb","casco","lakas","utas"], strengths: ["Legjobb kárrendezés","Saját szervízhálózat","Digitális zöldkártya"], weaknesses: ["Magasabb díjak","Kevesebb fizetési kedvezmény"], strengths_hu: "A magyar piac legjobb kárrendezési értékelése: gyorsabb ügyintézés, saját szervízhálózat, és kedvezőbb helyettesítő autó feltételek. Az Allianz applikáció a legjobbak között van: online kárbejelentés, valós idejű státuszkövetés, digitális zöldkártya.", weaknesses_hu: "Díjai jellemzően 10-15%-kal a piaci átlag felett vannak. Kevesebb egyedi kedvezményt kínálnak a díjfizetés módja alapján." },
  { id: "generali", name: "Generali Biztosító", short_name: "Generali", base_rate: 32000, claims_speed: 4, claims_speed_days: 12, digital_rating: 3, roadside: false, satisfaction: 4.0, color: "#C0392B", market_share_pct: 12, products: ["kgfb","casco","lakas","utas"], strengths: ["Stabil háttér","Széles termékkínálat","MFO termékek"], weaknesses: ["Lassabb digitális fejlődés","Asszisztencia csak kiegészítőként"], strengths_hu: "Nemzetközi háttérrel rendelkező, stabil biztosító. Széles termékkínálat, különösen erős lakásbiztosítási portfólió.", weaknesses_hu: "Digitális szolgáltatásai lemaradnak a versenytársakhoz képest. Közúti asszisztencia csak kiegészítő biztosításként érhető el." },
  { id: "genertel", name: "Genertel Biztosító", short_name: "Genertel", base_rate: 28500, claims_speed: 3, claims_speed_days: 15, digital_rating: 5, roadside: false, satisfaction: 3.8, color: "#E74C3C", market_share_pct: 10, products: ["kgfb","casco","lakas"], strengths: ["Legalacsonyabb díjak","Teljesen online ügyintézés","Gyors szerződéskötés"], weaknesses: ["Csak online ügyfélszolgálat","Lassabb kárrendezés","Nincs asszisztencia"], strengths_hu: "A Generali online leányvállalata, kifejezetten alacsony díjakkal. Teljesen digitális ügyintézés.", weaknesses_hu: "Ügyfélszolgálat kizárólag online/telefonon érhető el. A kárrendezés átlagosan lassabb." },
  { id: "groupama", name: "Groupama Biztosító", short_name: "Groupama", base_rate: 30200, claims_speed: 5, claims_speed_days: 9, digital_rating: 4, roadside: true, satisfaction: 4.3, color: "#27AE60", market_share_pct: 11, products: ["kgfb","casco","lakas","utas"], strengths: ["Kiváló kárrendezés","Asszisztencia alapcsomagban","Jó ár-érték arány"], weaknesses: ["Kevésbé ismert márka","Kevesebb casco variáció"], strengths_hu: "Az egyik legjobb ár-érték arányú biztosító. Gyors kárrendezés, közúti asszisztencia már az alapcsomagban.", weaknesses_hu: "Márkaismertség alacsonyabb. Casco kínálata szűkebb." },
  { id: "kh", name: "K&H Biztosító", short_name: "K&H", base_rate: 31800, claims_speed: 4, claims_speed_days: 11, digital_rating: 4, roadside: true, satisfaction: 4.1, color: "#2980B9", market_share_pct: 15, products: ["kgfb","casco","lakas","utas"], strengths: ["Rugalmas fizetés","Banki integráció","Széles hálózat"], weaknesses: ["Átlagos online élmény","Magasabb díjak vidéken"], strengths_hu: "A K&H Bank leányvállalata, banki integrációs előnyökkel. Rugalmas fizetési lehetőségek és széles fiókhálózat.", weaknesses_hu: "Online felülete funkcionális, de nem a legmodernebb. Vidéki régiókban a díjak magasabbak lehetnek." },
  { id: "kobe", name: "KÖBE Biztosító", short_name: "KÖBE", base_rate: 27800, claims_speed: 3, claims_speed_days: 18, digital_rating: 2, roadside: false, satisfaction: 3.5, color: "#8E44AD", market_share_pct: 8, products: ["kgfb","casco"], strengths: ["Alacsony díjak","Egyszerű termékek","Tagsági rendszer"], weaknesses: ["Korlátozott digitális szolgáltatások","Lassabb kárrendezés","Szűk termékkínálat"], strengths_hu: "Szövetkezeti biztosítóként alacsony díjakat kínál, különösen a balesetmentes sofőröknek.", weaknesses_hu: "Digitális szolgáltatásai jelentősen elmaradnak. Kárrendezés lassabb, ügyfélszolgálat nehezebben elérhető." },
  { id: "union", name: "Union Biztosító", short_name: "Union", base_rate: 29500, claims_speed: 4, claims_speed_days: 13, digital_rating: 3, roadside: true, satisfaction: 3.9, color: "#F39C12", market_share_pct: 7, products: ["kgfb","casco","lakas","utas"], strengths: ["Versenyképes díjak","Asszisztencia alapcsomagban","Casco Trend termék"], weaknesses: ["Kisebb piaci jelenlét","Kevésbé ismert"], strengths_hu: "Versenyképes árazás, asszisztencia az alapcsomagban. Innovatív Casco Trend termék.", weaknesses_hu: "Kisebb piaci jelenlét, kevésbé ismert márka." },
  { id: "uniqa", name: "UNIQA Biztosító", short_name: "UNIQA", base_rate: 31000, claims_speed: 4, claims_speed_days: 10, digital_rating: 4, roadside: true, satisfaction: 4.2, color: "#1ABC9C", market_share_pct: 9, products: ["kgfb","casco","lakas","utas"], strengths: ["Jó ár-érték arány","Multi Casco Plusz","Erős utas termékek"], weaknesses: ["Közepesen ismert márka","Online kárbejelentés fejlesztés alatt"], strengths_hu: "Jó egyensúly az ár és a szolgáltatás között. Multi Casco Plusz terméke a piac egyik legrugalmasabb casco ajánlata.", weaknesses_hu: "Márkaismertség a közepes kategóriában. Online kárbejelentési rendszere még fejlesztés alatt áll." },
  { id: "signal", name: "Signal Biztosító", short_name: "Signal", base_rate: 29000, claims_speed: 3, claims_speed_days: 14, digital_rating: 3, roadside: false, satisfaction: 3.7, color: "#3498DB", market_share_pct: 5, products: ["kgfb","casco"], strengths: ["Kedvező díjak fiataloknak","Ominimo casco"], weaknesses: ["Szűk termékkínálat","Korlátozott hálózat"], strengths_hu: "Versenyképes díjakat kínál fiatal sofőröknek. Ominimo casco terméke egyszerűsített opció.", weaknesses_hu: "Termékkínálat szűkebb. Szervizpartner-hálózat korlátozott." },
  { id: "alfa", name: "Alfa Biztosító", short_name: "Alfa", base_rate: 28800, claims_speed: 3, claims_speed_days: 14, digital_rating: 3, roadside: false, satisfaction: 3.8, color: "#9B59B6", market_share_pct: 6, products: ["kgfb","casco","lakas","utas"], strengths: ["Kupola MFO lakásbiztosítás","Versenyképes KGFB díjak"], weaknesses: ["Kisebb piaci részesedés","Lassabb online fejlődés"], strengths_hu: "Az Alfa Kupola MFO az egyik legjobb értékelésű lakásbiztosítás. KGFB díjaik versenyképesek.", weaknesses_hu: "Kisebb piaci részesedés. Online szolgáltatások fejlesztés alatt." },
  { id: "granit", name: "Gránit Biztosító", short_name: "Gránit", base_rate: 27200, claims_speed: 3, claims_speed_days: 16, digital_rating: 2, roadside: false, satisfaction: 3.6, color: "#2C3E50", market_share_pct: 4, products: ["kgfb","casco","lakas"], strengths: ["Alacsony díjak","Egyszerű termékek"], weaknesses: ["Legkisebb piaci szereplő","Korlátozott ügyfélszolgálat"], strengths_hu: "A legkedvezőbb díjú biztosítók egyike. Egyszerű, átlátható termékek.", weaknesses_hu: "A legkisebb piaci szereplők egyike, ügyfélszolgálati kapacitása korlátozott." },
  { id: "magyar_posta", name: "Magyar Posta Biztosító", short_name: "Magyar Posta", base_rate: 30500, claims_speed: 2, claims_speed_days: 17, digital_rating: 2, roadside: false, satisfaction: 3.4, color: "#E67E22", market_share_pct: 3, products: ["kgfb","casco"], strengths: ["Postai hálózat","Egyszerű ügyintézés"], weaknesses: ["Legkevésbé digitális","Lassú kárrendezés"], strengths_hu: "A Magyar Posta hálózatán keresztül személyesen elérhető.", weaknesses_hu: "Digitális szolgáltatásai a legkorlátozottabbak. Kárrendezés a leglassabb." },
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
  return Math.round(raw / 100) * 100;
}

export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function getInsuranceFeatures(insurer: Insurer, lang: 'hu' | 'en' = 'hu'): string[] {
  const f: string[] = [];
  if (insurer.claims_speed >= 4) f.push(lang === 'en' ? 'Fast claims' : 'Gyors kárrendezés');
  if (insurer.digital_rating >= 4) f.push(lang === 'en' ? 'Online service' : 'Online ügyintézés');
  if (insurer.roadside) f.push(lang === 'en' ? 'Roadside assist' : 'Asszisztencia');
  if (insurer.satisfaction >= 4.0) f.push(lang === 'en' ? 'High satisfaction' : 'Magas elégedettség');
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
  currentPrice: 38000,
  location: 'Budapest',
  isReturningCustomer: true,
  yearsAsCustomer: 3,
  anniversaryDate: 'január 1.',
  paymentMethod: 'átutalás',
};

// New customer — VW Golf VII, Debrecen, A00
export const profileB: Profile = {
  vehicle: vehicles[2],
  bonus: 'A00',
  region: 'county_seat',
  payment: 'annual',
  location: 'Debrecen',
  paymentMethod: 'bankkártya',
};

// Advisory — Opel Astra, Szeged, B06
export const profileC: Profile = {
  vehicle: vehicles[0],
  bonus: 'B06',
  region: 'county_seat',
  payment: 'quarterly',
  currentInsurer: 'Generali',
  currentPrice: 44500,
  location: 'Szeged',
  isReturningCustomer: true,
  paymentMethod: 'csekk',
};

export function getQuotesForProfile(profile: Profile, lang: 'hu' | 'en' = 'hu'): QuoteData[] {
  return insurers
    .map((ins) => {
      const yearly = calculatePremium(ins, profile.vehicle, profile.bonus, profile.region, profile.payment);
      return {
        insurerName: ins.short_name,
        insurerColor: ins.color,
        yearlyPrice: yearly,
        monthlyPrice: Math.round(yearly / 12),
        features: getInsuranceFeatures(ins, lang),
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
    strengths_hu: ins.strengths_hu,
    weaknesses_hu: ins.weaknesses_hu,
    products: ins.products,
  }));
}

/** Market stats for AI context */
export const marketStats = {
  kgfb_avg_premium_2025_q1: 59000,
  kgfb_avg_savings_on_switch: 14000,
  netrisk_daily_contracts: 2000,
  netrisk_returning_customers: 1000000,
  netrisk_insurer_partners: 22,
  netrisk_years_in_operation: 30,
  b10_share_of_switchers_pct: 82,
  annual_payment_share_pct: 63,
};
