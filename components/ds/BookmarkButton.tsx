"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/contexts/BookmarkContext";

interface BookmarkButtonProps {
  releaseId: string;
  size?: "sm" | "md";
}

export default function BookmarkButton({ releaseId, size = "sm" }: BookmarkButtonProps) {
  const { toggle, isBookmarked } = useBookmarks();
  const active = isBookmarked(releaseId);

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const padding = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(releaseId);
      }}
      aria-label={active ? "Quitar de guardados" : "Guardar"}
      className={`${padding} rounded-[var(--radius-sm)] transition-colors ${
        active
          ? "text-[var(--color-brand)]"
          : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
      }`}
    >
      <Bookmark
        className={iconSize}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}
