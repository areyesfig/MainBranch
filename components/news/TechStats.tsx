import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface TechStatsProps {
  label: string;
  totalReleases: number;
  recentCount: number;
  breakingCount: number;
  totalBreaking: number;
  avgImpact: number;
  avgDaysBetween: number;
  latestVersion?: string;
  latestDate?: Date | string;
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
      <p className="text-sm font-medium text-[var(--color-text-tertiary)]">
        {title}
      </p>
      <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ImpactBar({ score }: { score: number }) {
  const width = Math.min(score, 100);
  let color = "bg-green-500";
  if (score >= 70) color = "bg-red-500";
  else if (score >= 40) color = "bg-yellow-500";

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-[var(--color-text-primary)]">
        {score}
      </span>
      <div className="h-2 flex-1 rounded-full bg-[var(--color-bg-tertiary)]">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function TechStats({
  label,
  totalReleases,
  recentCount,
  breakingCount,
  totalBreaking,
  avgImpact,
  avgDaysBetween,
  latestVersion,
  latestDate,
}: TechStatsProps) {
  return (
    <div>
      {/* Resumen textual */}
      <div className="mb-6 rounded-[var(--radius-lg)] border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>{label}</strong> tuvo{" "}
          <strong>{recentCount} release{recentCount !== 1 ? "s" : ""}</strong> en
          los últimos 6 meses
          {breakingCount > 0 && (
            <>
              , incluyendo{" "}
              <strong className="text-red-700 dark:text-red-300">
                {breakingCount} breaking change{breakingCount !== 1 ? "s" : ""}
              </strong>
            </>
          )}
          .
          {avgDaysBetween > 0 && (
            <>
              {" "}
              En promedio se publica un release cada{" "}
              <strong>{avgDaysBetween} días</strong>.
            </>
          )}
        </p>
      </div>

      {/* Grid de stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Releases"
          value={totalReleases}
        />
        <StatCard
          title="Últimos 6 meses"
          value={recentCount}
          subtitle={`${totalBreaking} breaking en total`}
        />
        <StatCard
          title="Frecuencia"
          value={
            avgDaysBetween > 0 ? `~${avgDaysBetween}d` : "—"
          }
          subtitle="Promedio entre releases"
        />
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
          <p className="text-sm font-medium text-[var(--color-text-tertiary)]">
            Impact Score Promedio
          </p>
          <div className="mt-1">
            <ImpactBar score={avgImpact} />
          </div>
        </div>
      </div>

      {/* Último release */}
      {latestVersion && latestDate && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span>Último release:</span>
          <Badge variant="blue" size="sm">
            v{latestVersion}
          </Badge>
          <span>({formatDate(latestDate)})</span>
        </div>
      )}
    </div>
  );
}
