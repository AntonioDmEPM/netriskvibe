# CLAUDE.md — Project Brief for Claude Code

> **This file gives Claude Code the full context to develop this project. Drop it in the repo root.**

---

## Project Identity

**Name:** Netrisk AI Tanácsadó / Personal Finance Agent  
**Repo:** https://github.com/AntonioDmEPM/netriskvibe  
**Owner:** Antonio Di Marzo, Head of Applied AI EU, EPAM Systems  
**Purpose:** A working prototype that demonstrates two propositions:
1. **Netrisk-specific:** An agentic KGFB (Hungarian mandatory car insurance) advisor replacing traditional comparison forms with AI-powered conversation
2. **Generic:** A Personal Finance Agent that autonomously monitors, compares, negotiates, and switches all household contracts (insurance, energy, broadband, mobile, banking, subscriptions)

**Pitch target:** Netrisk Group (Hungary, 6 CEE markets, TA Associates / MCI Capital backed)

---

## Current State

### What Exists (from Lovable build)
The app is a **React + TypeScript + Tailwind CSS + Vite** single-page application exported from Lovable. It has three tabs:

1. **Tab 1 — Netrisk.hu Agentic Homepage:** A reimagined Netrisk.hu homepage with the AI advisor embedded as the hero element. Three pre-scripted conversation flows (returning customer, new customer, advisory question) activate from homepage interactions (hero input, suggestion chips, product cards). Conversations run in a full-screen overlay modal. Includes quote cards, comparison panels, switching confirmation, and a before/after section showing traditional forms vs. conversational AI.

2. **Tab 2 — Personal Finance Dashboard:** A logged-in consumer dashboard for "Kovács Anna" showing 8 contracts (KGFB, home insurance, energy, broadband, mobile, banking, credit card, TV), an activity feed of agent actions, a savings counter with 50/50 split visualization, a negotiation transcript demo (Vodafone), and contract detail panels.

3. **Tab 3 — Vision & Architecture:** An English-language pitch page with competitive gap analysis, revenue transformation model, 3-year P&L projection (in HUF), market sizing, build roadmap, valuation comps, and success metrics. All figures are localized to the Hungarian market.

### What's Pre-scripted vs. Real
Currently **everything is pre-scripted** — the conversation flows use hardcoded state machines with typing delays, not actual LLM calls. The pricing calculator uses real multiplier-based math (KGFB formula with power/bonus/region/age/payment factors across 12 insurers), but agent responses are static text.

### Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **State:** React state (useState/useReducer) — no backend, no database
- **Data:** Embedded JSON constants (insurers, vehicles, customer profiles, pricing tables)
- **Deployment:** Lovable hosting (will move to Vercel/Netlify)
- **No backend, no API calls, no authentication, no database**

---

## Architecture Target

### The Five-Agent System

The application should evolve into a real multi-agent system where each agent is a distinct prompt/function calling the Claude API:

```
┌─────────────────────────────────────────┐
│          FRONTEND (React)               │
│  Conversation UI, Dashboard, Vision     │
└──────────────┬──────────────────────────┘
               │ HTTP/WebSocket
┌──────────────▼──────────────────────────┐
│       ORCHESTRATOR (Backend)            │
│  Intent classification, agent routing,  │
│  shared context management, streaming   │
├─────┬─────┬─────┬─────┬────────────────┤
│CONV │DATA │COMP │ADVS │LIFECYCLE       │
│AGENT│AGENT│AGENT│AGENT│AGENT           │
└─────┴─────┴─────┴─────┴────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CLAUDE API (Anthropic)          │
│  claude-sonnet-4-20250514 for agents    │
│  Streaming responses                    │
└─────────────────────────────────────────┘
```

**Agent roles:**

| Agent | Responsibility | Talks to Customer? | LLM Required? |
|-------|---------------|-------------------|---------------|
| Conversation Agent | Dialogue management, personality, response assembly | YES | YES |
| Data Agent | Vehicle lookup, region classification, profile management | No | Minimal (validation logic, mostly deterministic) |
| Comparison Agent | KGFB pricing calculation, multi-dimensional scoring | No | No (pure math) |
| Advisory Agent | Recommendation generation, reasoning, trade-off analysis | No | YES |
| Lifecycle Agent | Anniversary tracking, proactive outreach triggers | No | No (temporal logic) |

