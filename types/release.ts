/**
 * Interfaz para una nota de lanzamiento de tecnología
 */
export interface ReleaseNote {
  /**
   * ID único de la nota de lanzamiento
   */
  id: string;

  /**
   * Nombre de la tecnología/framework (ej: "React", "Next.js", "TypeScript")
   */
  technology: string;

  /**
   * Versión del lanzamiento (ej: "18.2.0", "14.1.0")
   */
  version: string;

  /**
   * Fecha de lanzamiento
   */
  releaseDate: Date | string;

  /**
   * Resumen breve (TLDR) de los cambios principales
   */
  tldr: string;

  /**
   * Descripción detallada de los cambios
   */
  description: string;

  /**
   * Indica si este lanzamiento incluye cambios que rompen compatibilidad
   */
  breakingChange: boolean;

  /**
   * Lista de características nuevas
   */
  features?: string[];

  /**
   * Lista de mejoras realizadas
   */
  improvements?: string[];

  /**
   * Lista de correcciones de bugs
   */
  bugFixes?: string[];

  /**
   * Lista de cambios que rompen compatibilidad (si breakingChange es true)
   */
  breakingChanges?: string[];

  /**
   * URL del anuncio oficial o changelog
   */
  officialUrl?: string;

  /**
   * Tags o categorías para filtrar (ej: ["frontend", "framework", "typescript"])
   */
  tags?: string[];

  /**
   * Stack tecnológico al que pertenece (ej: "react", "nextjs", "typescript")
   */
  stack?: string;

  /**
   * Categoría ampliada del release (frontend, backend, ai-ml, llms, etc.)
   */
  category?: string;

  /**
   * Versión anterior para comparación
   */
  previousVersion?: string;

  /**
   * Ejemplos de código para breaking changes (antes/después)
   */
  codeExamples?: {
    title: string;
    before: string;
    after: string;
    language?: string;
  }[];

  /**
   * Checklist de migración paso a paso
   */
  migrationSteps?: {
    step: number;
    title: string;
    description: string;
    estimatedTime?: string;
    codeExample?: string;
  }[];

  /**
   * Impacto en otras tecnologías del ecosistema
   */
  ecosystemImpact?: {
    technology: string;
    impact: "required" | "recommended" | "optional" | "breaking";
    description: string;
    minVersion?: string;
  }[];

  /**
   * Métricas de rendimiento comparativas
   */
  performanceMetrics?: {
    metric: string;
    before: string | number;
    after: string | number;
    improvement: string;
  }[];

  /**
   * Alertas de seguridad (si aplica)
   */
  securityAlerts?: {
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
    cve?: string;
  }[];

  /**
   * Bundle size impact (en KB)
   */
  bundleSizeImpact?: {
    before: number;
    after: number;
    change: number;
  };

  /**
   * Tiempo estimado de migración (en horas)
   */
  estimatedMigrationTime?: number;

  /**
   * Nivel de complejidad de migración
   */
  migrationComplexity?: "low" | "medium" | "high" | "critical";
}
