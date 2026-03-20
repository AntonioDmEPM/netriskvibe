/**
 * Comparison Agent — deterministic KGFB pricing calculator.
 * No LLM calls needed.
 */

import type { Vehicle, RegionType } from "./data.js";

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
  strengths_en: string;
  weaknesses_en: string;
  products: string[];
}

const insurers: Insurer[] = [
  { id: "allianz", name: "Allianz Hungária", short_name: "Allianz", base_rate: 84, claims_speed: 5, claims_speed_days: 8, digital_rating: 5, roadside: true, satisfaction: 4.5, color: "#003781", market_share_pct: 14, products: ["mtpl","casco","home","travel"], strengths_en: "Top claims rating in the Hungarian market: faster processing, own repair network, and better courtesy car terms.", weaknesses_en: "Premiums are typically 10-15% above market average." },
  { id: "generali", name: "Generali Biztosító", short_name: "Generali", base_rate: 80, claims_speed: 4, claims_speed_days: 12, digital_rating: 3, roadside: false, satisfaction: 4.0, color: "#C0392B", market_share_pct: 12, products: ["mtpl","casco","home","travel"], strengths_en: "International backing, stable insurer. Wide product range.", weaknesses_en: "Digital services lag behind. Roadside only as add-on." },
  { id: "genertel", name: "Genertel Biztosító", short_name: "Genertel", base_rate: 71, claims_speed: 3, claims_speed_days: 15, digital_rating: 5, roadside: false, satisfaction: 3.8, color: "#E74C3C", market_share_pct: 10, products: ["mtpl","casco","home"], strengths_en: "Generali's online subsidiary, low premiums. Fully digital.", weaknesses_en: "Online-only support. Claims processing is slower." },
  { id: "groupama", name: "Groupama Biztosító", short_name: "Groupama", base_rate: 76, claims_speed: 5, claims_speed_days: 9, digital_rating: 4, roadside: true, satisfaction: 4.3, color: "#27AE60", market_share_pct: 11, products: ["mtpl","casco","home","travel"], strengths_en: "Best value-for-money. Fast claims, roadside included.", weaknesses_en: "Lower brand awareness. Narrower casco range." },
  { id: "kh", name: "K&H Biztosító", short_name: "K&H", base_rate: 80, claims_speed: 4, claims_speed_days: 11, digital_rating: 4, roadside: true, satisfaction: 4.1, color: "#2980B9", market_share_pct: 15, products: ["mtpl","casco","home","travel"], strengths_en: "Banking integration, flexible payments, wide network.", weaknesses_en: "Average online experience. Higher rural premiums." },
  { id: "kobe", name: "KÖBE Biztosító", short_name: "KÖBE", base_rate: 70, claims_speed: 3, claims_speed_days: 18, digital_rating: 2, roadside: false, satisfaction: 3.5, color: "#8E44AD", market_share_pct: 8, products: ["mtpl","casco"], strengths_en: "Cooperative insurer, low premiums for accident-free drivers.", weaknesses_en: "Digital services lag. Claims handling is slower." },
  { id: "union", name: "Union Biztosító", short_name: "Union", base_rate: 74, claims_speed: 4, claims_speed_days: 13, digital_rating: 3, roadside: true, satisfaction: 3.9, color: "#F39C12", market_share_pct: 7, products: ["mtpl","casco","home","travel"], strengths_en: "Competitive pricing, roadside included. Innovative Casco Trend.", weaknesses_en: "Smaller presence, less known brand." },
  { id: "uniqa", name: "UNIQA Biztosító", short_name: "UNIQA", base_rate: 78, claims_speed: 4, claims_speed_days: 10, digital_rating: 4, roadside: true, satisfaction: 4.2, color: "#1ABC9C", market_share_pct: 9, products: ["mtpl","casco","home","travel"], strengths_en: "Good price-service balance. Multi Casco Plus is flexible.", weaknesses_en: "Medium brand awareness. Online claims still developing." },
  { id: "signal", name: "Signal Biztosító", short_name: "Signal", base_rate: 73, claims_speed: 3, claims_speed_days: 14, digital_rating: 3, roadside: false, satisfaction: 3.7, color: "#3498DB", market_share_pct: 5, products: ["mtpl","casco"], strengths_en: "Competitive for young drivers. Ominimo casco simplified.", weaknesses_en: "Narrow product range. Limited repair network." },
  { id: "alfa", name: "Alfa Biztosító", short_name: "Alfa", base_rate: 72, claims_speed: 3, claims_speed_days: 14, digital_rating: 3, roadside: false, satisfaction: 3.8, color: "#9B59B6", market_share_pct: 6, products: ["mtpl","casco","home","travel"], strengths_en: "Kupola MFO top home insurance. Competitive MTPL.", weaknesses_en: "Smaller market share. Online under development." },
  { id: "granit", name: "Gránit Biztosító", short_name: "Gránit", base_rate: 68, claims_speed: 3, claims_speed_days: 16, digital_rating: 2, roadside: false, satisfaction: 3.6, color: "#2C3E50", market_share_pct: 4, products: ["mtpl","casco","home"], strengths_en: "Lowest premiums. Simple, transparent products.", weaknesses_en: "Smallest player, limited customer service." },
  { id: "magyar_posta", name: "Magyar Posta Biztosító", short_name: "Magyar Posta", base_rate: 76, claims_speed: 2, claims_speed_days: 17, digital_rating: 2, roadside: false, satisfaction: 3.4, color: "#E67E22", market_share_pct: 3, products: ["mtpl","casco"], strengths_en: "Accessible through the postal network.", weaknesses_en: "Least digital. Slowest claims." },
];

