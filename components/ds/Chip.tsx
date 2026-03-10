"use client";

interface ChipProps {
  label: string;
  active?: boolean;
  count?: number;
  color?: string;
  onClick?: () => void;
}

export default function Chip({ label, active = false, count, color, onClick }: ChipProps) {
  const baseClasses =
    "inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer select-none";

  const stateClasses = active
    ? color
      ? "" // dynamic style applied below
      : "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]"
    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-default)] hover:text-[var(--color-text-primary)]";

  const dynamicStyle: React.CSSProperties | undefined =
    active && color
      ? {
          background: `color-mix(in srgb, ${color} 15%, transparent)`,
          color: color,
          borderWidth: "1px",
          borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
        }
      : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${stateClasses}`}
      style={dynamicStyle}
      aria-pressed={active}
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      )}
      {label}
      {count != null && (
        <span className={`text-xs ${active ? "text-[var(--color-text-inverse)]/70" : "text-[var(--color-text-tertiary)]"}`}>
          {count}
        </span>
      )}
    </button>
  );
}
