import { motion } from "framer-motion";
import { cn } from "@/utils/helpers";
import { fadeInUp } from "@/utils/animations";

const SectionHeader = ({ title, subtitle, centered = false, className }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
    className={cn("mb-12", centered && "text-center", className)}
  >
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-secondary text-xs font-semibold tracking-wider uppercase mb-4",
        centered && "mx-auto",
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      {subtitle}
    </div>
    <h2 className="text-h2 mb-4">{title}</h2>
    <div
      className={cn(
        "h-1 w-20 bg-gradient-to-r from-accent to-transparent rounded-full",
        centered && "mx-auto",
      )}
    />
  </motion.div>
);

export default SectionHeader;