### Shared Context Object

All agents read/write to a shared context that persists across the conversation:

```typescript
interface SharedContext {
  sessionId: string;
  flowType: 'new_customer' | 'returning_customer' | 'advisory';
  customerProfile: {
    vehicle: VehicleData | null;
    person: { location: string; regionType: string; regionMultiplier: number; bonusMalus: string; bonusMultiplier: number } | null;
    currentPolicy: { insurerId: string; premiumHuf: number; paymentFrequency: string; anniversaryDate: string } | null;
    preferences: { priority: 'price' | 'quality' | 'balanced' };
    completeness: { vehicleConfirmed: boolean; locationSet: boolean; bonusSet: boolean; readyForComparison: boolean };
  };
  conversationHistory: Message[];
  comparisonResults: ComparisonResult | null;
  recommendation: AdvisoryResult | null;
  activeAgent: 'conversation' | 'data' | 'comparison' | 'advisory' | 'lifecycle';
}
```

---

## Development Roadmap

### PHASE 1: Backend Foundation + Live Agents (Week 1-2)

**Goal:** Replace pre-scripted flows with real Claude API calls. The conversation should feel dynamic, not canned.

**Tasks:**

1. **Add a backend server**
   - Create `/server` directory with Express.js (TypeScript)
   - Single endpoint: `POST /api/chat` accepting `{ message: string, context: SharedContext }`
   - Returns streamed response (SSE or WebSocket) for typewriter effect
   - Environment variable for `ANTHROPIC_API_KEY`

2. **Implement the Orchestrator**
   - File: `/server/orchestrator.ts`
   - Receives user message + context
   - Classifies intent using simple rules first (regex for plate numbers, city names, bonus codes, questions)
   - Routes to appropriate agent function
   - Assembles final response with any structured components (quote cards, etc.)

3. **Implement Conversation Agent**
   - File: `/server/agents/conversation.ts`
   - System prompt from `netrisk_agent_prompts.md` (Conversation Agent section)
   - Calls Claude API with system prompt + conversation history + current context
   - Parses response for structured components (looks for `[COMPONENT:...]` markers)
   - Streams text back to frontend

4. **Implement Advisory Agent**
   - File: `/server/agents/advisory.ts`
   - System prompt from `netrisk_agent_prompts.md` (Advisory Agent section)
   - Receives customer profile + comparison results
   - Returns structured JSON recommendation

5. **Keep Data Agent and Comparison Agent deterministic**
   - File: `/server/agents/data.ts` — vehicle lookup from JSON, region classification, bonus validation
   - File: `/server/agents/comparison.ts` — the existing pricing formula, returns all 12 insurer quotes with multi-dimensional scores
   - These don't need LLM calls — they're pure logic

6. **Update frontend to call backend**
   - Replace pre-scripted conversation state machine with API calls
   - Keep typing indicator, streaming text effect
   - Parse structured components from API response and render existing React components (QuoteCard, ComparisonPanel, etc.)

**Deliverable:** The KGFB advisor overlay works with real Claude-generated responses. The conversation is dynamic — users can ask anything, go off-script, and the agent handles it naturally in Hungarian.

### PHASE 2: Remaining Product Verticals (Week 3-4)

**Goal:** Extend the agent beyond KGFB to Casco, Lakásbiztosítás, and Utasbiztosítás.

**Tasks:**

1. **Add product-specific data models**
   - Casco: pricing based on vehicle value, deductible, coverage type (from `netrisk_mock_data.json`)
   - Lakásbiztosítás: pricing based on property type, size, location, coverage (from mock data)
   - Utasbiztosítás: pricing based on destination, duration, traveler count, coverage level

