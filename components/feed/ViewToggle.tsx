"use client";

import { List, LayoutGrid } from "lucide-react";

type ViewMode = "signal" | "flow";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] p-0.5">
      <button
        type="button"
        onClick={() => onChange("signal")}
        className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors ${
          mode === "signal"
            ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-xs)]"
            : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
        }`}
        aria-pressed={mode === "signal"}
      >
        <List className="h-3.5 w-3.5" />
        Signal
      </button>
      <button
        type="button"
        onClick={() => onChange("flow")}
        className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors ${
          mode === "flow"
            ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-xs)]"
            : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
        }`}
        aria-pressed={mode === "flow"}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Flow
      </button>
    </div>
  );
}
