export interface ConversationMessage {
  sender: "agent" | "provider" | "system";
  senderLabel: string;
  text: string;
  time: string;
}

export interface ActivityConversation {
  title: string;
  provider: string;
  providerColor: string;
  outcome: string;
  result: string;
  messages: ConversationMessage[];
}

export const activityConversations: (ActivityConversation | null)[] = [
  // 0: MVM Energy — switch prepared (pending)
  null,

  // 1: KGFB — pending approval
  null,

  // 2: Telekom — analysis
  {
    title: "Telekom Mobile Analysis",
    provider: "Telekom",
    providerColor: "bg-pink-600",
    outcome: "No switch needed",
    result: "Current plan is competitive — no better offer on the market.",
    messages: [
      {
        sender: "system", senderLabel: "System", time: "09:00",
        text: "Automatic market comparison started: Telekom Mobile M plan (€16/mo).",
      },
      {
        sender: "agent", senderLabel: "AI Agent", time: "09:01",
        text: "Checked 3 provider offers: Vodafone (€17), Yettel (€16, but less data), Digi (€12, but limited coverage). Telekom plan offers the best value for your usage patterns.",
      },
      {
        sender: "agent", senderLabel: "AI Agent", time: "09:02",
        text: "Decision: No switch recommended. Next check in 30 days, or if market conditions change.",
      },
    ],
  },

  // 3: Vodafone — successful negotiation
  {
    title: "Vodafone Internet Negotiation",
    provider: "Vodafone",
    providerColor: "bg-red-500",
    outcome: "Successful negotiation — 25% savings",
    result: "Monthly €20 → €15. Annual savings: €60.",
    messages: [
      {
        sender: "agent", senderLabel: "AI Agent", time: "14:32",
        text: "Good day! I'm calling on behalf of our client Anna Kovács, under power of attorney. Her current NetConnect 1000 plan is €20/month. We'd like your current loyalty offer, given that Telekom offers similar speeds for €14/month.",
      },
      {
        sender: "provider", senderLabel: "Vodafone Support", time: "14:33",
        text: "One moment, let me check available offers... We can reduce the current plan to €16/month with a 12-month commitment.",
      },
      {
        sender: "agent", senderLabel: "AI Agent", time: "14:34",
        text: "Thank you for the offer. For our client, Telekom's €14 offer remains more attractive. Is there room for further discount?",
      },
      {
        sender: "provider", senderLabel: "Vodafone Support", time: "14:36",
        text: "Our best offer is €15/month with a 24-month commitment, and we'll upgrade speed to 1 Gbps free of charge.",
      },
      {
        sender: "agent", senderLabel: "AI Agent", time: "14:37",
        text: "I accept this on behalf of our client. Please send the contract amendment confirmation by email. Thank you!",
      },
    ],
  },

  // 4: Allianz — home insurance switch
  {
    title: "Home Insurance Switch",
    provider: "Allianz",
    providerColor: "bg-blue-600",
    outcome: "Successful switch — better coverage, lower price",
    result: "Generali → Allianz. Annual savings: €21, broader coverage.",
    messages: [
      {
        sender: "system", senderLabel: "System", time: "10:00",
        text: "Pre-expiry automatic home insurance comparison started.",
      },
      {
        sender: "agent", senderLabel: "AI Agent", time: "10:02",
        text: "Requested quotes from 5 insurers. Generali current premium: €116/year. Allianz offer: €95/year, broader coverage (pipe burst + electrical short included by default).",
      },
      {
        sender: "agent", senderLabel: "AI Agent", time: "10:05",
        text: "Selected the Allianz offer under client's standing authorization. The switch will happen automatically within the cancellation period, Generali policy terminated.",
      },
      {
        sender: "provider", senderLabel: "Allianz Insurance", time: "10:12",
        text: "Thank you for the contract. Policy number and details will be sent to the client by email.",
      },
    ],
  },

  // 5: OTP Bank — analysis only
  null,

  // 6: CIB Card — cancellation prepared
  null,

  // 7: Digi TV — successful downgrade
  {
    title: "Digi TV Plan Downgrade",
    provider: "Digi",
    providerColor: "bg-cyan-600",
    outcome: "Successful plan change — unused channels removed",
    result: "Monthly €16 → €10. Annual savings: €75.",
    messages: [
      {
        sender: "system", senderLabel: "System", time: "11:00",
        text: "Subscription usage analysis: of the 87 channels in the Digi TV Premium plan, only 12 were watched in the last 90 days.",
      },
      {
        sender: "agent", senderLabel: "AI Agent", time: "11:02",
        text: "The Digi Basic plan includes all 12 watched channels for €10/month. Initiating plan change under client's standing authorization.",
      },
      {
        sender: "agent", senderLabel: "AI Agent", time: "11:03",
        text: "Good day! Calling on behalf of Anna Kovács, requesting plan change: Premium → Basic. Account ID: DG-2024-1847.",
      },
      {
        sender: "provider", senderLabel: "Digi Support", time: "11:05",
        text: "Understood, the plan change will take effect from the next billing cycle. Confirmation will be sent by email.",
      },
    ],
  },
];
