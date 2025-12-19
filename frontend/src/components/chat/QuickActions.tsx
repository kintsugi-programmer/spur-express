import { motion } from "framer-motion";

interface QuickActionsProps {
  onSelect: (message: string) => void;
  disabled?: boolean;
}

const suggestions = [
  "What's your return policy?",
  "Do you ship to USA?",
  "What are your support hours?",
  "How can I track my order?",
];

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {suggestions.map((suggestion, i) => (
        <motion.button
          key={suggestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl border border-border transition-all duration-200 hover:shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
}
