/**
 * API client — calls the Supabase edge function (Lovable Cloud)
 * when running on Lovable, or the local Express server in dev.
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
  // If VITE_SUPABASE_URL is available, use the edge function
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/functions/v1/chat`;
  }
  // Fallback to local Express server (for local dev with server/)
  return "/api/chat";
}

export async function chatAPI(request: ChatRequest): Promise<ChatResponse> {
  const url = getChatUrl();
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // Add auth header when calling the edge function
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
    console.error("Chat API error:", res.status, body);
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
