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

export default function SectionHeader({ title, subtitle, href, linkLabel = "Ver todos", icon }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="flex items-center gap-2 border-l-4 border-blue-600 pl-3 text-2xl font-bold text-gray-900 dark:text-white">
          {icon}
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 pl-5 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
