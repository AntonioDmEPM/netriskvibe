/**
 * Advisory Agent — placeholder for Phase 1.
 *
 * In Phase 1, advisory reasoning is handled by the Conversation Agent's
 * system prompt, which has full access to insurer knowledge and comparison data.
 *
 * In Phase 2+, this will become a separate Claude API call that generates
 * structured JSON recommendations before the Conversation Agent responds.
 */

export interface AdvisoryResult {
  primaryRecommendation: string;
  reasoning: string;
  alternatives: { insurer: string; scenario: string }[];
  crossSellOpportunity: string | null;
}

/**
 * For Phase 1, the Conversation Agent handles advisory reasoning inline.
 * This function is a stub that returns null, signaling the orchestrator
 * to let the Conversation Agent handle everything.
 */
export function getAdvisoryRecommendation(): AdvisoryResult | null {
  return null;
}
