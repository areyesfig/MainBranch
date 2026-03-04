import type { Metadata } from "next";
import { Zap, Bot, Code, Mail } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Main Branch es tu hub de tecnología: releases, noticias AI y tendencias del ecosistema dev en un solo lugar.",
  openGraph: {
    title: "Acerca de — Main Branch",
    description: "Conoce qué es Main Branch, el hub centralizado de releases y noticias AI.",
    url: `${SITE_URL}/about`,
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

const FEATURES = [
  {
    icon: Zap,
    title: "Releases en tiempo real",
    description: "Changelogs de 30+ tecnologías indexados automáticamente cada 6 horas.",
    color: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Bot,
    title: "Noticias AI curadas",
    description: "Las últimas noticias de OpenAI, Claude, Gemini, DeepSeek y más, centralizadas.",
    color: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Code,
    title: "Filtrado por stack",
    description: "Filtra por la tecnología que te importa: frontend, backend, AI/ML, DevOps.",
    color: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: Mail,
    title: "Digests semanales",
    description: "Recibe un resumen semanal con lo más relevante directo en tu email.",
    color: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
];

const STEPS = [
  { number: "01", title: "Recopilamos", description: "Monitoreamos 30+ fuentes RSS, APIs de GitHub y feeds de noticias AI en tiempo real." },
  { number: "02", title: "Procesamos", description: "Extraemos versiones, detectamos breaking changes, calculamos impacto y validamos con Zod." },
  { number: "03", title: "Publicamos", description: "Servimos todo via Server Components, feeds RSS, newsletter semanal y bot de Telegram." },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Acerca de Main Branch
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Tu hub centralizado de noticias, releases y tendencias en tecnología
          </p>
        </div>

        {/* Mission */}
        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Nuestra Misión
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Main Branch nace de la necesidad de tener una fuente única y confiable para
            seguir el pulso del ecosistema tecnológico. Agregamos releases de 30+ tecnologías
            y las últimas noticias de inteligencia artificial, proporcionando información clara
            sobre changelogs, breaking changes, guías de migración y tendencias del sector.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Características
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${feature.color}`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Cómo funciona
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="relative rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <span className="mb-3 block text-3xl font-bold text-blue-600/30 dark:text-blue-400/30">
                  {step.number}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Stack Tecnológico
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Este proyecto está construido con las siguientes tecnologías:
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <strong>Next.js 16+</strong> - Framework React con App Router
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <strong>TypeScript</strong> - Tipado estático para JavaScript
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <strong>Tailwind CSS</strong> - Framework de utilidades CSS
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <strong>Prisma + Neon Postgres</strong> - ORM y base de datos
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
