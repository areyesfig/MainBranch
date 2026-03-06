import type { ReleaseNote } from "@/types/release";
import Badge from "@/components/ui/Badge";
import { formatDate, sanitizeReleaseText } from "@/lib/utils";

interface ReleaseCompareProps {
  releaseA: ReleaseNote;
  releaseB: ReleaseNote;
}

function safe(text: string | undefined | null, max = 10000) {
  return sanitizeReleaseText(text, max);
}

function ListCompare({
  title,
  listA,
  listB,
  dotColor,
}: {
  title: string;
  listA: string[];
  listB: string[];
  dotColor: string;
}) {
  if (listA.length === 0 && listB.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <ItemList items={listA} dotColor={dotColor} />
        <ItemList items={listB} dotColor={dotColor} />
      </div>
    </div>
  );
}

function ItemList({ items, dotColor }: { items: string[]; dotColor: string }) {
  if (items.length === 0) {
    return (
      <p className="text-sm italic text-[var(--color-text-tertiary)]">
        Sin datos
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
        >
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function StatRow({
  label,
  valueA,
  valueB,
  highlight,
}: {
  label: string;
  valueA: React.ReactNode;
  valueB: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <tr className={highlight ? "bg-yellow-50 dark:bg-yellow-900/10" : ""}>
      <td className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </td>
      <td className="px-4 py-2 text-sm text-[var(--color-text-primary)]">
        {valueA}
      </td>
      <td className="px-4 py-2 text-sm text-[var(--color-text-primary)]">
        {valueB}
      </td>
    </tr>
  );
}

function ComplexityBadge({ level }: { level?: string }) {
  if (!level) return <span className="text-[var(--color-text-tertiary)]">—</span>;
  const variants: Record<string, "green" | "yellow" | "orange" | "red"> = {
    low: "green",
    medium: "yellow",
    high: "orange",
    critical: "red",
  };
  return <Badge variant={variants[level] ?? "gray"}>{level}</Badge>;
}

export default function ReleaseCompare({
  releaseA,
  releaseB,
}: ReleaseCompareProps) {
  const featuresA = releaseA.features?.map((f) => safe(f, 2000)) ?? [];
  const featuresB = releaseB.features?.map((f) => safe(f, 2000)) ?? [];
  const improvementsA = releaseA.improvements?.map((f) => safe(f, 2000)) ?? [];
  const improvementsB = releaseB.improvements?.map((f) => safe(f, 2000)) ?? [];
  const bugFixesA = releaseA.bugFixes?.map((f) => safe(f, 2000)) ?? [];
  const bugFixesB = releaseB.bugFixes?.map((f) => safe(f, 2000)) ?? [];
  const breakingA = releaseA.breakingChanges?.map((c) => safe(c, 2000)) ?? [];
  const breakingB = releaseB.breakingChanges?.map((c) => safe(c, 2000)) ?? [];

  return (
    <div>
      {/* Headers */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {releaseA.technology}
            </h2>
            <Badge variant="blue" size="sm">
              v{releaseA.version}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
            {formatDate(releaseA.releaseDate)}
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {releaseB.technology}
            </h2>
            <Badge variant="blue" size="sm">
              v{releaseB.version}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
            {formatDate(releaseB.releaseDate)}
          </p>
        </div>
      </div>

      {/* TLDR */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold text-[var(--color-text-primary)]">
          Resumen (TLDR)
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <p className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4 text-sm text-[var(--color-text-secondary)]">
            {safe(releaseA.tldr)}
          </p>
          <p className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4 text-sm text-[var(--color-text-secondary)]">
            {safe(releaseB.tldr)}
          </p>
        </div>
      </div>

      {/* Stats Table */}
      <div className="mb-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--color-text-tertiary)]">
                Métrica
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--color-text-tertiary)]">
                {releaseA.technology} v{releaseA.version}
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--color-text-tertiary)]">
                {releaseB.technology} v{releaseB.version}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]">
            <StatRow
              label="Impact Score"
              valueA={releaseA.impactScore ?? "—"}
              valueB={releaseB.impactScore ?? "—"}
            />
            <StatRow
              label="Breaking Changes"
              valueA={
                releaseA.breakingChange ? (
                  <Badge variant="red">Si</Badge>
                ) : (
                  <Badge variant="green">No</Badge>
                )
              }
              valueB={
                releaseB.breakingChange ? (
                  <Badge variant="red">Si</Badge>
                ) : (
                  <Badge variant="green">No</Badge>
                )
              }
              highlight={releaseA.breakingChange !== releaseB.breakingChange}
            />
            <StatRow
              label="Complejidad de Migración"
              valueA={<ComplexityBadge level={releaseA.migrationComplexity} />}
              valueB={<ComplexityBadge level={releaseB.migrationComplexity} />}
            />
            <StatRow
              label="Tiempo Est. Migración"
              valueA={
                releaseA.estimatedMigrationTime
                  ? `${releaseA.estimatedMigrationTime}h`
                  : "—"
              }
              valueB={
                releaseB.estimatedMigrationTime
                  ? `${releaseB.estimatedMigrationTime}h`
                  : "—"
              }
            />
            <StatRow
              label="Features"
              valueA={featuresA.length}
              valueB={featuresB.length}
            />
            <StatRow
              label="Bug Fixes"
              valueA={bugFixesA.length}
              valueB={bugFixesB.length}
            />
          </tbody>
        </table>
      </div>

      {/* Bundle Size */}
      {(releaseA.bundleSizeImpact || releaseB.bundleSizeImpact) && (
        <div className="mb-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
                <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--color-text-tertiary)]">
                  Bundle Size
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--color-text-tertiary)]">
                  {releaseA.technology} v{releaseA.version}
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--color-text-tertiary)]">
                  {releaseB.technology} v{releaseB.version}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]">
              <StatRow
                label="Antes"
                valueA={
                  releaseA.bundleSizeImpact
                    ? `${releaseA.bundleSizeImpact.before} KB`
                    : "—"
                }
                valueB={
                  releaseB.bundleSizeImpact
                    ? `${releaseB.bundleSizeImpact.before} KB`
                    : "—"
                }
              />
              <StatRow
                label="Después"
                valueA={
                  releaseA.bundleSizeImpact
                    ? `${releaseA.bundleSizeImpact.after} KB`
                    : "—"
                }
                valueB={
                  releaseB.bundleSizeImpact
                    ? `${releaseB.bundleSizeImpact.after} KB`
                    : "—"
                }
              />
              <StatRow
                label="Cambio"
                valueA={
                  releaseA.bundleSizeImpact
                    ? `${releaseA.bundleSizeImpact.change > 0 ? "+" : ""}${releaseA.bundleSizeImpact.change} KB`
                    : "—"
                }
                valueB={
                  releaseB.bundleSizeImpact
                    ? `${releaseB.bundleSizeImpact.change > 0 ? "+" : ""}${releaseB.bundleSizeImpact.change} KB`
                    : "—"
                }
              />
            </tbody>
          </table>
        </div>
      )}

      {/* Features */}
      <ListCompare
        title="Nuevas Características"
        listA={featuresA}
        listB={featuresB}
        dotColor="bg-blue-500"
      />

      {/* Breaking Changes */}
      <ListCompare
        title="Breaking Changes"
        listA={breakingA}
        listB={breakingB}
        dotColor="bg-red-500"
      />

      {/* Improvements */}
      <ListCompare
        title="Mejoras"
        listA={improvementsA}
        listB={improvementsB}
        dotColor="bg-green-500"
      />

      {/* Bug Fixes */}
      <ListCompare
        title="Correcciones"
        listA={bugFixesA}
        listB={bugFixesB}
        dotColor="bg-purple-500"
      />
    </div>
  );
}
