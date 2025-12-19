import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
}

export function ChatMessage({ sender, text, timestamp }: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "gradient-primary shadow-glow"
            : "bg-secondary"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-secondary-foreground" />
        )}
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "gradient-primary text-primary-foreground rounded-tr-md"
              : "bg-card border border-border text-card-foreground rounded-tl-md shadow-card"
          }`}
        >
          {text}
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1.5 px-1">
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}
