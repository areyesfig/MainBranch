"use client";

import { AlertTriangle, Code2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeExample {
  title: string;
  before: string;
  after: string;
  language?: string;
}

interface BreakingChangesDetailProps {
  breakingChanges: string[];
  codeExamples?: CodeExample[];
}

export default function BreakingChangesDetail({
  breakingChanges,
  codeExamples = [],
}: BreakingChangesDetailProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breaking Changes List */}
      <div className="rounded-[var(--radius-lg)] border-2 border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
            Cambios que Rompen Compatibilidad
          </h3>
        </div>
        <ul className="space-y-3">
          {breakingChanges.map((change, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-red-800 dark:text-red-200"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-600"></span>
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Code Examples */}
      {codeExamples.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Ejemplos de Código
            </h3>
          </div>
          {codeExamples.map((example, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)]"
            >
              <div className="bg-[var(--color-bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]">
                {example.title}
              </div>
              <div className="grid gap-0 md:grid-cols-2">
                {/* Before */}
                <div className="border-r border-[var(--color-border-default)]">
                  <div className="flex items-center justify-between bg-red-50 px-4 py-2 dark:bg-red-950/20">
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      Antes
                    </span>
                    <button
                      onClick={() => copyToClipboard(example.before, index * 2)}
                      className="rounded p-1 text-[var(--color-text-secondary)] transition-colors hover:bg-red-100 hover:text-[var(--color-text-primary)] dark:hover:bg-red-900/40"
                      title="Copiar código"
                    >
                      {copiedIndex === index * 2 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto bg-[var(--color-bg-elevated)] p-4 text-sm">
                    <code className="text-[var(--color-text-secondary)]">
                      {example.before}
                    </code>
                  </pre>
                </div>

                {/* After */}
                <div>
                  <div className="flex items-center justify-between bg-green-50 px-4 py-2 dark:bg-green-950/20">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Después
                    </span>
                    <button
                      onClick={() => copyToClipboard(example.after, index * 2 + 1)}
                      className="rounded p-1 text-[var(--color-text-secondary)] transition-colors hover:bg-green-100 hover:text-[var(--color-text-primary)] dark:hover:bg-green-900/40"
                      title="Copiar código"
                    >
                      {copiedIndex === index * 2 + 1 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto bg-[var(--color-bg-elevated)] p-4 text-sm">
                    <code className="text-[var(--color-text-secondary)]">
                      {example.after}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
