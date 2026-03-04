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
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
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
      <p className="text-sm italic text-gray-400 dark:text-gray-500">
        Sin datos
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
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
      <td className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </td>
      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
        {valueA}
      </td>
      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
        {valueB}
      </td>
    </tr>
  );
}

function ComplexityBadge({ level }: { level?: string }) {
  if (!level) return <span className="text-gray-400">—</span>;
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
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {releaseA.technology}
            </h2>
            <Badge variant="blue" size="sm">
              v{releaseA.version}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formatDate(releaseA.releaseDate)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {releaseB.technology}
            </h2>
            <Badge variant="blue" size="sm">
              v{releaseB.version}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formatDate(releaseB.releaseDate)}
          </p>
        </div>
      </div>

      {/* TLDR */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Resumen (TLDR)
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            {safe(releaseA.tldr)}
          </p>
          <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            {safe(releaseB.tldr)}
          </p>
        </div>
      </div>

      {/* Stats Table */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Métrica
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                {releaseA.technology} v{releaseA.version}
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                {releaseB.technology} v{releaseB.version}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
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
        <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Bundle Size
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {releaseA.technology} v{releaseA.version}
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {releaseB.technology} v{releaseB.version}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
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
