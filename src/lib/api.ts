/**
 * API client — routes to the right backend:
 * - On Vercel: relative /api/chat (serverless function)
 * - Local with ?backend=local: http://localhost:3001/api/chat
 * - Local with Supabase: edge function
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

function getChatUrl(): string {
  if (typeof window === "undefined") return "/api/chat";

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("backend");

  // Explicit override via ?backend=local or ?backend=cloud
  if (mode === "local") return "http://localhost:3001/api/chat";
  if (mode === "cloud") {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) return `${supabaseUrl}/functions/v1/chat`;
  }

  // Default: use relative /api/chat (works on both Vercel and local with Vite proxy)
  return "/api/chat";
}

export async function chatAPI(request: ChatRequest): Promise<ChatResponse> {
  const url = getChatUrl();
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // Add auth header when calling the Supabase edge function
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (anonKey && url.includes("/functions/v1/")) {
    headers["Authorization"] = `Bearer ${anonKey}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    console.error(`Chat API error (${url}):`, res.status, body);
    if (body?.parts) return body;
    return {
      parts: [{
        type: "text",
        content: "I'm having trouble connecting right now. Let me try again...",
      }],
    };
  }

  return body ?? { parts: [{ type: "text", content: "..." }] };
}
