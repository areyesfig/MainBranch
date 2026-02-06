/**
 * Etiquetas legibles para stacks tecnológicos
 */
export const STACK_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  react: "React",
  typescript: "TypeScript",
  tailwind: "Tailwind CSS",
  nodejs: "Node.js",
  pytorch: "PyTorch",
  langchain: "LangChain",
  huggingface: "Hugging Face",
  claude: "Claude",
  llama: "Llama",
  openai: "OpenAI",
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
