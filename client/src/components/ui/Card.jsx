import { cn } from "@/utils/helpers";

const Card = ({
  children,
  className,
  hover = true,
  glow = false,
  accent = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        accent ? "glass-accent" : "glass",
        hover && "glass-hover cursor-pointer",
        glow && "glow-hover",
        "transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("mb-4", className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }) => (
  <h3
    className={cn("text-xl font-bold text-white font-heading", className)}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-text-secondary mt-1", className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div
    className={cn(
      "mt-4 pt-4 border-t border-border flex items-center gap-3",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
export default Card;
