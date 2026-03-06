interface DividerProps {
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

const SPACING_CLASSES = {
  sm: "my-4",
  md: "my-6",
  lg: "my-8",
};

export default function Divider({ spacing = "md", className = "" }: DividerProps) {
  return (
    <hr
      className={`border-t border-[var(--color-border-default)] ${SPACING_CLASSES[spacing]} ${className}`}
    />
  );
}
