import { describe, expect, it } from "vitest";
import { ALL_MISSIONS, CHAPTERS } from "@/data/missions";
import {
  DEFAULT_STATE,
  collectStar,
  collectSticker,
  isCertified,
  medalFor,
  nextMedal,
  passportProgress,
  points,
  rankFor,
  recordAttempt,
} from "./explorer";
import { LANDER, startLander, stepLander } from "./lander";

describe("explorer rules", () => {
  it("collecting the same sticker twice only counts once", () => {
    const s = collectSticker(collectSticker(DEFAULT_STATE, "apollo-11"), "apollo-11");
    expect(s.stickers).toEqual(["apollo-11"]);
    expect(points(s)).toBe(10);
  });

  it("a hidden star is worth 5 points and only once", () => {
    const s = collectStar(collectStar(DEFAULT_STATE, "star-1"), "star-1");
    expect(points(s)).toBe(5);
  });

  it("signing your name gifts the Cadet sticker", () => {
    expect(passportProgress(DEFAULT_STATE, 8)).toEqual({ collected: 0, total: 9 });
    expect(passportProgress({ ...DEFAULT_STATE, name: "Zara" }, 8)).toEqual({ collected: 1, total: 9 });
  });

  it("ranks climb at 30, 60, 100 and 140 points", () => {
    const withPoints = (n: number) => ({ ...DEFAULT_STATE, stars: Array.from({ length: n / 5 }, (_, i) => `s${i}`) });
    expect(rankFor(withPoints(25)).title).toBe("Space Cadet");
    expect(rankFor(withPoints(30)).title).toBe("Rocket Rookie");
    expect(rankFor(withPoints(60)).title).toBe("Moon Walker");
    expect(rankFor(withPoints(100)).title).toBe("Mars Ranger");
    expect(rankFor(withPoints(140)).title).toBe("Galaxy Captain");
  });

  it("the certificate unlocks only when every mission sticker is collected", () => {
    const ids = ["a", "b", "c"];
    const partial = collectSticker(collectSticker(DEFAULT_STATE, "a"), "b");
    expect(isCertified(partial, ids)).toBe(false);
    expect(isCertified(collectSticker(partial, "c"), ids)).toBe(true);
  });
});

describe("mini-game medals", () => {
  const winOnTry = (n: number) => {
    let s = DEFAULT_STATE;
    for (let i = 1; i < n; i++) s = recordAttempt(s, "g", false);
    return recordAttempt(s, "g", true);
  };

  it("1st try = gold, 2nd = silver, 3rd = bronze, more than 3 = no medal", () => {
    expect(medalFor(1)).toBe("gold");
    expect(medalFor(2)).toBe("silver");
    expect(medalFor(3)).toBe("bronze");
    expect(medalFor(4)).toBeNull();
    expect(winOnTry(1).games["g"]?.medal).toBe("gold");
    expect(winOnTry(2).games["g"]?.medal).toBe("silver");
    expect(winOnTry(3).games["g"]?.medal).toBe("bronze");
    expect(winOnTry(5).games["g"]).toEqual({ attempts: 5, done: true, medal: null });
  });

  it("replaying a finished game never changes the medal", () => {
    const s = winOnTry(1);
    expect(recordAttempt(recordAttempt(s, "g", false), "g", true)).toBe(s);
  });

  it("shows the medal still up for grabs on the next try", () => {
    expect(nextMedal(DEFAULT_STATE, "g")).toBe("gold");
    expect(nextMedal(recordAttempt(DEFAULT_STATE, "g", false), "g")).toBe("silver");
  });

  it("medals add points: gold 30, silver 20, bronze 10", () => {
    expect(points(winOnTry(1))).toBe(30);
    expect(points(winOnTry(2))).toBe(20);
    expect(points(winOnTry(3))).toBe(10);
  });
});

describe("timeline", () => {
  it("missions run in strict chronological order across chapters", () => {
    expect(ALL_MISSIONS.map((m) => `${m.year} ${m.name}`)).toEqual([
      "1967 Surveyor 3",
      "1969 Apollo 11",
      "1971 Lunar Roving Vehicle",
      "1972 Pioneer 10",
      "1977 Voyager 1",
      "1997 Sojourner",
      "2012 Curiosity",
      "2021 Ingenuity",
    ]);
    expect(CHAPTERS.map((c) => c.id)).toEqual(["moon", "deep-space", "mars"]);
  });
});

describe("lander physics", () => {
  const fly = (fire: (t: number) => boolean) => {
    let l = startLander();
    for (let t = 0; t < 60; t += 0.02) {
      const r = stepLander(l, fire(t), 0.02);
      l = r.lander;
      if (r.status !== "flying") return r.status;
    }
    return "flying";
  };

  it("falling without firing crashes", () => {
    expect(fly(() => false)).toBe("crashed");
  });

  it("a well-timed burn lands safely", () => {
    // Fall freely, then fire once the braking distance catches up with the height.
    const brake = LANDER.thrust - LANDER.gravity;
    let l = startLander();
    let status = "flying";
    for (let i = 0; i < 3000 && status === "flying"; i++) {
      const fire = l.speed > 1.5 && (l.speed * l.speed) / (2 * brake) >= l.height - 3;
      const r = stepLander(l, fire, 0.02);
      l = r.lander;
      status = r.status;
    }
    expect(status).toBe("landed");
  });

  it("no fuel means no thrust", () => {
    const empty = { height: 50, speed: 0, fuel: 0 };
    expect(stepLander(empty, true, 1).lander.speed).toBeCloseTo(LANDER.gravity);
  });
});
