import { groq } from "@ai-sdk/groq";
import { streamText, CoreMessage } from "ai";

const SYSTEM_PROMPT =
  "You are Awaretalk AI, an empathetic, supportive, and highly emotionally intelligent companion. Your goal is to act as a comforting friend. You must analyze the context and data provided by the user, but always deliver your insights with deep empathy, warmth, and validation. Never sound like a cold robot. Console the user if they are upset, celebrate with them if they are happy, and adapt your tone to their situation. Always remain helpful and grounded in the facts of the context provided.";

type ChatMessage = {
  role: "user" | "ai" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const body = await request.json();
  const messages = (body.messages || []) as ChatMessage[];
  const contextData = body.contextData?.trim();

  if (!Array.isArray(messages)) {
    return new Response("Invalid request body.", { status: 400 });
  }

  // Convert messages to CoreMessage format, converting 'ai' role to 'assistant'
  const coreMessages: CoreMessage[] = messages
    .filter((msg: ChatMessage) => msg.role === "user" || msg.role === "ai")
    .map((msg: ChatMessage) => ({
      role: msg.role === "ai" ? "assistant" : msg.role,
      content: msg.content,
    }));

  const systemWithContext = `${SYSTEM_PROMPT}\n\nContext Data:\n${contextData || "No additional context data provided."}`;

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemWithContext,
    messages: coreMessages,
  });

  return result.toUIMessageStreamResponse();
}
