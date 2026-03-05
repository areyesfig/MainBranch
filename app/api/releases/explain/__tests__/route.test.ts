import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/data/releases", () => ({
  getReleaseById: vi.fn().mockResolvedValue({
    id: "rel123",
    technology: "React",
    version: "19.0.0",
    tldr: "Major update",
    releaseDate: new Date("2026-01-01"),
  }),
}));

vi.mock("@/lib/ai/explainRelease", () => ({
  explainReleaseWithAI: vi.fn().mockResolvedValue("Esta es una explicación generada por IA."),
}));

vi.mock("@/lib/cache/redis", () => ({
  cacheGet: vi.fn().mockResolvedValue(null),
  cacheSet: vi.fn().mockResolvedValue(undefined),
  cacheGetRaw: vi.fn().mockResolvedValue(null),
  redisIncr: vi.fn().mockResolvedValue(1),
}));

import { POST } from "../route";
import { getReleaseById } from "@/lib/data/releases";
import { explainReleaseWithAI } from "@/lib/ai/explainRelease";

function makeRequest(body: unknown, ip = "10.0.0.1") {
  return new Request("http://localhost:3000/api/releases/explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

describe("POST /api/releases/explain", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = "test-key";
  });

  it("devuelve 415 sin Content-Type json", async () => {
    const req = new Request("http://localhost:3000/api/releases/explain", {
      method: "POST",
      headers: { "Content-Type": "text/plain", "x-forwarded-for": "5.5.5.1" },
      body: "not json",
    }) as unknown as import("next/server").NextRequest;

    const res = await POST(req);
    expect(res.status).toBe(415);
  });

  it("devuelve 400 sin releaseId", async () => {
    const res = await POST(makeRequest({}, "5.5.5.2"));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("releaseId");
  });

  it("devuelve 404 si el release no existe", async () => {
    vi.mocked(getReleaseById).mockResolvedValueOnce(null);
    const res = await POST(makeRequest({ releaseId: "noexiste" }, "5.5.5.3"));
    expect(res.status).toBe(404);
  });

  it("devuelve 503 sin OPENAI_API_KEY", async () => {
    delete process.env.OPENAI_API_KEY;
    const res = await POST(makeRequest({ releaseId: "rel123" }, "5.5.5.4"));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toContain("no disponible");
  });

  it("devuelve explicación con release válido", async () => {
    const res = await POST(makeRequest({ releaseId: "rel123" }, "5.5.5.5"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.explanation).toBe("Esta es una explicación generada por IA.");
    expect(explainReleaseWithAI).toHaveBeenCalled();
  });

  it("devuelve 502 si la IA falla", async () => {
    vi.mocked(explainReleaseWithAI).mockRejectedValueOnce(new Error("API error"));
    // Usar un releaseId diferente para evitar el caché en memoria del test anterior
    const res = await POST(makeRequest({ releaseId: "relfail999" }, "5.5.5.6"));
    expect(res.status).toBe(502);
  });
});
