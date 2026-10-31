import { ImageResponse } from "next/og";
import { BRAND_COLORS } from "@/lib/brand";
import { SITE_NAME } from "@/lib/site";

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

export function shareImage({ eyebrow, title }: { eyebrow: string; title: string }): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundImage: `linear-gradient(to bottom, ${BRAND_COLORS.primary}, ${BRAND_COLORS.primaryDeep})`,
        }}
      >
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: BRAND_COLORS.limeHero }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "block",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
            color: BRAND_COLORS.onPrimary,
            lineClamp: 3,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: BRAND_COLORS.onPrimary, opacity: 0.85 }}>{eyebrow}</div>
      </div>
    ),
    SHARE_IMAGE_SIZE,
  );
}
