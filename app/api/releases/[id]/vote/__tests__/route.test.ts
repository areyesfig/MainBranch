import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/releases", () => ({
  incrementVotes: vi.fn().mockResolvedValue(5),
}));

import { POST } from "../route";
import { incrementVotes } from "@/lib/db/releases";

function makeRequest(id: string, ip = "10.0.0.1") {
  const req = new Request(`http://localhost:3000/api/releases/${id}/vote`, {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  }) as unknown as import("next/server").NextRequest;
  // Attach headers.get properly for NextRequest
  Object.defineProperty(req, "headers", {
    value: new Headers({ "x-forwarded-for": ip }),
  });
  return req;
}

describe("POST /api/releases/[id]/vote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve 400 con ID inválido (caracteres especiales)", async () => {
    const req = makeRequest("invalid-id!", "1.1.1.1");
    const res = await POST(req, { params: Promise.resolve({ id: "invalid-id!" }) });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("inválido");
  });

  it("devuelve 400 con ID vacío", async () => {
    const req = makeRequest("", "1.1.1.2");
    const res = await POST(req, { params: Promise.resolve({ id: "" }) });
    expect(res.status).toBe(400);
  });

  it("devuelve votos con ID válido", async () => {
    const req = makeRequest("abc123", "2.2.2.2");
    const res = await POST(req, { params: Promise.resolve({ id: "abc123" }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.votes).toBe(5);
    expect(incrementVotes).toHaveBeenCalledWith("abc123");
  });

  it("devuelve 429 al votar dos veces con la misma IP", async () => {
    const req1 = makeRequest("def456", "3.3.3.3");
    await POST(req1, { params: Promise.resolve({ id: "def456" }) });

    const req2 = makeRequest("def456", "3.3.3.3");
    const res2 = await POST(req2, { params: Promise.resolve({ id: "def456" }) });
    expect(res2.status).toBe(429);
    const data = await res2.json();
    expect(data.error).toContain("Ya votaste");
  });

  it("devuelve 404 si incrementVotes lanza error", async () => {
    vi.mocked(incrementVotes).mockRejectedValueOnce(new Error("Not found"));
    const req = makeRequest("notfound", "4.4.4.4");
    const res = await POST(req, { params: Promise.resolve({ id: "notfound" }) });
    expect(res.status).toBe(404);
  });
});
