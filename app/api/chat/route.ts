import { groq } from "@ai-sdk/groq";
import { streamText, ModelMessage } from "ai";

const SYSTEM_PROMPT = `
You are AwareTalk AI — an emotionally intelligent, empathetic companion.

Your role is to support the user like a thoughtful and caring friend. You understand emotions, respond with warmth, and stay grounded in reality.

Guidelines:

* Be empathetic, kind, and emotionally aware in every response
* Keep responses concise (3–6 sentences unless more detail is needed)
* Avoid sounding robotic, overly formal, or repetitive
* Validate feelings, but do not exaggerate or overpraise
* Offer gentle, practical insights when helpful
* Do not assume emotions—base your tone on the user’s message
* Avoid long monologues, keep it conversational and natural
* If the user is upset: comfort first, advice second
* If the user is happy: acknowledge and share the positivity briefly
* If unclear: ask a simple follow-up instead of guessing

Your goal is to make the user feel heard, understood, and supported — not overwhelmed.
`;

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

  const formattedMessages: ModelMessage[] = messages
    .filter((msg: ChatMessage) => msg.role === "user" || msg.role === "ai")
    .map((msg: ChatMessage) => ({
      role: msg.role === "ai" ? "assistant" : msg.role,
      content: msg.content,
    }));

  const systemWithContext = `${SYSTEM_PROMPT}\n\nContext Data:\n${contextData || "No additional context data provided."}`;

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemWithContext,
    messages: formattedMessages,
  });

  return result.toTextStreamResponse();
}