'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay, Mousewheel, Virtual } from 'swiper/modules';
import { 
  Loader2, 
  Eye, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Zap,
  Building,
  Star,
  ArrowUpRight,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useProjects } from '@/hooks/useProjects';

interface InteractiveProjectsCarouselProps {
  className?: string;
  limit?: number;
}

const InteractiveProjectsCarousel: React.FC<InteractiveProjectsCarouselProps> = ({
  className = '',
  limit = 8
}) => {
  const { projects, loading, error, categories } = useProjects({ 
    activeOnly: true, 
    limit,
    featured: true 
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const swiperRef = useRef<any>(null);

  // Filter projects by category
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const formatBudget = (budget?: number) => {
    if (!budget) return 'Budget on request';
    if (budget >= 1000000) return `$${(budget / 1000000).toFixed(1)}M`;
    if (budget >= 1000) return `$${(budget / 1000).toFixed(0)}K`;
    return `$${budget}`;
  };

  const formatArea = (area?: number) => {
    if (!area) return 'Area TBD';
    return `${area.toLocaleString()} sq ft`;
  };

  useEffect(() => {
    if (swiperRef.current && selectedCategory !== 'All') {
      swiperRef.current.slideTo(0, 500);
      setActiveIndex(0);
    }
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-32 ${className}`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
          <p className="text-gray-600 text-lg">Loading exceptional projects...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-32 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 rounded-xl p-8 max-w-md mx-auto"
        >
          <p className="text-red-600 mb-4 font-semibold">Unable to load projects</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!filteredProjects || filteredProjects.length === 0) {
    return (
      <div className={`text-center py-32 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-gray-600"
        >
          <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">No projects found for "{selectedCategory}"</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`projects-carousel-wrapper ${className}`}>
      {/* Category Filter Pills */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {['All', ...categories].map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/25'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4 inline-block mr-2" />
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* 3D Interactive Carousel */}
      <div className="relative">
        {/* Autoplay Controls */}
        <motion.div 
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all duration-300 border border-white/20"
            aria-label={isAutoPlaying ? 'Pause autoplay' : 'Play autoplay'}
          >
            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </motion.div>

        <Swiper
          ref={swiperRef}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay, Mousewheel, Virtual]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          mousewheel={{
            thresholdDelta: 50,
            sensitivity: 1,
          }}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 2.5,
            slideShadows: true,
          }}
          autoplay={isAutoPlaying ? {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            prevEl: '.swiper-nav-prev',
            nextEl: '.swiper-nav-next',
          }}
          loop={filteredProjects.length > 2}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="projects-swiper"
        >
          {filteredProjects.map((project, index) => (
            <SwiperSlide key={project.id} className="!w-80 !h-[480px]">
              <motion.div
                className="project-card-3d group cursor-pointer h-full"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setShowDetails(showDetails === project.id ? null : project.id)}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {/* Card Container */}
                <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-2xl border border-white/50 backdrop-blur-sm">
                  
                  {/* Project Image with Overlay Effects */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={project.imageUrl || '/placeholder-project.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <motion.div 
                        className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        initial={{ scale: 0, rotate: -12 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.3 }}
                      >
                        <Star className="w-3 h-3 inline mr-1" />
                        FEATURED
                      </motion.div>
                    )}
                    
                    {/* View Project Button */}
                    <motion.div 
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <button 
                        className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300"
                        aria-label="View project details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </motion.div>
                    
                    {/* Category Tag */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                      {project.category}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                      {project.title}
                    </h3>
                    
                    {/* Project Description */}
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {project.shortDescription || project.description}
                    </p>
                    
                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="truncate">{project.location || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                        <span>{formatBudget(project.budget)}</span>
                      </div>
                      {project.clientName && (
                        <div className="flex items-center text-xs text-gray-500 col-span-2">
                          <Users className="w-4 h-4 mr-1 text-purple-500" />
                          <span className="truncate">{project.clientName}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Hover Action */}
                    <motion.div 
                      className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ y: 10 }}
                      whileHover={{ y: 0 }}
                    >
                      <span className="text-sm text-blue-600 font-medium">View Details</span>
                      <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    </motion.div>
                  </div>
                  
                  {/* Glassmorphism Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl" />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <motion.button
            className="swiper-nav-prev w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <div className="flex space-x-2">
            {filteredProjects.slice(0, Math.min(5, filteredProjects.length)).map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex % filteredProjects.length
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
          
          <motion.button
            className="swiper-nav-next w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const project = filteredProjects.find(p => p.id === showDetails);
                if (!project) return null;
                
                return (
                  <div>
                    <div className="relative h-64">
                      <Image
                        src={project.imageUrl || '/placeholder-project.jpg'}
                        alt={project.title}
                        fill
                        className="object-cover rounded-t-2xl"
                      />
                      <button
                        onClick={() => setShowDetails(null)}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
                      <p className="text-gray-600 mb-6">{project.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <h3 className="font-semibold mb-2">Project Details</h3>
                          <div className="space-y-2 text-sm">
                            <div>Category: {project.category}</div>
                            <div>Client: {project.clientName || 'Confidential'}</div>
                            <div>Location: {project.location || 'TBD'}</div>
                            <div>Area: {formatArea(project.projectArea)}</div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Technologies</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies?.slice(0, 4).map((tech, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300">
                        View Full Project Details
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style jsx global>{`
        .projects-swiper {
          padding: 50px 0;
        }
        
        .projects-swiper .swiper-slide {
          background: transparent;
        }
        
        .projects-swiper .swiper-pagination {
          display: none;
        }
        
        .project-card-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .projects-carousel-wrapper {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 2rem;
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
        }
        
        .projects-carousel-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .projects-swiper .swiper-slide {
            width: 300px !important;
          }
          
          .projects-carousel-wrapper {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveProjectsCarousel;