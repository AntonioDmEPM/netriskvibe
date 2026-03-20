export interface ConversationMessage {
  sender: "agent" | "provider" | "system";
  senderLabel_hu: string;
  senderLabel_en: string;
  text_hu: string;
  text_en: string;
  time: string;
}

export interface ActivityConversation {
  title_hu: string;
  title_en: string;
  provider: string;
  providerColor: string;
  outcome_hu: string;
  outcome_en: string;
  result_hu: string;
  result_en: string;
  messages: ConversationMessage[];
}

// Index matches feedItems order in ActivityFeed
// null = no conversation available (pending/not yet acted on)
export const activityConversations: (ActivityConversation | null)[] = [
  // 0: MVM Energy — switch prepared (pending, no conversation yet)
  null,

  // 1: KGFB — pending approval, no conversation yet
  null,

  // 2: Telekom — analysis (completed analysis, has log)
  {
    title_hu: "Telekom mobil elemzés",
    title_en: "Telekom Mobile Analysis",
    provider: "Telekom",
    providerColor: "bg-pink-600",
    outcome_hu: "Nincs szükség váltásra",
    outcome_en: "No switch needed",
    result_hu: "A jelenlegi csomag versenyképes — nincs jobb ajánlat a piacon.",
    result_en: "Current plan is competitive — no better offer on the market.",
    messages: [
      {
        sender: "system", senderLabel_hu: "Rendszer", senderLabel_en: "System", time: "09:00",
        text_hu: "Automatikus piaci összehasonlítás indítva: Telekom Mobil M csomag (6 490 Ft/hó).",
        text_en: "Automatic market comparison started: Telekom Mobile M plan (6,490 HUF/mo).",
      },
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "09:01",
        text_hu: "3 szolgáltató ajánlatát ellenőriztem: Vodafone (6 990 Ft), Yettel (6 290 Ft, de kevesebb adat), Digi (4 990 Ft, de korlátozott lefedettség). A Telekom csomag ár-érték arányban a legjobb az Ön használati szokásaihoz.",
        text_en: "Checked 3 provider offers: Vodafone (6,990 HUF), Yettel (6,290 HUF, but less data), Digi (4,990 HUF, but limited coverage). Telekom plan offers the best value for your usage patterns.",
      },
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "09:02",
        text_hu: "Döntés: Nem javaslok váltást. A következő ellenőrzést 30 nap múlva végzem, vagy ha piaci változás történik.",
        text_en: "Decision: No switch recommended. Next check in 30 days, or if market conditions change.",
      },
    ],
  },

  // 3: Vodafone — successful negotiation
  {
    title_hu: "Vodafone internet tárgyalás",
    title_en: "Vodafone Internet Negotiation",
    provider: "Vodafone",
    providerColor: "bg-red-500",
    outcome_hu: "Sikeres tárgyalás — 25% megtakarítás",
    outcome_en: "Successful negotiation — 25% savings",
    result_hu: "Havi 7 990 Ft → 5 990 Ft. Éves megtakarítás: 24 000 Ft.",
    result_en: "Monthly 7,990 → 5,990 HUF. Annual savings: 24,000 HUF.",
    messages: [
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "14:32",
        text_hu: "Jó napot! Kovács Anna ügyfelünk nevében hívom, meghatalmazás alapján. A jelenlegi NetConnect 1000 csomagja havi 7 990 Ft. Szeretnénk az aktuális hűségajánlatukat kérni, tekintettel arra, hogy a Telekom hasonló sebességet havi 5 490 Ft-ért kínálja.",
        text_en: "Good day! I'm calling on behalf of our client Anna Kovács, under power of attorney. Her current NetConnect 1000 plan is 7,990 HUF/month. We'd like your current loyalty offer, given that Telekom offers similar speeds for 5,490 HUF/month.",
      },
      {
        sender: "provider", senderLabel_hu: "Vodafone Ügyfélszolgálat", senderLabel_en: "Vodafone Support", time: "14:33",
        text_hu: "Egy pillanat, megnézem az elérhető ajánlatainkat... A jelenlegi csomagját tudjuk havi 6 490 Ft-ra csökkenteni 12 hónapos hűségvállalással.",
        text_en: "One moment, let me check available offers... We can reduce the current plan to 6,490 HUF/month with a 12-month commitment.",
      },
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "14:34",
        text_hu: "Köszönöm az ajánlatot. Az ügyfelünk számára a Telekom 5 490 Ft-os ajánlata továbbra is kedvezőbb. Van lehetőség további kedvezményre?",
        text_en: "Thank you for the offer. For our client, Telekom's 5,490 HUF offer remains more attractive. Is there room for further discount?",
      },
      {
        sender: "provider", senderLabel_hu: "Vodafone Ügyfélszolgálat", senderLabel_en: "Vodafone Support", time: "14:36",
        text_hu: "A legjobb ajánlatunk havi 5 990 Ft, 24 hónapos hűségvállalással, és a sebességet 1 Gbps-re emeljük díjmentesen.",
        text_en: "Our best offer is 5,990 HUF/month with a 24-month commitment, and we'll upgrade speed to 1 Gbps free of charge.",
      },
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "14:37",
        text_hu: "Ezt elfogadom az ügyfelünk nevében. Kérem a szerződésmódosítás visszaigazolását emailben. Köszönöm!",
        text_en: "I accept this on behalf of our client. Please send the contract amendment confirmation by email. Thank you!",
      },
    ],
  },

  // 4: Allianz — home insurance switch
  {
    title_hu: "Lakásbiztosítás váltás",
    title_en: "Home Insurance Switch",
    provider: "Allianz",
    providerColor: "bg-blue-600",
    outcome_hu: "Sikeres váltás — jobb fedezet, alacsonyabb díj",
    outcome_en: "Successful switch — better coverage, lower price",
    result_hu: "Generali → Allianz. Éves megtakarítás: 8 200 Ft, bővebb fedezeti kör.",
    result_en: "Generali → Allianz. Annual savings: 8,200 HUF, broader coverage.",
    messages: [
      {
        sender: "system", senderLabel_hu: "Rendszer", senderLabel_en: "System", time: "10:00",
        text_hu: "Lakásbiztosítás lejárat előtti automatikus összehasonlítás indítva.",
        text_en: "Pre-expiry automatic home insurance comparison started.",
      },
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "10:02",
        text_hu: "5 biztosító ajánlatát kértem le. A Generali jelenlegi díja: 46 200 Ft/év. Az Allianz ajánlata: 38 000 Ft/év, bővebb fedezeti kör (csőtörés + elektromos zárlat alapból benne van).",
        text_en: "Requested quotes from 5 insurers. Generali current premium: 46,200 HUF/year. Allianz offer: 38,000 HUF/year, broader coverage (pipe burst + electrical short included by default).",
      },
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "10:05",
        text_hu: "Az Allianz ajánlatot kiválasztottam az ügyfél meghatalmazása alapján. A váltás felmondási időn belül automatikusan megtörténik, a Generali-t felmondtam.",
        text_en: "Selected the Allianz offer under client's standing authorization. The switch will happen automatically within the cancellation period, Generali policy terminated.",
      },
      {
        sender: "provider", senderLabel_hu: "Allianz Biztosító", senderLabel_en: "Allianz Insurance", time: "10:12",
        text_hu: "Köszönjük a szerződéskötést. A kötvényszámot és a részleteket emailben küldjük el az ügyfélnek.",
        text_en: "Thank you for the contract. Policy number and details will be sent to the client by email.",
      },
    ],
  },

  // 5: OTP Bank — analysis only (pending confirmation)
  null,

  // 6: CIB Card — cancellation prepared (pending approval)
  null,

  // 7: Digi TV — successful downgrade
  {
    title_hu: "Digi TV csomag váltás",
    title_en: "Digi TV Plan Downgrade",
    provider: "Digi",
    providerColor: "bg-cyan-600",
    outcome_hu: "Sikeres csomagváltás — felesleges csatornák eltávolítva",
    outcome_en: "Successful plan change — unused channels removed",
    result_hu: "Havi 6 490 Ft → 3 990 Ft. Éves megtakarítás: 30 000 Ft.",
    result_en: "Monthly 6,490 → 3,990 HUF. Annual savings: 30,000 HUF.",
    messages: [
      {
        sender: "system", senderLabel_hu: "Rendszer", senderLabel_en: "System", time: "11:00",
        text_hu: "Előfizetés-használat elemzés: a Digi TV Premium csomag 87 csatornájából az elmúlt 90 napban csak 12-t néztek.",
        text_en: "Subscription usage analysis: of the 87 channels in the Digi TV Premium plan, only 12 were watched in the last 90 days.",
      },
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "11:02",
        text_hu: "A Digi Alap csomag tartalmazza mind a 12 nézett csatornát, havi 3 990 Ft-ért. Csomagváltást kezdeményezem az ügyfél általános meghatalmazása alapján.",
        text_en: "The Digi Basic plan includes all 12 watched channels for 3,990 HUF/month. Initiating plan change under client's standing authorization.",
      },
      {
        sender: "agent", senderLabel_hu: "AI Ügynök", senderLabel_en: "AI Agent", time: "11:03",
        text_hu: "Jó napot! Kovács Anna nevében hívom, csomagváltást szeretnék: Premium → Alap csomag. A fiók azonosítója: DG-2024-1847.",
        text_en: "Good day! Calling on behalf of Anna Kovács, requesting plan change: Premium → Basic. Account ID: DG-2024-1847.",
      },
      {
        sender: "provider", senderLabel_hu: "Digi Ügyfélszolgálat", senderLabel_en: "Digi Support", time: "11:05",
        text_hu: "Rendben, a csomagváltás a következő számlázási ciklustól érvényes. A változásról emailben küldünk visszaigazolást.",
        text_en: "Understood, the plan change will take effect from the next billing cycle. Confirmation will be sent by email.",
      },
    ],
  },
];
