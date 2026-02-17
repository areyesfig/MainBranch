import { getDigests } from "@/lib/data/digests";
import DigestClient from "./DigestClient";

export const metadata = {
  title: "Digests — Main Branch",
  description: "Resúmenes semanales y mensuales de las últimas releases tecnológicas",
};

export default async function DigestPage() {
  const digests = await getDigests();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Digests
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Resúmenes generados por IA de las últimas releases tecnológicas
        </p>
      </div>

      <DigestClient digests={digests} />
    </main>
  );
}
