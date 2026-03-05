import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/subscribers", () => ({
  createSubscriber: vi.fn().mockResolvedValue({ email: "test@example.com", token: "tok_123" }),
  findSubscriberByEmail: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/email/digest", () => ({
  sendConfirmationEmail: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "../route";
import { createSubscriber, findSubscriberByEmail } from "@/lib/db/subscribers";
import { sendConfirmationEmail } from "@/lib/email/digest";

let ipCounter = 0;
function makeRequest(body: unknown, ip?: string) {
  const resolvedIp = ip ?? `127.0.0.${++ipCounter}`;
  return new Request("http://localhost:3000/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": resolvedIp },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

describe("POST /api/newsletter/subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve 400 con email inválido", async () => {
    const res = await POST(makeRequest({ email: "no-es-email" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("inválido");
  });

  it("devuelve 400 sin email", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("devuelve 201 con email válido nuevo", async () => {
    const res = await POST(makeRequest({ email: "nuevo@example.com" }));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(createSubscriber).toHaveBeenCalledWith("nuevo@example.com");
    expect(sendConfirmationEmail).toHaveBeenCalled();
  });

  it("devuelve 200 si el email ya está confirmado (no revela estado)", async () => {
    vi.mocked(findSubscriberByEmail).mockResolvedValueOnce({
      email: "ya@example.com",
      confirmedAt: new Date(),
      token: "tok",
    } as Awaited<ReturnType<typeof findSubscriberByEmail>>);

    const res = await POST(makeRequest({ email: "ya@example.com" }));
    expect(res.status).toBe(200);
    expect(createSubscriber).not.toHaveBeenCalled();
  });

  it("reenvía confirmación si existe pero no está confirmado", async () => {
    vi.mocked(findSubscriberByEmail).mockResolvedValueOnce({
      email: "pendiente@example.com",
      confirmedAt: null,
      token: "tok_456",
    } as Awaited<ReturnType<typeof findSubscriberByEmail>>);

    const res = await POST(makeRequest({ email: "pendiente@example.com" }));
    expect(res.status).toBe(200);
    expect(sendConfirmationEmail).toHaveBeenCalledWith("pendiente@example.com", "tok_456");
    expect(createSubscriber).not.toHaveBeenCalled();
  });
});
