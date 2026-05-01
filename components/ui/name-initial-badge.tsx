import { cn } from "@/lib/utils";

type ItemTone = "amber" | "sky" | "orange" | "slate" | "emerald" | "indigo";

type NameInitialBadgeProps = {
  name: string;
  className?: string;
};

const THUMBNAIL_TONE_STYLES: Record<ItemTone, string> = {
  amber: "bg-amber-100 text-amber-800",
  sky: "bg-sky-100 text-sky-800",
  orange: "bg-orange-100 text-orange-800",
  slate: "bg-slate-200 text-slate-700",
  emerald: "bg-emerald-100 text-emerald-800",
  indigo: "bg-indigo-100 text-indigo-800",
};

function toItemTone(itemName: string): ItemTone {
  const tones: ItemTone[] = ["amber", "sky", "orange", "slate", "emerald", "indigo"];
  const hash = itemName
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return tones[hash % tones.length];
}

export function NameInitialBadge({ name, className }: NameInitialBadgeProps) {
  const tone = toItemTone(name);
  const initial = name.trim().charAt(0).toUpperCase() || "-";

  return (
    <span
      className={cn(
        "inline-flex h-[22px] w-[22px] items-center justify-center rounded-[6px] text-[10px] font-semibold",
        THUMBNAIL_TONE_STYLES[tone],
        className,
      )}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

