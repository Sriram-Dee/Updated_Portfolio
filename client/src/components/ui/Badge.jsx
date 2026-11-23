import { cn } from "@/utils/helpers";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}) => {
  const variants = {
    default: "bg-surface border-border text-text-secondary",
    accent: "bg-accent/20 border-accent/30 text-accent",
    success: "bg-success/20 border-success/30 text-success",
    warning: "bg-warning/20 border-warning/30 text-warning",
    error: "bg-error/20 border-error/30 text-error",
    info: "bg-info/20 border-info/30 text-info",
    gradient:
      "bg-gradient-to-r from-accent/20 to-accent-secondary/20 border-accent/30 gradient-text",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