export type PaymentFrequency = "annual" | "semi" | "quarterly";

function getPowerMultiplier(kw: number): number {
  if (kw <= 50) return 0.70;
  if (kw <= 75) return 0.85;
  if (kw <= 100) return 1.00;
  if (kw <= 130) return 1.15;
  return 1.40;
}

function getRegionMultiplier(region: RegionType): number {
  if (region === "budapest") return 1.15;
  if (region === "county_seat") return 1.00;
  return 0.85;
}

function getAgeMultiplier(year: number): number {
  const age = 2026 - year;
  if (age <= 3) return 1.10;
  if (age <= 7) return 1.00;
  if (age <= 12) return 0.90;
  return 0.85;
}

function getPaymentMultiplier(payment: PaymentFrequency): number {
  if (payment === "annual") return 0.85;
  if (payment === "semi") return 0.95;
  return 1.00;
}

export interface QuoteResult {
  insurerName: string;
  insurerColor: string;
  yearlyPrice: number;
  monthlyPrice: number;
  features: string[];
  satisfaction: number;
  claimsSpeedDays: number;
  digitalRating: number;
  roadsideAssistance: boolean;
  marketSharePct: number;
}

function getFeatures(ins: Insurer): string[] {
  const f: string[] = [];
  if (ins.claims_speed >= 4) f.push("Fast claims");
  if (ins.digital_rating >= 4) f.push("Online service");
  if (ins.roadside) f.push("Roadside assist");
  if (ins.satisfaction >= 4.0) f.push("High satisfaction");
  return f;
}

export function calculateAllQuotes(
  vehicle: Vehicle,
  bonusMultiplier: number,
  region: RegionType,
  payment: PaymentFrequency,
): QuoteResult[] {
  const powerMult = getPowerMultiplier(vehicle.power_kw);
  const regionMult = getRegionMultiplier(region);
  const ageMult = getAgeMultiplier(vehicle.year);
  const paymentMult = getPaymentMultiplier(payment);

  return insurers
    .map((ins) => {
      const raw =
        ins.base_rate *
        powerMult *
        bonusMultiplier *
        regionMult *
        ageMult *
        paymentMult;
      const yearly = Math.round(raw);

      return {
        insurerName: ins.short_name,
        insurerColor: ins.color,
        yearlyPrice: yearly,
        monthlyPrice: Math.round(yearly / 12),
        features: getFeatures(ins),
        satisfaction: ins.satisfaction,
        claimsSpeedDays: ins.claims_speed_days,
        digitalRating: ins.digital_rating,
        roadsideAssistance: ins.roadside,
        marketSharePct: ins.market_share_pct,
      };
    })
    .sort((a, b) => a.yearlyPrice - b.yearlyPrice);
}

export function getInsurerKnowledge(): Record<string, unknown>[] {
  return insurers.map((ins) => ({
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
