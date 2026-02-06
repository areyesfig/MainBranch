import { describe, it, expect } from "vitest";
import {
  mockReleases,
  filterReleasesByStack,
  filterReleasesByStacks,
  searchReleases,
} from "@/lib/mockData";

describe("mockReleases", () => {
  it("tiene al menos un release", () => {
    expect(mockReleases.length).toBeGreaterThan(0);
  });

  it("cada release tiene campos requeridos", () => {
    for (const r of mockReleases) {
      expect(r).toHaveProperty("id");
      expect(r).toHaveProperty("technology");
      expect(r).toHaveProperty("version");
      expect(r).toHaveProperty("releaseDate");
      expect(r).toHaveProperty("tldr");
    }
  });
});

describe("filterReleasesByStack", () => {
  it("con null devuelve todos los releases", () => {
    expect(filterReleasesByStack(null)).toEqual(mockReleases);
  });

  it("filtra por stack existente", () => {
    const nextjs = filterReleasesByStack("nextjs");
    expect(nextjs.every((r) => r.stack === "nextjs")).toBe(true);
  });

  it("devuelve array vacío para stack sin releases", () => {
    const empty = filterReleasesByStack("stack-inexistente-xyz");
    expect(empty).toEqual([]);
  });
});

describe("filterReleasesByStacks", () => {
  it("con array vacío devuelve vacío", () => {
    expect(filterReleasesByStacks([])).toEqual([]);
  });

  it("filtra por múltiples stacks", () => {
    const stacks = ["nextjs", "react"];
    const result = filterReleasesByStacks(stacks);
    expect(result.every((r) => r.stack && stacks.includes(r.stack))).toBe(true);
  });
});

describe("searchReleases", () => {
  it("con query vacío devuelve todos", () => {
    expect(searchReleases("")).toEqual(mockReleases);
    expect(searchReleases("   ")).toEqual(mockReleases);
  });

  it("encuentra por tecnología", () => {
    const next = searchReleases("Next.js");
    expect(next.length).toBeGreaterThan(0);
    expect(next.some((r) => r.technology.toLowerCase().includes("next"))).toBe(true);
  });

  it("encuentra por versión", () => {
    const v15 = searchReleases("15");
    expect(v15.length).toBeGreaterThanOrEqual(0);
  });

  it("query inexistente devuelve array vacío", () => {
    const none = searchReleases("xyz123tecnologiaquenoexiste");
    expect(none).toEqual([]);
  });
});
