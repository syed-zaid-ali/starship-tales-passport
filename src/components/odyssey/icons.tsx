import { Award, Medal as MedalIcon, Moon, Orbit, PartyPopper, Rocket, Sparkles, Star, Trophy, type LucideIcon } from "lucide-react";
import type { Medal, RankIcon } from "@/lib/explorer";
import type { RewardIcon } from "@/lib/explorer-store";

export const RANK_ICON: Record<RankIcon, LucideIcon> = {
  cadet: Star,
  rocket: Rocket,
  moon: Moon,
  planet: Orbit,
  galaxy: Sparkles,
};

export const REWARD_ICON: Record<RewardIcon, LucideIcon> = {
  welcome: PartyPopper,
  sticker: Award,
  star: Star,
  gold: MedalIcon,
  silver: MedalIcon,
  bronze: MedalIcon,
  finish: Trophy,
};

/** Literal classes per medal so Tailwind can see them. */
export const MEDAL_STYLE: Record<Medal, { face: string; ring: string; text: string; label: string; place: string }> = {
  gold: { face: "bg-medal-gold", ring: "border-medal-gold-deep", text: "text-medal-gold-deep", label: "Gold Medal", place: "1st try" },
  silver: { face: "bg-medal-silver", ring: "border-medal-silver-deep", text: "text-medal-silver-deep", label: "Silver Medal", place: "2nd try" },
  bronze: { face: "bg-medal-bronze", ring: "border-medal-bronze-deep", text: "text-medal-bronze-deep", label: "Bronze Medal", place: "3rd try" },
};
