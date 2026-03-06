interface ArticleSummaryProps {
  tldr: string;
  features?: string[];
  accentColor?: string;
}

export default function ArticleSummary({
  tldr,
  features,
  accentColor = "var(--color-brand)",
}: ArticleSummaryProps) {
  if (!tldr) return null;

  return (
    <div
      className="rounded-[var(--radius-lg)] border-l-4 bg-[var(--color-bg-elevated)] p-5 sm:p-6"
      style={{ borderLeftColor: accentColor }}
    >
      <p className="overline mb-2 text-[var(--color-text-tertiary)]">RESUMEN</p>
      <p className="text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">
        {tldr}
      </p>

      {features && features.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {features.slice(0, 5).map((f, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