2. **Add product-specific Comparison Agent logic**
   - `/server/agents/comparison.ts` gets a `product` parameter
   - Each product has its own pricing formula and scoring dimensions
   - KGFB: existing formula (12 insurers)
   - Casco: vehicle value × base rate × deductible factor × bonus factor (11 insurers)
   - Lakás: property area × base rate per m² × type factor × region factor (11 insurers)
   - Utas: daily rate × days × coverage factor × age factor (8 insurers)

3. **Extend Conversation Agent prompts**
   - The system prompt needs product-awareness: detect which product the user is asking about
   - Add product-specific question flows (lakás needs property data, utas needs travel data)
   - Cross-sell logic: after KGFB completion, naturally suggest Casco if vehicle value > 3M Ft

4. **Update frontend product grid**
   - All 4 product cards in the homepage grid should now trigger real conversation flows (not "Hamarosan!")
   - Each product opens the overlay with the appropriate agent context

5. **Update suggestion chips**
   - Add: "🏠 Lakásbiztosítás" and "✈️ Utasbiztosítás" as working flows
   - Hero input should detect product intent from natural language ("lakást szeretnék biztosítani" → lakás flow)

**Deliverable:** All 4 insurance verticals work end-to-end through the conversational advisor with real agent responses.

### PHASE 3: Dashboard Goes Live (Week 5-6)

**Goal:** Transform the dashboard from a static mockup into a dynamic, interactive view with real agent actions.

**Tasks:**

1. **Add user authentication (simple)**
   - Supabase or a simple JWT-based auth
   - Login/register flow
   - User profiles stored in database
   - Demo mode: "Log in as Kovács Anna" button for presentations

2. **Implement contract storage**
   - Database table: `contracts` (user_id, provider, product_type, monthly_cost, status, anniversary_date, etc.)
   - Pre-seed Kovács Anna's 8 contracts for demo
   - API endpoints: GET /api/contracts, PUT /api/contracts/:id/status

3. **Implement activity feed**
   - Database table: `agent_actions` (user_id, timestamp, action_type, description, savings_amount, status)
   - API endpoint: GET /api/activity
   - Real-time updates when agent takes action (via polling or WebSocket)

4. **Wire up contract actions**
   - "Jóváhagyom" button → calls agent to execute switch → updates contract status
   - "Részletek" → opens detail panel with real comparison data (runs Comparison Agent for that product)
   - Status transitions: monitoring → better_deal_available → approval_needed → switching → optimized

5. **Savings counter — real calculation**
   - Sum all savings from `agent_actions` where status = completed
   - Apply 50/50 split
   - Animate on dashboard load

6. **Negotiation engine demo**
   - The Vodafone negotiation transcript stays pre-scripted for now
   - But wrap it in a component that could accept real negotiation logs in the future
   - Add a "Simulate New Negotiation" button that calls the Advisory Agent with a negotiation prompt and streams a simulated negotiation conversation

**Deliverable:** Dashboard shows real contract data, activity feed updates dynamically, approval actions work, savings counter is live.

### PHASE 4: Production Hardening (Week 7-8)

**Goal:** Make this deployable and presentable at enterprise quality.

**Tasks:**

1. **Error handling and edge cases**
   - Agent timeout handling (>10s → "Dolgozom rajta..." intermediate response)
   - Claude API rate limiting and retry logic
   - Graceful fallback if LLM returns unexpected format
   - Input sanitization (prevent prompt injection via user messages)

2. **Streaming optimization**
   - Server-Sent Events for agent responses
   - Progressive rendering of structured components (text first, then cards)
   - Smooth scroll-to-bottom with "new message" indicator

3. **Presenter mode hardening**
   - Ctrl+Shift+P activates presenter bar
   - Direct flow triggers for all product verticals
   - Agent Architecture panel shows live agent activation with colored dots
   - Reset button clears all state and returns to homepage

