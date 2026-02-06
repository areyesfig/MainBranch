const STORAGE_KEY = "main-branch-notification-stacks";
const LAST_VISIT_KEY = "main-branch-last-visit";

/**
 * Obtiene los stacks seleccionados para notificaciones desde localStorage
 */
export function getNotificationStacks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Guarda los stacks seleccionados para notificaciones en localStorage
 */
export function setNotificationStacks(stacks: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stacks));
  } catch {
    // Ignorar errores de localStorage (modo privado, etc.)
  }
}

/**
 * Añade un stack a las preferencias de notificación
 */
export function addNotificationStack(stack: string): void {
  const stacks = getNotificationStacks();
  if (!stacks.includes(stack)) {
    setNotificationStacks([...stacks, stack]);
  }
}

/**
 * Elimina un stack de las preferencias de notificación
 */
export function removeNotificationStack(stack: string): void {
  setNotificationStacks(getNotificationStacks().filter((s) => s !== stack));
}

/**
 * Comprueba si un stack está en las preferencias de notificación
 */
export function hasNotificationStack(stack: string): boolean {
  return getNotificationStacks().includes(stack);
}

/**
 * Guarda la fecha de última visita para detectar releases "nuevos"
 */
export function setLastVisit(timestamp: number = Date.now()): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_VISIT_KEY, timestamp.toString());
  } catch {
    // Ignorar
  }
}

/**
 * Obtiene la fecha de última visita
 */
export function getLastVisit(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LAST_VISIT_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
}
