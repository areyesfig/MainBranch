/**
 * Utilidades generales para la aplicación
 */

/**
 * Formatea una fecha a formato legible
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Clase de utilidad para combinar clases de Tailwind
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Indica si la versión es un placeholder (ej. 0.0.0) que no debe mostrarse en tarjetas.
 */
/**
 * Detecta versiones pre-release (alpha, beta, rc, canary, dev, next, preview).
 */
export function isPreRelease(version: string | undefined | null): boolean {
  if (!version) return false;
  return /-(alpha|beta|rc|canary|dev|next|preview)/i.test(version);
}

export function isPlaceholderVersion(version: string | undefined | null): boolean {
  if (!version) return true;
  const normalized = version.replace(/^v/i, "").trim();
  return normalized === "0.0.0";
}

/** Máximo largo para no truncar (p. ej. en página de detalle). */
const NO_TRUNCATE = 100_000;

/**
 * Limpia texto de releases: quita markdown, URLs largas y caracteres innecesarios.
 * @param maxLength - Límite de caracteres (por defecto 280 para tarjetas). Usar NO_TRUNCATE o número alto para detalle.
 */
export function sanitizeReleaseText(text: string | undefined | null, maxLength = 280): string {
  if (!text || typeof text !== "string") return "";
  let out = text
    // Quitar comentarios HTML <!-- ... -->
    .replace(/<!--[\s\S]*?-->/g, "")
    // Quitar tags HTML (<p>, <code>, <a href="...">, etc.)
    .replace(/<[^>]+>/g, "")
    // Quitar encabezados markdown (###, ##, #)
    .replace(/^#{1,6}\s*/gm, "")
    // Quitar enlaces markdown [texto](url) -> texto
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // Quitar enlaces sueltos tipo https://...
    .replace(/https?:\/\/\S+/g, "")
    // Quitar hashes de commit cortos [`abc1234`]
    .replace(/\[\`([a-f0-9]+)\`\]/g, "")
    // Quitar negrita/cursiva markdown
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    // Quitar referencias tipo [#12345] o (#15258)
    .replace(/[\[\(]#\d+[\]\)]/g, "")
    // Thanks @user al final (opcional)
    .replace(/\s*Thanks\s+@\w+\s*$/i, "")
    // Normalizar espacios y saltos
    .replace(/\s+/g, " ")
    .trim();
  if (maxLength < NO_TRUNCATE && out.length > maxLength) {
    out = out.slice(0, maxLength).trim() + "…";
  }
  return out;
}
