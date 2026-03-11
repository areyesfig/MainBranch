export type AdFormat = "auto" | "horizontal" | "rectangle" | "vertical";

export interface AdSlot {
  id: string;
  format: AdFormat;
  responsive: boolean;
}

export const ADS_CONFIG = {
  pubId: process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? "ca-pub-8465474306414652",
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED !== "false",
} as const;

export const AD_SLOTS: Record<string, AdSlot> = {
  homeBanner: {
    id: process.env.NEXT_PUBLIC_AD_SLOT_HOME_BANNER ?? "",
    format: "horizontal",
    responsive: true,
  },
  sidebar: {
    id: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR ?? "",
    format: "rectangle",
    responsive: true,
  },
  inArticle: {
    id: process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE ?? "",
    format: "auto",
    responsive: true,
  },
  releaseBottom: {
    id: process.env.NEXT_PUBLIC_AD_SLOT_RELEASE_BOTTOM ?? "",
    format: "horizontal",
    responsive: true,
  },
};
