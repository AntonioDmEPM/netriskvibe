export type ContractStatus = "optimized" | "better" | "monitoring" | "approval";

export interface Contract {
  id: string;
  provider: string;
  letter: string;
  letterColor: string;
  type: string;
  monthly: number;
  status: ContractStatus;
}

export const contracts: Contract[] = [
  { id: "kobe-kgfb", provider: "KÖBE", letter: "K", letterColor: "bg-secondary text-white", type: "MTPL Insurance", monthly: 8, status: "approval" },
  { id: "allianz-home", provider: "Allianz", letter: "A", letterColor: "bg-blue-600 text-white", type: "Home Insurance", monthly: 10, status: "optimized" },
  { id: "mvm-energy", provider: "MVM", letter: "M", letterColor: "bg-red-600 text-white", type: "Energy (electricity+gas)", monthly: 46, status: "better" },
  { id: "vodafone-net", provider: "Vodafone", letter: "V", letterColor: "bg-red-500 text-white", type: "Internet", monthly: 15, status: "optimized" },
  { id: "telekom-mobile", provider: "Telekom", letter: "T", letterColor: "bg-pink-600 text-white", type: "Mobile", monthly: 16, status: "monitoring" },
  { id: "otp-bank", provider: "OTP", letter: "O", letterColor: "bg-green-700 text-white", type: "Bank Account", monthly: 3, status: "better" },
  { id: "cib-card", provider: "CIB", letter: "C", letterColor: "bg-indigo-700 text-white", type: "Credit Card", monthly: 1, status: "approval" },
  { id: "digi-tv", provider: "Digi", letter: "D", letterColor: "bg-cyan-600 text-white", type: "TV Subscription", monthly: 10, status: "optimized" },
];

export const statusConfig: Record<ContractStatus, { label: string; className: string }> = {
  optimized: { label: "✅ Optimized", className: "bg-primary/10 text-primary border-primary/20" },
  better: { label: "⚡ Better deal available", className: "bg-orange-50 text-orange-700 border-orange-200" },
  monitoring: { label: "🔍 Monitoring", className: "bg-blue-50 text-blue-700 border-blue-200" },
  approval: { label: "⚠️ Approval needed", className: "bg-amber-50 text-amber-700 border-amber-200" },
};
