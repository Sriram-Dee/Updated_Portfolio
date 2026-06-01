import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X, ExternalLink } from "lucide-react";
import { optimizeImage } from "@/utils/helpers";
import ProgressiveImage from "@/components/ui/ProgressiveImage";

const Achievements = ({ achievements }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    if (selectedAchievement) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [selectedAchievement]);

  if (!achievements?.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-8 flex items-center gap-3 font-display">
        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
          <Award size={20} />
        </div>
        Honors & Awards
      </h3>
      <div className="grid gap-4">
        {achievements.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              if (item.link) {
                window.open(item.link, "_blank");
              } else if (item.image) {
                setSelectedAchievement(item);
              }
            }}
            onMouseEnter={() => {
              if (item.image) {
                const img = new Image();
                img.src = optimizeImage(item.image, 1200);
              }
            }}
            className={`group relative bg-surface/30 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:bg-surface/50 transition-all duration-300 flex gap-5 items-center overflow-hidden ${
              item.link || item.image
                ? "cursor-pointer hover:border-accent/30"
                : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              {item.image ? (
                <ProgressiveImage
                  src={item.image}
                  width={200}
                  alt={item.name}
                  className="w-full h-full"
                />
              ) : (
                <Award size={28} className="text-yellow-400" />
              )}
            </div>
            <div className="relative flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-primary text-lg group-hover:text-yellow-400 transition-colors">
                    {item.name || item.title}
                  </h4>
                  <p className="text-sm text-secondary mt-1 font-medium">
                    {item.issuer || item.organization}
                  </p>
                </div>
                {item.link && (
                  <ExternalLink
                    size={16}
                    className="text-primary/30 group-hover:text-accent transition-colors"
                  />
                )}
              </div>
              <p className="text-xs text-secondary mt-1 opacity-60 font-mono">
                {item.date}
              </p>
              {item.description && (
                <ul className="text-sm text-text-muted mt-3 leading-relaxed list-disc pl-4 space-y-1">
                  {item.description.split("\n").map((point, i) => (
                    <li key={i}>{point.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {selectedAchievement &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-primary hover:bg-black/70 transition-colors z-10"
              >
                <X size={20} />
              </button>
              <div className="flex-1 min-h-0 w-full overflow-hidden bg-black/50 flex items-center justify-center p-4">
                <ProgressiveImage
                  src={selectedAchievement.image}
                  width={1200}
                  alt={selectedAchievement.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
                />
              </div>
              <div className="p-6 bg-surface/95 backdrop-blur border-t border-white/10">
                <h3 className="text-xl font-bold text-primary mb-1">
                  {selectedAchievement.name || selectedAchievement.title}
                </h3>
                <p className="text-sm text-secondary">
                  {selectedAchievement.issuer ||
                    selectedAchievement.organization}{" "}
                  • {selectedAchievement.date}
                </p>
                {selectedAchievement.description && (
                  <ul className="text-base text-secondary mt-4 leading-relaxed list-disc pl-4 space-y-2">
                    {selectedAchievement.description
                      .split("\n")
                      .map((point, i) => (
                        <li key={i}>{point.trim()}</li>
                      ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </div>
  );
};

export default Achievements;
