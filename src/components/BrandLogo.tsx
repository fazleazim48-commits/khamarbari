import mark from "@/assets/khamar-bari-mark.png";

export function BrandLogo({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-bright p-1 shadow-sm">
        <img src={mark} alt="খামার বাড়ি লোগো" width={1024} height={1024} className="size-full object-contain" />
      </span>
      {!compact && <span><strong className={`block font-display text-xl leading-none ${inverse ? "text-primary-foreground" : "text-primary"}`}>খামার বাড়ি</strong><small className={`mt-1 block text-[10px] ${inverse ? "text-primary-foreground/70" : "text-muted-foreground"}`}>সমন্বিত মুরগি ও মাছের খামার</small></span>}
    </span>
  );
}