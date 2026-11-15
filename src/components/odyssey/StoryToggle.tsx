import { motion } from "framer-motion";
import { BookOpen, Rocket } from "lucide-react";
import { updateExplorer, useExplorer } from "@/lib/explorer-store";
import { sfx } from "@/lib/sfx";

export function StoryToggle({ compact = false }: { compact?: boolean }) {
  const on = useExplorer().storyMode;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Story Mode"
      onClick={() => {
        sfx.pop();
        updateExplorer((s) => ({ ...s, storyMode: !s.storyMode }));
      }}
      className={`group flex cursor-pointer items-center gap-2 rounded-full border-2 py-1 pl-1 pr-3 font-display text-sm font-semibold transition-colors ${
        on ? "border-primary-deep bg-primary text-primary-foreground glow-sun" : "border-border bg-muted text-muted-foreground"
      }`}
    >
      <span className={`relative flex h-8 w-14 items-center rounded-full ${on ? "bg-primary-deep/50" : "bg-border"}`}>
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`grid size-7 place-items-center rounded-full ${on ? "ml-auto mr-0.5 bg-chat text-primary" : "ml-0.5 bg-card text-muted-foreground"}`}
        >
          {on ? <Rocket className="size-4" /> : <BookOpen className="size-4" />}
        </motion.span>
      </span>
      <span className="whitespace-nowrap">{compact ? (on ? "Story" : "Facts") : "Story Mode"}</span>
    </button>
  );
}
