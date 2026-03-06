import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  size?: IconButtonSize;
}

const SIZE_CLASSES: Record<IconButtonSize, string> = {
  sm: "h-7 w-7 [&>svg]:h-3.5 [&>svg]:w-3.5",
  md: "h-8 w-8 [&>svg]:h-4 [&>svg]:w-4",
  lg: "h-10 w-10 [&>svg]:h-5 [&>svg]:w-5",
};

export default function IconButton({
  icon,
  label,
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
