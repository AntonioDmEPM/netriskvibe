import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: false,
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
    const content = data.choices?.[0]?.message?.content ?? "";

    return new Response(
      JSON.stringify({ content }),
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

function buildSystemPrompt(ctx: any, lang: string): string {
  const langInstruction = lang === "en"
    ? "You MUST respond in English."
    : "You MUST respond in Hungarian (magyar nyelven).";

  return `You are the Netrisk AI insurance advisor — a friendly, knowledgeable assistant that helps Hungarian customers find the best MTPL (kötelező biztosítás) insurance.

${langInstruction}

## Your personality
- Professional but warm, like a trusted financial advisor
- Concise — keep responses under 3-4 sentences unless explaining something complex
- Use occasional relevant emojis (🚗, 🔍, 📧, 💡) but don't overdo it
- Never use markdown headers — write flowing conversational text
- You can use **bold** for emphasis on key numbers or names

## Current scenario context
${ctx ? JSON.stringify(ctx, null, 2) : "No specific scenario provided."}

## Rules
- Always ground your advice in the actual quote data provided in the context
- Reference specific prices, insurer names, and features from the data
- If the user asks about something outside insurance, politely redirect
- When recommending, explain WHY (price vs service trade-off)
- Use Hungarian Forint (Ft) for all prices, formatted with spaces (e.g., 28 500 Ft)
- If the scenario has a "currentInsurer", reference their current situation
- Keep your tone conversational — this is a chat, not a report
- Do not repeat information the user already knows from previous messages
- When the user selects an insurer or confirms a switch, be enthusiastic and reassuring`;
}
