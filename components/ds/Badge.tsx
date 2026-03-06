import type { ReactNode } from "react";

type BadgeVariant =
  | "blue" | "red" | "yellow" | "green" | "purple" | "orange" | "gray"
  | "outline";
type BadgeSize = "xs" | "sm";
type ContentType = "release" | "news" | "analysis" | "brief" | "explainer";
type CategoryId =
  | "frontend" | "backend" | "ai-ml" | "llms"
  | "devops" | "mobile" | "databases" | "tools";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  category?: CategoryId;
  contentType?: ContentType;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  outline: "border border-[var(--color-border-default)] text-[var(--color-text-secondary)] bg-transparent",
};

const CATEGORY_STYLES: Record<CategoryId, string> = {
  frontend: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  backend: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "ai-ml": "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  llms: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  devops: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  mobile: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  databases: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  tools: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const CONTENT_TYPE_STYLES: Record<ContentType, string> = {
  release: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  news: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  analysis: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  brief: "border border-[var(--color-border-default)] text-[var(--color-text-secondary)] bg-transparent",
  explainer: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0.5 text-[10px]",
  sm: "px-2 py-0.5 text-xs",
};

export default function Badge({
  variant = "blue",
  size = "xs",
  icon,
  category,
  contentType,
  children,
}: BadgeProps) {
  let colorClass: string;
  if (category) {
    colorClass = CATEGORY_STYLES[category] ?? VARIANT_CLASSES[variant];
  } else if (contentType) {
    colorClass = CONTENT_TYPE_STYLES[contentType] ?? VARIANT_CLASSES[variant];
  } else {
    colorClass = VARIANT_CLASSES[variant];
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[var(--radius-sm)] font-semibold leading-none ${colorClass} ${SIZE_CLASSES[size]}`}
    >
      {icon}
      {children}
    </span>
  );
}
