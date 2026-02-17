import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseVersion,
  getVersionTypeScore,
  getBreakingChangeScore,
  getNpmPopularityScore,
  getReleaseFrequencyScore,
  getSecurityScore,
  calculateImpactScore,
  clearNpmCache,
} from "../impactScore";
import type { ReleaseNote } from "@/types/release";
import type { DataSource } from "@/types/sources";

function makeRelease(overrides: Partial<ReleaseNote> = {}): ReleaseNote {
  return {
    id: "test-1",
    technology: "Test",
    version: "1.0.0",
    releaseDate: new Date(),
    tldr: "Test release",
    description: "",
    breakingChange: false,
    ...overrides,
  };
}

function makeSource(overrides: Partial<DataSource> = {}): DataSource {
  return {
    id: "test-source",
    name: "Test Source",
    type: "api",
    url: "https://example.com",
    technology: "Test",
    ...overrides,
  } as DataSource;
}

describe("parseVersion", () => {
  it("parsea versión semver estándar", () => {
    expect(parseVersion("1.2.3")).toEqual([1, 2, 3]);
  });

  it("parsea versión con prefijo v", () => {
    expect(parseVersion("v2.0.0")).toEqual([2, 0, 0]);
  });

  it("parsea versión con sufijo pre-release", () => {
    expect(parseVersion("3.1.0-beta.1")).toEqual([3, 1, 0]);
  });

  it("retorna null para versión inválida", () => {
    expect(parseVersion("latest")).toBeNull();
    expect(parseVersion("")).toBeNull();
  });
});

describe("getVersionTypeScore", () => {
  it("retorna 30 para major bump", () => {
    expect(getVersionTypeScore("2.0.0", "1.5.3")).toBe(30);
  });

  it("retorna 15 para minor bump", () => {
    expect(getVersionTypeScore("1.6.0", "1.5.3")).toBe(15);
  });

  it("retorna 5 para patch bump", () => {
    expect(getVersionTypeScore("1.5.4", "1.5.3")).toBe(5);
  });

  it("infiere major sin previousVersion (x.0.0)", () => {
    expect(getVersionTypeScore("3.0.0")).toBe(30);
  });

  it("infiere minor sin previousVersion (x.y.0)", () => {
    expect(getVersionTypeScore("3.2.0")).toBe(15);
  });

  it("infiere patch sin previousVersion", () => {
    expect(getVersionTypeScore("3.2.1")).toBe(5);
  });

  it("retorna 2 para pre-release sin semver", () => {
    expect(getVersionTypeScore("canary-2024")).toBe(2);
  });

  it("retorna 5 para versión no reconocida sin keywords pre-release", () => {
    expect(getVersionTypeScore("latest")).toBe(5);
  });
});

describe("getBreakingChangeScore", () => {
  it("retorna 0 sin breaking changes", () => {
    expect(getBreakingChangeScore(makeRelease())).toBe(0);
  });

  it("retorna 10 con flag breakingChange pero sin lista", () => {
    expect(
      getBreakingChangeScore(makeRelease({ breakingChange: true }))
    ).toBe(10);
  });

  it("retorna score proporcional a cantidad de breaking changes", () => {
    const release = makeRelease({
      breakingChange: true,
      breakingChanges: ["bc1", "bc2", "bc3"],
    });
    // 10 base + 3*2 = 16
    expect(getBreakingChangeScore(release)).toBe(16);
  });

  it("está capped en 20", () => {
    const release = makeRelease({
      breakingChange: true,
      breakingChanges: Array(10).fill("bc"),
    });
    // 10 base + 10*2 = 30, capped a 20
    expect(getBreakingChangeScore(release)).toBe(20);
  });
});

describe("getNpmPopularityScore", () => {
  beforeEach(() => {
    clearNpmCache();
    vi.restoreAllMocks();
  });

  it("retorna 10 (neutro) sin paquete npm", async () => {
    expect(await getNpmPopularityScore()).toBe(10);
    expect(await getNpmPopularityScore(undefined)).toBe(10);
  });

  it("retorna 25 para paquetes con >10M descargas", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 15_000_000 }), { status: 200 })
    );
    expect(await getNpmPopularityScore("react")).toBe(25);
  });

  it("retorna 20 para paquetes con >1M descargas", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 2_000_000 }), { status: 200 })
    );
    expect(await getNpmPopularityScore("svelte")).toBe(20);
  });

  it("retorna 15 para paquetes con >100K descargas", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 500_000 }), { status: 200 })
    );
    expect(await getNpmPopularityScore("some-lib")).toBe(15);
  });

  it("retorna 10 para paquetes con >10K descargas", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 50_000 }), { status: 200 })
    );
    expect(await getNpmPopularityScore("mid-lib")).toBe(10);
  });

  it("retorna 5 para paquetes con >1K descargas", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 5_000 }), { status: 200 })
    );
    expect(await getNpmPopularityScore("small-lib")).toBe(5);
  });

  it("retorna 2 para paquetes con pocas descargas", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 100 }), { status: 200 })
    );
    expect(await getNpmPopularityScore("tiny-lib")).toBe(2);
  });

  it("usa cache en llamadas subsecuentes", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 15_000_000 }), { status: 200 })
    );
    await getNpmPopularityScore("react");
    await getNpmPopularityScore("react");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("retorna 2 cuando fetch falla", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"));
    expect(await getNpmPopularityScore("broken-lib")).toBe(2);
  });
});

