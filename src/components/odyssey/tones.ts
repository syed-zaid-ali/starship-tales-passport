import type { Tone } from "@/data/missions";

/** Literal class strings per tone so Tailwind can see them. */
export const TONE: Record<Tone, { bg: string; border: string; text: string; ring: string; pop: string }> = {
  sun: { bg: "bg-tone-sun", border: "border-tone-sun", text: "text-tone-sun", ring: "ring-tone-sun", pop: "shadow-[0_5px_0_var(--tone-sun-deep)]" },
  pink: { bg: "bg-tone-pink", border: "border-tone-pink", text: "text-tone-pink", ring: "ring-tone-pink", pop: "shadow-[0_5px_0_var(--tone-pink-deep)]" },
  sky: { bg: "bg-tone-sky", border: "border-tone-sky", text: "text-tone-sky", ring: "ring-tone-sky", pop: "shadow-[0_5px_0_var(--tone-sky-deep)]" },
  lime: { bg: "bg-tone-lime", border: "border-tone-lime", text: "text-tone-lime", ring: "ring-tone-lime", pop: "shadow-[0_5px_0_var(--tone-lime-deep)]" },
  orange: { bg: "bg-tone-orange", border: "border-tone-orange", text: "text-tone-orange", ring: "ring-tone-orange", pop: "shadow-[0_5px_0_var(--tone-orange-deep)]" },
  teal: { bg: "bg-tone-teal", border: "border-tone-teal", text: "text-tone-teal", ring: "ring-tone-teal", pop: "shadow-[0_5px_0_var(--tone-teal-deep)]" },
  coral: { bg: "bg-tone-coral", border: "border-tone-coral", text: "text-tone-coral", ring: "ring-tone-coral", pop: "shadow-[0_5px_0_var(--tone-coral-deep)]" },
  moon: { bg: "bg-tone-moon", border: "border-tone-moon", text: "text-tone-moon", ring: "ring-tone-moon", pop: "shadow-[0_5px_0_var(--tone-moon-deep)]" },
};

export const STAR_IDS = ["hero", "moon-a", "moon-b", "mars-a", "mars-b", "deep-a", "finale"] as const;
export const SECTION_IDS = ["earth", "moon", "deep-space", "mars", "finale"] as const;
