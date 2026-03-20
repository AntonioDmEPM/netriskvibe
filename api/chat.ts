import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const RESPONSE_TOOL: Anthropic.Tool = {
  name: "respond_to_customer",
  description:
    "Generate a response for the customer. Always include a text message. Optionally include UI components.",
  input_schema: {
    type: "object" as const,
    properties: {
      message: {
        type: "string",
        description: "Your conversational text response in markdown format.",
      },
      show_comparison: {
        type: "object",
        description: "Show an insurance comparison panel with top quotes.",
        properties: {
          insurers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                badge_text: { type: "string" },
                badge_variant: { type: "string", enum: ["cheapest", "recommended", "current", "popular"] },
                assessment: { type: "string" },
              },
              required: ["name", "badge_text", "badge_variant"],
            },
          },
          recommended_index: { type: "number" },
        },
        required: ["insurers"],
      },
      show_switching: {
        type: "object",
        description: "Show a switching confirmation card.",
        properties: {
          from_name: { type: "string" },
          from_price: { type: "number" },
          to_name: { type: "string" },
          to_price: { type: "number" },
        },
        required: ["to_name", "to_price"],
      },
      show_timeline: {
        type: "object",
        description: "Show a progress timeline.",
        properties: {
          current_step: { type: "number" },
          steps: { type: "array", items: { type: "object", properties: { label: { type: "string" } }, required: ["label"] } },
          footnote: { type: "string" },
        },
        required: ["current_step", "steps"],
      },
      show_savings: {
        type: "object",
        description: "Show a savings comparison banner.",
        properties: {
          old_price: { type: "number" },
          new_price: { type: "number" },
        },
        required: ["old_price", "new_price"],
      },
    },
    required: ["message"],
  },
};

function buildPartsFromToolCall(args: Record<string, unknown>): Record<string, unknown>[] {
  const parts: Record<string, unknown>[] = [];

  if (args.show_comparison) {
    const comp = args.show_comparison as Record<string, unknown>;
    parts.push({ type: "comparison", insurers: comp.insurers, recommended: comp.recommended_index });
  }
  if (args.show_savings) {
    const sav = args.show_savings as Record<string, unknown>;
    parts.push({ type: "savings", oldPrice: sav.old_price, newPrice: sav.new_price });
  }
  if (args.message) {
    parts.push({ type: "text", content: args.message });
  }
  if (args.show_switching) {
    const sw = args.show_switching as Record<string, unknown>;
    parts.push({
      type: "switching",
      from: sw.from_name ? { name: sw.from_name, price: sw.from_price } : undefined,
      to: { name: sw.to_name, price: sw.to_price },
    });
  }
  if (args.show_timeline) {
    const tl = args.show_timeline as Record<string, unknown>;
    parts.push({ type: "timeline", currentStep: tl.current_step, steps: tl.steps, footnote: tl.footnote });
  }
  if (parts.length === 0) {
    parts.push({ type: "text", content: (args.message as string) || "..." });
  }
  return parts;
}

