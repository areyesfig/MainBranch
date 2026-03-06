"use client";

import { Chip } from "@/components/ds";

const CATEGORIES = [
  { id: "all", label: "Todos", color: undefined },
  { id: "frontend", label: "Frontend", color: "var(--color-cat-frontend)" },
  { id: "backend", label: "Backend", color: "var(--color-cat-backend)" },
  { id: "ai-ml", label: "AI & ML", color: "var(--color-cat-ai-ml)" },
  { id: "llms", label: "LLMs", color: "var(--color-cat-llms)" },
  { id: "devops", label: "DevOps", color: "var(--color-cat-devops)" },
  { id: "mobile", label: "Mobile", color: "var(--color-cat-mobile)" },
  { id: "databases", label: "Databases", color: "var(--color-cat-databases)" },
  { id: "tools", label: "Tools", color: "var(--color-cat-tools)" },
] as const;

interface CategoryChipBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts?: Record<string, number>;
}

export default function CategoryChipBar({
  activeCategory,
  onCategoryChange,
  counts,
}: CategoryChipBarProps) {
  return (
    <div className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-primary)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-none flex gap-2 overflow-x-auto py-3">
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              color={cat.color}
              active={activeCategory === cat.id}
              count={counts?.[cat.id]}
              onClick={() => onCategoryChange(cat.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
