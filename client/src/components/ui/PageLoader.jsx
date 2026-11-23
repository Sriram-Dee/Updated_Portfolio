import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING");

  // Glitch text effect
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
    let interval;

    if (progress < 100) {
      interval = setInterval(() => {
        setText((prev) =>
          prev
            .split("")
            .map((char, i) => {
              if (Math.random() > 0.9) {
                return chars[Math.floor(Math.random() * chars.length)];
              }
              return "INITIALIZING"[i];
            })
            .join(""),
        );
      }, 50);
    } else {
      setText("ACCESS GRANTED");
    }

    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = Math.random() * 2 + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center overflow-hidden font-mono text-text-primary">
      {/* Matrix Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-accent, #8b5cf6) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-accent, #8b5cf6) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black 40%, transparent 80%)",
        }}
      />

      {/* Hexagon Pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 border border-accent/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main HUD Container */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Outer Rotating Ring */}
        <motion.div
          className="absolute inset-0 border border-accent/20 rounded-full border-t-accent border-b-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Counter-Rotating Ring */}
        <motion.div
          className="absolute inset-4 border border-accent-secondary/20 rounded-full border-r-accent-secondary border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Pulsing Core */}
        <motion.div
          className="absolute inset-0 bg-accent/5 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Central Geometry */}
        <div className="relative w-40 h-40">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-accent/40"
              style={{
                rotate: i * 45,
                borderRadius: "20%",
              }}
              animate={{
                rotate: [i * 45, i * 45 + 180],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* THE CORE (New Center Element) */}
        <motion.div
          className="absolute z-20 w-12 h-12 bg-white rounded-full shadow-[0_0_50px_var(--color-accent)] flex items-center justify-center"
          style={{
            "--shadow-color": "var(--color-accent, #8b5cf6)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            boxShadow: [
              "0 0 30px var(--shadow-color)",
              "0 0 60px var(--shadow-color)",
              "0 0 30px var(--shadow-color)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-accent rounded-full animate-ping opacity-20" />
          <div className="absolute inset-2 bg-gradient-to-tr from-accent-secondary to-white rounded-full blur-[1px]" />
        </motion.div>

        {/* Data Stream Lines */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse top-1/2 -translate-y-1/2 opacity-30" />
        <div className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-accent-secondary to-transparent animate-pulse left-1/2 -translate-x-1/2 opacity-30" />
      </div>

      {/* HUD Text Interface */}
      <div className="z-10 mt-12 space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 text-accent text-xl tracking-[0.2em] font-bold">
          <span className="w-2 h-2 bg-accent rounded-full animate-ping" />
          {text}
        </div>

        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full bg-gradient-to-r from-accent via-accent-secondary to-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-text-secondary w-64 uppercase tracking-widest mt-1">
          <span>System Integrity</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="text-[10px] text-accent-secondary/50 mt-4 animate-pulse">
          ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
