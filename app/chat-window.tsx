"use client";

import { Bot } from "lucide-react";
import ChatInput from "./chat-input";
import MessageBubble from "./message-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
  id?: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi, how are you feeling today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    // Add user message to the chat
    const newUserMessage: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Send to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      let fullResponse = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.role === "ai") {
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, content: fullResponse },
            ];
          }
          return [...prev, { role: "ai", content: fullResponse }];
        });
      }

      fullResponse += decoder.decode();

      if (fullResponse) {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.role === "ai") {
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, content: fullResponse },
            ];
          }
          return [...prev, { role: "ai", content: fullResponse }];
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white to-blue-50">

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-gray-900">Awaretalk AI</span>
          <p className="text-xs text-gray-500">Always here to listen</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-sm">Start a conversation...</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} content={msg.content} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />

    </div>
  );
}