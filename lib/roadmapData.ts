import { RoadmapRelease } from "@/types/roadmap";

/**
 * Datos mock del roadmap de próximos releases
 */
export const roadmapReleases: RoadmapRelease[] = [
  {
    id: "r1",
    technology: "Next.js",
    version: "16.0.0",
    stack: "nextjs",
    expectedDate: "2025 Q2",
    status: "planned",
    description: "Mejoras en el compilador Turbopack y soporte para React 20",
    features: ["Turbopack estable por defecto", "Mejoras en streaming", "Nuevo API de middleware"],
  },
  {
    id: "r2",
    technology: "React",
    version: "20.0.0",
    stack: "react",
    expectedDate: "2025 Q3",
    status: "planned",
    description: "Siguiente versión mayor de React",
    features: ["React Compiler estable", "Mejoras en concurrent rendering"],
  },
  {
    id: "r3",
    technology: "TypeScript",
    version: "5.7.0",
    stack: "typescript",
    expectedDate: "2025 Q1",
    status: "rc",
    description: "Mejoras en inferencia y nuevo modo de verificación",
    features: ["Mejor inferencia de tipos", "Nuevo modo strict adicional"],
  },
  {
    id: "r4",
    technology: "Vue",
    version: "3.5.0",
    stack: "vue",
    expectedDate: "2025 Q1",
    status: "beta",
    description: "Vue 3.5 con mejoras en Reactivity",
    features: ["Reactivity v2", "Mejoras en SSR"],
  },
  {
    id: "r5",
    technology: "Node.js",
    version: "23.0.0",
    stack: "nodejs",
    expectedDate: "2025 Q2",
    status: "planned",
    description: "Próxima versión LTS de Node.js",
    features: ["V8 actualizado", "Nuevas APIs nativas"],
  },
];
