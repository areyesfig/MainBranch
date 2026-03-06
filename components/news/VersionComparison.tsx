import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface PerformanceMetric {
  metric: string;
  before: string | number;
  after: string | number;
  improvement: string;
}

interface VersionComparisonProps {
  currentVersion: string;
  previousVersion: string;
  technology: string;
  performanceMetrics?: PerformanceMetric[];
  bundleSizeImpact?: {
    before: number;
    after: number;
    change: number;
  };
}

export default function VersionComparison({
  currentVersion,
  previousVersion,
  technology,
  performanceMetrics = [],
  bundleSizeImpact,
}: VersionComparisonProps) {
  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}KB`;
    }
    return `${value}KB`;
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-[var(--color-text-secondary)]" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-bold text-[var(--color-text-primary)]">
          Comparación de Versiones
        </h3>
        <div className="flex items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6">
          <div className="text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              Versión Anterior
            </div>
            <div className="text-2xl font-bold text-[var(--color-text-primary)]">
              {technology} {previousVersion}
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-[var(--color-text-tertiary)]" />
          <div className="text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              Nueva Versión
            </div>
            <div className="text-2xl font-bold text-[var(--color-brand)]">
              {technology} {currentVersion}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {performanceMetrics.length > 0 && (
        <div>
          <h4 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
            Métricas de Rendimiento
          </h4>
          <div className="space-y-3">
            {performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4"
              >
                <div className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">
                  {metric.metric}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--color-text-secondary)]">
                      {metric.before}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {metric.after}
                    </span>
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {metric.improvement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bundle Size */}
      {bundleSizeImpact && (
        <div>
          <h4 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
            Impacto en Bundle Size
          </h4>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Antes
                  </div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)]">
                    {formatNumber(bundleSizeImpact.before)}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                <div className="text-center">
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    Después
                  </div>
                  <div className="text-xl font-bold text-[var(--color-text-primary)]">
                    {formatNumber(bundleSizeImpact.after)}
                  </div>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  bundleSizeImpact.change < 0
                    ? "text-green-600 dark:text-green-400"
                    : bundleSizeImpact.change > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {getTrendIcon(bundleSizeImpact.change)}
                <span className="text-lg font-semibold">
                  {bundleSizeImpact.change > 0 ? "+" : ""}
                  {formatNumber(Math.abs(bundleSizeImpact.change))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
