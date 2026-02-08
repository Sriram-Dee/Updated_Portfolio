import React from "react";
import { motion } from "framer-motion";

const FooterLoader = () => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center perspective-1000">
      <div className="relative w-24 h-24 preserve-3d animate-[spin_10s_linear_infinite]">
        {/* Core Glow */}
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />

        {/* Inner Core */}
        <motion.div
          className="absolute inset-4 border-4 border-accent-secondary/50 rounded-full"
          animate={{ rotateX: 360, rotateY: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Outer Rings */}
        {[0, 60, 120].map((deg, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-accent/40 rounded-full"
            style={{ rotateX: deg, rotateY: deg }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: [0, Math.cos(i * 60 * (Math.PI / 180)) * 60],
              y: [0, Math.sin(i * 60 * (Math.PI / 180)) * 60],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FooterLoader;
