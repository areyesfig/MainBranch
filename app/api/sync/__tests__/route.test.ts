import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/lib/pipeline", () => ({
  runFullPipeline: vi.fn().mockResolvedValue({
    results: [{ sourceId: "nextjs-blog", transformedCount: 5, rawCount: 10, errors: [], duration: 100 }],
    allReleases: [{ id: "1", technology: "Next.js", version: "15" }],
    totalDuration: 200,
  }),
  runPipelineForSource: vi.fn().mockResolvedValue({ transformedCount: 5 }),
}));

vi.mock("@/lib/sources/config", () => ({
  getActiveSources: vi.fn().mockReturnValue([
    { id: "nextjs-blog", type: "rss" as const, url: "https://example.com" },
  ]),
}));

vi.mock("@/lib/data/releases", () => ({
  invalidateReleasesCache: vi.fn(),
}));

describe("GET /api/sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve 200 sin CRON_SECRET (desarrollo)", async () => {
    const url = "http://localhost:3000/api/sync";
    const req = new Request(url);
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data).toHaveProperty("totalReleases");
    expect(data).toHaveProperty("sourcesProcessed");
  });

  it("devuelve 401 con CRON_SECRET sin token", async () => {
    const prev = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "secret123";

    const req = new Request("http://localhost:3000/api/sync");
    const res = await GET(req);
    const data = await res.json();

    process.env.CRON_SECRET = prev;

    expect(res.status).toBe(401);
    expect(data.error).toBe("No autorizado");
  });

  it("devuelve 200 con CRON_SECRET y token válido", async () => {
    const prev = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "secret123";

    const req = new Request("http://localhost:3000/api/sync", {
      headers: { Authorization: "Bearer secret123" },
    });
    const res = await GET(req);
    const data = await res.json();

    process.env.CRON_SECRET = prev;

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("devuelve 404 para source inexistente", async () => {
    const prev = process.env.CRON_SECRET;
    delete process.env.CRON_SECRET;

    const req = new Request("http://localhost:3000/api/sync?source=inexistente");
    const res = await GET(req);

    process.env.CRON_SECRET = prev;
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toContain("inexistente");
  });
});
