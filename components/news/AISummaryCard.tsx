"use client";

import { useState } from "react";
import type { AISummary } from "@/types/release";
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface AISummaryCardProps {
  summary: AISummary;
  rawDescription?: string;
}

const ACTION_CONFIG = {
  none: {
    label: "Nada urgente",
    sublabel: "Actualiza cuando quieras",
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    dot: "bg-green-500",
  },
  recommended: {
    label: "Recomendado",
    sublabel: "Hazlo esta semana",
    icon: Info,
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    dot: "bg-amber-500",
  },
  required: {
    label: "Acción requerida",
    sublabel: "Lee antes de actualizar",
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    dot: "bg-red-500",
  },
} as const;

export default function AISummaryCard({ summary, rawDescription }: AISummaryCardProps) {
  const [showMigration, setShowMigration] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const actionCfg = ACTION_CONFIG[summary.action_level];
  const ActionIcon = actionCfg.icon;

  return (
    <div className="rounded-[var(--radius-lg)] border border-purple-500/20 bg-[var(--color-bg-elevated)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--color-border-subtle)] bg-purple-500/5">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
          Resumen editorial · IA
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Action level badge */}
        <div className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-1.5 text-sm font-medium ${actionCfg.className}`}>
          <ActionIcon className="h-4 w-4" />
          <span>{actionCfg.label}</span>
          <span className="font-normal opacity-70">— {summary.action_reason}</span>
        </div>

        {/* TL;DR */}
        <p className="text-lg font-semibold text-[var(--color-text-primary)] leading-snug">
          {summary.tldr}
        </p>

        {/* Changes */}
        <ul className="space-y-2">
          {summary.changes.map((change, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${actionCfg.dot}`} />
              {change}
            </li>
          ))}
        </ul>

        {/* Audience */}
        <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1">
            A quién le importa
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">{summary.audience}</p>
        </div>

        {/* Migration accordion */}
        {summary.migration && (
          <div className="rounded-[var(--radius-md)] border border-red-500/20 overflow-hidden">
            <button
              onClick={() => setShowMigration((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-red-700 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Migración necesaria
              </span>
              {showMigration ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {showMigration && (
              <div className="p-4 space-y-3 bg-[var(--color-bg-secondary)]">
                {summary.migration.note && (
                  <p className="text-xs text-[var(--color-text-secondary)]">{summary.migration.note}</p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-tertiary)] mb-1.5">Antes</p>
                    <pre className="rounded-[var(--radius-sm)] bg-[var(--color-bg-tertiary)] p-3 text-xs text-[var(--color-text-secondary)] overflow-x-auto whitespace-pre-wrap">
                      {summary.migration.before}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-tertiary)] mb-1.5">Después</p>
                    <pre className="rounded-[var(--radius-sm)] bg-[var(--color-bg-tertiary)] p-3 text-xs text-[var(--color-text-secondary)] overflow-x-auto whitespace-pre-wrap">
                      {summary.migration.after}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border-subtle)]">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Generado por IA · puede contener errores
          </p>
          {rawDescription && (
            <button
              onClick={() => setShowRaw((v) => !v)}
              className="text-xs text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors"
            >
              {showRaw ? "Ocultar changelog original" : "Ver changelog original"}
            </button>
          )}
        </div>

        {/* Raw changelog accordion */}
        {showRaw && rawDescription && (
          <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] p-4">
            <p className="whitespace-pre-line text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {rawDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
