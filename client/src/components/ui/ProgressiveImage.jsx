import React, { useState } from "react";
import { motion } from "framer-motion";
import { optimizeImage, cn } from "@/utils/helpers";

const ProgressiveImage = ({
  src,
  alt,
  className,
  imgClassName,
  width = 800, // Default width for optimization
  priority = false, // Set true for LCP images
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Low-res placeholder */}
      <img
        src={optimizeImage(src, 20)}
        alt={alt || ""}
        className={cn(
          "absolute inset-0 w-full h-full object-cover blur-xl scale-110",
          imgClassName,
        )}
        aria-hidden="true"
      />

      {/* High-res image */}
      <motion.img
        src={optimizeImage(src, width)}
        alt={alt || ""}
        className={cn("relative w-full h-full object-cover z-10", imgClassName)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    </div>
  );
};

export default ProgressiveImage;
