export default function MessageBubble({
  role,
  content,
}: {
  role: string;
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-end w-full`}>
      
      <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
        style={{
          background: isUser 
            ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
            : "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)"
        }}
      >
        {isUser ? "U" : "AI"}
      </div>

      <div
        className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md transition-all ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        {content}
      </div>

    </div>
  );
}