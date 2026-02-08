import { forwardRef, useState, useRef, useEffect } from "react";
import { cn } from "@/utils/helpers";

const Textarea = forwardRef(
  (
    { label, error, maxLength, className, containerClassName, value, ...props },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const charCount = value?.length || 0;
    const innerRef = useRef(null);

    // Combine refs
    const setRef = (element) => {
      innerRef.current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    };

    // Auto-resize
    const adjustHeight = () => {
      const textarea = innerRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    // Adjust on value change
    useState(() => {
      // We use a layout effect-like behavior by calling it in render or effect,
      // but strictly for this simple component, useEffect is safer for consistency.
      // However, we need to trigger it.
    });

    // Using simple approach: call adjustHeight on change/mount
    // We can use the 'value' dependency in useEffect
    useEffect(() => {
      adjustHeight();
    }, [value]);

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={setRef}
            value={value}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-surface/50 border text-white placeholder-text-muted resize-none overflow-hidden",
              "transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-accent/50",
              focused
                ? "border-accent"
                : error
                  ? "border-error"
                  : "border-border",
              className,
            )}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onInput={adjustHeight}
            maxLength={maxLength}
            {...props}
          />
          {maxLength && (
            <div className="absolute bottom-3 right-3 text-xs text-text-muted">
              {charCount}/{maxLength}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
