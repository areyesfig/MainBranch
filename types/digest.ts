/**
 * Interfaz para un digest (resumen semanal/mensual generado por IA)
 */
export interface Digest {
  id: string;
  period: "weekly" | "monthly";
  startDate: Date | string;
  endDate: Date | string;
  content: string;
  technologies: string[];
  releaseCount: number;
  generatedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
