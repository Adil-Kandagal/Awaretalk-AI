"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading) {
      onSend(trimmedInput);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = !input.trim() || isLoading;

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2 rounded-2xl border px-4 py-3 shadow-sm bg-white/50 focus-within:bg-white transition-colors">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Awaretalk..."
          disabled={isLoading}
          className="flex-1 bg-transparent outline-none text-sm disabled:opacity-50"
        />

        <button 
          onClick={handleSend}
          disabled={isDisabled}
          className={`transition-all ${isDisabled ? "text-gray-300 cursor-not-allowed" : "text-primary hover:text-primary/80 active:scale-95"}`}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>

      </div>
    </div>
  );
}