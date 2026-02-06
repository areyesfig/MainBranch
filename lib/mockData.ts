import { ReleaseNote } from "@/types/release";

/**
 * Datos mock para desarrollo y pruebas
 */
export const mockReleases: ReleaseNote[] = [
  {
    id: "1",
    technology: "Next.js",
    version: "15.0.0",
    previousVersion: "14.2.0",
    releaseDate: new Date("2024-10-23"),
    tldr: "Next.js 15 incluye mejoras significativas en rendimiento, nuevo sistema de caché y mejor soporte para React Server Components.",
    description: "Next.js 15 trae consigo mejoras importantes en el rendimiento y la experiencia de desarrollo. Incluye un nuevo sistema de caché más eficiente, mejor soporte para React Server Components, y optimizaciones en el proceso de build.",
    breakingChange: true,
    features: [
      "Nuevo sistema de caché optimizado",
      "Mejor soporte para React Server Components",
      "Mejoras en el proceso de build",
      "Nuevas APIs para manejo de formularios"
    ],
    improvements: [
      "Rendimiento mejorado en producción",
      "Tiempos de build más rápidos",
      "Mejor experiencia de desarrollo"
    ],
    bugFixes: [
      "Corrección de problemas con rutas dinámicas",
      "Fix en el manejo de imágenes optimizadas"
    ],
    breakingChanges: [
      "Cambios en la API de caché - revalidatePath ahora es async",
      "Nuevos requisitos para React Server Components - requiere React 19+"
    ],
    codeExamples: [
      {
        title: "API de Caché - revalidatePath",
        before: `// Next.js 14
import { revalidatePath } from 'next/cache';

export async function POST() {
  revalidatePath('/products');
  return { success: true };
}`,
        after: `// Next.js 15
import { revalidatePath } from 'next/cache';

export async function POST() {
  await revalidatePath('/products');
  return { success: true };
}`,
        language: "typescript",
      },
      {
        title: "React Server Components",
        before: `// Next.js 14 - Funciona con React 18
'use client';
export function Component() {
  return <div>Client Component</div>;
}`,
        after: `// Next.js 15 - Requiere React 19
// Server Component por defecto
export function Component() {
  return <div>Server Component</div>;
}`,
        language: "typescript",
      },
    ],
    migrationSteps: [
      {
        step: 1,
        title: "Actualizar React a versión 19",
        description: "Next.js 15 requiere React 19 como dependencia mínima. Actualiza tu package.json.",
        estimatedTime: "15 min",
        codeExample: `npm install react@19 react-dom@19`,
      },
      {
        step: 2,
        title: "Actualizar llamadas a revalidatePath",
        description: "Todas las llamadas a revalidatePath ahora deben ser await.",
        estimatedTime: "30 min",
        codeExample: `// Buscar y reemplazar:
revalidatePath( → await revalidatePath(`,
      },
      {
        step: 3,
        title: "Revisar Server Components",
        description: "Verifica que tus componentes Server Components sean compatibles con React 19.",
        estimatedTime: "1 hora",
      },
      {
        step: 4,
        title: "Probar en desarrollo",
        description: "Ejecuta npm run dev y verifica que no haya errores de compatibilidad.",
        estimatedTime: "30 min",
      },
    ],
    estimatedMigrationTime: 2.5,
    migrationComplexity: "high",
    ecosystemImpact: [
      {
        technology: "React",
        impact: "required",
        description: "Next.js 15 requiere React 19 como versión mínima",
        minVersion: "19.0.0",
      },
      {
        technology: "TypeScript",
        impact: "recommended",
        description: "Se recomienda TypeScript 5.6+ para mejor soporte de tipos",
        minVersion: "5.6.0",
      },
      {
        technology: "Node.js",
        impact: "recommended",
        description: "Se recomienda Node.js 20+ para mejor rendimiento",
        minVersion: "20.0.0",
      },
    ],
    performanceMetrics: [
      {
        metric: "Tiempo de Build",
        before: "45s",
        after: "32s",
        improvement: "-29%",
      },
      {
        metric: "Tiempo de Carga Inicial",
        before: "1.2s",
        after: "0.8s",
        improvement: "-33%",
      },
    ],
    bundleSizeImpact: {
      before: 145,
      after: 142,
      change: -3,
    },
    officialUrl: "https://nextjs.org/blog/next-15",
    tags: ["frontend", "framework", "react", "nextjs"],
    stack: "nextjs",
    category: "frontend",
  },
  {
    id: "2",
    technology: "React",
    version: "19.0.0",
    releaseDate: new Date("2024-12-05"),
    tldr: "React 19 introduce nuevas características como Actions, mejoras en el manejo de formularios y optimizaciones de rendimiento.",
    description: "React 19 es una actualización importante que incluye nuevas características como Actions para manejar formularios de manera más eficiente, mejoras en el sistema de renderizado y optimizaciones generales de rendimiento.",
    breakingChange: false,
    features: [
      "Nuevas Actions para formularios",
      "Mejoras en el manejo de estado",
      "Optimizaciones de rendimiento",
      "Nuevo hook useFormState"
    ],
    improvements: [
      "Mejor rendimiento en aplicaciones grandes",
      "Reducción del tamaño del bundle",
      "Mejor soporte para Server Components"
    ],
    bugFixes: [
      "Corrección de problemas con StrictMode",
      "Fix en el manejo de eventos"
    ],
    officialUrl: "https://react.dev/blog/2024/12/05/react-19",
    tags: ["frontend", "library", "react", "javascript"],
    stack: "react",
    category: "frontend",
  },
  {
    id: "3",
    technology: "TypeScript",
    version: "5.6.0",
    releaseDate: new Date("2024-11-12"),
    tldr: "TypeScript 5.6 incluye mejoras en la inferencia de tipos, nuevas utilidades de tipo y correcciones de bugs importantes.",
    description: "TypeScript 5.6 continúa mejorando la experiencia de desarrollo con mejoras en la inferencia de tipos, nuevas utilidades de tipo y correcciones importantes de bugs que afectaban el rendimiento y la precisión del sistema de tipos.",
    breakingChange: false,
    features: [
      "Mejoras en la inferencia de tipos",
      "Nuevas utilidades de tipo",
      "Mejor soporte para decoradores",
      "Optimizaciones en el compilador"
    ],
    improvements: [
      "Compilación más rápida",
      "Mejor precisión en la inferencia",
      "Mejor experiencia de autocompletado"
    ],
    bugFixes: [
      "Corrección de problemas con tipos genéricos",
      "Fix en el manejo de tipos condicionales"
    ],
    officialUrl: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-6.html",
    tags: ["language", "typescript", "javascript", "development"],
    stack: "typescript",
    category: "tools",
  },
  {
    id: "4",
    technology: "Tailwind CSS",
    version: "4.0.0",
    releaseDate: new Date("2024-10-30"),
    tldr: "Tailwind CSS 4.0 introduce un nuevo motor CSS, mejor rendimiento y nuevas características de diseño.",
    description: "Tailwind CSS 4.0 es una reescritura completa del framework con un nuevo motor CSS que ofrece mejor rendimiento, nuevas características de diseño y una experiencia de desarrollo mejorada.",
    breakingChange: true,
    features: [
      "Nuevo motor CSS",
      "Mejor rendimiento",
      "Nuevas utilidades de diseño",
      "Soporte mejorado para temas"
    ],
    improvements: [
      "Build times más rápidos",
      "Mejor optimización del CSS generado",
      "Mejor soporte para CSS moderno"
    ],
    bugFixes: [
      "Corrección de problemas con purga de CSS",
      "Fix en el manejo de variantes"
    ],
    breakingChanges: [
      "Cambios en la configuración",
      "Nuevas APIs para plugins"
    ],
    officialUrl: "https://tailwindcss.com/blog/tailwindcss-v4",
    tags: ["css", "framework", "styling", "frontend"],
    stack: "tailwind",
    category: "frontend",
  },
  {
    id: "5",
    technology: "Node.js",
    version: "22.0.0",
    releaseDate: new Date("2024-10-29"),
    tldr: "Node.js 22 incluye mejoras en rendimiento, nuevas APIs y mejor soporte para módulos ES.",
    description: "Node.js 22 trae mejoras significativas en rendimiento, nuevas APIs para desarrollo y mejor soporte para módulos ES. También incluye actualizaciones de seguridad importantes.",
    securityAlerts: [
      {
        severity: "high",
        title: "Vulnerabilidad en módulo crypto",
        description: "Se corrige una vulnerabilidad de ejecución remota de código en el módulo crypto. Se recomienda actualizar urgentemente.",
        cve: "CVE-2024-XXXXX",
      },
    ],
    breakingChange: false,
    features: [
      "Mejoras en el rendimiento de V8",
      "Nuevas APIs para desarrollo",
      "Mejor soporte para módulos ES",
      "Actualizaciones de seguridad"
    ],
    improvements: [
      "Mejor rendimiento general",
      "Menor uso de memoria",
      "Mejor soporte para async/await"
    ],
    bugFixes: [
      "Corrección de problemas con streams",
      "Fix en el manejo de módulos"
    ],
    officialUrl: "https://nodejs.org/en/blog/release/v22.0.0",
    tags: ["backend", "runtime", "javascript", "nodejs"],
    stack: "nodejs",
    category: "backend",
  },
  // IA / ML
  {
    id: "6",
    technology: "PyTorch",
    version: "2.2.0",
    releaseDate: new Date("2024-11-15"),
    tldr: "PyTorch 2.2 mejora el compilador TorchInductor y añade soporte para nuevas arquitecturas de transformers.",
    description: "PyTorch 2.2 incluye mejoras significativas en TorchInductor para compilación más rápida, nuevo soporte para Flash Attention 2, y optimizaciones para entrenamiento de LLMs.",
    breakingChange: false,
    features: [
      "Mejoras en TorchInductor",
      "Soporte para Flash Attention 2",
      "Optimizaciones para LLMs",
      "Nuevo API de cuantización"
    ],
    improvements: [
      "Entrenamiento 15% más rápido",
      "Menor uso de memoria en GPUs",
      "Mejor soporte para AMD ROCm"
    ],
    officialUrl: "https://pytorch.org/blog/pytorch-2-2-released/",
    tags: ["ai", "ml", "deep-learning", "python"],
    stack: "pytorch",
    category: "ai-ml",
  },
  {
    id: "7",
    technology: "LangChain",
    version: "0.3.0",
    releaseDate: new Date("2024-12-01"),
    tldr: "LangChain 0.3 simplifica la API para trabajar con LLMs y añade soporte para agentes multi-modal.",
    description: "LangChain 0.3 introduce una API más limpia y consistente, mejor integración con proveedores de IA, y soporte nativo para agentes que combinan texto, imágenes y código.",
    breakingChange: true,
    features: [
      "Nueva API unificada LCEL",
      "Soporte multi-modal nativo",
      "Integración con Anthropic Claude 3.5",
      "Mejoras en RAG y retrieval"
    ],
    breakingChanges: [
      "Cambios en la API de chains",
      "Nuevos nombres de imports"
    ],
    officialUrl: "https://blog.langchain.dev/langchain-v0-3/",
    tags: ["ai", "llm", "langchain", "rag"],
    stack: "langchain",
    category: "ai-ml",
  },
  {
    id: "8",
    technology: "Hugging Face",
    version: "Transformers 4.45",
    releaseDate: new Date("2024-11-20"),
    tldr: "Transformers 4.45 añade soporte para Llama 3.2, Qwen 2.5 y mejoras en el pipeline de inferencia.",
    description: "La librería Transformers de Hugging Face amplía su catálogo con los últimos modelos open-source, mejoras en cuantización y optimización para inferencia en edge.",
    breakingChange: false,
    features: [
      "Soporte para Llama 3.2 (1B-70B)",
      "Integración Qwen 2.5",
      "Mejoras en BitsAndBytes",
      "Nuevo pipeline de vision-language"
    ],
    officialUrl: "https://huggingface.co/blog/transformers-4-45",
    tags: ["ai", "nlp", "transformers", "huggingface"],
    stack: "huggingface",
    category: "ai-ml",
  },
  // LLMs
  {
    id: "9",
    technology: "Claude",
    version: "3.5 Sonnet",
    releaseDate: new Date("2024-11-14"),
    tldr: "Anthropic lanza Claude 3.5 Sonnet con mejor razonamiento en código y ventana de contexto extendida a 200K tokens.",
    description: "Claude 3.5 Sonnet mejora significativamente en tareas de programación, análisis de código y razonamiento matemático. Incluye visión mejorada y menor latencia.",
    breakingChange: false,
    features: [
      "Ventana de contexto 200K tokens",
      "Mejor rendimiento en código",
      "Visión mejorada para diagramas",
      "API de streaming optimizada"
    ],
    improvements: [
      "30% más rápido en tareas de código",
      "Menor latencia en respuestas",
      "Mejor comprensión de documentos largos"
    ],
    officialUrl: "https://www.anthropic.com/news/claude-3-5-sonnet",
    tags: ["ai", "llm", "anthropic", "claude"],
    stack: "claude",
    category: "llms",
  },
  {
    id: "10",
    technology: "Llama",
    version: "3.2",
    releaseDate: new Date("2024-10-22"),
    tldr: "Meta lanza Llama 3.2 con modelos desde 1B hasta 70B parámetros, incluyendo variante vision-language.",
    description: "Llama 3.2 democratiza el acceso a modelos de IA con versiones desde 1B parámetros optimizadas para edge, hasta 70B para servidor. Incluye Llama 3.2 Vision.",
    breakingChange: false,
    features: [
      "Modelos 1B, 3B, 11B, 70B",
      "Llama 3.2 Vision (11B)",
      "Optimizado para inferencia en edge",
      "Licencia Apache 2.0"
    ],
    officialUrl: "https://ai.meta.com/blog/llama-3-2/",
    tags: ["ai", "llm", "meta", "open-source"],
    stack: "llama",
    category: "llms",
  },
  {
    id: "11",
    technology: "GPT-4o",
    version: "2024-11",
    releaseDate: new Date("2024-11-18"),
    tldr: "OpenAI actualiza GPT-4o con mejor razonamiento, soporte para o1-preview y APIs de agente mejoradas.",
    description: "GPT-4o recibe actualizaciones significativas incluyendo mejor razonamiento en chain-of-thought, nueva modalidad de agente, y mejor integración con DALL-E 3.",
    breakingChange: false,
    features: [
      "Mejor razonamiento o1-preview",
      "APIs de agente unificadas",
      "Integración DALL-E 3 mejorada",
      "JSON mode mejorado"
    ],
    officialUrl: "https://openai.com/blog/gpt-4o-system-card",
    tags: ["ai", "llm", "openai", "gpt"],
    stack: "openai",
    category: "llms",
  },
  // Databases
  {
    id: "12",
    technology: "Supabase",
    version: "2.0",
    releaseDate: new Date("2024-11-25"),
    tldr: "Supabase 2.0 añade Edge Functions mejoradas, Realtime v2 y soporte para bases de datos distribuidas.",
    description: "Supabase 2.0 moderniza su plataforma con Edge Functions más rápidas, Realtime con menor latencia, y opciones de PostgreSQL distribuido para escalabilidad global.",
    breakingChange: false,
    features: [
      "Edge Functions con Deno 2",
      "Realtime v2 con WebSockets optimizados",
      "PostgreSQL 16",
      "Vector search para embeddings de IA"
    ],
    officialUrl: "https://supabase.com/blog/supabase-2-0",
    tags: ["database", "postgres", "backend", "serverless"],
    stack: "supabase",
    category: "databases",
  },
  {
    id: "13",
    technology: "Pinecone",
    version: "3.0",
    releaseDate: new Date("2024-11-10"),
    tldr: "Pinecone 3.0 introduce serverless como opción por defecto y mejoras para RAG con LLMs.",
    description: "Pinecone 3.0 hace serverless la opción predeterminada, reduciendo costos y simplificando el deployment. Incluye optimizaciones específicas para pipelines RAG.",
    breakingChange: true,
    features: [
      "Serverless por defecto",
      "Optimizaciones para RAG",
      "Soporte para filtros híbridos",
      "Namespaces mejorados"
    ],
    breakingChanges: [
      "Cambio en API de índices",
      "Nueva estructura de métricas"
    ],
    officialUrl: "https://www.pinecone.io/blog/pinecone-3/",
    tags: ["database", "vector", "ai", "rag"],
    stack: "pinecone",
    category: "databases",
  },
  // DevOps
  {
    id: "14",
    technology: "Docker",
    version: "27.0",
    releaseDate: new Date("2024-11-05"),
    tldr: "Docker 27.0 incluye BuildKit mejorado, soporte para WASM y mejor integración con Kubernetes.",
    description: "Docker 27.0 moderniza el build system con BuildKit 2.0, añade soporte experimental para WebAssembly, y mejora la experiencia de desarrollo con Docker Compose v2.",
    breakingChange: false,
    features: [
      "BuildKit 2.0",
      "Soporte experimental WASM",
      "Docker Compose v2 mejorado",
      "Mejor integración con containerd"
    ],
    officialUrl: "https://docs.docker.com/desktop/release-notes/",
    tags: ["devops", "containers", "docker"],
    stack: "docker",
    category: "devops",
  },
  {
    id: "15",
    technology: "Kubernetes",
    version: "1.31",
    releaseDate: new Date("2024-10-28"),
    tldr: "Kubernetes 1.31 mejora el soporte para sidecars, workloads stateful y el API Gateway.",
    description: "Kubernetes 1.31 incluye mejoras en la API de sidecar containers, optimizaciones para StatefulSets, y progreso hacia la estabilización del API Gateway.",
    breakingChange: false,
    features: [
      "Sidecar containers GA",
      "Mejoras en StatefulSet",
      "API Gateway beta",
      "Node memory manager"
    ],
    officialUrl: "https://kubernetes.io/blog/2024/10/28/kubernetes-v1-31-release/",
    tags: ["devops", "orchestration", "kubernetes", "cloud"],
    stack: "kubernetes",
    category: "devops",
  },
  // Mobile
  {
    id: "16",
    technology: "React Native",
    version: "0.76",
    releaseDate: new Date("2024-11-08"),
    tldr: "React Native 0.76 introduce el nuevo renderer por defecto, mejor soporte para Fabric y menor overhead.",
    description: "React Native 0.76 hace el nuevo architecture el predeterminado, con Fabric y TurboModules habilitados por defecto. Incluye mejoras en el bundler y debugging.",
    breakingChange: true,
    features: [
      "Nueva architecture por defecto",
      "Fabric y TurboModules habilitados",
      "Mejor soporte para bridgeless",
      "Metro bundler mejorado"
    ],
    breakingChanges: [
      "Nueva architecture requerida",
      "Cambios en linking nativo"
    ],
    officialUrl: "https://reactnative.dev/blog/2024/11/08/release-0.76",
    tags: ["mobile", "react", "cross-platform"],
    stack: "react-native",
    category: "mobile",
  },
  // Data Science
  {
    id: "17",
    technology: "Pandas",
    version: "2.2.0",
    releaseDate: new Date("2024-11-12"),
    tldr: "Pandas 2.2 mejora el rendimiento con PyArrow, nuevo soporte para tipos Arrow nativos y mejoras en groupby.",
    description: "Pandas 2.2 continúa la migración hacia PyArrow como backend, con mejoras de rendimiento significativas en operaciones de grupo y merge.",
    breakingChange: false,
    features: [
      "PyArrow como backend opcional",
      "Mejoras en groupby (30% más rápido)",
      "Nuevos tipos Arrow nativos",
      "Mejor manejo de timezones"
    ],
    officialUrl: "https://pandas.pydata.org/docs/whatsnew/v2.2.0.html",
    tags: ["data-science", "python", "data", "analytics"],
    stack: "pandas",
    category: "data-science",
  },
];

