export interface Resource {
  name: string;
  description: string;
  url: string;
  category: ResourceCategory;
}

export type ResourceCategory =
  | "Hosting"
  | "IDEs & Editores"
  | "Aprendizaje"
  | "APIs & Backend"
  | "Bases de Datos"
  | "DevOps & CI/CD"
  | "Diseño & UI"
  | "Herramientas Dev";

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "Hosting",
  "IDEs & Editores",
  "Aprendizaje",
  "APIs & Backend",
  "Bases de Datos",
  "DevOps & CI/CD",
  "Diseño & UI",
  "Herramientas Dev",
];

export const resources: Resource[] = [
  // Hosting
  {
    name: "Vercel",
    description: "Plataforma de despliegue para frameworks frontend y funciones serverless.",
    url: "https://vercel.com",
    category: "Hosting",
  },
  {
    name: "Netlify",
    description: "Hosting y CI/CD para sitios web modernos con funciones edge.",
    url: "https://www.netlify.com",
    category: "Hosting",
  },
  {
    name: "Railway",
    description: "Despliegue de apps full-stack, bases de datos y servicios en la nube.",
    url: "https://railway.app",
    category: "Hosting",
  },
  {
    name: "Cloudflare Pages",
    description: "Sitios estáticos y full-stack con red global de Cloudflare.",
    url: "https://pages.cloudflare.com",
    category: "Hosting",
  },

  // IDEs & Editores
  {
    name: "VS Code",
    description: "Editor de código gratuito y extensible de Microsoft.",
    url: "https://code.visualstudio.com",
    category: "IDEs & Editores",
  },
  {
    name: "Cursor",
    description: "Editor de código con IA integrada basado en VS Code.",
    url: "https://cursor.sh",
    category: "IDEs & Editores",
  },
  {
    name: "WebStorm",
    description: "IDE profesional de JetBrains para JavaScript y TypeScript.",
    url: "https://www.jetbrains.com/webstorm",
    category: "IDEs & Editores",
  },

  // Aprendizaje
  {
    name: "freeCodeCamp",
    description: "Plataforma gratuita para aprender desarrollo web y programación.",
    url: "https://www.freecodecamp.org",
    category: "Aprendizaje",
  },
  {
    name: "Frontend Masters",
    description: "Cursos avanzados de frontend, Node.js y full-stack.",
    url: "https://frontendmasters.com",
    category: "Aprendizaje",
  },
  {
    name: "Egghead.io",
    description: "Lecciones cortas y concisas sobre tecnologías web modernas.",
    url: "https://egghead.io",
    category: "Aprendizaje",
  },
  {
    name: "Roadmap.sh",
    description: "Rutas de aprendizaje interactivas para distintos roles tech.",
    url: "https://roadmap.sh",
    category: "Aprendizaje",
  },

  // APIs & Backend
  {
    name: "Hono",
    description: "Framework web ultraligero para edge y serverless.",
    url: "https://hono.dev",
    category: "APIs & Backend",
  },
  {
    name: "tRPC",
    description: "APIs end-to-end type-safe sin esquemas ni generación de código.",
    url: "https://trpc.io",
    category: "APIs & Backend",
  },
  {
    name: "Stripe",
    description: "Infraestructura de pagos para internet.",
    url: "https://stripe.com",
    category: "APIs & Backend",
  },

  // Bases de Datos
  {
    name: "Neon",
    description: "Postgres serverless con branching y autoescalado.",
    url: "https://neon.tech",
    category: "Bases de Datos",
  },
  {
    name: "Supabase",
    description: "Backend-as-a-Service open source con Postgres, auth y storage.",
    url: "https://supabase.com",
    category: "Bases de Datos",
  },
  {
    name: "Prisma",
    description: "ORM moderno para TypeScript y Node.js con migraciones y studio.",
    url: "https://www.prisma.io",
    category: "Bases de Datos",
  },
  {
    name: "Drizzle ORM",
    description: "ORM ligero y type-safe para TypeScript con queries SQL-like.",
    url: "https://orm.drizzle.team",
    category: "Bases de Datos",
  },

  // DevOps & CI/CD
  {
    name: "GitHub Actions",
    description: "Automatización de CI/CD directamente en tu repositorio de GitHub.",
    url: "https://github.com/features/actions",
    category: "DevOps & CI/CD",
  },
  {
    name: "Docker",
    description: "Plataforma de contenedores para desarrollo y despliegue de apps.",
    url: "https://www.docker.com",
    category: "DevOps & CI/CD",
  },
  {
    name: "Turborepo",
    description: "Sistema de build incremental para monorepos JavaScript/TypeScript.",
    url: "https://turbo.build",
    category: "DevOps & CI/CD",
  },

  // Diseño & UI
  {
    name: "shadcn/ui",
    description: "Componentes reutilizables de alta calidad construidos con Radix y Tailwind.",
    url: "https://ui.shadcn.com",
    category: "Diseño & UI",
  },
  {
    name: "Figma",
    description: "Herramienta de diseño colaborativo en la nube.",
    url: "https://www.figma.com",
    category: "Diseño & UI",
  },
  {
    name: "Tailwind CSS",
    description: "Framework CSS utility-first para crear diseños personalizados rápidamente.",
    url: "https://tailwindcss.com",
    category: "Diseño & UI",
  },

  // Herramientas Dev
  {
    name: "Bruno",
    description: "Cliente API open source alternativa a Postman, sin cuenta requerida.",
    url: "https://www.usebruno.com",
    category: "Herramientas Dev",
  },
  {
    name: "Biome",
    description: "Toolchain rápido para formato y linting de JavaScript/TypeScript.",
    url: "https://biomejs.dev",
    category: "Herramientas Dev",
  },
  {
    name: "Warp",
    description: "Terminal moderna con IA integrada y colaboración en equipo.",
    url: "https://www.warp.dev",
    category: "Herramientas Dev",
  },
];
