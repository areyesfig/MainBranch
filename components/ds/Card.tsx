import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "elevated" | "bordered" | "ghost";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default:
    "bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] shadow-[var(--shadow-xs)]",
  elevated:
    "bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] shadow-[var(--shadow-md)]",
  bordered:
    "bg-transparent border border-[var(--color-border-default)]",
  ghost:
    "bg-transparent",
};

const PADDING_CLASSES: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] transition-[box-shadow,border-color] duration-200 ${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
