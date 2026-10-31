import { shareImage } from "@/lib/share-image";

export const alt = "Nota Segura - BR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({
    eyebrow: "Notas anônimas e autodestrutivas",
    title: "Compartilhe textos sensíveis com segurança",
  });
}
