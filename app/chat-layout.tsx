"use client";

import Sidebar from "./sidebar";
import ChatWindow from "./chat-window";

export default function ChatLayout() {
  return (
    <div className="flex h-screen w-full">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Chat */}
      <div className="flex flex-1 flex-col">
        <ChatWindow />
      </div>

    </div>
  );
}