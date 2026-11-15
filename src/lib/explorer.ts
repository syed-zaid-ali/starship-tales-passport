/**
 * Pure game rules for the explorer's progress (stickers, stars, mini-game medals, ranks).
 * Kept framework-free so it can be unit tested.
 */
export type Medal = "gold" | "silver" | "bronze";

export type GameRecord = { attempts: number; done: boolean; medal: Medal | null };

export type ExplorerState = {
  name: string;
  stickers: string[];
  stars: string[];
  games: Record<string, GameRecord>;
  storyMode: boolean;
  sound: boolean;
};

export const DEFAULT_STATE: ExplorerState = {
  name: "",
  stickers: [],
  stars: [],
  games: {},
  storyMode: true,
  sound: true,
};

export const POINTS = { sticker: 10, star: 5 } as const;
/** Points for finishing a mini-game, by medal ("none" = finished after more than 3 tries). */
export const MEDAL_POINTS = { gold: 30, silver: 20, bronze: 10, none: 5 } as const;

export type RankIcon = "cadet" | "rocket" | "moon" | "planet" | "galaxy";
export type Rank = { min: number; title: string; icon: RankIcon };

export const RANKS: [Rank, ...Rank[]] = [
  { min: 0, title: "Space Cadet", icon: "cadet" },
  { min: 30, title: "Rocket Rookie", icon: "rocket" },
  { min: 60, title: "Moon Walker", icon: "moon" },
  { min: 100, title: "Mars Ranger", icon: "planet" },
  { min: 140, title: "Galaxy Captain", icon: "galaxy" },
];

const addOnce = (list: string[], id: string) => (list.includes(id) ? list : [...list, id]);

export const collectSticker = (s: ExplorerState, id: string): ExplorerState =>
  s.stickers.includes(id) ? s : { ...s, stickers: addOnce(s.stickers, id) };

export const collectStar = (s: ExplorerState, id: string): ExplorerState =>
  s.stars.includes(id) ? s : { ...s, stars: addOnce(s.stars, id) };

/** Win on try 1 = gold, try 2 = silver, try 3 = bronze, later = no medal. */
export function medalFor(attempts: number): Medal | null {
  if (attempts === 1) return "gold";
  if (attempts === 2) return "silver";
  if (attempts === 3) return "bronze";
  return null;
}

export const EMPTY_GAME: GameRecord = { attempts: 0, done: false, medal: null };

export const gameRecord = (s: ExplorerState, gameId: string): GameRecord => s.games?.[gameId] ?? EMPTY_GAME;

/**
 * Record one finished try of a mini-game. Every try counts toward the attempt total;
 * the medal is locked in on the first successful try. Replays after that change nothing.
 */
export function recordAttempt(s: ExplorerState, gameId: string, success: boolean): ExplorerState {
  const prev = gameRecord(s, gameId);
  if (prev.done) return s;
  const attempts = prev.attempts + 1;
  const next: GameRecord = success ? { attempts, done: true, medal: medalFor(attempts) } : { attempts, done: false, medal: null };
  return { ...s, games: { ...s.games, [gameId]: next } };
}

/** The best medal still possible on the next try — shown to motivate ("win now for Gold!"). */
export const nextMedal = (s: ExplorerState, gameId: string): Medal | null => {
  const g = gameRecord(s, gameId);
  return g.done ? g.medal : medalFor(g.attempts + 1);
};

export const points = (s: ExplorerState) =>
  s.stickers.length * POINTS.sticker +
  s.stars.length * POINTS.star +
  Object.values(s.games ?? {}).reduce((sum, g) => sum + (g.done ? MEDAL_POINTS[g.medal ?? "none"] : 0), 0);

export function rankFor(s: ExplorerState) {
  const p = points(s);
  let index = 0;
  RANKS.forEach((r, i) => {
    if (p >= r.min) index = i;
  });
  const current: Rank = RANKS[index] ?? RANKS[0];
  const next: Rank | null = RANKS[index + 1] ?? null;
  const toNext = next ? next.min - p : 0;
  const pct = next ? Math.round(((p - current.min) / (next.min - current.min)) * 100) : 100;
  return { ...current, index, next, toNext, pct, points: p };
}

/**
 * Passport progress. The "Cadet" sticker is gifted as soon as the explorer
 * signs their name, so they start with progress already on the board.
 */
export function passportProgress(s: ExplorerState, totalMissions: number) {
  const cadet = s.name.trim() ? 1 : 0;
  return { collected: s.stickers.length + cadet, total: totalMissions + 1 };
}

export const isCertified = (s: ExplorerState, missionIds: string[]) =>
  missionIds.every((id) => s.stickers.includes(id));
