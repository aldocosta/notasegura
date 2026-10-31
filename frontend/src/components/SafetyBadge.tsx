import type { Algorithm } from "@/lib/playground/types";

const SAFETY_CLASS: Record<Algorithm["safety"], string> = {
  Seguro: "border-mint-200 bg-mint-100 text-primary",
  "Não é criptografia": "border-hairline-strong bg-canvas-soft text-body",
  Inseguro: "border-error bg-canvas text-error",
};

export default function SafetyBadge({ safety }: { safety: Algorithm["safety"] }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${SAFETY_CLASS[safety]}`}>{safety}</span>
  );
}
