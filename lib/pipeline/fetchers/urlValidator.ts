/**
 * Validación de URLs para prevenir SSRF.
 * Bloquea localhost, IPs privadas y protocolos no-HTTP.
 */

const BLOCKED_HOSTNAMES = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"];

const PRIVATE_IP_REGEX =
  /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.)/;

export function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    if (BLOCKED_HOSTNAMES.includes(hostname)) {
      return false;
    }

    if (PRIVATE_IP_REGEX.test(hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
