import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Loader3D = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 3D Cube Loader */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="perspective-1000">
          <motion.div
            className="relative w-32 h-32"
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Cube faces */}
            {[
              {
                transform: "rotateY(0deg) translateZ(64px)",
                bg: "bg-accent/40",
              },
              {
                transform: "rotateY(90deg) translateZ(64px)",
                bg: "bg-accent/30",
              },
              {
                transform: "rotateY(180deg) translateZ(64px)",
                bg: "bg-accent/40",
              },
              {
                transform: "rotateY(-90deg) translateZ(64px)",
                bg: "bg-accent/30",
              },
              {
                transform: "rotateX(90deg) translateZ(64px)",
                bg: "bg-accent/50",
              },
              {
                transform: "rotateX(-90deg) translateZ(64px)",
                bg: "bg-accent/20",
              },
            ].map((face, i) => (
              <div
                key={i}
                className={`absolute w-32 h-32 ${face.bg} border border-accent/50 backdrop-blur-sm`}
                style={{
                  transform: face.transform,
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 border-4 border-accent/60 rounded-lg"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Portfolio
          </h2>
          <p className="text-accent text-sm">
            Preparing immersive experience...
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden border border-accent/30">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Progress percentage */}
        <motion.div
          className="text-accent font-bold text-xl"
          key={progress}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          {progress}%
        </motion.div>

        {/* Orbiting dots */}
        <div className="absolute w-48 h-48">
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-accent rounded-full"
              style={{
                left: "50%",
                top: "50%",
              }}
              animate={{
                rotate: [angle, angle + 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div
                className="w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/50"
                style={{
                  transform: "translate(-50%, -50%) translateX(96px)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loader3D;
