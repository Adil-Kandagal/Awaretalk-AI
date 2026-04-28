"use client";

import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const chats = [
  "Morning reflection",
  "Anxiety check-in",
  "Late night thoughts",
  "Gratitude journal",
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-muted/30">
      
      {/* New Chat */}
      <div className="p-4">
        <Button className="w-full justify-start gap-2">
          <Plus size={16} />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <Button
            key={chat}
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
          >
            <MessageCircle size={16} />
            {chat}
          </Button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 text-xs text-muted-foreground">
        Awaretalk AI <br />
        Calm conversations
      </div>
    </aside>
  );
}