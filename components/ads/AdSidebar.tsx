"use client";

import AdBanner from "./AdBanner";
import { AD_SLOTS } from "@/lib/ads/config";

export default function AdSidebar() {
  const slot = AD_SLOTS.sidebar;
  if (!slot.id) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
      <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)]">
        Publicidad
      </p>
      <AdBanner slot={slot.id} format="rectangle" />
    </div>
  );
}
