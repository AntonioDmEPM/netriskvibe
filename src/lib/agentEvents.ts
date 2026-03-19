export type AgentName =
  | 'Conversation Agent'
  | 'Data Agent'
  | 'Comparison Agent'
  | 'Advisory Agent'
  | 'Lifecycle Agent';

export interface AgentAction {
  id: number;
  agent: AgentName;
  text: string;
  timestamp: number;
}

export interface AgentEvent {
  activeAgent: AgentName;
  actions: AgentAction[];
  profileUpdates: Record<string, string>;
}

const agentColors: Record<AgentName, string> = {
  'Conversation Agent': '#3B82F6',
  'Data Agent': '#F59E0B',
  'Comparison Agent': '#10B981',
  'Advisory Agent': '#8B5CF6',
  'Lifecycle Agent': '#EF4444',
};

export function getAgentColor(name: AgentName): string {
  return agentColors[name];
}

let _actionId = 0;
function a(agent: AgentName, text: string): AgentAction {
  return { id: ++_actionId, agent, text, timestamp: Date.now() };
}

export interface TurnAgentEvents {
  activeAgent: AgentName;
  actions: AgentAction[];
  profileUpdates: Record<string, string>;
}

export function getReturningAgentEvents(): TurnAgentEvents[] {
  return [
    // Turn 0 — greeting + comparison
    {
      activeAgent: 'Data Agent',
      actions: [
        a('Conversation Agent', 'Session started — returning customer detected'),
        a('Data Agent', 'Customer lookup → Suzuki SX4 S-Cross (DEF-456)'),
        a('Data Agent', 'Current policy: KÖBE, 38 000 HUF/yr, anniversary Jan 1'),
        a('Comparison Agent', '8 quotes calculated, sorted by price'),
        a('Comparison Agent', 'Best price: Genertel — top value: Groupama'),
        a('Advisory Agent', 'Recommendation: Groupama (value + roadside in Budapest)'),
      ],
      profileUpdates: {
        vehicle: 'Suzuki SX4 S-Cross (2012)',
        plate: 'DEF-456',
        power: '88 kW',
        region: 'Budapest',
        bonus: 'B10',
        currentInsurer: 'KÖBE',
        currentPremium: '38 000 HUF/yr',
      },
    },
    // Turn 1 — switching card
    {
      activeAgent: 'Lifecycle Agent',
      actions: [
        a('Conversation Agent', 'User selected Groupama'),
        a('Lifecycle Agent', 'Switching card generated: KÖBE → Groupama'),
        a('Lifecycle Agent', 'Savings calculated: showing confirmation'),
      ],
      profileUpdates: {
        selectedInsurer: 'Groupama',
        action: 'Switch pending',
      },
    },
    // Turn 2 — confirmation
    {
      activeAgent: 'Lifecycle Agent',
      actions: [
        a('Lifecycle Agent', 'Switch confirmed — process initiated'),
        a('Lifecycle Agent', 'Timeline generated: 4-step switching plan'),
        a('Lifecycle Agent', 'Email notification queued'),
      ],
      profileUpdates: {
        action: 'Switch initiated ✓',
        nextStep: 'KÖBE cancellation letter',
      },
    },
  ];
}

