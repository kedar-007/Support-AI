import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../_generated/api.js";
export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: google("gemini-2.5-flash") as any, // Cast to bypass version mismatch
  instructions: `You are a customer support agent.Use "resolveConversation" tool when user expresses finalization of the conversation.Use "escalateConversation" tool when user expresses frustration,or requests a human explicitly.`,
 
});