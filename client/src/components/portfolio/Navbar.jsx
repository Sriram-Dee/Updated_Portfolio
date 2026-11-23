import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CodeXml } from "lucide-react";
import { cn, scrollToSection } from "@/utils/helpers";

const Navbar = ({ sections, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "py-4" : "py-6",
        )}
      >
        <div className="container">
          <div
            className={cn(
              "flex items-center justify-between px-6 py-3 transition-all duration-500",
              scrolled
                ? "bg-primary/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full max-w-4xl mx-auto"
                : "bg-transparent max-w-full rounded-2xl",
            )}
          >
            <div
              className="flex items-center gap-2 font-bold text-xl cursor-pointer"
              onClick={() => scrollToSection("hero")}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-accent-tertiary flex items-center justify-center text-white shadow-lg shadow-accent/30">
                <CodeXml size={22} />
              </div>
              <span
                className={`hidden sm:inline font-display tracking-tight ${scrolled ? "text-base" : "text-lg"}`}
              >
                Portfolio
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative px-3 py-1.5 rounded-full hover:bg-white/5",
                    activeSection === section.id
                      ? "text-white"
                      : "text-text-secondary hover:text-white",
                  )}
                >
                  {section.label}
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-1px_0_0_rgba(255,255,255,0.05)] rounded-full -z-10 backdrop-blur-md"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {sections.some((s) => s.id === "contact") && (
              <button
                onClick={() => scrollToSection("contact")}
                className={`hidden md:flex btn btn-sm py-2 px-5 min-h-[auto] rounded-full transition-all duration-300 ${scrolled ? "text-lg" : ""}`}
              >
                Let's Talk
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-text-primary"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md md:hidden flex justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[300px] h-full bg-surface border-l border-white/10 p-8 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold font-display">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      scrollToSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "text-left text-lg font-medium py-3 px-4 rounded-xl transition-all duration-300",
                      activeSection === section.id
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:text-white hover:bg-white/5",
                    )}
                  >
                    {section.label}
                  </button>
                ))}
                {sections.some((s) => s.id === "contact") && (
                  <button
                    onClick={() => {
                      scrollToSection("contact");
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-primary mt-6 w-full py-3 rounded-xl shadow-lg shadow-accent/20"
                  >
                    Get in Touch
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
