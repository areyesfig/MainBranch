import { describe, it, expect } from "vitest";
import { getWeeklyRange, getMonthlyRange, formatDateRange } from "../dateRanges";

describe("getWeeklyRange", () => {
  it("devuelve lunes-domingo de la semana anterior", () => {
    // Miércoles 15 de enero 2025
    const ref = new Date(2025, 0, 15);
    const { startDate, endDate } = getWeeklyRange(ref);

    // Semana anterior: lunes 6 - domingo 12 de enero 2025
    expect(startDate.getDay()).toBe(1); // lunes
    expect(startDate.getDate()).toBe(6);
    expect(startDate.getMonth()).toBe(0);
    expect(startDate.getHours()).toBe(0);

    expect(endDate.getDay()).toBe(0); // domingo
    expect(endDate.getDate()).toBe(12);
    expect(endDate.getHours()).toBe(23);
    expect(endDate.getMinutes()).toBe(59);
  });

  it("maneja el cruce de mes correctamente", () => {
    // Lunes 3 de febrero 2025
    const ref = new Date(2025, 1, 3);
    const { startDate, endDate } = getWeeklyRange(ref);

    // Semana anterior: lunes 27 de enero - domingo 2 de febrero
    expect(startDate.getDate()).toBe(27);
    expect(startDate.getMonth()).toBe(0); // enero
    expect(endDate.getDate()).toBe(2);
    expect(endDate.getMonth()).toBe(1); // febrero
  });

  it("maneja domingo como referencia", () => {
    // Domingo 12 de enero 2025
    const ref = new Date(2025, 0, 12);
    const { startDate, endDate } = getWeeklyRange(ref);

    // Semana anterior: lunes 30 dic 2024 - domingo 5 enero 2025
    expect(startDate.getDate()).toBe(30);
    expect(startDate.getMonth()).toBe(11); // diciembre
    expect(startDate.getFullYear()).toBe(2024);
    expect(endDate.getDate()).toBe(5);
    expect(endDate.getMonth()).toBe(0); // enero
  });
});

describe("getMonthlyRange", () => {
  it("devuelve el mes anterior completo", () => {
    // 15 de marzo 2025
    const ref = new Date(2025, 2, 15);
    const { startDate, endDate } = getMonthlyRange(ref);

    // Febrero 2025: 1 - 28
    expect(startDate.getDate()).toBe(1);
    expect(startDate.getMonth()).toBe(1);
    expect(endDate.getDate()).toBe(28);
    expect(endDate.getMonth()).toBe(1);
    expect(endDate.getHours()).toBe(23);
  });

  it("maneja el cruce de año correctamente", () => {
    // Enero 2025
    const ref = new Date(2025, 0, 10);
    const { startDate, endDate } = getMonthlyRange(ref);

    // Diciembre 2024
    expect(startDate.getDate()).toBe(1);
    expect(startDate.getMonth()).toBe(11);
    expect(startDate.getFullYear()).toBe(2024);
    expect(endDate.getDate()).toBe(31);
    expect(endDate.getMonth()).toBe(11);
    expect(endDate.getFullYear()).toBe(2024);
  });

  it("maneja meses de 31 días", () => {
    // Agosto 2025 -> julio tiene 31 días
    const ref = new Date(2025, 7, 1);
    const { startDate, endDate } = getMonthlyRange(ref);

    expect(startDate.getDate()).toBe(1);
    expect(startDate.getMonth()).toBe(6); // julio
    expect(endDate.getDate()).toBe(31);
    expect(endDate.getMonth()).toBe(6);
  });
});

describe("formatDateRange", () => {
  it("formatea el rango correctamente", () => {
    const start = new Date(2025, 0, 6);
    const end = new Date(2025, 0, 12);
    const result = formatDateRange(start, end);

    expect(result).toContain("6");
    expect(result).toContain("12");
    expect(result).toContain("2025");
    expect(result).toContain("—");
  });

  it("acepta strings como input", () => {
    const result = formatDateRange("2025-01-06", "2025-01-12");
    expect(result).toContain("2025");
    expect(result).toContain("—");
  });
});
