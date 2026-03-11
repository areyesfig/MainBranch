import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Política de privacidad de Main Branch: qué datos recogemos, cómo los usamos y tus derechos.",
  openGraph: {
    title: "Privacidad — Main Branch",
    description: "Política de privacidad de Main Branch.",
    url: `${SITE_URL}/privacy`,
  },
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="animate-fade-in py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-brand)] hover:opacity-80"
          >
            &larr; Volver al inicio
          </Link>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Política de privacidad
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
          Última actualización: marzo 2025
        </p>

        <div className="mt-10 space-y-8 text-[var(--color-text-secondary)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              1. Responsable del tratamiento
            </h2>
            <p className="mt-2">
              Main Branch (&quot;el sitio&quot;) es un hub de noticias y releases tecnológicos.
              Los datos que proporciones se tratan para ofrecer y mejorar este servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              2. Datos que recogemos
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong>Email:</strong> si te suscribes a la newsletter o al digest semanal,
                guardamos tu dirección de correo para enviarte los contenidos y gestionar la
                suscripción (confirmación y baja).
              </li>
              <li>
                <strong>Dirección IP:</strong> se puede usar de forma temporal para limitar
                abusos (rate limiting) en acciones como suscripciones, votos o uso de
                servicios con límite de uso. No asociamos la IP a tu perfil de forma permanente.
              </li>
              <li>
                <strong>Preferencias en el navegador:</strong> si eliges tema claro/oscuro,
                esa preferencia puede guardarse en tu dispositivo (localStorage) para mejorar
                tu experiencia. No la enviamos a nuestros servidores.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              3. Finalidad del tratamiento
            </h2>
            <p className="mt-2">
              Usamos tus datos para: (a) enviarte la newsletter o el digest si te has
              suscrito; (b) evitar abusos y garantizar la estabilidad del servicio;
              (c) cumplir obligaciones legales si fueran aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              4. Base legal y conservación
            </h2>
            <p className="mt-2">
              El tratamiento del email se basa en tu consentimiento (suscribirte). Puedes
              darte de baja en cualquier momento mediante el enlace que incluye cada
              correo. Conservamos tu email mientras mantengas la suscripción activa; al
              darte de baja, podemos conservar un registro mínimo durante un tiempo
              limitado por obligaciones legales o para evitar reenvíos no deseados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              5. Cesión y terceros
            </h2>
            <p className="mt-2">
              Podemos utilizar servicios de terceros que procesan datos en nuestro nombre:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong>Envío de correo:</strong> utilizamos un proveedor de email
                transaccional para enviar la newsletter y los digests. Este proveedor
                puede almacenar tu dirección y el historial de envíos según su propia
                política de privacidad.
              </li>
              <li>
                <strong>Alojamiento e infraestructura:</strong> el sitio y las bases de
                datos pueden estar alojados en proveedores en la nube (por ejemplo, en
                la Unión Europea o EE. UU.), que actúan como encargados del tratamiento.
              </li>
            </ul>
            <p className="mt-2">
              No vendemos ni alquilamos tus datos personales a terceros con fines
              comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              6. Cookies y tecnologías similares
            </h2>
            <p className="mt-2">
              El sitio utiliza el mínimo necesario: preferencias de tema (por ejemplo en
              localStorage) y, si en el futuro se incorporan análisis de uso, se
              informará aquí.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              7. Publicidad — Google AdSense
            </h2>
            <p className="mt-2">
              Este sitio puede mostrar anuncios proporcionados por Google AdSense.
              Google utiliza cookies para mostrar anuncios basados en visitas
              previas a este u otros sitios web. Puedes inhabilitar el uso de
              cookies de publicidad personalizada visitando la{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-brand)] underline hover:no-underline"
              >
                configuración de anuncios de Google
              </a>
              . Proveedores de publicidad terceros pueden usar cookies para
              mostrar anuncios en función de datos de navegación. Para más
              información, consulta{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-brand)] underline hover:no-underline"
              >
                cómo usa Google los datos de los sitios de sus partners
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              8. Tus derechos
            </h2>
            <p className="mt-2">
              Puedes solicitar acceso, rectificación, supresión o limitación del
              tratamiento de tus datos, así como oponerte al tratamiento o solicitar la
              portabilidad cuando sea aplicable. Para ejercer estos derechos o para
              cualquier consulta sobre privacidad, contacta con nosotros a través del
              sitio o del medio que indiquemos en la sección de contacto.
            </p>
            <p className="mt-2">
              Si consideras que el tratamiento no se ajusta a la normativa, tienes
              derecho a presentar una reclamación ante la autoridad de protección de
              datos que corresponda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              9. Cambios en esta política
            </h2>
            <p className="mt-2">
              Podemos actualizar esta política de privacidad. Los cambios relevantes se
              reflejarán en esta página y, si afectan de forma relevante a tus datos,
              te lo indicaremos cuando sea posible (por ejemplo, mediante un aviso en el
              sitio o en la newsletter).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              10. Contacto
            </h2>
            <p className="mt-2">
              Para preguntas sobre esta política o sobre tus datos personales, puedes
              contactarnos a través de la información de contacto publicada en el sitio
              (por ejemplo, en la página <Link href="/about" className="text-[var(--color-brand)] underline hover:no-underline">Acerca de</Link>).
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border-default)]">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-brand)] hover:opacity-80"
          >
            &larr; Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
