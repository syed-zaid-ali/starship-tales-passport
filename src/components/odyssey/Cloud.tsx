/** A puffy cartoon cloud built from circles — crisp at any size, no image needed. */
export function Cloud({ className = "", tint = "bg-card" }: { className?: string; tint?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none relative aspect-[2.2/1] drop-shadow-[0_10px_0_var(--border)] ${className}`}>
      <span className={`absolute inset-x-0 bottom-0 h-[48%] rounded-full ${tint}`} />
      <span className={`absolute bottom-[18%] left-[12%] aspect-square w-[38%] rounded-full ${tint}`} />
      <span className={`absolute bottom-[22%] left-[38%] aspect-square w-[44%] rounded-full ${tint}`} />
      <span className={`absolute bottom-[14%] right-[6%] aspect-square w-[28%] rounded-full ${tint}`} />
    </div>
  );
}
