/**
 * Data Agent — deterministic vehicle lookup, region classification, bonus validation.
 * No LLM calls needed.
 */

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

const vehicles: Vehicle[] = [
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

export function lookupVehicle(plate: string): Vehicle | null {
  const normalized = plate.toUpperCase().replace(/\s+/g, "");
  return vehicles.find((v) => v.plate.replace("-", "") === normalized.replace("-", "")) ?? null;
}

export type RegionType = "budapest" | "county_seat" | "rural";

const countySeats = new Set([
  "debrecen", "szeged", "miskolc", "pécs", "győr", "nyíregyháza",
  "kecskemét", "székesfehérvár", "szombathely", "eger", "szolnok",
  "kaposvár", "veszprém", "békéscsaba", "zalaegerszeg", "sopron",
  "tatabánya", "szekszárd", "salgótarján",
]);

export function classifyRegion(city: string): { type: RegionType; multiplier: number } {
  const lower = city.toLowerCase().trim();
  if (lower === "budapest") return { type: "budapest", multiplier: 1.15 };
  if (countySeats.has(lower)) return { type: "county_seat", multiplier: 1.0 };
  return { type: "rural", multiplier: 0.85 };
}

const bonusMultipliers: Record<string, number> = {
  B10: 0.50, B09: 0.55, B08: 0.60, B07: 0.65, B06: 0.70,
  B05: 0.75, B04: 0.80, B03: 0.85, B02: 0.90, B01: 0.95,
  A00: 1.00, M01: 1.50, M02: 2.00,
};

export function validateBonus(input: string): { code: string; multiplier: number } | null {
  const normalized = input.toUpperCase().replace(/\s+/g, "");
  if (bonusMultipliers[normalized] !== undefined) {
    return { code: normalized, multiplier: bonusMultipliers[normalized] };
  }
  return null;
}
