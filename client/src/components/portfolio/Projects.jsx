import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  Github,
  ExternalLink,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Layers,
  ZoomIn,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProgressiveImage from "@/components/ui/ProgressiveImage";
import { optimizeImage } from "@/utils/helpers";

// Register ScrollTrigger immediately
gsap.registerPlugin(ScrollTrigger);

// ... (Lightbox component remains effectively unchanged, but good to check if we should replace img there too. The prompt said "every where". Let's do it.)

// Fullscreen Image Lightbox with Navigation
const Lightbox = ({ images, currentIndex, title, onClose, onNavigate }) => {
  // ... existing logic ...
  const hasMultiple = images && images.length > 1;

  const handlePrev = (e) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* ... nav buttons ... */}
      {hasMultiple && (
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-primary transition-colors z-10"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image - Replacing motion.img with ProgressiveImage-like structure or just keep motion.img since it's a lightbox and usually needs high res immediately? 
         User said "make the url that provides as samller version... before the real image". 
         For Lightbox, maybe we just use the high res? 
         Actually, let's keep Lightbox as is for now or use ProgressiveImage if simple. 
         Lightbox uses AnimatePresence which might be tricky with the wrapper div in ProgressiveImage. 
         Let's stick to the main UI elements first. 
      */}
      <AnimatePresence mode="wait">
        <ProgressiveImage
          key={currentIndex}
          src={images[currentIndex]}
          width={1920}
          alt={`${title} - ${currentIndex + 1}`}
          className="max-w-[85vw] max-h-[85vh] rounded-lg relative"
          imgClassName="object-contain"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        />
      </AnimatePresence>

      {/* ... rest of lightbox ... */}
      {hasMultiple && (
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-primary transition-colors z-10"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 md:top-6 right-4 md:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-primary transition-colors"
      >
        <X size={24} />
      </button>

      {/* Image Counter */}
      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-primary text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
};

// Unique 3D Perspective Carousel with Thumbnails
const PerspectiveCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images?.length) {
    return (
      <div className="aspect-video rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center border border-white/10">
        <Layers size={64} className="text-primary/10" />
      </div>
    );
  }

  const hasMultiple = images.length > 1;

  return (
    <div className="space-y-4">
      {/* Main Image with 3D Effect */}
      <div className="relative group">
        <div
          className="relative aspect-video rounded-2xl overflow-hidden cursor-zoom-in"
          style={{
            perspective: "1000px",
            boxShadow: "0 30px 60px -15px rgba(0,0,0,0.5)",
          }}
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ rotateY: 15, opacity: 0, scale: 0.95 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -15, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <ProgressiveImage
                src={images[currentIndex]}
                width={1200}
                alt={`${title} - ${currentIndex + 1}`}
                className="w-full h-full"
              />
              {/* Zoom Icon Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center z-20">
                <ZoomIn
                  size={32}
                  className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(
                    (prev) => (prev - 1 + images.length) % images.length,
                  );
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/20 z-30"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/20 z-30"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
          {images.map((img, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? "border-white ring-2 ring-white/30"
                  : "border-white/20 opacity-50 hover:opacity-100"
              }`}
            >
              <ProgressiveImage
                src={img}
                width={200}
                alt=""
                className="w-full h-full"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={currentIndex}
            title={title}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setCurrentIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Project Card with Cursor-Following Glow
const ProjectCard = ({ project, index, onClick, isMobile, totalCards }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Calculate stagger offset for mobile parallax stacking
  const mobileOffset = isMobile ? index * 20 : 0;

  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      // Disable Framer Motion on mobile to let GSAP handle the animation
      {...(isMobile
        ? { animate: { opacity: 1, y: 0, transition: { duration: 0.5 } } } // Force visibility and reset position for GSAP
        : {
            initial: { opacity: 0, y: 60 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-50px" },
            transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
          })}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer overflow-visible"
      style={{
        perspective: "1000px",
      }}
    >
      {/* CURSOR-FOLLOWING GLOW - Only on desktop */}
      {!isMobile && (
        <div
          className="absolute -inset-1 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.4), rgba(167, 139, 250, 0.2) 40%, transparent 70%)`,
          }}
        />
      )}

      {/* Border glow that follows cursor */}
      <div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(167, 139, 250, 0.5), transparent 50%)`,
        }}
      />

      {/* Main Card */}
      <motion.div
        className={`relative rounded-2xl overflow-hidden border border-white/10 group-hover:border-violet-400/30 transition-all duration-300 ${isMobile ? "bg-[#0a0a0a]" : "bg-surface"}`}
        whileHover={{
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        style={{
          boxShadow: isMobile
            ? "0 -10px 40px -5px rgba(0,0,0,0.8), 0 25px 50px -12px rgba(0,0,0,0.6)"
            : isHovered
              ? "0 25px 50px -12px rgba(139, 92, 246, 0.4), 0 0 60px -15px rgba(167, 139, 250, 0.3)"
              : "0 25px 50px -12px rgba(0,0,0,0.6)",
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.images?.[0] ? (
            <ProgressiveImage
              src={project.images[0]}
              width={800}
              alt={project.title}
              className="w-full h-full"
              whileHover={{ scale: 1.08 }} // Pass framer motion props if wrapper supports it? No, wrapper is div.
              // ProgressiveImage wraps with div, so whileHover won't work on the motion.img directly if passed as ...props unless we ensure it's passed.
              // My ProgressiveImage impl passes ...props to motion.img.
              // BUT the wrapper div needs to handle overflow usually.
              // Wait, ProgressiveImage has default 'relative overflow-hidden'.
              // So scaling the image inside might get clipped? Yes.
              // But here the parent div `relative aspect-[16/10] overflow-hidden` also clips.
              // So it should be fine.
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-900/20 to-surface flex items-center justify-center">
              <Layers size={48} className="text-primary/10" />
            </div>
          )}

          {/* Gradient Overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 z-10" />

          {/* Floating Project Index - MORE VISIBLE */}
          <div className="absolute top-4 left-4">
            <span
              className="text-4xl md:text-8xl font-black font-display"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px rgba(255, 255, 255, 0.15)",
                textShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-black/70 backdrop-blur-sm border border-white/20 text-primary/80 hover:text-primary hover:border-violet-400/50 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={16} />
              </a>
            )}
            {(project.demoUrl || project.link) && (
              <a
                href={project.demoUrl || project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-black/70 backdrop-blur-sm border border-white/20 text-primary/80 hover:text-primary hover:border-violet-400/50 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="text-xl font-bold text-primary mb-3 font-display tracking-tight drop-shadow-lg">
              {project.title}
            </h3>

            {/* Tech Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(Array.isArray(project.technologies)
                ? project.technologies
                : project.technologies?.split(",").map((t) => t.trim()) || []
              )
                .slice(0, 3)
                .map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-violet-500/30 backdrop-blur-sm border border-violet-400/30 text-primary"
                  >
                    {tech}
                  </span>
                ))}
              {(Array.isArray(project.technologies)
                ? project.technologies
                : project.technologies?.split(",") || []
              ).length > 3 && (
                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white/20 backdrop-blur-sm border border-white/20 text-primary/80">
                  +
                  {(Array.isArray(project.technologies)
                    ? project.technologies
                    : project.technologies?.split(",") || []
                  ).length - 3}
                </span>
              )}
            </div>

            <p className="text-primary/80 text-sm line-clamp-2 font-light drop-shadow">
              {project.description}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between p-4 bg-black/30 border-t border-white/10">
          <div className="flex items-center gap-2 text-primary/60 text-xs">
            <Layers size={14} />
            <span>{project.images?.length || 1} images</span>
          </div>
          <motion.div
            className="flex items-center gap-1.5 text-primary/70 font-medium text-sm group-hover:text-violet-300 transition-colors"
            whileHover={{ x: 3 }}
          >
            <span>View</span>
            <ArrowUpRight size={14} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const displayedProjects = showAll ? projects : projects.slice(0, 3);
  const hasMoreProjects = projects.length > 3;

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ... (GSAP logic omitted, assumed unchanged from previous view) ...
  // CSS Sticky Calculation
  const stackHeight = 500; // Height of the card stack
  const scrollDistance = (displayedProjects.length - 1) * 500;
  const sectionHeight = isMobile ? stackHeight + scrollDistance + 300 : "auto";

  // GSAP ScrollTrigger for mobile rummy card stacking
  useLayoutEffect(() => {
    // Register plugin
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px)", () => {
      // Clean up any potential scroll interfering styles
      ScrollTrigger.normalizeScroll(false);

      if (!containerRef.current || !sectionRef.current) return;

      const cards = cardsRef.current.filter(Boolean);
      if (cards.length === 0) return;

      // Ensure container has height for sticky to work with absolute children
      gsap.set(containerRef.current, { height: stackHeight });

      // Set initial state for cards
      cards.forEach((card, i) => {
        gsap.set(card, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: i + 1,
          boxShadow: "0 -20px 60px -15px rgba(0,0,0,0.8)",
          y: i === 0 ? "0%" : "250%",
          rotation: i === 0 ? 1.5 : i % 2 === 0 ? 10 : -10,
        });
      });

      // Animation Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current, // Use the SECTION as the trigger
          start: "top 200px", // Lowered pinning position
          // End 100px BEFORE the unpin point to ensure animation finishes
          // 200 (top offset) + stackHeight (height of sticky) + 100 (buffer)
          end: `bottom ${200 + stackHeight + 100}px`,
          scrub: 0.5, // Reduced scrub for faster visual response
          preventOverlaps: true,
          invalidateOnRefresh: true,
        },
      });

      // Animate base card
      tl.to(
        cards[0],
        {
          rotation:
            (Math.random() * 1.5 + 1.5) * (Math.random() > 0.5 ? 1 : -1),
          ease: "none",
          duration: cards.length - 1,
        },
        0,
      );

      // Animate stack
      cards.slice(1).forEach((card, i) => {
        const cardIndex = i + 1;
        const endRotation =
          (Math.random() * 1.5 + 1.5) * (i % 2 === 0 ? 1 : -1);

        tl.to(
          card,
          {
            y: `${cardIndex * 18}%`,
            rotation: endRotation,
            ease: "none",
            duration: 1,
          },
          i,
        );
      });

      return () => {
        // cleanup
      };
    });

    return () => mm.revert();
  }, [showAll, displayedProjects.length]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={
        isMobile
          ? "section relative flex flex-col"
          : "section relative overflow-hidden"
      }
      style={{
        minHeight: isMobile ? `${sectionHeight}px` : "auto",
        paddingBottom: isMobile ? 0 : undefined,
      }}
    >
      {/* ... Background ... */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[150px]" />
      </div>
      <div
        className={`container relative z-10 ${isMobile ? "flex flex-col flex-1" : ""}`}
      >
        <SectionHeader
          title="Featured Projects"
          subtitle="Explore My Work"
          centered
        />

        {/* Projects Container */}
        <div
          ref={containerRef}
          className={
            isMobile
              ? "relative w-full"
              : "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          }
          style={
            isMobile
              ? {
                  position: "sticky",
                  top: "200px",
                  height: `${stackHeight}px`,
                  // Ensure it doesn't overflow horizontally
                  overflow: "visible",
                }
              : {}
          }
        >
          {displayedProjects.map((project, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={isMobile ? "w-full px-2" : ""}
              style={
                isMobile
                  ? {
                      backgroundColor: "#0a0a0a",
                      borderRadius: "16px",
                      zIndex: index + 10,
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }
                  : {}
              }
            >
              <ProjectCard
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
                isMobile={isMobile}
                totalCards={displayedProjects.length}
              />
            </div>
          ))}
        </div>

        {/* Show More / Jump to Next Section */}
        {hasMoreProjects && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* ... rest of show more button ... */}
            {!showAll ? (
              <motion.button
                onClick={() => setShowAll(true)}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-secondary font-medium">
                  View All Projects
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/50 text-sm font-semibold">
                  {projects.length - 3} more
                </span>
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronDown size={18} className="text-white/50" />
                </motion.div>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setShowAll(false)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-secondary text-sm font-medium">
                  Show Less
                </span>
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
      {/* Project Details Modal */}
      {/* ... (Modal stays mostly matching existing, but let's make sure we include proper imports) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-surface via-surface to-surface-elevated rounded-3xl border border-white/10 scrollbar-hide"
              style={{ boxShadow: "0 50px 100px -20px rgba(0,0,0,0.9)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-primary transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content Grid - Mobile First */}
              <div className="flex flex-col lg:grid lg:grid-cols-5">
                {/* Left: Carousel (3 cols on desktop) */}
                <div className="lg:col-span-3 p-4 sm:p-6 lg:p-8 bg-black/20">
                  <PerspectiveCarousel
                    images={selectedProject.images}
                    title={selectedProject.title}
                  />
                </div>

                {/* Right: Details (2 cols on desktop) */}
                <div className="lg:col-span-2 p-4 sm:p-6 lg:p-8 flex flex-col">
                  {/* Title */}
                  <h2 className="text-2xl lg:text-3xl font-bold font-display text-primary mb-6">
                    {selectedProject.title}
                  </h2>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {(selectedProject.demoUrl || selectedProject.link) && (
                      <a
                        href={selectedProject.demoUrl || selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors text-sm"
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-primary font-medium rounded-xl hover:bg-white/20 transition-colors text-sm border border-white/20"
                      >
                        <Github size={16} /> Source Code
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-6 flex-1 min-h-0">
                    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-3">
                      <Briefcase size={14} />
                      About
                    </div>
                    <div className="max-h-[200px] lg:max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <p className="text-secondary leading-relaxed text-sm whitespace-pre-line">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-4">
                      <Code2 size={14} />
                      Built With
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(selectedProject.technologies)
                        ? selectedProject.technologies
                        : selectedProject.technologies
                            ?.split(",")
                            .map((t) => t.trim()) || []
                      ).map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 border border-white/10 text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
export default Projects;
