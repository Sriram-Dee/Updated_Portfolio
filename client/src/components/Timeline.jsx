import { motion } from "framer-motion";
import {
  Award,
  FileText,
  Calendar,
  Building,
  ExternalLink,
  Star,
  Zap,
} from "lucide-react";

const Timeline = ({ achievements = [] }) => {
  // Sort by date (newest first)
  const sorted = [...achievements].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <Award size={48} className="mx-auto mb-4 opacity-50" />
        <p>No certifications or awards yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="relative">
        {/* Vertical line with glow effect */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent">
          <div className="absolute inset-0 bg-accent/20 blur-sm" />
        </div>

        {sorted.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="relative pl-16 sm:pl-20 pb-10 last:pb-0 group"
          >
            {/* Timeline dot with pulse animation */}
            <div className="absolute left-4 sm:left-6 top-3 z-20">
              {/* Main dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-accent border-4 border-primary shadow-lg shadow-accent/50 relative z-10"
              />

              {/* Pulsing ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
                className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-accent/50 border-2 border-accent"
              />
            </div>

            {/* Connecting line with animation */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
              className="absolute left-10 sm:left-12 top-4 h-0.5 bg-gradient-to-r from-accent to-accent/30 w-6 sm:w-8 origin-left"
            />

            {/* Content card */}
            <motion.div
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="relative bg-gradient-to-br from-secondary/80 to-primary/30 backdrop-blur-xl border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-accent/50 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-accent/10 overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              <div className="relative z-10">
                {/* Header - Period in top right on desktop, separate row on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  {/* Left side: Icon, Title, and Issuer */}
                  <div className="flex items-start gap-3 flex-1 flex-wrap">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${
                        achievement.type === "certification"
                          ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                          : "bg-gradient-to-br from-yellow-500/20 to-amber-500/20"
                      } border ${
                        achievement.type === "certification"
                          ? "border-blue-500/30"
                          : "border-yellow-500/30"
                      } backdrop-blur-sm`}
                    >
                      {achievement.type === "certification" ? (
                        <FileText className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Award className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.div>

                    {/* Title and Issuer */}
                    <div className="flex-1 min-w-0">
                      <motion.h3
                        className="text-lg sm:text-xl font-bold text-white group-hover:text-accent transition-colors duration-300 leading-tight mb-2"
                        whileHover={{ x: 1 }}
                      >
                        {achievement.name}
                      </motion.h3>

                      {/* Issuer */}
                      <div className="hidden sm:flex items-center gap-2 text-gray-300 text-sm">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 text-accent/80 flex-shrink-0" />
                        <span className="font-medium text-gray-300">
                          {achievement.issuer}
                        </span>
                      </div>
                    </div>

                    {/* Issuer mobile */}
                    <div className="flex sm:hidden items-center gap-2 text-gray-300 text-sm">
                      <Building className="w-3 h-3 sm:w-4 sm:h-4 text-accent/80 flex-shrink-0" />
                      <span className="font-medium text-gray-300">
                        {achievement.issuer}
                      </span>
                    </div>
                  </div>

                  {/* Period - Top right on desktop, separate row on mobile */}
                  <motion.div
                    className="flex items-center gap-2 text-accent text-sm font-semibold bg-accent/10 px-3 py-2 rounded-lg border border-accent/20 w-full sm:w-fit justify-center sm:justify-start mt-2 sm:mt-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {new Date(achievement.date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </motion.div>
                </div>

                {/* Description */}
                {achievement.description && (
                  <motion.p
                    className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base border-l-2 border-accent/30 pl-3 sm:pl-4 py-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    {achievement.description}
                  </motion.p>
                )}

                {/* Image with overlay */}
                {achievement.image && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                    whileHover={{ scale: 1.03 }}
                    className="w-max h-max overflow-hidden rounded-lg sm:rounded-xl border border-gray-600/50 group/image relative mb-4 sm:mb-6"
                  >
                    <img
                      src={achievement.image}
                      alt={achievement.name}
                      className="w-full max-w-[200px] aspect-[1/1] object-contain bg-white object-center transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                )}

                {/* Footer with badge and action buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-700/50">
                  {/* Badge */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 w-fit ${
                      achievement.type === "certification"
                        ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {achievement.type === "certification" ? (
                      <>
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        Certification
                      </>
                    ) : (
                      <>
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400" />
                        Award
                      </>
                    )}
                  </motion.div>

                  {/* Action buttons */}
                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 w-full xs:w-auto">
                    {achievement.link && (
                      <motion.a
                        href={achievement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent border border-accent/30 rounded-lg hover:bg-accent/20 transition-colors text-xs sm:text-sm font-medium w-full xs:w-auto"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        View Credential
                      </motion.a>
                    )}

                    {achievement.skills && achievement.skills.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.8 }}
                        className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-400 flex-wrap"
                      >
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                        <span className="text-xs break-words line-clamp-1">
                          {achievement.skills.slice(0, 3).join(", ")}
                          {achievement.skills.length > 3 && "..."}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
