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
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filtrar por Topic
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTopicChange(null)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedTopic === null
              ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Todos
        </button>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicChange(topic)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedTopic === topic
                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {getTopicLabel(topic)}
          </button>
        ))}
      </div>
    </div>
  );
}