/**
 * Obtiene todos los stacks únicos de una lista de releases
 */
export function getUniqueStacks(releases?: ReleaseNote[]): string[] {
  const source = releases ?? mockReleases;
  const stacks = source
    .map(release => release.stack)
    .filter((stack): stack is string => stack !== undefined);
  return Array.from(new Set(stacks));
}

/**
 * Obtiene todas las categorías presentes en una lista de releases
 */
export function getUniqueCategories(releases?: ReleaseNote[]): string[] {
  const source = releases ?? mockReleases;
  const categories = source
    .map(release => release.category)
    .filter((cat): cat is string => cat !== undefined);
  return Array.from(new Set(categories));
}

/**
 * Filtra releases por stack
 */
export function filterReleasesByStack(stack: string | null): ReleaseNote[] {
  if (!stack) return mockReleases;
  return mockReleases.filter(release => release.stack === stack);
}

/**
 * Filtra releases por categoría
 */
export function filterReleasesByCategory(category: string | null): ReleaseNote[] {
  if (!category) return mockReleases;
  return mockReleases.filter(release => release.category === category);
}

/**
 * Filtra releases por múltiples stacks (para notificaciones personalizadas)
 */
export function filterReleasesByStacks(stacks: string[]): ReleaseNote[] {
  if (!stacks.length) return [];
  return mockReleases.filter(
    release => release.stack && stacks.includes(release.stack)
  );
}

/**
 * Busca releases por texto (tecnología, versión, tldr, features, breaking changes, categoría)
 */
export function searchReleases(query: string): ReleaseNote[] {
  if (!query.trim()) return mockReleases;
  const lowerQuery = query.toLowerCase().trim();
  return mockReleases.filter(release => {
    const searchableText = [
      release.technology,
      release.version,
      release.tldr,
      release.description,
      release.category,
      ...(release.features || []),
      ...(release.breakingChanges || []),
      ...(release.tags || []),
    ].join(" ").toLowerCase();
    return searchableText.includes(lowerQuery);
  });
}
