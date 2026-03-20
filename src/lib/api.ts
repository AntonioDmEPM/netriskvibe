/**
 * API client for the backend server.
 * Replaces Supabase edge function calls with direct HTTP to /api/chat.
 */

export interface ChatRequest {
  messages: { role: string; content: string }[];
  scenarioContext: Record<string, unknown>;
  lang: string;
}

export interface ChatResponse {
  parts: Record<string, unknown>[];
  error?: string;
}

export async function chatAPI(request: ChatRequest): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Chat API error:", res.status, body);
    // Server returns { parts: [...] } even on errors for display
    if (body?.parts) return body;
    return {
      parts: [{
        type: "text",
        content: request.lang === "en"
          ? "I'm having trouble connecting right now. Let me try again..."
          : "Jelenleg kapcsolódási problémám van. Próbálom újra...",
      }],
    };
  }

  return body ?? { parts: [{ type: "text", content: "..." }] };
}
