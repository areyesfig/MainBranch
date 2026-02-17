/**
 * Utilidades para calcular rangos de fechas para digests semanales/mensuales
 */

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Devuelve el rango lunes-domingo de la semana anterior a `ref`.
 * startDate = lunes 00:00:00, endDate = domingo 23:59:59.999
 */
export function getWeeklyRange(ref: Date = new Date()): DateRange {
  const d = new Date(ref);
  // Retroceder al lunes de esta semana
  const dayOfWeek = d.getDay(); // 0=dom, 1=lun, ...
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  d.setDate(d.getDate() - diffToMonday);
  // Retroceder una semana completa para obtener la semana anterior
  d.setDate(d.getDate() - 7);
  const startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

/**
 * Devuelve el rango del mes anterior completo a `ref`.
 * startDate = día 1 00:00:00, endDate = último día 23:59:59.999
 */
export function getMonthlyRange(ref: Date = new Date()): DateRange {
  const d = new Date(ref);
  const year = d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear();
  const month = d.getMonth() === 0 ? 11 : d.getMonth() - 1;
  const startDate = new Date(year, month, 1, 0, 0, 0, 0);
  // Último día del mes: día 0 del mes siguiente
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { startDate, endDate };
}

/**
 * Formatea un rango de fechas como string legible.
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const s = start instanceof Date ? start : new Date(start);
  const e = end instanceof Date ? end : new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  return `${s.toLocaleDateString("es-ES", opts)} — ${e.toLocaleDateString("es-ES", opts)}`;
}
