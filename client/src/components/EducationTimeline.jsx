import { motion } from "framer-motion";

const EducationTimeline = ({ education }) => {
  return (
    <div className="relative max-w-4xl mx-auto px-4">
      {/* Center Vertical Line */}
      <div
        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] 
        bg-gradient-to-b from-transparent via-accent/60 to-transparent 
        -translate-x-1/2 pointer-events-none"
      />

      <div className="space-y-16 md:space-y-24">
        {education.map((edu, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative flex md:block"
            >
              {/* Timeline Node */}
              <div
                className="absolute left-4 md:left-1/2 top-2 
                -translate-x-1/2 z-20"
              >
                <div
                  className="w-10 h-10 rounded-full bg-primary border-2 border-accent 
                shadow-[0_0_14px_rgba(56,189,248,0.35)] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={edu.logo || "https://via.placeholder.com/50"}
                    alt={edu.institution}
                    className="w-full h-full object-contain bg-white rounded-full"
                  />
                </div>
              </div>

              {/* Desktop alternating layout */}
              <div
                className={`
                  mt-10 md:mt-0 
                  md:w-1/2 
                  ${
                    isLeft
                      ? "md:pr-12 md:text-right"
                      : "md:pl-12 md:ml-auto md:text-left"
                  }
                  text-left   /* Always left on mobile */
                `}
              >
                {/* Connector Line */}
                <div
                  className={`hidden md:block absolute top-6 w-12 h-[2px] 
                  bg-gradient-to-r 
                  ${
                    isLeft
                      ? "right-1/2 from-accent/70 to-transparent"
                      : "left-1/2 from-transparent to-accent/70"
                  }`}
                />

                {/* Card */}
                <div
                  className="bg-secondary/30 backdrop-blur-md border border-white/10 
                  p-6 rounded-lg transition-all duration-300 
                  hover:border-accent/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]
                  "
                >
                  <div
                    className={`flex flex-col gap-2 ${
                      isLeft ? "md:items-end" : "md:items-start"
                    }`}
                  >
                    {/* Degree & Period */}
                    <div
                      className={`flex justify-between items-start flex-wrap gap-2 
                      ${isLeft ? "md:flex-row-reverse" : "md:flex-row"}`}
                    >
                      <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">
                        {edu.degree}
                      </h3>
                      <span className="px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full border border-accent/20">
                        {edu.period}
                      </span>
                    </div>

                    {/* Institution */}
                    <div
                      className={`text-gray-300 text-sm flex items-center gap-2 
                      ${isLeft ? "md:justify-end" : "md:justify-start"}`}
                    >
                      <span className="font-medium">{edu.institution}</span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full" />
                      <span className="text-gray-400">{edu.location}</span>
                    </div>

                    {/* Grade */}
                    {edu.grade && (
                      <div
                        className={`text-xs text-accent/80 font-mono ${
                          isLeft ? "md:text-right" : "md:text-left"
                        }`}
                      >
                        {edu.grade}
                      </div>
                    )}

                    {/* Description */}
                    {edu.description && (
                      <p
                        className={`text-gray-300 text-sm leading-relaxed mt-2 
                        ${isLeft ? "md:text-right" : "md:text-left"}`}
                      >
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EducationTimeline;
