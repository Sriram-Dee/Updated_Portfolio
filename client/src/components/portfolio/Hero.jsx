import { motion, useScroll, useTransform } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  ChevronDown,
  User,
} from "lucide-react";
import { scrollToSection, optimizeImage } from "@/utils/helpers";
import SocialButton from "./SocialButton";
import OrbitingText from "./OrbitingText";
import ProgressiveImage from "@/components/ui/ProgressiveImage";
import React from "react";

const Hero = ({ profile }) => {
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reduce/disable parallax on mobile for better scrolling
  const y1Desktop = useTransform(scrollY, [0, 500], [0, 200]);
  const y2Desktop = useTransform(scrollY, [0, 500], [0, -150]);
  const scrollOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const y1 = isMobile ? 0 : y1Desktop;
  const y2 = isMobile ? 0 : y2Desktop;
  const opacity = isMobile ? 1 : scrollOpacity;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-8"
    >
      {/* Dynamic Background - Northern Lights Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-20%] w-[40vw] h-[40vw] rounded-full bg-accent-secondary/10 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-accent-tertiary/10 blur-[140px] animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-6 lg:gap-24 items-center">
        <motion.div
          style={{ y: y1, opacity }}
          className="order-2 lg:order-1 flex items-start gap-4"
        >
          {/* Vertical "Available" badge on left */}
          <div className="hidden lg:flex flex-col items-center gap-3 pt-24">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-secondary"></span>
            </span>
            <span
              className="text-xs font-medium tracking-widest uppercase text-primary/70 rotate-180"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              Available for freelance work
            </span>
          </div>

          {/* Main content */}
          <div className="flex flex-col items-start text-left">
            <div className="mb-8">
              <h1 className="text-display text-primary mb-2 leading-tight">
                {profile?.name}
              </h1>
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r ext-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent animate-gradient-x">
                {profile?.title}
              </h2>
            </div>

            <p className="text-l text-secondary max-w-xl mb-8 leading-relaxed font-light">
              {profile?.summary || "Building digital experiences that matter."}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("projects")}
                className="btn btn-primary rounded-2xl px-8 py-2 text-sm shadow-glow hover:shadow-glow-lg transition-all"
              >
                View Projects
                <ArrowUpRight size={22} />
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="btn btn-outline rounded-2xl px-8 py-2 text-sm hover:bg-white/5 border-white/10"
              >
                Contact Me
              </button>
            </div>

            <div className="mt-8 flex items-center gap-6 text-secondary border-t border-white/5 pt-8 w-full max-w-md">
              {profile?.github && (
                <SocialButton
                  href={profile.github}
                  icon={Github}
                  label="GitHub"
                />
              )}
              {profile?.linkedin && (
                <SocialButton
                  href={profile.linkedin}
                  icon={Linkedin}
                  label="LinkedIn"
                />
              )}
              {profile?.twitter && (
                <SocialButton
                  href={profile.twitter}
                  icon={Twitter}
                  label="Twitter"
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Premium Floating Image Visual */}
        <motion.div
          style={{ y: y2, opacity }}
          className="order-1 lg:order-2 relative flex justify-center lg:justify-end mt-8 lg:mt-0"
        >
          <div className="relative w-[clamp(280px,28vw,500px)] aspect-square perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent via-accent to-accent-secondary rounded-full opacity-20 blur-[120px] animate-pulse-slow" />

            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full h-full rounded-full border border-white/10 shadow-2xl bg-surface/30 backdrop-blur-2xl p-4 rotate-3 hover:rotate-0 transition-transform duration-700"
            >
              <div className="w-full h-full rounded-full bg-secondary relative group z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {profile?.avatar ? (
                  <ProgressiveImage
                    src={profile.avatar}
                    width={500}
                    priority={true}
                    alt={profile.name}
                    className="w-full h-full transform scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-elevated text-secondary">
                    <User size={80} />
                  </div>
                )}
              </div>

              {/* Spinning Circular Text */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <OrbitingText
                  text="• Searching for Opportunities • Available for Work "
                  duration={30}
                  fontSize={8.2}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer p-3 rounded-full hover:bg-white/5 transition-colors"
        onClick={() => scrollToSection("skills")}
      >
        <ChevronDown className="w-8 h-8 text-primary/50 hover:text-primary transition-colors" />
      </motion.div>
    </section>
  );
};

export default Hero;
