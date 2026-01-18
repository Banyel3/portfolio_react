"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
  images?: string[];
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
      // Trigger animation after a brief delay
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = "unset";
      setIsVisible(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [project]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [project, onClose]);

  if (!project) return null;

  const images = project.images && project.images.length > 0 ? project.images : [];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible 
          ? "bg-black/80 backdrop-blur-sm" 
          : "bg-black/0 backdrop-blur-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-lg border border-border shadow-2xl transition-all duration-300 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-background/80 hover:bg-background border border-border transition-all duration-200 hover:scale-110 hover:rotate-90"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-accent/10 text-accent mb-3">
              {project.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {project.title}
            </h2>
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative mb-6 rounded-lg overflow-hidden bg-muted">
              <img
                src={images[currentImageIndex]}
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                className="w-full h-64 sm:h-96 object-cover transition-opacity duration-300"
                key={currentImageIndex}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background border border-border transition-all duration-200 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background border border-border transition-all duration-200 hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 text-sm border border-border">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-sm px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(project.liveLink || project.githubLink) && (
            <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Live
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:scale-105"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
