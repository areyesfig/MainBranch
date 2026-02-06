"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

interface AIReleaseExplanationProps {
  releaseId: string;
}

/**
 * Sección que permite generar una explicación del release en lenguaje claro usando IA.
 */
export default function AIReleaseExplanation({ releaseId }: AIReleaseExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
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
        setError(data.error ?? "Error al generar la explicación");
        return;
      }
      setExplanation(data.explanation ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-lg border border-violet-200 bg-white p-6 dark:border-violet-900 dark:bg-gray-900">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
        <Sparkles className="h-5 w-5 text-violet-500 dark:text-violet-400" />
        Explicación con IA
      </h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Genera un resumen en lenguaje claro de los cambios de este release, pensado para desarrolladores.
      </p>

      {!explanation && !loading && !error && (
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
        >
          <Sparkles className="h-4 w-4" />
          Generar explicación
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Generando explicación…</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {explanation && (
        <div className="mt-4 rounded-md bg-gray-50 p-4 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
          <p className="whitespace-pre-line text-sm leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
}
