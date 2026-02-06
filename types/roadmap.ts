/**
 * Representa un release planificado en el roadmap
 */
export interface RoadmapRelease {
  id: string;
  technology: string;
  version: string;
  stack?: string;
  expectedDate?: string;
  status: "planned" | "beta" | "rc" | "delayed";
  description?: string;
  features?: string[];
}
