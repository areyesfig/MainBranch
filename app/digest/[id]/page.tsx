import { notFound } from "next/navigation";
import { getDigestById } from "@/lib/data/digests";
import DigestDetail from "@/components/news/DigestDetail";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DigestDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || id.length > 50) {
    notFound();
  }

  const digest = await getDigestById(id);

  if (!digest) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/digest"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Digests
      </Link>

      <DigestDetail digest={digest} />
    </main>
  );
}
