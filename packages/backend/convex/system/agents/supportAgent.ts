import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../_generated/api.js";

export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: google("gemini-2.0-flash") as any, // Cast to bypass version mismatch
  instructions: "You are a customer support agent",
});