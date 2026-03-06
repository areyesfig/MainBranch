import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { ReleaseNote } from "@/types/release";
import Link from "next/link";

interface SecurityAlertsProps {
  releases: ReleaseNote[];
}

const severityConfig = {
  critical: {
    icon: ShieldAlert,
    bgColor: "bg-red-100 dark:bg-red-950/50",
    borderColor: "border-red-300 dark:border-red-900",
    textColor: "text-red-800 dark:text-red-200",
    label: "Crítico",
  },
  high: {
    icon: ShieldAlert,
    bgColor: "bg-orange-100 dark:bg-orange-950/50",
    borderColor: "border-orange-300 dark:border-orange-900",
    textColor: "text-orange-800 dark:text-orange-200",
    label: "Alto",
  },
  medium: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-100 dark:bg-yellow-950/50",
    borderColor: "border-yellow-300 dark:border-yellow-900",
    textColor: "text-yellow-800 dark:text-yellow-200",
    label: "Medio",
  },
  low: {
    icon: ShieldCheck,
    bgColor: "bg-blue-100 dark:bg-blue-950/50",
    borderColor: "border-blue-300 dark:border-blue-900",
    textColor: "text-blue-800 dark:text-blue-200",
    label: "Bajo",
  },
};

export default function SecurityAlerts({ releases }: SecurityAlertsProps) {
  const releasesWithAlerts = releases.filter(
    (r) => r.securityAlerts && r.securityAlerts.length > 0
  );

  if (releasesWithAlerts.length === 0) {
    return null;
  }

  const allAlerts = releasesWithAlerts.flatMap((release) =>
    (release.securityAlerts || []).map((alert) => ({
      ...alert,
      release,
    }))
  );

  const sortedAlerts = allAlerts.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-[var(--color-text-primary)]">
        <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
        Alertas de Seguridad
      </h2>
      <div className="space-y-4">
        {sortedAlerts.map((alert, index) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <Link
              key={`${alert.release.id}-${index}`}
              href={`/releases/${alert.release.id}`}
              className={`block rounded-[var(--radius-lg)] border-2 p-4 transition-colors hover:opacity-90 ${config.bgColor} ${config.borderColor}`}
            >
              <div className="flex items-start gap-4">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.textColor}`} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${config.textColor}`}
                    >
                      {config.label}
                    </span>
                    {alert.cve && (
                      <code className="text-xs text-[var(--color-text-secondary)]">
                        {alert.cve}
                      </code>
                    )}
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {alert.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {alert.description}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    {alert.release.technology} {alert.release.version} • Ver
                    detalles
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
