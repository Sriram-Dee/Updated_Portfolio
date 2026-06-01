import { motion } from "framer-motion";
import { Briefcase, MapPin, GraduationCap } from "lucide-react";
import SectionHeader from "./SectionHeader";
import Achievements from "./Achievements";

const Experience = ({ experience, education, achievements }) => {
  if (!experience?.length && !education?.length) return null;

  return (
    <section id="experience" className="section relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute right-0 top-1/2 w-[600px] h-[600px] bg-accent-tertiary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Experience Column */}
          <div>
            <SectionHeader
              title="Experience"
              subtitle="Professional Journey"
              className="text-center md:text-left"
            />

            <div className="space-y-8 relative pl-8 border-l border-white/5 ml-4">
              {experience?.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <span className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-secondary border-[3px] border-accent shadow-[0_0_10px_rgba(139,92,246,0.5)] z-10" />

                  <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-accent/30 transition-all duration-300 group hover:shadow-lg hover:shadow-accent/5">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h4 className="font-bold text-xl mb-1 font-display">
                          {exp.role}
                        </h4>
                        <div className="flex items-center gap-2 text-secondary text-sm mt-1">
                          <Briefcase
                            size={14}
                            className="text-accent-secondary/70"
                          />
                          <span className="font-medium">{exp.company}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-secondary bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
                        {exp.period}
                      </span>
                    </div>

                    {exp.location && (
                      <div className="flex items-center gap-2 text-xs text-secondary mb-6">
                        <MapPin size={12} />
                        {exp.location}
                      </div>
                    )}

                    {exp.description && (
                      <ul className="text-secondary text-sm mb-6 leading-relaxed font-light list-disc pl-4 space-y-2">
                        {exp.description.split("\n").map((point, i) => (
                          <li key={i}>{point.trim()}</li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2 pt-5 border-t border-white/5">
                        {(Array.isArray(exp.technologies)
                          ? exp.technologies
                          : exp.technologies?.split(",") || []
                        ).map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold tracking-wide px-2.5 py-1 bg-white/5 rounded-md text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
                          >
                            {typeof t === "string" ? t.trim() : t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <SectionHeader
              title="Education"
              subtitle="Academic Background"
              className="text-center md:text-left"
            />

            <div className="space-y-6">
              {education?.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-surface/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 flex gap-6 items-start hover:bg-surface/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent-secondary/10 text-accent-secondary flex items-center justify-center shrink-0 border border-accent-secondary/20 shadow-lg shadow-accent-secondary/5">
                    <GraduationCap size={28} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xl mb-1 font-display">
                      {edu.degree}
                    </h4>
                    <p className="font-medium text-secondary">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-secondary mt-2 font-mono bg-white/5 inline-block px-3 py-1 rounded-lg mb-3">
                      {edu.period}
                    </p>
                    {edu.description && (
                      <ul className="text-sm text-secondary leading-relaxed font-light list-disc pl-4 space-y-1">
                        {edu.description.split("\n").map((point, i) => (
                          <li key={i}>{point.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <Achievements achievements={achievements} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
