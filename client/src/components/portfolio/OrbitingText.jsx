import { motion } from "framer-motion";

const OrbitingText = ({
  text = "• Searching for Opportunities • Available for Work ",
  duration = 60,
  fontSize = 10,
}) => {
  // Duplicate text to fill the circle
  const displayText = text.repeat(2);

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className="absolute inset-[-5%] flex items-center justify-center pointer-events-none"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <path
            id="circlePath"
            d="M 100, 100 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
            fill="none"
          />
        </defs>
        <text
          className="fill-white/80 uppercase tracking-[0.3em]"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: "600",
          }}
        >
          <textPath href="#circlePath" startOffset="0%">
            {displayText}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
};

export default OrbitingText;
