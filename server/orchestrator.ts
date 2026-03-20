/**
 * Orchestrator — receives user message + scenario context, routes to agents,
 * assembles the final response.
 *
 * In Phase 1, the Conversation Agent handles intent classification and response
 * generation in a single Claude call. The orchestrator's main job is:
 * 1. Ensure the scenario context has all required data (quotes, insurer knowledge)
 * 2. Call the Conversation Agent
 * 3. Return structured parts for the frontend
 */

import { callConversationAgent, type ConversationResult } from "./agents/conversation.js";

export async function handleChat(
  messages: { role: string; content: string }[],
  scenarioContext: Record<string, unknown>,
  lang: string,
): Promise<ConversationResult> {
  // The scenario context from the frontend already contains:
  // - customer profile (vehicle, location, bonus, etc.)
  // - allQuotes (pre-calculated by the frontend's Comparison Agent)
  // - allInsurerKnowledge (insurer details for advisory reasoning)
  // - marketStats (for context)
  //
  // The Conversation Agent's system prompt embeds all of this,
  // so Claude can generate responses with full knowledge.

  const result = await callConversationAgent(messages, scenarioContext, lang);
  return result;
}
