import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/helpers";

const TiltCard = ({
  children,
  className,
  tiltAmount = 10,
  glare = true,
  scale = 1.02,
}) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    setRotateX((-mouseY / (rect.height / 2)) * tiltAmount);
    setRotateY((mouseX / (rect.width / 2)) * tiltAmount);

    // Glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX,
        rotateY,
        scale: rotateX !== 0 || rotateY !== 0 ? scale : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}

      {/* Glare effect */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15), transparent 50%)`,
            opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
