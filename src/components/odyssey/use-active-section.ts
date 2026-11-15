import { useEffect, useState } from "react";
import { SECTION_IDS } from "./tones";

export type SectionId = (typeof SECTION_IDS)[number];

/** Which story section is currently in the middle of the screen. */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("earth");
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
