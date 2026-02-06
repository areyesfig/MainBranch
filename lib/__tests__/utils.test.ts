import { describe, it, expect } from "vitest";
import { formatDate, cn, sanitizeReleaseText, isPlaceholderVersion } from "@/lib/utils";

describe("formatDate", () => {
  it("formatea Date a español", () => {
    const date = new Date("2024-10-23");
    expect(formatDate(date)).toMatch(/octubre|23|2024/i);
  });

  it("formatea string ISO a español", () => {
    expect(formatDate("2024-10-23")).toMatch(/octubre|23|2024/i);
  });
});

describe("cn", () => {
  it("combina clases válidas", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignora undefined, null y false", () => {
    expect(cn("a", undefined, null, false, "b")).toBe("a b");
  });

  it("devuelve string vacío sin argumentos", () => {
    expect(cn()).toBe("");
  });
});

describe("sanitizeReleaseText", () => {
  it("quita encabezados markdown y enlaces", () => {
    const raw = "### Minor Changes - [#15258](https://github.com/withastro/astro/pull/15258)";
    expect(sanitizeReleaseText(raw)).toBe("Minor Changes - #15258");
  });

  it("devuelve string vacío para null/undefined", () => {
    expect(sanitizeReleaseText(null)).toBe("");
    expect(sanitizeReleaseText(undefined)).toBe("");
  });

  it("trunca a maxLength y añade ellipsis", () => {
    const long = "a".repeat(400);
    const out = sanitizeReleaseText(long, 50);
    expect(out.length).toBe(51);
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("isPlaceholderVersion", () => {
  it("devuelve true para 0.0.0 y v0.0.0", () => {
    expect(isPlaceholderVersion("0.0.0")).toBe(true);
    expect(isPlaceholderVersion("v0.0.0")).toBe(true);
    expect(isPlaceholderVersion("V0.0.0")).toBe(true);
  });
  it("devuelve true para null/undefined", () => {
    expect(isPlaceholderVersion(null)).toBe(true);
    expect(isPlaceholderVersion(undefined)).toBe(true);
  });
  it("devuelve false para versiones reales", () => {
    expect(isPlaceholderVersion("1.0.0")).toBe(false);
    expect(isPlaceholderVersion("v18.2.0")).toBe(false);
  });
});
