/**
 * API client — supports both Lovable Cloud (edge function) and local Express server.
 * Toggle via ?backend=local or ?backend=cloud in the URL, or defaults intelligently.
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

export type BackendMode = "cloud" | "local" | "auto";

/** Read backend preference from URL search params (?backend=cloud|local|auto) */
function getBackendMode(): BackendMode {
  if (typeof window === "undefined") return "auto";
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("backend");
  if (mode === "cloud" || mode === "local") return mode;
  return "auto";
}

function getChatUrl(mode: BackendMode): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  if (mode === "cloud" && supabaseUrl) {
    return `${supabaseUrl}/functions/v1/chat`;
  }
  if (mode === "local") {
    return "http://localhost:3001/api/chat";
  }
  // Auto: use edge function if available, else local
  if (supabaseUrl) {
    return `${supabaseUrl}/functions/v1/chat`;
  }
  return "http://localhost:3001/api/chat";
}

export function getCurrentBackendLabel(): string {
  const mode = getBackendMode();
  const url = getChatUrl(mode);
  if (url.includes("/functions/v1/")) return "Cloud";
  return "Local";
}

export async function chatAPI(request: ChatRequest): Promise<ChatResponse> {
  const mode = getBackendMode();
  const url = getChatUrl(mode);
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
