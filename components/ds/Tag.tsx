interface TagProps {
  label: string;
  color?: string;
}

export default function Tag({ label, color }: TagProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden
        />
      )}
      {label}
    </span>
  );
}
