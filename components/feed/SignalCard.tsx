"use client";

import type { ReleaseNote } from "@/types/release";
import Link from "next/link";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatTime";
import { sanitizeReleaseText } from "@/lib/utils";
import BookmarkButton from "@/components/ds/BookmarkButton";

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

interface SignalCardProps {
  release: ReleaseNote;
  mode: "signal" | "flow";
  index?: number;
  isActive?: boolean;
}

function SignalMode({ release, isActive }: { release: ReleaseNote; isActive?: boolean }) {
  const catColor = CATEGORY_COLORS[release.category ?? ""];

  return (
    <Link
      href={`/releases/${release.id}`}
      className={`group gradient-border-left flex items-start gap-4 bg-[var(--color-bg-elevated)] pl-5 pr-4 py-3 transition-colors hover:bg-[var(--color-bg-secondary)] ${
        isActive ? "ring-2 ring-inset ring-[var(--color-brand)] bg-[var(--color-bg-secondary)]" : ""
      }`}
      style={{ "--accent-color": catColor ?? "var(--color-brand)" } as React.CSSProperties}
    >
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {catColor && (
            <span className="overline" style={{ color: catColor }}>
              {release.category?.toUpperCase()}
            </span>
          )}
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {release.technology}
            <span className="ml-1 font-normal text-[var(--color-text-tertiary)]">
              v{release.version}
            </span>
          </span>
          <span className="hidden sm:inline text-sm text-[var(--color-text-secondary)] truncate">
            — {sanitizeReleaseText(release.tldr, 80)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
          <span>{formatRelativeTime(release.releaseDate)}</span>
          {release.impactScore != null && release.impactScore > 0 && (
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {release.impactScore}
            </span>
          )}
          {release.breakingChange && (
            <span className="flex items-center gap-1 text-[var(--color-breaking)]">
              <AlertTriangle className="h-3 w-3" />
              Breaking
            </span>
          )}
          {release.votes != null && release.votes > 0 && (
            <span>+{release.votes}</span>
          )}
        </div>
      </div>
      <BookmarkButton releaseId={release.id} />
    </Link>
  );
}

function FlowMode({ release, isActive }: { release: ReleaseNote; isActive?: boolean }) {
  const catColor = CATEGORY_COLORS[release.category ?? ""];

  return (
    <Link
      href={`/releases/${release.id}`}
      className={`group block gradient-border-top card-glow rounded-[var(--radius-lg)] border bg-[var(--color-bg-elevated)] p-5 transition-all ${
        isActive
          ? "border-[var(--color-brand)] ring-2 ring-[var(--color-brand)]"
          : "border-[var(--color-border-default)]"
      }`}
      style={{ "--accent-color": catColor ?? "var(--color-brand)" } as React.CSSProperties}
      data-category={release.category ?? ""}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {catColor && (
            <span className="overline" style={{ color: catColor }}>
              {release.category?.toUpperCase()}
            </span>
          )}
          <span className="overline text-[var(--color-text-tertiary)]">RELEASE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {formatRelativeTime(release.releaseDate)}
          </span>
          <BookmarkButton releaseId={release.id} />
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-lg font-semibold text-[var(--color-text-primary)] leading-snug">
        {release.technology}{" "}
        <span className="text-[var(--color-text-tertiary)]">v{release.version}</span>
      </h3>

      {/* TLDR */}
      <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
        {sanitizeReleaseText(release.tldr, 200)}
      </p>

      {/* Features preview */}
      {release.features && release.features.length > 0 && (
        <ul className="mt-3 space-y-1">
          {release.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: catColor ?? "var(--color-brand)" }} />
              <span className="line-clamp-1">{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
        {release.impactScore != null && release.impactScore > 0 && (
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Impact {release.impactScore}
          </span>
        )}
        {release.breakingChange && (
          <span className="flex items-center gap-1 text-[var(--color-breaking)]">
            <AlertTriangle className="h-3 w-3" />
            Breaking
          </span>
        )}
        {release.votes != null && release.votes > 0 && (
          <span>+{release.votes} votos</span>
        )}
        {release.tags && release.tags.length > 0 && (
          <div className="flex gap-1.5 ml-auto">
            {release.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="rounded-[var(--radius-full)] bg-[var(--color-bg-tertiary)] px-2 py-0.5 text-[10px] text-[var(--color-text-tertiary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function SignalCard({ release, mode, index, isActive }: SignalCardProps) {
  const style = index != null && index < 20 ? { animationDelay: `${index * 50}ms` } : undefined;

  return (
    <div className={index != null ? "animate-slide-up" : undefined} style={style}>
      {mode === "signal" ? (
        <SignalMode release={release} isActive={isActive} />
      ) : (
        <FlowMode release={release} isActive={isActive} />
      )}
    </div>
  );
}
