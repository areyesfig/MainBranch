"use client";

import { useState } from "react";
import type { ReleaseNote } from "@/types/release";
import Link from "next/link";
import { AlertTriangle, ChevronDown, ChevronUp, Package } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatTime";
import { sanitizeReleaseText } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "var(--color-cat-frontend)",
  backend: "var(--color-cat-backend)",
  "ai-ml": "var(--color-cat-ai-ml)",
  llms: "var(--color-cat-llms)",
  devops: "var(--color-cat-devops)",
  mobile: "var(--color-cat-mobile)",
  databases: "var(--color-cat-databases)",
  tools: "var(--color-cat-tools)",
};

interface GroupedSignalCardProps {
  tech: string;
  category?: string;
  releases: ReleaseNote[];
  latest: Date;
  hasBreaking: boolean;
  mode: "signal" | "flow";
}

function SignalGroupMode({
  tech,
  category,
  releases,
  latest,
  hasBreaking,
}: Omit<GroupedSignalCardProps, "mode">) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[category ?? ""];

  return (
    <div
      className="gradient-border-left bg-[var(--color-bg-elevated)]"
      style={{ "--accent-color": catColor ?? "var(--color-brand)" } as React.CSSProperties}
    >
      {/* Summary row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-4 pl-5 pr-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {catColor && (
              <span className="overline" style={{ color: catColor }}>
                {category?.toUpperCase()}
              </span>
            )}
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {tech}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]">
              <Package className="h-3 w-3" />
              {releases.length} paquetes
            </span>
            {hasBreaking && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--color-breaking)]">
                <AlertTriangle className="h-3 w-3" />
                Breaking
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
            <span>{formatRelativeTime(latest)}</span>
            <span className="text-[var(--color-text-tertiary)]">—</span>
            <span className="truncate">
              {releases
                .slice(0, 3)
                .map((r) => `v${r.version}`)
                .join(" · ")}
              {releases.length > 3 && ` · +${releases.length - 3} más`}
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 mt-1 text-[var(--color-text-tertiary)]" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 mt-1 text-[var(--color-text-tertiary)]" />
        )}
      </button>

      {/* Expanded list */}
      {expanded && (
        <div className="border-t border-[var(--color-border-subtle)] divide-y divide-[var(--color-border-subtle)]">
          {releases.map((r) => (
            <Link
              key={r.id}
              href={`/releases/${r.id}`}
              className="flex items-start gap-3 pl-8 pr-4 py-2.5 transition-colors hover:bg-[var(--color-bg-secondary)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    v{r.version}
                  </span>
                  {r.breakingChange && (
                    <AlertTriangle className="h-3 w-3 text-[var(--color-breaking)]" />
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
                  {sanitizeReleaseText(r.tldr, 80)}
                </p>
              </div>
              <span className="text-xs text-[var(--color-text-tertiary)] shrink-0">
                {formatRelativeTime(r.releaseDate)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FlowGroupMode({
  tech,
  category,
  releases,
  latest,
  hasBreaking,
}: Omit<GroupedSignalCardProps, "mode">) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[category ?? ""];
  const breakingRelease = releases.find((r) => r.breakingChange);
  const preview = releases.slice(0, expanded ? releases.length : 3);

  return (
    <div
      className="gradient-border-top card-glow rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5"
      style={{ "--accent-color": catColor ?? "var(--color-brand)" } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {catColor && (
            <span className="overline" style={{ color: catColor }}>
              {category?.toUpperCase()}
            </span>
          )}
          <span className="overline text-[var(--color-text-tertiary)]">RELEASE BUNDLE</span>
        </div>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {formatRelativeTime(latest)}
        </span>
      </div>

      {/* Title */}
      <div className="mt-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{tech}</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-tertiary)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
          <Package className="h-3 w-3" />
          {releases.length} paquetes
        </span>
        {hasBreaking && (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--color-breaking)]">
            <AlertTriangle className="h-3 w-3" />
            Breaking
          </span>
        )}
      </div>

      {/* Breaking release highlight */}
      {breakingRelease && (
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          <span className="font-medium text-[var(--color-breaking)]">Breaking en v{breakingRelease.version}:</span>{" "}
          {sanitizeReleaseText(breakingRelease.tldr, 100)}
        </p>
      )}

      {/* Version list */}
      <ul className="mt-3 space-y-1.5">
        {preview.map((r) => (
          <li key={r.id}>
            <Link
              href={`/releases/${r.id}`}
              className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 -mx-2 transition-colors hover:bg-[var(--color-bg-secondary)]"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: catColor ?? "var(--color-brand)" }}
              />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                v{r.version}
              </span>
              {r.breakingChange && (
                <AlertTriangle className="h-3 w-3 text-[var(--color-breaking)]" />
              )}
              <span className="text-xs text-[var(--color-text-secondary)] truncate">
                {sanitizeReleaseText(r.tldr, 60)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-hover)]"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-3.5 w-3.5" />
            Mostrar menos
          </>
        ) : (
          <>
            <ChevronDown className="h-3.5 w-3.5" />
            Ver todas las versiones
          </>
        )}
      </button>
    </div>
  );
}

export default function GroupedSignalCard(props: GroupedSignalCardProps) {
  return props.mode === "signal" ? (
    <SignalGroupMode {...props} />
  ) : (
    <FlowGroupMode {...props} />
  );
}
