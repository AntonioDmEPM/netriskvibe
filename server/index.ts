import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleChat } from "./orchestrator.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Validate API key on startup
if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith("your-")) {
  console.error("\n❌ ANTHROPIC_API_KEY is not configured.");
  console.error("   Create server/.env with: ANTHROPIC_API_KEY=sk-ant-...\n");
}

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, scenarioContext, lang } = req.body;

    if (!Array.isArray(messages) || messages.length > 30) {
      res.status(400).json({ error: "Invalid or too many messages." });
      return;
    }

    const result = await handleChat(messages, scenarioContext, lang ?? "en");
    res.json(result);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    console.error("Chat endpoint error:", error.message ?? err);

    if (error.status === 401) {
      res.status(401).json({
        parts: [{ type: "text", content: "⚠️ API key is invalid. Please check server/.env" }],
      });
      return;
    }

    if (error.status === 429) {
      res.status(429).json({
        parts: [{ type: "text", content: "Rate limited — please wait a moment and try again." }],
      });
      return;
    }

    res.status(500).json({
      parts: [{ type: "text", content: "Server error — check the backend console for details." }],
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
