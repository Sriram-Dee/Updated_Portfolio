import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className,
      disabled,
      loading,
      icon,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-accent to-accent-secondary text-white hover:opacity-90 focus:ring-accent shadow-lg shadow-accent/25",
      secondary: "glass glass-hover text-white hover:border-accent/50",
      ghost:
        "bg-transparent text-text-secondary hover:text-white hover:bg-white/5",
      outline:
        "border border-border text-white hover:border-accent hover:bg-accent/10",
      danger: "bg-error/90 text-white hover:bg-error focus:ring-error",
      success: "bg-success/90 text-white hover:bg-success focus:ring-success",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
      xl: "px-10 py-4 text-lg gap-3",
    };

    const Component = props.as || "button";
    const { as, ...rest } = props;

    return (
      <Component
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && "relative !text-transparent",
          className,
        )}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </Component>
    );
  },
);

Button.displayName = "Button";

export default Button;
