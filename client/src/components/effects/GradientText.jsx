import { motion } from "framer-motion";

const GradientText = ({ children, className = "", animate = true }) => {
  return animate ? (
    <motion.span
      className={`gradient-text ${className}`}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </motion.span>
  ) : (
    <span className={`gradient-text ${className}`}>{children}</span>
  );
};

export default GradientText;
