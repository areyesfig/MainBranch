import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import NewsletterForm from "@/components/ui/NewsletterForm";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-bg-primary)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-text-primary)] text-[10px] font-bold text-[var(--color-text-inverse)]">
                MB
              </span>
              Main Branch
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Tu hub centralizado de releases y tendencias tech.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com/areyesfig/mainbranch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/mainbranch_dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="overline text-[var(--color-text-tertiary)]">
              Navegación
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/releases", label: "Releases" },
                { href: "/tech", label: "Tecnologías" },
                { href: "/noticias", label: "Noticias" },
                { href: "/timeline", label: "Timeline" },
                { href: "/digest", label: "Digests" },
                { href: "/about", label: "Acerca de" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-5">
            <h4 className="overline text-[var(--color-text-tertiary)]">
              Newsletter
            </h4>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Los releases más relevantes, cada semana en tu email.
            </p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-default)] py-6 text-xs text-[var(--color-text-tertiary)] md:flex-row">
          <p>&copy; {currentYear} Main Branch</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
