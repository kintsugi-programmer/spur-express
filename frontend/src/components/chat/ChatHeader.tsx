import { Bot, Sparkles } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
      {/* Logo/Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full border-2 border-card flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-accent-foreground" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h1 className="font-semibold text-foreground">Spur AI Support</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
          Always here to help
        </p>
      </div>

      {/* Badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
        <Sparkles className="w-3 h-3" />
        Powered by AI
      </div>
    </div>
  );
}
