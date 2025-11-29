import { motion } from "framer-motion";
import { useState } from "react";

const EducationCard = ({ education }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-[320px] perspective-1000 group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="h-full w-full p-6 rounded-2xl bg-secondary/40 backdrop-blur-sm border border-gray-700/50 flex flex-col items-center justify-center text-center gap-4 group-hover:border-accent/50 transition-colors shadow-xl">
            {/* Institution Logo - Small */}
            <div className="w-16 h-16 rounded-full bg-primary/50 p-2 border border-gray-600 flex items-center justify-center overflow-hidden mb-2">
              {education.logo ? (
                <img
                  src={education.logo}
                  alt={education.institution}
                  className="w-full h-full object-contain"
                />
              ) : (
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              )}
            </div>

            <h3 className="text-xl font-bold text-white leading-tight">
              {education.degree}
            </h3>

            <p className="text-accent font-medium">{education.institution}</p>

            <div className="mt-auto px-4 py-1 rounded-full bg-primary/60 border border-gray-700 text-sm text-gray-300">
              {education.period}
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-secondary to-primary border border-accent/30 p-6 flex flex-col items-center justify-center text-center gap-4 shadow-xl"
          style={{ transform: "rotateY(180deg)" }}
        >
          {education.grade && (
            <div className="px-4 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent font-bold text-sm mb-2">
              {education.grade}
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {education.location}
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            {education.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EducationCard;
