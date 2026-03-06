"use client";

import { useState, useEffect, useCallback } from "react";

interface UseKeyboardNavigationOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
}

export function useKeyboardNavigation({
  itemCount,
  onSelect,
}: UseKeyboardNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Reset when item count changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [itemCount]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      if (itemCount === 0) return;

      if (e.key === "j") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev < itemCount - 1 ? prev + 1 : prev;
          return next;
        });
      } else if (e.key === "k") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : 0;
          return next;
        });
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        onSelect?.(activeIndex);
      }
    },
    [itemCount, activeIndex, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { activeIndex };
}
