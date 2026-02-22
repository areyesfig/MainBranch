/**
 * Etiquetas legibles para stacks tecnológicos
 */
export const STACK_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  react: "React",
  vue: "Vue",
  svelte: "Svelte",
  astro: "Astro",
  nuxt: "Nuxt",
  remix: "Remix",
  vite: "Vite",
  typescript: "TypeScript",
  tailwind: "Tailwind CSS",
  nodejs: "Node.js",
  deno: "Deno",
  rust: "Rust",
  go: "Go",
  pytorch: "PyTorch",
  langchain: "LangChain",
  huggingface: "Hugging Face",
  claude: "Claude",
  openai: "OpenAI",
  gemini: "Gemini",
  mistral: "Mistral AI",
  grok: "Grok",
  ollama: "Ollama",
  deepseek: "DeepSeek",
  vercel: "Vercel",
  github: "GitHub",
  cloudflare: "Cloudflare",
  supabase: "Supabase",
  pinecone: "Pinecone",
  docker: "Docker",
  kubernetes: "Kubernetes",
  "react-native": "React Native",
  pandas: "Pandas",
};

export function getStackLabel(stack: string): string {
  return STACK_LABELS[stack] ?? stack;
}