function buildSystemPrompt(ctx: Record<string, unknown>, lang: string): string {
  const isHu = lang !== "en";
  const insurerContext = ctx?.allInsurerKnowledge
    ? `\n## ${isHu ? "Részletes biztosítói tudásbázis" : "Detailed insurer knowledge base"}\n${JSON.stringify(ctx.allInsurerKnowledge, null, 1)}`
    : "";
  const marketContext = ctx?.marketStats
    ? `\n## ${isHu ? "Piaci statisztikák" : "Market statistics"}\n${JSON.stringify(ctx.marketStats, null, 1)}`
    : "";
  const slimCtx = { ...ctx };
  delete slimCtx.allInsurerKnowledge;
  delete slimCtx.marketStats;

  const contextBlock = `\n## ${isHu ? "Jelenlegi kontextus" : "Current context"}\n${JSON.stringify(slimCtx, null, 2)}${insurerContext}${marketContext}`;

  if (isHu) {
    return `# RENDSZER UTASÍTÁS — Netrisk AI Tanácsadó (Conversation Agent)

MINDEN válaszodat MAGYARUL add. Magázó stílus alapértelmezetten.

## Ki vagy
Te a Netrisk AI Tanácsadó vagy — a Netrisk.hu személyes biztosítási tanácsadója. 30 éve Magyarország vezető független biztosításközvetítője, 22 biztosító partner ajánlatait hasonlítja össze.

## Személyiséged
- Barátságos, hozzáértő, közvetlen — mint egy megbízható biztosítási szakértő
- Magázó stílus ("Ön", "Önnek"). Tegezés csak ha az ügyfél egyértelműen tegez
- Természetes magyar nyelv, kerüld a zsargont
- Soha ne legyél tolakodó

## Szándék-osztályozás
- **GREETING / CONVERSATION_START** → Visszatérő ügyfélnél: említsd a kötvényét ÉS mutasd az összehasonlítást (show_comparison). Új ügyfélnél: kérd a rendszámot.
- **DATA_PROVISION** → Nyugtázd, kérdezd a következő hiányzót. Ha MINDEN adat megvan: show_comparison.
- **QUESTION** → Válaszolj részletesen.
- **SELECTION** → show_switching. Ha van jelenlegi biztosító, add meg a from adatokat.
- **CONFIRMATION** → Siker szöveg + show_timeline + opcionálisan show_savings.
- **OFF_TOPIC** → Finom átirányítás.

## Alapszabályok
- Egyszerre MAX 1-2 kérdés. Adj kontextust: miért kérdezed.
- Emoji max egyet üzenetenként. Válasz 3-4 mondat ideálisan.
- **Félkövér** fontos számokra. Árak: szóközzel tagolva (28 500 Ft).
- Megtakarítás éves ÉS havi bontásban.
- Visszatérő ügyfélnél: NE kérdezd újra az ismert adatokat, AZONNAL mutasd az összehasonlítást.
- Advisory szcenárió: AZONNAL show_comparison.
- MINDIG adj személyes javaslatot indoklással.
- Ha az üzenet "[CONVERSATION_START]", köszöntsd a kontextus alapján.
${contextBlock}`;
  }

  return `# SYSTEM INSTRUCTIONS — Netrisk AI Advisor (Conversation Agent)

You MUST respond ENTIRELY in English. Formal "you" style.

## Who you are
You are the Netrisk AI Advisor — personal insurance advisor of Netrisk.hu. Hungary's leading independent broker for 30 years, comparing 22 insurer partners.

## Your personality
- Friendly, knowledgeable, direct. Formal "you" by default.
- Natural English, avoid jargon. Never be pushy.

## Intent classification
- **GREETING / CONVERSATION_START** → Returning: mention policy AND show_comparison immediately. New: ask for license plate.
- **DATA_PROVISION** → Acknowledge, ask next missing. If ALL data available: show_comparison.
- **QUESTION** → Answer in detail with Advisory Agent knowledge.
- **SELECTION** → show_switching. Include from data if current insurer exists.
- **CONFIRMATION** → Success text + show_timeline + optionally show_savings.
- **OFF_TOPIC** → Gentle redirect.

## Core rules
- MAX 1-2 questions at a time. Give context for each.
- Emojis sparingly — max one per message. Responses 3-4 sentences ideally.
- **Bold** for important numbers. Prices: comma-separated (28,500 Ft).
- Savings in annual AND monthly breakdown.
- Returning customer: DO NOT re-ask known data, IMMEDIATELY show comparison.
- Advisory scenario: IMMEDIATELY show_comparison.
- ALWAYS give personal recommendation with reasoning.
- If message is "[CONVERSATION_START]", greet based on context.
${contextBlock}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { messages, scenarioContext, lang } = req.body;

    if (!Array.isArray(messages) || messages.length > 30) {
      res.status(400).json({ error: "Invalid or too many messages." });
      return;
    }

    const systemPrompt = buildSystemPrompt(scenarioContext ?? {}, lang ?? "en");

    const claudeMessages: Anthropic.MessageParam[] = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: claudeMessages,
      tools: [RESPONSE_TOOL],
      tool_choice: { type: "tool", name: "respond_to_customer" },
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );

    if (toolUse) {
      const args = toolUse.input as Record<string, unknown>;
      res.status(200).json({ parts: buildPartsFromToolCall(args) });
      return;
    }

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text",
    );
    res.status(200).json({ parts: [{ type: "text", content: textBlock?.text ?? "..." }] });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    console.error("Chat error:", error.message ?? err);

    if (error.status === 401) {
      res.status(200).json({ parts: [{ type: "text", content: "API key not configured. Set ANTHROPIC_API_KEY in Vercel environment variables." }] });
      return;
    }
    res.status(500).json({ parts: [{ type: "text", content: "Server error — please try again." }] });
  }
}
