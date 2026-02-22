import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import NewsletterForm from "@/components/ui/NewsletterForm";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Main Branch
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tu hub centralizado de noticias, releases y tendencias en tecnología.
                Todo lo que necesitas del ecosistema dev, en un solo lugar.
              </p>
            </div>

            {/* Links Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Enlaces
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/releases"
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Releases
                  </Link>
                </li>
                <li>
                  <Link
                    href="/noticias"
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Noticias AI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/digest"
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Digests
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Acerca de
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Newsletter semanal
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Los releases más relevantes directo a tu email, cada semana.
              </p>
              <NewsletterForm />
              <div className="flex space-x-4 pt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-600 dark:text-gray-400 md:flex-row md:space-y-0">
            <p>&copy; {currentYear} Main Branch. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
