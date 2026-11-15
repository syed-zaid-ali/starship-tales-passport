import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { useState } from "react";
import { Celebration } from "@/components/odyssey/Celebration";
import { ChapterSection } from "@/components/odyssey/ChapterSection";
import { Finale } from "@/components/odyssey/Finale";
import { Hero } from "@/components/odyssey/Hero";
import { Mascot } from "@/components/odyssey/Mascot";
import { MissionModal } from "@/components/odyssey/MissionModal";
import { Certificate, Passport } from "@/components/odyssey/Passport";
import { ScrollRocket } from "@/components/odyssey/ScrollRocket";
import { SiteHeader } from "@/components/odyssey/SiteHeader";
import { Starfield } from "@/components/odyssey/Starfield";
import { CHAPTERS, type Mission } from "@/data/missions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Forgotten Tales — A Space Adventure for Curious Explorers" },
      { name: "description", content: "A colorful, scroll-driven space adventure for kids: meet Moon landers, talking rovers and spacecraft, play mission games, and collect explorer medals." },
      { property: "og:title", content: "Forgotten Tales — A Space Adventure" },
      { property: "og:description", content: "Meet the robots, rovers and rockets that explored space — and hear their stories in their own words!" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [passport, setPassport] = useState(false);
  const [certificate, setCertificate] = useState(false);
  const openCertificate = () => { setPassport(false); setCertificate(true); };

  return <MotionConfig reducedMotion="user">
    <Starfield />
    <SiteHeader onPassport={() => setPassport(true)} />
    <ScrollRocket />
    <main className="relative">
      <Hero />
      {CHAPTERS.map((chapter) => <ChapterSection key={chapter.id} chapter={chapter} onOpen={setMission} />)}
      <Finale onPassport={() => setPassport(true)} onCertificate={openCertificate} />
    </main>
    <Mascot />
    <MissionModal mission={mission} onClose={() => setMission(null)} />
    <Passport open={passport} onOpenChange={setPassport} onCertificate={openCertificate} />
    <Certificate open={certificate} onOpenChange={setCertificate} />
    <Celebration />
  </MotionConfig>;
}
