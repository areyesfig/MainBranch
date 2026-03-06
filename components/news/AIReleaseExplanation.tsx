"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

interface AIReleaseExplanationProps {
  releaseId: string;
}

const MAX_RETRIES = 2;

export default function AIReleaseExplanation({ releaseId }: AIReleaseExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const retries = useRef(0);

  const handleGenerate = async () => {
    if (retries.current >= MAX_RETRIES) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/releases/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releaseId }),
      });
      const data = await res.json();

      if (!res.ok) {
        retries.current++;
        setError(data.error ?? "Error al generar la explicación");
        return;
      }
      setExplanation(data.explanation ?? "");
    } catch (e) {
      retries.current++;
      setError(e instanceof Error ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const canRetry = !loading && !explanation && retries.current < MAX_RETRIES;

  return (
    <div className="rounded-[var(--radius-lg)] border border-purple-500/20 bg-[var(--color-bg-elevated)] p-5 sm:p-6">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
        <Sparkles className="h-5 w-5 text-purple-500" />
        Explicación con IA
      </h2>
      <p className="mb-4 text-sm text-[var(--color-text-tertiary)]">
        Genera un resumen en lenguaje claro de los cambios de este release.
      </p>

      {canRetry && !error && (
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          <Sparkles className="h-4 w-4" />
          Generar explicación
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-[var(--color-text-tertiary)]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Generando explicación...</span>
        </div>
      )}

      {error && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-[var(--radius-md)] bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          {canRetry && (
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
            >
              Reintentar
            </button>
          )}
        </div>
      )}

      {explanation && (
        <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] p-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
