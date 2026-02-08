import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Globe, Database, Code2 } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { getIcon } from "@/utils/skillIcons.jsx";
import React from "react";

const categoryIcons = {
  frontend: Globe,
  backend: Database,
  devops: Code2,
};

// 3D Tilt Card Component
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Skills = ({ skills }) => {
  if (!skills) return null;

  return (
    <section
      id="skills"
      className="section relative overflow-hidden"
      style={{ perspective: "1500px" }}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10">
        <SectionHeader
          title="Technical Expertise"
          subtitle="My Tech Stack"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Object.entries(skills).map(([category, items], idx) => {
            const Icon = categoryIcons[category.toLowerCase()] || Globe;

            // Filter out disabled skills
            const visibleItems = items.filter((item) => {
              if (typeof item === "string") return true;
              return item.enabled !== false;
            });

            if (visibleItems.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, z: -100, rotateX: 15 }}
                whileInView={{ opacity: 1, z: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.2,
                  duration: 0.7,
                  ease: "easeOut",
                }}
              >
                <TiltCard className="group cursor-pointer">
                  {/* Main Card */}
                  <div
                    className="relative rounded-3xl overflow-hidden bg-surface/50 backdrop-blur-xl border border-white/10 transition-all duration-500 group-hover:border-white/20"
                    style={{
                      transformStyle: "preserve-3d",
                      boxShadow:
                        "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
                    }}
                  >
                    {/* Floating Layer Effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ transform: "translateZ(20px)" }}
                    />

                    {/* Content */}
                    <div
                      className="relative z-10 p-6 md:p-8"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <motion.div
                          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl shadow-black/20"
                          whileHover={{ scale: 1.1, rotateZ: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Icon className="w-6 h-6 md:w-7 md:h-7 text-secondary" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold capitalize font-display tracking-tight text-primary">
                            {category}
                          </h3>
                          <p className="text-sm text-secondary mt-0.5">
                            {visibleItems.length} technologies
                          </p>
                        </div>
                      </div>

                      {/* Skills with Stagger Animation */}
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {visibleItems.map((skillItem, skillIdx) => {
                          const skillName =
                            typeof skillItem === "string"
                              ? skillItem
                              : skillItem.name;

                          return (
                            <motion.div
                              key={skillName}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                delay: idx * 0.1 + skillIdx * 0.05,
                              }}
                              whileHover={{
                                scale: 1.08,
                                y: -4,
                                boxShadow: "0 10px 30px -5px rgba(0,0,0,0.3)",
                              }}
                              className="flex items-center gap-2 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 bg-white/[0.05] rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-colors duration-300 cursor-default"
                            >
                              <span className="text-secondary">
                                {getIcon(skillName)}
                              </span>
                              <span className="text-sm font-medium text-secondary">
                                {skillName}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Shadow for Depth */}
                    <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
