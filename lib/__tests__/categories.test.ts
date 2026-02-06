import { describe, it, expect } from "vitest";
import { getCategoryLabel, CATEGORY_IDS, CATEGORIES } from "@/lib/categories";

describe("getCategoryLabel", () => {
  it("devuelve label para categoría conocida", () => {
    expect(getCategoryLabel("frontend")).toBe("Frontend");
    expect(getCategoryLabel("ai-ml")).toBe("IA / ML");
  });

  it("devuelve id para categoría desconocida", () => {
    expect(getCategoryLabel("unknown")).toBe("unknown");
  });
});

describe("CATEGORY_IDS", () => {
  it("contiene las categorías esperadas", () => {
    expect(CATEGORY_IDS).toContain("frontend");
    expect(CATEGORY_IDS).toContain("ai-ml");
    expect(CATEGORY_IDS.length).toBeGreaterThan(5);
  });
});

describe("CATEGORIES", () => {
  it("cada categoría tiene id, label y description", () => {
    for (const [, cat] of Object.entries(CATEGORIES)) {
      expect(cat).toHaveProperty("id");
      expect(cat).toHaveProperty("label");
      expect(cat).toHaveProperty("description");
    }
  });
});
