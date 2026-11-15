import { Award, Earth, Moon, Orbit, Rocket, Telescope, Volume2, VolumeX } from "lucide-react";
import { ALL_MISSIONS } from "@/data/missions";
import { passportProgress } from "@/lib/explorer";
import { updateExplorer, useExplorer } from "@/lib/explorer-store";
import { sfx } from "@/lib/sfx";
import { StoryToggle } from "./StoryToggle";
import { scrollToId, useActiveSection } from "./use-active-section";

/** Chronological order: Moon (1967–71) → Deep Space (1972–77) → Mars (1997–2021). */
const LINKS = [
  { id: "earth", label: "Earth", icon: Earth },
  { id: "moon", label: "Moon", icon: Moon },
  { id: "deep-space", label: "Deep Space", icon: Telescope },
  { id: "mars", label: "Mars", icon: Orbit },
] as const;

export function SiteHeader({ onPassport }: { onPassport: () => void }) {
  const s = useExplorer();
  const active = useActiveSection();
  const { collected, total } = passportProgress(s, ALL_MISSIONS.length);

  const nav = (id: string) => {
    sfx.click();
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full border-2 border-border bg-card/80 px-2 py-2 shadow-card-pop backdrop-blur-md">
        <button type="button" onClick={() => nav("earth")} className="flex cursor-pointer items-center gap-2 rounded-full pl-1 pr-2">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_3px_0_var(--primary-deep)]">
            <Rocket className="size-5 -rotate-45" />
          </span>
          <span className="hidden font-display text-xl font-bold leading-none tracking-wide text-primary-deep lg:inline">Forgotten Tales</span>
        </button>

        <nav aria-label="Chapters" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => nav(l.id)}
              aria-current={active === l.id ? "true" : undefined}
              className={`cursor-pointer rounded-full px-3 py-2 font-display text-sm font-semibold transition-colors ${
                active === l.id ? "bg-primary text-primary-foreground shadow-[0_3px_0_var(--primary-deep)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <l.icon className="mr-1 inline size-4 -translate-y-px" />
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <StoryToggle />
          </div>
          <div className="sm:hidden">
            <StoryToggle compact />
          </div>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onPassport();
            }}
            aria-label={`Open my Space Passport, ${collected} of ${total} stickers`}
            className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-3 font-display text-sm font-bold text-secondary-foreground shadow-[var(--shadow-chunky-pink)] chunky"
          >
            <Award className="size-4" />
            {collected}/{total}
          </button>
          <button
            type="button"
            onClick={() => updateExplorer((x) => ({ ...x, sound: !x.sound }))}
            aria-label={s.sound ? "Turn sounds off" : "Turn sounds on"}
            className="grid size-10 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {s.sound ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </button>
        </div>
      </div>

      <nav aria-label="Chapters" className="mx-auto mt-2 flex max-w-sm justify-center gap-1 md:hidden">
        {LINKS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => nav(l.id)}
            className={`cursor-pointer rounded-full border-2 px-2.5 py-1 font-display text-xs font-semibold backdrop-blur-md ${
              active === l.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/80 text-muted-foreground"
            }`}
          >
            <l.icon className="mr-0.5 inline size-3.5 -translate-y-px" />
            {l.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
