import { motion } from "framer-motion";
import { Award, Trophy } from "lucide-react";
import bleep from "@/assets/bleep-mascot.jpg";
import { Button } from "@/components/ui/button";
import { ALL_MISSIONS } from "@/data/missions";
import { isCertified } from "@/lib/explorer";
import { useExplorer } from "@/lib/explorer-store";
import { HiddenStar } from "./HiddenStar";
import { RankCard } from "./Passport";

export function Finale({ onPassport, onCertificate }: { onPassport: () => void; onCertificate: () => void }) {
  const s = useExplorer();
  const certified = isCertified(s, ALL_MISSIONS.map((m) => m.id));
  const left = ALL_MISSIONS.length - s.stickers.length;
  return (
    <section id="finale" className="relative px-5 pb-40 pt-24">
      <HiddenStar id="finale" className="left-[12%] top-[20%]" />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-3xl rounded-4xl border-4 border-primary bg-card/90 p-6 text-center backdrop-blur md:p-10"
      >
        <motion.img
          src={bleep}
          alt="Bleep the robot cheering"
          width={816}
          height={816}
          loading="lazy"
          animate={{ y: [0, -12, 0], rotate: [0, -4, 4, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="feather-mask mx-auto -mt-24 w-48"
        />
        <h2 className="font-display text-5xl font-bold md:text-6xl">
          {certified ? "Mission complete!" : "Mission report"}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-lg font-semibold text-muted-foreground">
          {certified
            ? `Amazing work${s.name ? `, ${s.name}` : ""}! You met every spacecraft on the journey.`
            : `You're doing great! Just ${left} more sticker${left === 1 ? "" : "s"} and the Official Explorer Certificate is yours.`}
        </p>
        <div className="mx-auto mt-6 max-w-md text-left">
          <RankCard />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {certified && (
            <Button variant="chunky" size="xl" onClick={onCertificate}>
              <Trophy /> Get my certificate
            </Button>
          )}
          <Button variant={certified ? "chunky-ghost" : "chunky-pink"} size="xl" onClick={onPassport}>
            <Award /> Open my Space Passport
          </Button>
        </div>
      </motion.div>
      <p className="mt-16 text-center text-sm font-semibold text-muted-foreground">
        Made for curious kids everywhere · Mission facts based on NASA history
      </p>
    </section>
  );
}
