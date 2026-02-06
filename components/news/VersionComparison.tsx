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

/**
 * Componente para comparar dos versiones lado a lado
 */
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
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Comparación de Versiones
        </h3>
        <div className="flex items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Versión Anterior
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {technology} {previousVersion}
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-gray-400" />
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Nueva Versión
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {technology} {currentVersion}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {performanceMetrics.length > 0 && (
        <div>
          <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Métricas de Rendimiento
          </h4>
          <div className="space-y-3">
            {performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {metric.metric}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 dark:text-gray-400">
                      {metric.before}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
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
          <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Impacto en Bundle Size
          </h4>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Antes
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(bundleSizeImpact.before)}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Después
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
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
                    : "text-gray-600 dark:text-gray-400"
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
