"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

interface VoteButtonProps {
  releaseId: string;
  initialVotes: number;
}

export default function VoteButton({ releaseId, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    if (voted || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/releases/${releaseId}/vote`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json() as { votes: number };
        setVotes(data.votes);
        setVoted(true);
      } else if (res.status === 429) {
        setVoted(true); // Ya votó antes
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={voted || loading}
      aria-label={voted ? "Ya votaste" : "Votar por este release"}
      className={[
        "flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1 text-sm font-medium transition-colors",
        voted
          ? "cursor-default bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-brand)]",
      ].join(" ")}
    >
      <ThumbsUp className="h-3.5 w-3.5" />
      <span>{votes}</span>
    </button>
  );
}
