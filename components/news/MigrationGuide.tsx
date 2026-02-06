"use client";

import { CheckCircle2, Circle, Clock, Code2 } from "lucide-react";
import { useState } from "react";

interface MigrationStep {
  step: number;
  title: string;
  description: string;
  estimatedTime?: string;
  codeExample?: string;
}

interface MigrationGuideProps {
  steps: MigrationStep[];
  estimatedTotalTime?: number;
  complexity?: "low" | "medium" | "high" | "critical";
}

/**
 * Componente interactivo para guía de migración con checklist
 */
export default function MigrationGuide({
  steps,
  estimatedTotalTime,
  complexity,
}: MigrationGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const complexityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const complexityLabels = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    critical: "Crítica",
  };

  const progress = (completedSteps.size / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Guía de Migración
          </h3>
          {complexity && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${complexityColors[complexity]}`}
            >
              Complejidad: {complexityLabels[complexity]}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Progreso de migración
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {completedSteps.size} / {steps.length} pasos
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {estimatedTotalTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>
              Tiempo estimado total: <strong>{estimatedTotalTime} horas</strong>
            </span>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isCompleted = completedSteps.has(step.step);
          return (
            <div
              key={step.step}
              className={`rounded-lg border-2 p-6 transition-all ${
                isCompleted
                  ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(step.step)}
                  className="mt-1 shrink-0 transition-transform hover:scale-110"
                  aria-label={`${isCompleted ? "Marcar como incompleto" : "Marcar como completo"}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Paso {step.step}
                    </span>
                    {step.estimatedTime && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {step.estimatedTime}
                      </span>
                    )}
                  </div>
                  <h4
                    className={`mb-2 text-lg font-semibold ${
                      isCompleted
                        ? "text-green-900 line-through dark:text-green-200"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`mb-4 ${
                      isCompleted
                        ? "text-green-700 dark:text-green-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                  {step.codeExample && (
                    <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
                        <Code2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Ejemplo de código
                        </span>
                      </div>
                      <pre className="overflow-x-auto p-4 text-sm">
                        <code className="text-gray-800 dark:text-gray-200">
                          {step.codeExample}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
