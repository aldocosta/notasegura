export const GUIDES_PATH = "/guias";

export function guideHref(slug: string): string {
  return `${GUIDES_PATH}/${slug}`;
}
