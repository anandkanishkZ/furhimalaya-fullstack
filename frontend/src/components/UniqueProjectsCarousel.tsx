'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, User, ExternalLink, Layers, Grid3X3, Eye, Heart, Share2, LayoutList } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import '@/styles/carousel-3d.css';

// Skeleton loading component for projects
const SkeletonProjectCard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    {/* Image Skeleton */}
    <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
    </div>
    
    {/* Content Skeleton */}
    <div className="p-4 sm:p-6">
      {/* Category Badge Skeleton */}
      <div className="mb-3 sm:mb-4">
        <div className="h-5 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      {/* Title Skeleton */}
      <div className="mb-3 space-y-2">
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
        <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
        <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      {/* Meta Info Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
        <div className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
);

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  galleryImages?: string[];
  completionDate?: string;
  clientName?: string;
  location?: string;
  status: 'ACTIVE' | 'INACTIVE';
  featured?: boolean;
  priority?: number;
}

interface UniqueProjectsCarouselProps {
  className?: string;
  limit?: number;
  showFilters?: boolean;
}

const UniqueProjectsCarousel: React.FC<UniqueProjectsCarouselProps> = ({
  className = '',
  limit = 8,
  showFilters = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | 'grid' | 'stack'>('3d');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  
  const { projects, loading, error } = useProjects({ 
    activeOnly: true, 
    limit,
    featured: true 
  });

  // Use all projects without category filtering
  const filteredProjects = projects;

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Advanced spring animations
  const springConfig = { damping: 30, stiffness: 300, mass: 0.8 };
  const rotateX = useSpring(useTransform(x, [-200, 200], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-200, 200], [-25, 25]), springConfig);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  // Auto-rotate effect
  useEffect(() => {
    if (viewMode === '3d' && filteredProjects.length > 1) {
      const interval = setInterval(nextProject, 6000);
      return () => clearInterval(interval);
    }
  }, [filteredProjects.length, viewMode]);

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonProjectCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !filteredProjects.length) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="text-6xl mb-4">🏗️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Projects Available</h3>
          <p className="text-gray-600">Check back soon for our latest projects!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10 py-8">
        {/* Header with View Modes Only */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center mb-8 px-6"
          >
            {/* View Mode Toggles */}
            <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1">
              {(['3d', 'grid', 'stack'] as const).map((mode) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-blue-100'
                  }`}
                >
                  {mode === '3d' && <Layers className="w-5 h-5" />}
                  {mode === 'grid' && <Grid3X3 className="w-5 h-5" />}
                  {mode === 'stack' && <LayoutList className="w-5 h-5" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3D Carousel View */}
        {viewMode === '3d' && (
          <div className="relative perspective-1000 h-[500px] flex items-center justify-center">
            <motion.div
              ref={containerRef}
              style={{ x, rotateX, rotateY }}
              className="relative preserve-3d"
              drag="x"
              dragConstraints={{ left: -200, right: 200 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) prevProject();
                if (info.offset.x < -100) nextProject();
              }}
            >
              {filteredProjects.map((project, index) => {
                const offset = (index - currentIndex + filteredProjects.length) % filteredProjects.length;
                const isCenter = offset === 0;
                const isAdjacent = offset === 1 || offset === filteredProjects.length - 1;
                
                return (
                  <motion.div
                    key={project.id}
                    className="absolute top-0 left-1/2 cursor-pointer preserve-3d"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isCenter ? 1 : isAdjacent ? 0.7 : 0.3,
                      scale: isCenter ? 1 : isAdjacent ? 0.8 : 0.6,
                      x: isCenter ? -200 : isAdjacent ? (offset === 1 ? 150 : -550) : 0,
                      z: isCenter ? 0 : isAdjacent ? -100 : -200,
                      rotateY: isCenter ? 0 : isAdjacent ? (offset === 1 ? -25 : 25) : 0,
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onHoverStart={() => setHoveredProject(project.id)}
                    onHoverEnd={() => setHoveredProject(null)}
                    onClick={() => {
                      if (isCenter) {
                        // Navigate to project details if it's the center card
                        window.location.href = `/projects/${project.slug}`;
                      } else {
                        // Otherwise, make it the center card
                        setCurrentIndex(index);
                      }
                    }}
                  >
                    <ProjectCard3D 
                      project={project} 
                      isCenter={isCenter}
                      isHovered={hoveredProject === project.id}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Navigation Controls */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevProject}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-white/50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextProject}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-white/50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCardGrid project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stack View */}
        {viewMode === 'stack' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center px-6"
          >
            <div className="relative w-full max-w-md">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="absolute top-0 left-0 w-full"
                  initial={{ opacity: 0, y: 100, rotate: Math.random() * 20 - 10 }}
                  animate={{
                    opacity: 1,
                    y: index * -8,
                    rotate: index * 2 - filteredProjects.length,
                    zIndex: filteredProjects.length - index,
                  }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 0, y: index * -12 }}
                >
                  <ProjectCardStack project={project} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Project Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <div className="flex gap-1">
              {filteredProjects.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {currentIndex + 1} of {filteredProjects.length}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

// 3D Project Card Component
const ProjectCard3D: React.FC<{ 
  project: Project; 
  isCenter: boolean; 
  isHovered: boolean;
}> = ({ project, isCenter, isHovered }) => (
  <motion.div
    className="w-80 h-80 relative preserve-3d"
    animate={{
      rotateY: isHovered ? 180 : 0,
    }}
    transition={{ duration: 0.6 }}
  >
    {/* Front Side */}
    <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.h3
            className="text-2xl font-bold mb-2"
            animate={{ y: isCenter ? 0 : 20, opacity: isCenter ? 1 : 0.8 }}
          >
            {project.title}
          </motion.h3>
          <p className="text-blue-200 text-sm mb-1">{project.category}</p>
          {project.location && (
            <div className="flex items-center text-xs text-gray-300 mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              {project.location}
            </div>
          )}
          {isCenter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-blue-200 mt-2"
            >
              Click to view details or hover to flip →
            </motion.div>
          )}
        </div>
      </div>
    </div>

    {/* Back Side */}
    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6">
      <h3 className="text-xl font-bold mb-4">{project.title}</h3>
      <p className="text-blue-100 text-sm mb-4 leading-relaxed">
        {project.shortDescription || project.description}
      </p>
      {project.clientName && (
        <div className="flex items-center text-sm mb-2">
          <User className="w-4 h-4 mr-2" />
          {project.clientName}
        </div>
      )}
      {project.completionDate && (
        <div className="flex items-center text-sm mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(project.completionDate).getFullYear()}
        </div>
      )}
      <div className="flex gap-2 mt-auto">
        <Link href={`/projects/${project.slug}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            View Details
          </motion.button>
        </Link>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            // Add to favorites functionality here
          }}
        >
          <Heart className="w-4 h-4" />
          Like
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Grid Project Card Component
const ProjectCardGrid: React.FC<{ project: Project }> = ({ project }) => (
  <Link href={`/projects/${project.slug}`} className="block h-full">
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
    >
      <div className="relative h-48">
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
          {project.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.shortDescription || project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                e.stopPropagation();
                // Add to favorites functionality here
              }}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button 
              className="text-gray-400 hover:text-blue-500 transition-colors"
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                e.stopPropagation();
                // Share functionality here
              }}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View Details
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

// Stack Project Card Component
const ProjectCardStack: React.FC<{ project: Project }> = ({ project }) => (
  <Link href={`/projects/${project.slug}`} className="block">
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 cursor-pointer hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          {project.imageUrl && (
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{project.title}</h3>
          <p className="text-blue-600 text-sm">{project.category}</p>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {project.shortDescription || project.description}
      </p>
      <div className="flex items-center justify-between">
        {project.location && (
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {project.location}
          </div>
        )}
        <div className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Learn More →
        </div>
      </div>
    </div>
  </Link>
);

export default UniqueProjectsCarousel;