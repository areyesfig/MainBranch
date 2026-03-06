import type { ReactNode } from "react";

type ContainerSize = "narrow" | "default" | "wide";

interface ContainerProps {
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

const SIZE_CLASSES: Record<ContainerSize, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export default function Container({ size = "default", className = "", children }: ContainerProps) {
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${SIZE_CLASSES[size]} ${className}`}>
      {children}
    </div>
  );
}
