import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ScrollFloat = ({ children, offset = 50 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [offset, 0, -offset]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="relative">
      {children}
    </motion.div>
  );
};

export default ScrollFloat;
