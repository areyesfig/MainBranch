import { describe, it, expect } from "vitest";
import { formatDate, cn } from "@/lib/utils";

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
