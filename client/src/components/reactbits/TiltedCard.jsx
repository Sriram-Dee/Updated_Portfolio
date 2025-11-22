import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TiltedCard = ({ 
  children, 
  onClick,
  className = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  rotateAmplitude = 12,
  scaleOnHover = 1.05,
  showMobileWarning = false,
  showTooltip = true,
  displayOverlayContent = false,
  overlayContent = null
}) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useSpring(0, { stiffness: 150, damping: 20 });

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [rotateAmplitude, -rotateAmplitude]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-rotateAmplitude, rotateAmplitude]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    z.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    z.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full rounded-xl bg-secondary border border-gray-800 cursor-pointer group perspective-1000 ${className}`}
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="relative h-full rounded-xl shadow-lg overflow-hidden"
      >
        {children}
        
        {/* Glare Effect */}
        <motion.div 
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
                background: useTransform(
                    mouseXSpring, 
                    [-0.5, 0.5], 
                    ["linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%)", "linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%)"]
                ),
                opacity: useTransform(z, [0, 1], [0, 1])
            }}
        />
      </div>
    </motion.div>
  );
};

export default TiltedCard;
