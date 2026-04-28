"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { Info, PlusCircle, SendHorizontal } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function extractText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function ChatInterface() {
  const [context, setContext] = React.useState("");
  const [draftContext, setDraftContext] = React.useState("");
  const [isContextOpen, setIsContextOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const messageEndRef = React.useRef<HTMLDivElement>(null);
  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    [],
  );
  const { messages, sendMessage, status } = useChat({
    transport,
  });

  const isSending = status === "submitted" || status === "streaming";

  const handleInput = (value: string) => {
    setInput(value);

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    await sendMessage(
      { text: trimmedInput },
      {
        body: {
          contextData: context,
        },
      },
    );

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  };

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border-none bg-white/30 shadow-[0_28px_65px_-35px_rgba(75,90,150,0.7)] backdrop-blur-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl text-[#4e5380]">Awaretalk Conversation</CardTitle>
            <p className="text-sm text-[#6b7198]">
              A softer, supportive space to think out loud.
            </p>
          </div>
          {context.trim() ? (
            <Badge className="border-none bg-white/50 text-[#6058b8] shadow-sm hover:bg-white/50">
              Context added
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <ScrollArea className="min-h-0 flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            {messages.length === 0 ? (
              <div className="rounded-2xl bg-white/35 px-5 py-4 text-sm text-[#686f98] shadow-sm">
                Begin whenever you are ready. Awaretalk AI will listen with warmth and respond with care.
              </div>
            ) : (
              messages.map((item) => {
                const text = extractText(item);
                if (!text) return null;

                const isUser = item.role === "user";

                return (
                  <div key={item.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[78%] ${
                        isUser
                          ? "rounded-br-md bg-[#8485df] text-white shadow-[0_12px_30px_-20px_rgba(70,75,180,0.75)]"
                          : "rounded-bl-md bg-transparent text-[#4f557f] shadow-[0_14px_30px_-26px_rgba(72,86,128,0.9)]"
                      }`}
                    >
                      <p className="mb-1 text-xs font-medium opacity-80">{isUser ? "You" : "Awaretalk AI"}</p>
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                            li: ({ children }) => <li>{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => (
                              <code className="rounded bg-black/10 px-1.5 py-0.5 text-[0.85em] dark:bg-white/10">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 bg-white/20 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            <div className="rounded-2xl bg-white/40 p-3 shadow-[0_16px_35px_-28px_rgba(72,86,130,0.9)]">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => handleInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Share what you are feeling. Awaretalk AI is listening..."
                className="max-h-[180px] min-h-[44px] w-full resize-none bg-transparent text-sm text-[#4f557f] outline-none placeholder:text-[#7a80a8]"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Sheet open={isContextOpen} onOpenChange={setIsContextOpen}>
                  <SheetTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl bg-white/45 text-[#5f6390] shadow-sm hover:bg-white/60"
                      />
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4 text-[#6664bd]" />
                    Add Context
                  </SheetTrigger>
                  <SheetContent className="w-[420px] max-w-[92vw] border-none bg-white/65 backdrop-blur-2xl">
                    <SheetHeader>
                      <SheetTitle>Add background context</SheetTitle>
                      <SheetDescription>
                        Paste personal preferences, goals, or relevant background so replies can be more
                        personalized and empathetic.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 flex h-[calc(100vh-11rem)] flex-col gap-3">
                      <textarea
                        value={draftContext}
                        onChange={(event) => setDraftContext(event.target.value)}
                        placeholder="Example: I feel more comfortable with short responses and grounding prompts."
                        className="min-h-[220px] flex-1 resize-none rounded-xl bg-white/55 p-3 text-sm outline-none"
                      />
                      <Button
                        type="button"
                        className="rounded-xl bg-[#7578dd] text-white hover:bg-[#666aca]"
                        onClick={() => {
                          setContext(draftContext);
                          setIsContextOpen(false);
                        }}
                      >
                        Save context
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={isSending || !input.trim()}
                  className="rounded-xl bg-[#7b7fe2] text-white shadow-sm hover:bg-[#6b70d4] disabled:opacity-60"
                >
                  <SendHorizontal className="mr-2 h-4 w-4" />
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#70789f]">
              <Info className="h-3.5 w-3.5" />
              Awaretalk AI offers emotional support, but is not a replacement for professional care.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