describe("getReleaseFrequencyScore", () => {
  it("retorna 15 para 0 releases previos", () => {
    expect(getReleaseFrequencyScore(0)).toBe(15);
  });

  it("retorna 12 para 1-2 releases", () => {
    expect(getReleaseFrequencyScore(1)).toBe(12);
    expect(getReleaseFrequencyScore(2)).toBe(12);
  });

  it("retorna 8 para 3-5 releases", () => {
    expect(getReleaseFrequencyScore(3)).toBe(8);
    expect(getReleaseFrequencyScore(5)).toBe(8);
  });

  it("retorna 5 para 6-10 releases", () => {
    expect(getReleaseFrequencyScore(6)).toBe(5);
    expect(getReleaseFrequencyScore(10)).toBe(5);
  });

  it("retorna 2 para >10 releases", () => {
    expect(getReleaseFrequencyScore(11)).toBe(2);
    expect(getReleaseFrequencyScore(50)).toBe(2);
  });
});

describe("getSecurityScore", () => {
  it("retorna 0 sin indicadores de seguridad", () => {
    expect(getSecurityScore(makeRelease())).toBe(0);
  });

  it("retorna 10 con securityAlerts", () => {
    const release = makeRelease({
      securityAlerts: [
        { severity: "high", title: "XSS", description: "XSS vulnerability" },
      ],
    });
    expect(getSecurityScore(release)).toBe(10);
  });

  it("retorna 7 con keyword 'security' en tldr", () => {
    const release = makeRelease({ tldr: "This is a security patch" });
    expect(getSecurityScore(release)).toBe(7);
  });

  it("retorna 7 con keyword 'CVE-' en description", () => {
    const release = makeRelease({
      description: "Fixes CVE-2024-1234 vulnerability",
    });
    expect(getSecurityScore(release)).toBe(7);
  });

  it("retorna 7 con keyword 'XSS' en contenido", () => {
    const release = makeRelease({ tldr: "Fixed XSS issue in parser" });
    expect(getSecurityScore(release)).toBe(7);
  });
});

describe("calculateImpactScore", () => {
  beforeEach(() => {
    clearNpmCache();
    vi.restoreAllMocks();
  });

  it("calcula score total para un major release popular", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 20_000_000 }), { status: 200 })
    );

    const release = makeRelease({
      version: "2.0.0",
      previousVersion: "1.9.5",
      breakingChange: true,
      breakingChanges: ["Removed legacy API", "Changed default behavior"],
    });
    const source = makeSource({ npmPackage: "react" });

    const score = await calculateImpactScore(release, source, 1);
    // version=30 + breaking=14 + npm=25 + frequency=12 + security=0 = 81
    expect(score).toBe(81);
  });

  it("calcula score bajo para patch minor sin breaking changes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 5_000 }), { status: 200 })
    );

    const release = makeRelease({
      version: "1.2.3",
      previousVersion: "1.2.2",
    });
    const source = makeSource({ npmPackage: "small-lib" });

    const score = await calculateImpactScore(release, source, 15);
    // version=5 + breaking=0 + npm=5 + frequency=2 + security=0 = 12
    expect(score).toBe(12);
  });

  it("clampea el score a máximo 100", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ downloads: 50_000_000 }), { status: 200 })
    );

    const release = makeRelease({
      version: "5.0.0",
      previousVersion: "4.0.0",
      breakingChange: true,
      breakingChanges: Array(10).fill("bc"),
      securityAlerts: [
        { severity: "critical", title: "RCE", description: "Critical RCE" },
      ],
    });
    const source = makeSource({ npmPackage: "react" });

    const score = await calculateImpactScore(release, source, 0);
    // version=30 + breaking=20 + npm=25 + frequency=15 + security=10 = 100
    expect(score).toBe(100);
  });

  it("maneja tecnologías sin npm package", async () => {
    const release = makeRelease({ version: "1.80.0" });
    const source = makeSource(); // sin npmPackage

    const score = await calculateImpactScore(release, source, 3);
    // version=15 + breaking=0 + npm=10(neutro) + frequency=8 + security=0 = 33
    expect(score).toBe(33);
  });
});
