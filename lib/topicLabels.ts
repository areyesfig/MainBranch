/**
 * Etiquetas legibles para topics de noticias AI
 */
export const TOPIC_LABELS: Record<string, string> = {
  openai: "OpenAI",
  claude: "Claude",
  gemini: "Gemini",
  deepseek: "DeepSeek",
  grok: "Grok",
  mistral: "Mistral AI",
  meta: "Meta AI",
  copilot: "GitHub Copilot",
  apple: "Apple AI",
  nvidia: "NVIDIA",
  "general-ai": "IA General",
};

export function getTopicLabel(topic: string): string {
  return TOPIC_LABELS[topic] ?? topic;
}
