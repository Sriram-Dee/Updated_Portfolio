import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = project.images && project.images.length > 0 
    ? project.images 
    : ['https://via.placeholder.com/800x450?text=No+Image+Available'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-secondary rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-700 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-accent transition z-10"
          >
            <X size={24} />
          </button>

          {/* Image Gallery */}
          <div className="relative h-64 md:h-96 bg-black flex items-center justify-center overflow-hidden rounded-t-2xl">
            <img 
              src={images[currentImageIndex]} 
              alt={`${project.name} screenshot ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 p-2 bg-black/50 rounded-full text-white hover:bg-accent transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 p-2 bg-black/50 rounded-full text-white hover:bg-accent transition"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-accent' : 'bg-gray-500'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
            <p className="text-accent mb-6">{project.technologies}</p>
            
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300 text-lg leading-relaxed">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-accent text-primary font-bold rounded-full hover:bg-opacity-90 transition"
                >
                  Visit Project
                </a>
              )}
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 border border-accent text-accent font-bold rounded-full hover:bg-accent hover:text-primary transition"
                >
                  View Code
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
