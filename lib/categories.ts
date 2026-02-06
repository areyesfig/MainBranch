/**
 * Categorías ampliadas para clasificar releases tecnológicos
 */
export const CATEGORIES = {
  frontend: {
    id: "frontend",
    label: "Frontend",
    description: "Frameworks y librerías de interfaz de usuario",
  },
  backend: {
    id: "backend",
    label: "Backend",
    description: "Runtimes, lenguajes y frameworks de servidor",
  },
  "ai-ml": {
    id: "ai-ml",
    label: "IA / ML",
    description: "Frameworks de machine learning e inteligencia artificial",
  },
  llms: {
    id: "llms",
    label: "LLMs",
    description: "Modelos de lenguaje y APIs de IA conversacional",
  },
  databases: {
    id: "databases",
    label: "Bases de Datos",
    description: "Bases de datos, ORMs y almacenamiento",
  },
  devops: {
    id: "devops",
    label: "DevOps / Cloud",
    description: "Contenedores, orquestación y servicios cloud",
  },
  mobile: {
    id: "mobile",
    label: "Mobile",
    description: "Frameworks y herramientas de desarrollo móvil",
  },
  tools: {
    id: "tools",
    label: "Herramientas",
    description: "Herramientas de desarrollo y productividad",
  },
  "data-science": {
    id: "data-science",
    label: "Data Science",
    description: "Análisis de datos y notebooks",
  },
} as const;

export type CategoryId = keyof typeof CATEGORIES;

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export function getCategoryLabel(id: string): string {
  return CATEGORIES[id as CategoryId]?.label ?? id;
}
