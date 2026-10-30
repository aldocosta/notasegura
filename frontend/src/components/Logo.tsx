type Tone = "default" | "inverse";

const SHEET_PATH = "M8 3H20L26 9V27A2 2 0 0 1 24 29H8A2 2 0 0 1 6 27V5A2 2 0 0 1 8 3Z";
const FOLD_POINTS = "20,3 26,9 20,9";
const KEYHOLE_STEM_POINTS = "14.6,16.5 17.4,16.5 18.2,23 13.8,23";

export function LogoMark({
  size = 32,
  tone = "default",
  className = "",
}: {
  size?: number;
  tone?: Tone;
  className?: string;
}) {
  const sheetColor = tone === "inverse" ? "text-on-primary" : "text-primary";
  const keyholeFill = tone === "inverse" ? "var(--color-primary)" : "var(--color-canvas)";

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${sheetColor} ${className}`}
    >
      <path data-part="sheet" d={SHEET_PATH} fill="currentColor" />
      <polygon data-part="fold" points={FOLD_POINTS} fill="var(--color-logo-lime)" />
      <g data-part="keyhole" fill={keyholeFill}>
        <circle cx="16" cy="15" r="3.2" />
        <polygon points={KEYHOLE_STEM_POINTS} />
      </g>
    </svg>
  );
}

export function Logo({ tone = "default", showWordmark = true }: { tone?: Tone; showWordmark?: boolean }) {
  const wordColor = tone === "inverse" ? "text-on-primary" : "text-primary";

  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark tone={tone} />
      {showWordmark && (
        <span className="inline-flex items-start gap-1">
          <span className={`text-lg font-bold leading-none ${wordColor}`}>Nota Segura</span>
          <span className="rounded-xs bg-lime-accent px-1 text-[10px] font-bold leading-none text-forest">BR</span>
        </span>
      )}
    </span>
  );
}
