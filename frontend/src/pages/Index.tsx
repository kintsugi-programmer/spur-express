import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { QuickActions } from "@/components/chat/QuickActions";
import { useToast } from "@/hooks/use-toast";

type Message = {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
};

const API_BASE =
  import.meta.env.VITE_API_URL ;

const CHAT_ENDPOINT = `${API_BASE}/chat/message`;

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Restore session id only (history comes from backend on send)
  useEffect(() => {
    const stored = localStorage.getItem("sessionId");
    if (stored) setSessionId(stored);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const formatTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      // persist session
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
      }

      // backend is source of truth
      setMessages(
        data.history.map((m: any) => ({
          sender: m.sender,
          text: m.text,
          timestamp: formatTime(),
        }))
      );
    } catch (err) {
      console.error(err);

      toast({
        title: "Connection error",
        description: "Could not reach the support server.",
        variant: "destructive",
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Sorry, I'm having trouble responding right now. Please try again shortly.",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem("sessionId");
    setSessionId(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-2xl h-[700px] bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-lg overflow-hidden flex flex-col"
      >
        <ChatHeader />

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.length === 0 && !loading && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-glow">
                    <MessageCircle className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    Welcome to Spur Support
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Hi there! I'm your AI assistant. Ask me anything about
                    shipping, returns, or support.
                  </p>
                  <QuickActions onSelect={sendMessage} disabled={loading} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {messages.map((m, i) => (
                <ChatMessage
                  key={`${i}-${m.text}`}
                  sender={m.sender}
                  text={m.text}
                  timestamp={m.timestamp}
                />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {loading && <TypingIndicator />}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>
        </div>

        {messages.length > 0 && messages.length < 3 && !loading && (
          <div className="px-4 pb-2">
            <QuickActions onSelect={sendMessage} disabled={loading} />
          </div>
        )}

        <ChatInput onSend={sendMessage} loading={loading} />
      </motion.div>

      {sessionId && (
        <button
          onClick={clearSession}
          className="fixed bottom-4 right-4 text-xs text-muted-foreground hover:text-foreground"
        >
          Clear session
        </button>
      )}
    </div>
  );
};

export default Index;