4. **Performance**
   - Lazy load Tab 2 and Tab 3 (they're heavy)
   - Image optimization
   - Bundle splitting

5. **Deployment**
   - Vercel deployment with environment variables
   - Custom domain (optional)
   - CI/CD via GitHub Actions

6. **Testing**
   - E2E tests for the three core KGFB conversation flows
   - Unit tests for pricing calculation (Comparison Agent)
   - Snapshot tests for key UI components

**Deliverable:** Production-quality application deployable on a custom URL for client demos.

---

## File Structure (Target)

```
netriskvibe/
├── CLAUDE.md                          ← THIS FILE
├── README.md
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
│
├── src/                               ← Frontend (existing Lovable code)
│   ├── App.tsx                        ← Top-level with tab navigation
│   ├── main.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNavBar.tsx          ← EPAM bar + tab switcher
│   │   │   ├── NetriskNavbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── homepage/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── BeforeAfterComparison.tsx
│   │   │   ├── SocialProofBar.tsx
│   │   │   └── TrustPartners.tsx
│   │   ├── advisor/
│   │   │   ├── ConversationOverlay.tsx ← The main advisor modal
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   ├── QuoteCard.tsx
│   │   │   ├── ComparisonPanel.tsx
│   │   │   ├── SwitchingConfirmation.tsx
│   │   │   └── TimelineCard.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── SavingsCounter.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── ContractCard.tsx
│   │   │   ├── ContractDetail.tsx
│   │   │   └── NegotiationTranscript.tsx
│   │   └── vision/
│   │       ├── VisionPage.tsx
│   │       ├── GapAnalysisTable.tsx
│   │       ├── RevenueTransformation.tsx
│   │       ├── FinancialProjection.tsx
│   │       ├── MarketSizing.tsx
│   │       └── BuildRoadmap.tsx
│   ├── data/
│   │   ├── insurers.ts                ← Insurer data (from netrisk_mock_data.json)
│   │   ├── vehicles.ts
│   │   ├── products.ts
│   │   ├── customerProfiles.ts
│   │   ├── regions.ts
│   │   └── marketStats.ts
│   ├── hooks/
│   │   ├── useChat.ts                 ← Hook for managing conversation + API calls
│   │   ├── useContracts.ts
│   │   └── usePresenterMode.ts
│   ├── lib/
│   │   ├── pricing.ts                 ← KGFB/Casco/Lakás/Utas pricing calculators
│   │   ├── scoring.ts                 ← Multi-dimensional insurer scoring
│   │   └── api.ts                     ← API client for backend calls
│   └── types/
│       ├── context.ts                 ← SharedContext interface
│       ├── agents.ts                  ← Agent types
│       └── products.ts               ← Product/insurer/vehicle types
│
├── server/                            ← Backend (NEW — add in Phase 1)
│   ├── index.ts                       ← Express server entry point
│   ├── orchestrator.ts                ← Agent routing + context management
│   ├── agents/
│   │   ├── conversation.ts            ← Claude API calls with conversation prompt
│   │   ├── data.ts                    ← Deterministic vehicle/region/bonus logic
│   │   ├── comparison.ts              ← Pricing calculator (no LLM)
│   │   ├── advisory.ts               ← Claude API calls with advisory prompt
│   │   └── lifecycle.ts               ← Temporal logic (no LLM)
│   ├── prompts/
│   │   ├── conversation.md            ← Conversation Agent system prompt
│   │   ├── advisory.md               ← Advisory Agent system prompt
│   │   └── negotiation.md            ← Negotiation demo prompt
│   └── middleware/
│       ├── auth.ts                    ← Simple auth (Phase 3)
│       └── streaming.ts               ← SSE response helpers
│
├── data/                              ← Shared data files
│   ├── netrisk_mock_data.json         ← Full mock dataset
│   └── agent_prompts.md              ← All 5 agent prompts
│
└── docs/                              ← Documentation
    ├── netrisk_agentic_spec.docx     ← Original specification
    └── architecture.md               ← Technical architecture notes
```

---

## Key Files Already Created (Reference Material)

These files were created during the design phase and contain the authoritative specifications:

| File | Contains | Use For |
|------|----------|---------|
| `netrisk_mock_data.json` | 12 insurers, 7 products, 10 vehicles, 3 customer profiles, 13 regions, agent knowledge, market stats | All mock data — import as TypeScript constants |
| `netrisk_agent_prompts.md` | System prompts for all 5 agents + orchestrator logic | Copy prompts into `/server/prompts/` |
| `netrisk_agentic_spec.docx` | Full vision document, benchmark analysis, north star | Background context |
| `lovable_homepage_instructions.md` | Homepage UI specification | Reference for component structure |
| `lovable_finance_agent_instructions.md` | Dashboard + Vision page specification | Reference for Tab 2 and Tab 3 |

---

## Claude API Integration Notes

### Model Selection
- **Conversation Agent:** `claude-sonnet-4-20250514` — best balance of speed and quality for real-time conversation
- **Advisory Agent:** `claude-sonnet-4-20250514` — same model, but can upgrade to Opus for higher reasoning quality if budget allows
- **All other agents:** No LLM needed (deterministic logic)

### API Call Pattern
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Streaming response for Conversation Agent
const stream = await client.messages.stream({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: conversationSystemPrompt,
  messages: [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ]
});

// Forward stream to frontend via SSE
for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
  }
}
```

### Structured Output from Advisory Agent
The Advisory Agent should return JSON. Use a system prompt instruction:
```
Respond ONLY with a JSON object matching this schema. No preamble, no markdown fences.
```

### Token Budget
- Conversation Agent: system prompt ~1500 tokens + context ~2000 tokens + history ~2000 tokens = ~5500 input, ~500 output per turn
- Advisory Agent: system prompt ~1200 tokens + profile ~500 tokens + comparison ~1500 tokens = ~3200 input, ~800 output per call
- **Estimated cost per KGFB session (6-8 turns):** ~$0.02-0.05

### Language Handling
- System prompts instruct agents to respond in Hungarian by default
- No translation layer needed — Claude handles Hungarian natively
- If user writes in English, agent should respond in English

---

## Important Constraints

1. **This is still a pitch demo** — it needs to work flawlessly for 3-4 specific demo scenarios. Robustness for edge cases is secondary to the three core flows working perfectly.

2. **Hungarian language quality matters** — the agents must speak natural Hungarian with correct grammar, accents (á, é, í, ó, ö, ő, ú, ü, ű), and culturally appropriate tone (magázás by default).

3. **The pricing math must be correct** — the KGFB comparison engine uses a real formula. If someone checks the numbers with a calculator, they should add up. Round to nearest 100 Ft.

4. **The 50/50 savings model must be visible** — every savings display should show total/customer-keeps/service-fee split.

5. **Presenter mode is critical** — Ctrl+Shift+P must work reliably. The agent architecture panel showing which agent is active is a key pitch moment.

6. **Don't break the Vision page** — Tab 3 is a polished pitch deck. It should not change during Phase 1-2 development. Only touch it to fix bugs.

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/AntonioDmEPM/netriskvibe.git
cd netriskvibe
npm install

# Run the frontend (existing Lovable app)
npm run dev

# Phase 1: Add the backend
cd server
npm init -y
npm install express typescript @anthropic-ai/sdk cors dotenv
npm install -D ts-node @types/express @types/cors

# Create .env
echo "ANTHROPIC_API_KEY=your-key-here" > .env

# Run backend
npx ts-node index.ts
```

---

## Confirmed Decisions (from Antonio)

1. **Anthropic API key:** Available and funded. Use it.
2. **Backend deployment:** Use **Vercel** for both frontend and backend. Deploy the Express backend as Vercel Serverless Functions (`/api/*` routes). This keeps everything on one platform, one deploy, one URL. Structure the backend endpoints as `/api/chat`, `/api/contracts`, etc. under a `/api` directory that Vercel auto-deploys as serverless functions. If serverless constraints become an issue (cold starts on streaming, 10s timeout on free tier), fall back to **Railway** for the backend with the frontend staying on Vercel.
3. **Database/Auth (Phase 3):** Use **Supabase**. Acceptable and approved. Use Supabase Auth for login + Supabase Postgres for contracts/activity storage. Add a "Demo login" button (log in as Kovács Anna) that bypasses real auth for presentations.
4. **Vision page (Tab 3):** **English only.** Do not add Hungarian translation. Do not touch Tab 3 during Phase 1-2 unless fixing bugs.
