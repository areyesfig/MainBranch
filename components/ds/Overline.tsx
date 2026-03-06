import type { ReactNode } from "react";

interface OverlineProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export default function Overline({ children, color, className = "" }: OverlineProps) {
  return (
    <span
      className={`overline text-[var(--color-text-tertiary)] ${className}`}
      style={color ? { color } : undefined}
    >
      {children}
    </span>
  );
}
