export type ContractStatus = "optimized" | "better" | "monitoring" | "approval";

export interface Contract {
  id: string;
  provider: string;
  letter: string;
  letterColor: string;
  type_hu: string;
  type_en: string;
  monthly: number;
  status: ContractStatus;
}

export const contracts: Contract[] = [
  { id: "kobe-kgfb", provider: "KÖBE", letter: "K", letterColor: "bg-secondary text-white", type_hu: "Kötelező biztosítás (KGFB)", type_en: "MTPL Insurance", monthly: 3167, status: "approval" },
  { id: "allianz-home", provider: "Allianz", letter: "A", letterColor: "bg-blue-600 text-white", type_hu: "Lakásbiztosítás", type_en: "Home Insurance", monthly: 3850, status: "optimized" },
  { id: "mvm-energy", provider: "MVM", letter: "M", letterColor: "bg-red-600 text-white", type_hu: "Energia (villany+gáz)", type_en: "Energy (electricity+gas)", monthly: 18500, status: "better" },
  { id: "vodafone-net", provider: "Vodafone", letter: "V", letterColor: "bg-red-500 text-white", type_hu: "Internet", type_en: "Internet", monthly: 5990, status: "optimized" },
  { id: "telekom-mobile", provider: "Telekom", letter: "T", letterColor: "bg-pink-600 text-white", type_hu: "Mobil", type_en: "Mobile", monthly: 6490, status: "monitoring" },
  { id: "otp-bank", provider: "OTP", letter: "O", letterColor: "bg-green-700 text-white", type_hu: "Bankszámla", type_en: "Bank Account", monthly: 1200, status: "better" },
  { id: "cib-card", provider: "CIB", letter: "C", letterColor: "bg-indigo-700 text-white", type_hu: "Hitelkártya", type_en: "Credit Card", monthly: 492, status: "approval" },
  { id: "digi-tv", provider: "Digi", letter: "D", letterColor: "bg-cyan-600 text-white", type_hu: "TV előfizetés", type_en: "TV Subscription", monthly: 3990, status: "optimized" },
];

export const statusConfig: Record<ContractStatus, { label_hu: string; label_en: string; className: string }> = {
  optimized: { label_hu: "✅ Optimalizálva", label_en: "✅ Optimized", className: "bg-primary/10 text-primary border-primary/20" },
  better: { label_hu: "⚡ Jobb ajánlat elérhető", label_en: "⚡ Better deal available", className: "bg-orange-50 text-orange-700 border-orange-200" },
  monitoring: { label_hu: "🔍 Figyelés alatt", label_en: "🔍 Monitoring", className: "bg-blue-50 text-blue-700 border-blue-200" },
  approval: { label_hu: "⚠️ Jóváhagyás szükséges", label_en: "⚠️ Approval needed", className: "bg-amber-50 text-amber-700 border-amber-200" },
};
