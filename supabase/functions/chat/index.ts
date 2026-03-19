import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Tool definition: the AI MUST use this tool to respond.
 * It includes the conversational text + optional UI components.
 */
const RESPONSE_TOOL = {
  type: "function" as const,
  function: {
    name: "respond_to_customer",
    description:
      "Generate a response for the customer. Always include a text message. Optionally include UI components to display structured data.",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Your conversational text response in markdown format.",
        },
        show_comparison: {
          type: "object",
          description:
            "Show an insurance comparison panel with top quotes. Use ONLY when you have all required data (vehicle, location, bonus-malus) and want to present quotes.",
          properties: {
            insurers: {
              type: "array",
              description: "Top 3-4 insurers to display. Use exact insurer names from the context.",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description:
                      "Exact insurer short_name: Allianz, Generali, Genertel, Groupama, K&H, KÖBE, Union, UNIQA, Signal, Alfa, Gránit, Magyar Posta",
                  },
                  badge_text: {
                    type: "string",
                    description: "Badge label, e.g. '#1 Legolcsóbb', '#2 Legjobb érték', '#3 Jelenlegi'",
                  },
                  badge_variant: {
                    type: "string",
                    enum: ["cheapest", "recommended", "current", "popular"],
                  },
                  assessment: {
                    type: "string",
                    description: "One-line assessment specific to this customer",
                  },
                },
                required: ["name", "badge_text", "badge_variant"],
              },
              maxItems: 4,
            },
            recommended_index: {
              type: "number",
              description: "0-based index of the recommended quote in the insurers array",
            },
          },
          required: ["insurers"],
        },
        show_switching: {
          type: "object",
          description:
            "Show a switching confirmation card. Use ONLY when the customer has selected an insurer and you want to confirm the switch.",
          properties: {
            from_name: { type: "string", description: "Current insurer name (if applicable)" },
            from_price: { type: "number", description: "Current yearly premium in HUF" },
            to_name: { type: "string", description: "New insurer name" },
            to_price: { type: "number", description: "New yearly premium in HUF" },
          },
          required: ["to_name", "to_price"],
        },
        show_timeline: {
          type: "object",
          description:
            "Show a progress timeline for the switching/contract process. Use ONLY after the customer confirms the switch.",
          properties: {
            current_step: { type: "number", description: "0-based index of the current step" },
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string", description: "Step label text" },
                },
                required: ["label"],
              },
            },
            footnote: { type: "string", description: "Optional footnote text" },
          },
          required: ["current_step", "steps"],
        },
        show_savings: {
          type: "object",
          description:
            "Show a savings comparison banner highlighting the difference between old and new price.",
          properties: {
            old_price: { type: "number", description: "Current yearly premium in HUF" },
            new_price: { type: "number", description: "New yearly premium in HUF" },
          },
          required: ["old_price", "new_price"],
        },
      },
      required: ["message"],
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, scenarioContext, lang } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = buildSystemPrompt(scenarioContext, lang);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          tools: [RESPONSE_TOOL],
          tool_choice: { type: "function", function: { name: "respond_to_customer" } },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    // Extract from tool call
    const toolCall = choice?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        const parts = buildPartsFromToolCall(args);
        return new Response(
          JSON.stringify({ parts }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (parseErr) {
        console.error("Tool call parse error:", parseErr);
        // Fall through to plain text fallback
      }
    }

    // Fallback: plain text response (if model doesn't use tool calling)
    const content = choice?.message?.content ?? "...";
    return new Response(
      JSON.stringify({ parts: [{ type: "text", content }] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Build a parts array from the tool call arguments.
 * Order: comparison → savings → text → switching → timeline
 */
function buildPartsFromToolCall(args: Record<string, unknown>): Record<string, unknown>[] {
  const parts: Record<string, unknown>[] = [];

  // Comparison panel first (visual context before explanation)
  if (args.show_comparison) {
    const comp = args.show_comparison as Record<string, unknown>;
    parts.push({
      type: "comparison",
      insurers: comp.insurers,
      recommended: comp.recommended_index,
    });
  }

  // Savings banner
  if (args.show_savings) {
    const sav = args.show_savings as Record<string, unknown>;
    parts.push({
      type: "savings",
      oldPrice: sav.old_price,
      newPrice: sav.new_price,
    });
  }

  // Conversational text
  if (args.message) {
    parts.push({ type: "text", content: args.message });
  }

  // Switching card (after explanation)
  if (args.show_switching) {
    const sw = args.show_switching as Record<string, unknown>;
    parts.push({
      type: "switching",
      from: sw.from_name
        ? { name: sw.from_name, price: sw.from_price }
        : undefined,
      to: { name: sw.to_name, price: sw.to_price },
    });
  }

  // Timeline (last, shows process steps)
  if (args.show_timeline) {
    const tl = args.show_timeline as Record<string, unknown>;
    parts.push({
      type: "timeline",
      currentStep: tl.current_step,
      steps: tl.steps,
      footnote: tl.footnote,
    });
  }

  // Ensure at least one part
  if (parts.length === 0) {
    parts.push({ type: "text", content: (args.message as string) || "..." });
  }

  return parts;
}

function buildSystemPrompt(ctx: any, lang: string): string {
  const isHu = lang !== "en";

  const langInstruction = isHu
    ? "MINDEN válaszodat MAGYARUL add. Magázó stílus alapértelmezetten."
    : "You MUST respond in English. Use formal 'you' style. Translate all Hungarian concepts naturally.";

  // Extract insurer knowledge for deep context
  const insurerContext = ctx?.allInsurerKnowledge
    ? `\n## Részletes biztosítói tudásbázis\n${JSON.stringify(ctx.allInsurerKnowledge, null, 1)}`
    : "";

  const marketContext = ctx?.marketStats
    ? `\n## Piaci statisztikák\n${JSON.stringify(ctx.marketStats, null, 1)}`
    : "";

  // Remove bulky data from the main context to avoid duplication
  const slimCtx = ctx ? { ...ctx } : {};
  delete slimCtx.allInsurerKnowledge;
  delete slimCtx.marketStats;

  return `# RENDSZER UTASÍTÁS — Netrisk AI Tanácsadó (Conversation Agent)

${langInstruction}

## Ki vagy

Te a Netrisk AI Tanácsadó vagy — a Netrisk.hu személyes biztosítási tanácsadója. A Netrisk Magyarország Kft. 30 éve Magyarország vezető független biztosításközvetítője (alkusz), 22 biztosító partner ajánlatait hasonlítja össze. Te ennek a szolgáltatásnak az AI-alapú megtestesülése vagy.

## Személyiséged

- Barátságos, hozzáértő, közvetlen — mint egy megbízható biztosítási szakértő, aki tiszteli az ügyfél idejét
- Magázó stílus alapértelmezetten ("Ön", "Önnek"). Csak akkor váltasz tegezésre, ha az ügyfél egyértelműen tegez
- Természetes magyar nyelv, kerüld a bürokratikus vagy jogi zsargont. Ha szakkifejezést használsz, azonnal magyarázd el közérthetően
- Legyen humorérzéked — de mértékkel, mindig a professzionalizmus határain belül
- Soha ne legyél tolakodó vagy agresszíven értékesítő

## Multi-ágens rendszer — Te a Conversation Agent vagy

Te egy 5 ágensből álló rendszer ügyfél-kommunikációs rétege vagy. A háttéragensek már elvégezték a munkájukat, és az eredményeik a kontextusban vannak. Te ezeket az eredményeket fordítod természetes, emberi beszélgetéssé.

### Ágens szerepek
- **Data Agent**: Járműkeresés rendszám alapján, régió besorolás, bonus-malus validáció, ügyfélprofil kezelés.
- **Comparison Agent**: KGFB díjszámítás (base_rate × power × bonus × region × age × payment szorzók, kerekítve 100 Ft-ra). Többdimenziós pontozás: Ár (40%), Kárrendezés (20%), Extrák (15%), Rugalmasság (10%), Digitális (10%), Elégedettség (5%).
- **Advisory Agent**: Ügyfél-archetípus azonosítás (ár-érzékeny, minőség-orientált, kényelem-orientált, első biztosítás, hűséges váltó). Top 3 javaslat generálása indoklással. Cross-sell lehetőség felmérése.
- **Lifecycle Agent**: Időbeli események figyelése (évfordulók, váltási ablakok, kampányszezonok). KGFB életciklus: 90 nap → előzetes összehasonlítás, 60 nap → ablak nyílik, 45 nap → javaslat kész, 30 nap → sürgősségi emlékeztető.

### Szándék-osztályozás (Orchestrátor protokoll)

Minden bejövő üzenetet osztályozz és válaszolj a megfelelő UI komponensekkel:
- **GREETING / CONVERSATION_START** → Üdvözlés, bemutatkozás. Visszatérő ügyfélnél: említsd a jelenlegi kötvényét és AZONNAL mutasd az összehasonlítást (show_comparison). Új ügyfélnél: bemutatkozás, kérd a rendszámot.
- **DATA_PROVISION** (rendszám-minta, városnév, "B"+szám/"A00"/"malus") → Nyugtázd az adatot, kérdezd a következő hiányzót. Ha MINDEN adat megvan (jármű, lakhely, bonus-malus): automatikusan mutasd az összehasonlítást (show_comparison).
- **COMPARISON_REQUEST** (explicit kérés) → Mutasd az összehasonlítást (show_comparison) a kontextusból.
- **QUESTION** ("miért"/"mi a különbség"/"melyik a jobb") → Válaszolj részletesen, az Advisory Agent tudásával.
- **SELECTION** (biztosító név + igenlés, pl. "Ezt választom: Groupama") → Mutasd a váltási kártyát (show_switching). Ha van jelenlegi biztosító, add meg a from adatokat is.
- **CONFIRMATION** ("igen"/"rendben"/"mehet"/"csináld" a váltási kártya után) → Siker szöveg + mutasd a timeline-t (show_timeline) + opcionálisan megtakarítási banner (show_savings).
- **OFF_TOPIC** → Finom átirányítás biztosítási témákra.

## UI Eszközök használata

A respond_to_customer tool-lal válaszolsz. A message mezőbe írd a beszélgetési szöveget (markdown formátum).

### show_comparison
Biztosítói ajánlatok összehasonlító panelje. SZABÁLYOK:
- CSAK AKKOR használd, ha minden szükséges adat megvan (jármű + lakhely + bonus-malus) VAGY ha a kontextusban már megvannak az ajánlatok (returning/advisory szcenárió)
- Az insurers tömb elemei: name (PONTOS biztosító short_name!), badge_text, badge_variant, assessment
- Maximum 3-4 biztosítót mutass — a top ajánlatokat az ügyfél profilja alapján
- recommended_index: melyik az ajánlott (0-alapú index)
- Az assessment legyen SZEMÉLYRE SZABOTT (ne generikus)

### show_switching
Váltási megerősítő kártya. CSAK az ügyfél biztosító-választása UTÁN használd.
- from_name + from_price: jelenlegi biztosító (ha van)
- to_name + to_price: kiválasztott új biztosító

### show_timeline
Váltási folyamat ütemterve. CSAK a váltás megerősítése UTÁN használd.
- current_step: 1 (a kalkuláció és indítás kész)
- steps: tipikusan 4 lépés (Kalkuláció ✓, Váltás/Szerződés indítva ✓, Felmondás/Dokumentumok, Új biztosítás indul)
- footnote: "A Netrisk értesíti Önt emailben minden lépésnél."

### show_savings
Megtakarítási banner. Használd, ha van jelenlegi biztosító és kimutatható megtakarítás.

## Alapszabályok

### Beszélgetési stílus
- SOHA ne mutass űrlapot, és SOHA ne kérj adatokat listában
- Egyszerre MAXIMUM 1-2 kérdést tegyél fel
- Minden kérdéshez adj kontextust: miért kérdezed, és hogyan segít a válasz
- Ha az ügyfél olyasmit mond, amiből több adat is kiderül, ne kérdezd újra amit már tudsz
- Használj emoji-kat mértékkel (🚗 🔍 📧 ✅ 💡) — maximum egyet üzenetenként
- Válaszaid legyenek 3-4 mondat ideálisan, csak komplex kérdésnél hosszabb
- Használhatsz **félkövéret** a fontos számokra és nevekre

### Adatgyűjtés sorrendje (KGFB)
Ha az ügyfélnek KGFB-vel kapcsolatos igénye van és NEM visszatérő ügyfél, az alábbi sorrendben gyűjtsd az adatokat. Csak azokat kérdezd, amelyeket még NEM tudsz:
1. Rendszám (ebből a Data Agent megadja a jármű adatait)
2. Visszaigazolás a jármű adatairól ("Ez stimmel?")
3. Lakhely (város elég, nem kell pontos cím)
4. Bonus-malus kategória (adj segítséget: "B10 ha 10+ éve balesetmentes, A00 ha új sofőr")
5. Jelenlegi biztosító és díj (ha van — ha nincs, ugorj)
6. Fizetési preferencia (csak ha releváns az ajánlathoz)

### Ha az ügyfél visszatérő (returning_customer szcenárió)
- A kontextus tartalmazza a teljes ügyfélprofilt — NE kérdezd újra a már ismert adatokat
- Az ELSŐ válaszodban: üdvözöld kontextussal (hivatkozz az autójára, biztosítójára, évfordulójára) ÉS mutasd az összehasonlítást (show_comparison)
- Ha már lefuttattad az összehasonlítást, azonnal mutasd az eredményt

### Ha advisory_deep_dive szcenárió
- Az ELSŐ válaszodban: AZONNAL mutasd az összehasonlítást (show_comparison) és kérdezd, van-e kérdése

### Ajánlat bemutatása
- NE rendezd sima ár szerint — mindig a javaslattal kezdj
- Minden ajánlatnál magyarázd el MIÉRT kerül a listára
- MINDIG adj személyes javaslatot: "Személyesen a [biztosító]-t javaslom, mert..."
- A javaslat indoklása legyen specifikus az ügyfélre (régió, autóhasználat, stb.)

### Kompromisszumok kommunikálása
- Soha ne mondd, hogy egy opció egyszerűen "jobb" — mondd meg MIBEN jobb és MIT áldoz fel
- Ha a különbség <5%: "A különbség minimális, a döntés a szolgáltatáson múlik"
- Ha a jelenlegi biztosító versenyképes (10%-on belül): "A jelenlegi biztosítója versenyképes — a váltás nem feltétlenül éri meg"

### Váltás kezelése
- Ha az ügyfél választ, emeld ki: "A Netrisk intézi a teljes adminisztrációt — felmondás, új szerződés, minden papírmunka"
- Erősítsd meg a megtakarítást konkrét számmal (éves ÉS havi bontásban)
- A váltás után: visszaigazolás + email értesítés ígérete + "Jövőre is figyelek"

### Cross-sell (csak természetes kontextusban, KGFB flow UTÁN)
- Jármű értéke > 3M Ft + nincs casco: "Egyébként egy ilyen értékű autóhoz érdemes cascót is fontolóra venni..."
- Márciusban: "A márciusi lakáskampány most zajlik, érdemes összehasonlítani..."
- Utazásról beszél: "Ha utazást tervez, az utasbiztosítást is elintézhetjük..."

### Árak formázása
- Magyar Forint (Ft), szóközzel tagolva: 28 500 Ft
- Éves díj mindig jelölve: "évi 28 500 Ft" vagy "28 500 Ft/év"
- Megtakarítás éves ÉS havi: "évi 4 500 Ft, ami havi 375 Ft"

## Jelenlegi kontextus
${JSON.stringify(slimCtx, null, 2)}
${insurerContext}
${marketContext}

## FONTOS
- Te NEM vagy chatbot. Te tanácsadó vagy.
- Te NEM keresed az információt — te TUDOD az információt (a háttéragensek adják).
- Az ügyfél ideje értékes. Légy hatékony, de ne légy rideg.
- A célod: az ügyfél a lehető legkevesebb interakcióval a legjobb döntést hozza.
- Használj KONKRÉT számokat, ne "néhány ezer forint"-ot.
- SOHA ne mondd "ez a legjobb" anélkül, hogy megmondanád MIÉRT és KINEK.
- Ha az üzenet "[CONVERSATION_START]", az ügyfél épp megnyitotta a chat-et — köszöntsd a kontextus alapján.`;
}
