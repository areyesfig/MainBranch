type SkeletonVariant = "text" | "title" | "card" | "circle" | "rect";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded-[var(--radius-sm)]",
  title: "h-6 w-3/4 rounded-[var(--radius-sm)]",
  card: "h-32 w-full rounded-[var(--radius-lg)]",
  circle: "h-10 w-10 rounded-full",
  rect: "h-20 w-full rounded-[var(--radius-md)]",
};

export default function Skeleton({ variant = "text", className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-bg-tertiary)] ${VARIANT_CLASSES[variant]} ${className}`}
      aria-hidden
    />
  );
}
