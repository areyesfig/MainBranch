import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface EcosystemImpact {
  technology: string;
  impact: "required" | "recommended" | "optional" | "breaking";
  description: string;
  minVersion?: string;
}

interface EcosystemImpactProps {
  impacts: EcosystemImpact[];
}

export default function EcosystemImpactComponent({ impacts }: EcosystemImpactProps) {
  const impactConfig = {
    required: {
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-900",
      label: "Requerido",
    },
    breaking: {
      icon: AlertCircle,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-900",
      label: "Cambio Requerido",
    },
    recommended: {
      icon: CheckCircle,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-900",
      label: "Recomendado",
    },
    optional: {
      icon: Info,
      color: "text-[var(--color-text-secondary)]",
      bgColor: "bg-[var(--color-bg-secondary)]",
      borderColor: "border-[var(--color-border-default)]",
      label: "Opcional",
    },
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
        Impacto en el Ecosistema
      </h3>
      <p className="text-[var(--color-text-secondary)]">
        Este lanzamiento afecta las siguientes tecnologías relacionadas:
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {impacts.map((impact, index) => {
          const config = impactConfig[impact.impact];
          const Icon = config.icon;

          return (
            <div
              key={index}
              className={`rounded-[var(--radius-lg)] border-2 p-4 ${config.bgColor} ${config.borderColor}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon className={`h-5 w-5 ${config.color}`} />
                <h4 className="font-semibold text-[var(--color-text-primary)]">
                  {impact.technology}
                </h4>
                <span
                  className={`ml-auto rounded-full px-2 py-1 text-xs font-medium ${config.color} ${config.bgColor}`}
                >
                  {config.label}
                </span>
              </div>
              <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
                {impact.description}
              </p>
              {impact.minVersion && (
                <div className="mt-2 rounded-[var(--radius-md)] bg-white/50 px-2 py-1 text-xs font-mono text-[var(--color-text-secondary)] dark:bg-[var(--color-bg-tertiary)]">
                  Versión mínima: {impact.minVersion}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
