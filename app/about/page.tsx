import type { Metadata } from "next";
import { Zap, Bot, Code, Mail, Heart, Coffee, Github } from "lucide-react";

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
    color: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Bot,
    title: "Noticias AI curadas",
    description: "Las últimas noticias de OpenAI, Claude, Gemini, DeepSeek y más, centralizadas.",
    color: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Code,
    title: "Filtrado por stack",
    description: "Filtra por la tecnología que te importa: frontend, backend, AI/ML, DevOps.",
    color: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: Mail,
    title: "Digests semanales",
    description: "Recibe un resumen semanal con lo más relevante directo en tu email.",
    color: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
];

const STEPS = [
  { number: "01", title: "Recopilamos", description: "Monitoreamos 30+ fuentes RSS, APIs de GitHub y feeds de noticias AI en tiempo real." },
  { number: "02", title: "Procesamos", description: "Extraemos versiones, detectamos breaking changes, calculamos impacto y validamos con Zod." },
  { number: "03", title: "Publicamos", description: "Servimos todo via Server Components, feeds RSS, newsletter semanal y bot de Telegram." },
];

const KOFI_URL = process.env.NEXT_PUBLIC_KOFI_URL ?? "";
const GITHUB_SPONSORS_URL = process.env.NEXT_PUBLIC_GITHUB_SPONSORS_URL ?? "https://github.com/sponsors/areyesfig";
const BUYMECOFFEE_URL = process.env.NEXT_PUBLIC_BUYMECOFFEE_URL ?? "";
const showSupport = KOFI_URL || GITHUB_SPONSORS_URL || BUYMECOFFEE_URL;

export default function AboutPage() {
  return (
    <div className="animate-fade-in py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Acerca de Main Branch
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--color-text-secondary)]">
            Tu hub centralizado de noticias, releases y tendencias en tecnología
          </p>
        </div>

        {/* Mission */}
        <div className="mb-12 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-8">
          <h2 className="mb-4 text-2xl font-semibold text-[var(--color-text-primary)]">
            Nuestra Misión
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Main Branch nace de la necesidad de tener una fuente única y confiable para
            seguir el pulso del ecosistema tecnológico. Agregamos releases de 30+ tecnologías
            y las últimas noticias de inteligencia artificial, proporcionando información clara
            sobre changelogs, breaking changes, guías de migración y tendencias del sector.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-primary)]">
            Características
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] ${feature.color}`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-[var(--color-text-primary)]">
            Cómo funciona
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="relative rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6"
              >
                <span className="mb-3 block text-3xl font-bold text-[var(--color-brand)]/30">
                  {step.number}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Apoya el proyecto */}
        {showSupport && (
          <div className="mb-12 rounded-[var(--radius-lg)] border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-8 dark:border-rose-900/50 dark:from-rose-950/30 dark:to-[var(--color-bg-elevated)]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/50">
                <Heart className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-[var(--color-text-primary)]">
                Apoya el proyecto
              </h2>
              <p className="mb-6 max-w-xl text-[var(--color-text-secondary)]">
                Si Main Branch te ahorra tiempo y quieres que sigamos mejorando el hub,
                considera invitarnos un café. Cualquier apoyo ayuda a mantener el sitio y
                las fuentes actualizadas.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {KOFI_URL && (
                  <a
                    href={KOFI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-[#ff5e5b] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    aria-label="Apoyar en Ko-fi"
                  >
                    <Coffee className="h-4 w-4" />
                    Ko-fi
                  </a>
                )}
                {GITHUB_SPONSORS_URL && (
                  <a
                    href={GITHUB_SPONSORS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
                    aria-label="Apoyar con GitHub Sponsors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Sponsors
                  </a>
                )}
                {BUYMECOFFEE_URL && (
                  <a
                    href={BUYMECOFFEE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    aria-label="Invitar un café en Buy Me a Coffee"
                  >
                    <Coffee className="h-4 w-4" />
                    Buy Me a Coffee
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-8">
          <h2 className="mb-4 text-2xl font-semibold text-[var(--color-text-primary)]">
            Stack Tecnológico
          </h2>
          <p className="mb-4 text-[var(--color-text-secondary)]">
            Este proyecto está construido con las siguientes tecnologías:
          </p>
          <ul className="space-y-2 text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-brand)]"></span>
              <strong>Next.js 16+</strong> - Framework React con App Router
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-brand)]"></span>
              <strong>TypeScript</strong> - Tipado estático para JavaScript
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-brand)]"></span>
              <strong>Tailwind CSS</strong> - Framework de utilidades CSS
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-brand)]"></span>
              <strong>Prisma + Neon Postgres</strong> - ORM y base de datos
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