export function getNewCustomerAgentEvents(): TurnAgentEvents[] {
  return [
    // Turn 0 — greeting
    {
      activeAgent: 'Conversation Agent',
      actions: [
        a('Conversation Agent', 'New session — no prior data'),
        a('Conversation Agent', 'Requesting license plate number'),
      ],
      profileUpdates: { status: 'New customer — collecting data' },
    },
    // Turn 1 — plate lookup
    {
      activeAgent: 'Data Agent',
      actions: [
        a('Data Agent', 'Plate lookup → VW Golf VII (GHI-789) found'),
        a('Data Agent', 'Vehicle: 2018, 1.4 TSI, 110 kW'),
        a('Conversation Agent', 'Confirming vehicle details with user'),
      ],
      profileUpdates: {
        vehicle: 'Volkswagen Golf VII (2018)',
        plate: 'GHI-789',
        power: '110 kW',
        engine: '1.4 TSI (1395 cc)',
      },
    },
    // Turn 2 — asking location
    {
      activeAgent: 'Conversation Agent',
      actions: [
        a('Conversation Agent', 'Vehicle confirmed — requesting location'),
      ],
      profileUpdates: { ownerConfirmed: 'Yes' },
    },
    // Turn 3 — asking bonus
    {
      activeAgent: 'Data Agent',
      actions: [
        a('Data Agent', 'Region set: Debrecen → county_seat (×1.00)'),
        a('Conversation Agent', 'Requesting bonus-malus category'),
      ],
      profileUpdates: {
        region: 'Debrecen (county seat)',
        regionMultiplier: '×1.00',
      },
    },
    // Turn 4 — comparison
    {
      activeAgent: 'Comparison Agent',
      actions: [
        a('Data Agent', 'Bonus set: A00 → multiplier ×1.00'),
        a('Comparison Agent', '8 insurer quotes calculated'),
        a('Comparison Agent', 'Profile: 110 kW (×1.15), county seat (×1.00), A00 (×1.00)'),
        a('Advisory Agent', 'Recommendation: UNIQA (balance of price + service)'),
      ],
      profileUpdates: {
        bonus: 'A00 (new driver)',
        bonusMultiplier: '×1.00',
      },
    },
    // Turn 5 — switching
    {
      activeAgent: 'Lifecycle Agent',
      actions: [
        a('Conversation Agent', 'User selected insurer'),
        a('Lifecycle Agent', 'Contract flow initiated'),
        a('Lifecycle Agent', 'Timeline generated'),
      ],
      profileUpdates: {
        selectedInsurer: 'UNIQA',
        action: 'Contract pending',
      },
    },
    // Turn 6 — done
    {
      activeAgent: 'Lifecycle Agent',
      actions: [
        a('Lifecycle Agent', 'Contract confirmed — process started'),
        a('Lifecycle Agent', 'Welcome email queued'),
      ],
      profileUpdates: {
        action: 'Contract initiated ✓',
      },
    },
  ];
}

export function getAdvisoryAgentEvents(): TurnAgentEvents[] {
  return [
    // Turn 0 — show comparison
    {
      activeAgent: 'Comparison Agent',
      actions: [
        a('Data Agent', 'Existing profile loaded: Opel Astra, Szeged, B06'),
        a('Comparison Agent', '8 quotes calculated for profile'),
        a('Comparison Agent', 'Top 3 selected: cheapest, best value, premium'),
      ],
      profileUpdates: {
        vehicle: 'Opel Astra (2015)',
        plate: 'ABC-123',
        power: '74 kW',
        region: 'Szeged (county seat)',
        bonus: 'B06',
      },
    },
    // Turn 1 — explain Allianz
    {
      activeAgent: 'Advisory Agent',
      actions: [
        a('Advisory Agent', 'User question: "Why is Allianz more expensive?"'),
        a('Advisory Agent', 'Analysis: claims quality, roadside, digital experience'),
        a('Advisory Agent', 'Personalized assessment for B06 / 74 kW / Szeged'),
      ],
      profileUpdates: {
        lastQuestion: 'Price difference analysis',
      },
    },
    // Turn 2 — final recommendation
    {
      activeAgent: 'Advisory Agent',
      actions: [
        a('Advisory Agent', 'User preference noted → leaning toward value'),
        a('Advisory Agent', 'Final recommendation: Groupama (middle ground)'),
        a('Conversation Agent', 'Offering to start switch'),
      ],
      profileUpdates: {
        recommendation: 'Groupama',
      },
    },
  ];
}

export function getAgentEvents(flowId: string): TurnAgentEvents[] {
  switch (flowId) {
    case 'returning': return getReturningAgentEvents();
    case 'new': return getNewCustomerAgentEvents();
    case 'advisory': return getAdvisoryAgentEvents();
    default: return getReturningAgentEvents();
  }
}
