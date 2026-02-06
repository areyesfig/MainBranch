import { Code, Zap, Target, Heart } from "lucide-react";

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
            Tu fuente confiable para estar al día con los últimos lanzamientos tecnológicos
          </p>
        </div>

        {/* Mission */}
        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Nuestra Misión
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Main Branch nace de la necesidad de mantener a los desarrolladores informados
            sobre los últimos lanzamientos y actualizaciones de las tecnologías más importantes
            del ecosistema de desarrollo. Nuestro objetivo es proporcionar información clara,
            concisa y útil sobre cada nueva versión, destacando características importantes,
            cambios que rompen compatibilidad y mejoras de rendimiento.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Características
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Actualizaciones en Tiempo Real
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Mantente al día con los últimos lanzamientos tan pronto como estén disponibles.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Información Detallada
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Obtén información completa sobre características, mejoras y cambios importantes.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Filtrado por Stack
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Filtra los lanzamientos por tecnología o stack que más te interese.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Hecho con Pasión
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Desarrollado por y para la comunidad de desarrolladores.
                </p>
              </div>
            </div>
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
              <strong>Lucide React</strong> - Biblioteca de iconos
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
