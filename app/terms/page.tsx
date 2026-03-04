import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Términos y condiciones de uso del sitio Main Branch.",
  openGraph: {
    title: "Términos de uso — Main Branch",
    description: "Términos y condiciones de uso de Main Branch.",
    url: `${SITE_URL}/terms`,
  },
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Volver al inicio
          </Link>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Términos de uso
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Última actualización: marzo 2025
        </p>

        <div className="mt-10 space-y-8 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              1. Aceptación
            </h2>
            <p className="mt-2">
              Al acceder o utilizar el sitio web Main Branch (&quot;el sitio&quot;) aceptas estos
              términos de uso. Si no estás de acuerdo, no uses el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. Descripción del servicio
            </h2>
            <p className="mt-2">
              Main Branch es un agregador de noticias, releases y tendencias tecnológicas.
              Recopilamos información de fuentes públicas (blogs, feeds RSS, APIs) y la
              presentamos de forma centralizada. No somos los autores del contenido
              original; los derechos corresponden a las fuentes y proyectos citados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. Uso permitido
            </h2>
            <p className="mt-2">
              Puedes usar el sitio para consultar releases, noticias, digests y feeds
              RSS con fines personales o profesionales, de forma lícita. No está
              permitido:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Usar el sitio para fines ilegales o que vulneren derechos de terceros.</li>
              <li>Intentar sobrecargar o alterar el funcionamiento del sitio (ataques, scraping abusivo, etc.).</li>
              <li>Suplantar identidad o falsear datos al suscribirte a la newsletter o usar servicios que lo requieran.</li>
              <li>Reutilizar masivamente el contenido del sitio sin autorización (por ejemplo, republicar íntegramente nuestros digests con fines comerciales sin acuerdo).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              4. Contenido y precisión
            </h2>
            <p className="mt-2">
              Nos esforzamos por ofrecer información útil y actualizada, pero el
              contenido se obtiene de terceros y puede contener errores, retrasos o
              inexactitudes. No garantizamos que la información sea completa, actual
              o adecuada para una decisión concreta. Para decisiones importantes
              (actualizaciones en producción, migraciones, etc.) consulta siempre las
              fuentes oficiales y la documentación de cada tecnología.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              5. Propiedad intelectual y enlaces
            </h2>
            <p className="mt-2">
              La estructura del sitio, el diseño y los textos propios de Main Branch
              están protegidos por las leyes de propiedad intelectual aplicables.
              Los resúmenes, traducciones y clasificaciones que generamos se ofrecen
              bajo la misma lógica de uso del sitio. Los enlaces a sitios externos
              (documentación, repositorios, blogs) son responsabilidad de sus
              respectivos titulares; no controlamos su contenido ni sus políticas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              6. Limitación de responsabilidad
            </h2>
            <p className="mt-2">
              En la máxima medida permitida por la ley aplicable, Main Branch y sus
              responsables no serán responsables por daños indirectos, incidentales,
              especiales o consecuentes derivados del uso o la imposibilidad de usar
              el sitio (incluyendo, entre otros, pérdida de datos, de beneficios o de
              negocio). El uso del sitio es &quot;tal cual&quot; y &quot;según disponibilidad&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              7. Newsletter y comunicaciones
            </h2>
            <p className="mt-2">
              Al suscribirte a la newsletter o al digest aceptas recibir correos
              electrónicos de Main Branch. Puedes darte de baja en cualquier momento
              mediante el enlace incluido en cada correo. El tratamiento de tus datos
              se rige por nuestra{" "}
              <Link href="/privacy" className="text-blue-600 underline hover:no-underline dark:text-blue-400">
                Política de privacidad
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              8. Modificaciones
            </h2>
            <p className="mt-2">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios entrarán en vigor al publicarlos en esta página.
              El uso continuado del sitio tras la publicación constituye la aceptación
              de los nuevos términos. Te recomendamos revisar esta página de forma
              periódica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              9. Ley aplicable y resolución de conflictos
            </h2>
            <p className="mt-2">
              Estos términos se rigen por la ley chilena. Cualquier controversia
              derivada de su interpretación o del uso del sitio se someterá a los
              tribunales que correspondan conforme a dicha ley, salvo que la
              normativa aplicable exija otro foro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              10. Contacto
            </h2>
            <p className="mt-2">
              Para consultas sobre estos términos puedes contactarnos a través de la
              información publicada en el sitio (por ejemplo, en la página{" "}
              <Link href="/about" className="text-blue-600 underline hover:no-underline dark:text-blue-400">
                Acerca de
              </Link>
              ).
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
