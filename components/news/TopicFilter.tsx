"use client";

import { Filter } from "lucide-react";
import { getTopicLabel } from "@/lib/topicLabels";

interface TopicFilterProps {
  topics: string[];
  selectedTopic: string | null;
  onTopicChange: (topic: string | null) => void;
}

export default function TopicFilter({
  topics,
  selectedTopic,
  onTopicChange,
}: TopicFilterProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5 text-[var(--color-text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Filtrar por Topic
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTopicChange(null)}
          className={`rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors ${
            selectedTopic === null
              ? "bg-[var(--color-brand)] text-white"
              : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
          }`}
        >
          Todos
        </button>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicChange(topic)}
            className={`rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors ${
              selectedTopic === topic
                ? "bg-[var(--color-brand)] text-white"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
            }`}
          >
            {getTopicLabel(topic)}
          </button>
        ))}
      </div>
    </div>
  );
}
