import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  icon?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Ver todos",
  icon,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--color-text-primary)]">
          {icon}
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-hover)]"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
