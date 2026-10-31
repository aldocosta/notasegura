import type { AlgorithmId } from "@/lib/playground/types";
import { ALGORITHMS_PATH } from "@/lib/site";

export function algorithmHref(id: AlgorithmId): string {
  return `${ALGORITHMS_PATH}/${id}`;
}
