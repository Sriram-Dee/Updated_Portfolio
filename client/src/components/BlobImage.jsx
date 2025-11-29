import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const BlobImage = ({ src, alt }) => {
  const imageRef = useRef(null);
  const borderRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    const border = borderRef.current;
    if (!image || !border) return;

    // Animate blob shape continuously
    const animateBlob = () => {
      const randomBorderRadius = () => {
        const values = [];
        for (let i = 0; i < 8; i++) {
          values.push(Math.floor(Math.random() * 80) + 40); // 30-60%
        }
        return `${values[0]}% ${values[1]}% ${values[2]}% ${values[3]}% / ${values[4]}% ${values[5]}% ${values[6]}% ${values[7]}%`;
      };

      const newRadius = randomBorderRadius();
      image.style.borderRadius = newRadius;
      border.style.borderRadius = newRadius;
    };

    // Initial animation
    animateBlob();

    // Animate every 3 seconds
    const interval = setInterval(animateBlob, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-64 h-64 md:w-96 md:h-96"
    >
      {/* Glowing background blob */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-blue-500/30 blur-2xl animate-pulse" />

      {/* Main image with blob animation */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="relative w-full h-full object-cover shadow-2xl shadow-accent/20 transition-all duration-[3000ms] ease-in-out"
        style={{
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        }}
      />

      {/* Animated border overlay */}
      <div
        ref={borderRef}
        className="absolute inset-0 border-4 border-accent/40 transition-all duration-[3000ms] ease-in-out pointer-events-none"
        style={{
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        }}
      />
    </motion.div>
  );
};

export default BlobImage;
