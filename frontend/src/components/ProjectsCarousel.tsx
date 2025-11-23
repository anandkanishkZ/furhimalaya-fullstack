'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, Thumbs } from 'swiper/modules';
import { Loader2, ChevronLeft, ChevronRight, Calendar, MapPin, User, Award, Filter, X } from 'lucide-react';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/thumbs';

import { useProjects } from '@/hooks/useProjects';

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
  technologies?: string[];
  achievements?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  featured?: boolean;
}

interface ProjectsCarouselProps {
  showNavigation?: boolean;
  showPagination?: boolean;
  autoplay?: boolean;
  className?: string;
  limit?: number;
  featuredOnly?: boolean;
  showCategoryFilter?: boolean;
}

const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({
  showNavigation = true,
  showPagination = true,
  autoplay = false,
  className = '',
  limit = 8,
  featuredOnly = false,
  showCategoryFilter = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { projects, categories, loading, error } = useProjects({ 
    activeOnly: true, 
    limit,
    featured: featuredOnly,
    category: selectedCategory
  });

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-20 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-20 ${className}`}>
        <p className="text-red-600 mb-4">Failed to load projects</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className={`text-center py-20 ${className}`}>
        <p className="text-gray-600">No projects available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={`projects-carousel-container relative ${className}`}>
      {/* Category Filter */}
      {showCategoryFilter && categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              !selectedCategory 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Projects
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev-projects',
          nextEl: '.swiper-button-next-projects',
          enabled: showNavigation,
        }}
        pagination={{
          clickable: true,
          enabled: showPagination,
          dynamicBullets: true,
        }}
        autoplay={autoplay ? {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        loop={projects.length > 2}
        effect="coverflow"
        coverflowEffect={{
          rotate: 15,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        className="projects-swiper"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id} className="h-auto">
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {showNavigation && projects.length > 2 && (
        <>
          <button
            className="swiper-button-prev-projects absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 bg-white rounded-full shadow-xl border hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            className="swiper-button-next-projects absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-14 h-14 bg-white rounded-full shadow-xl border hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            aria-label="Next project"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .projects-swiper .swiper-pagination {
          position: relative !important;
          margin-top: 2.5rem;
        }
        
        .projects-swiper .swiper-pagination-bullet {
          background-color: #e5e7eb;
          opacity: 1;
          width: 12px;
          height: 12px;
          margin: 0 6px;
        }
        
        .projects-swiper .swiper-pagination-bullet-active {
          background-color: #2563eb;
          transform: scale(1.3);
        }
        
        .projects-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
        
        .projects-carousel-container {
          padding: 0 4rem;
        }
        
        @media (max-width: 768px) {
          .projects-carousel-container {
            padding: 0 1rem;
          }
          
          .swiper-button-prev-projects,
          .swiper-button-next-projects {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

// Enhanced Project Card Component
interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden h-72">
        <Image 
          src={project.imageUrl || '/images/placeholder-project.jpg'} 
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
            {project.category}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center px-2 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </div>
          </div>
        )}

        {/* Hover Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="space-y-3">
            {project.clientName && (
              <div className="flex items-center text-sm opacity-90">
                <User className="w-4 h-4 mr-2" />
                <span>{project.clientName}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center text-sm opacity-90">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{project.location}</span>
              </div>
            )}
            {project.completionDate && (
              <div className="flex items-center text-sm opacity-90">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(project.completionDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {project.title}
        </h3>
        
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3 text-sm leading-relaxed">
          {project.shortDescription || project.description}
        </p>

        {/* Technologies/Achievements */}
        {(project.technologies || project.achievements) && (
          <div className="mb-4">
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-800 mb-2 uppercase tracking-wide">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* View Details Button */}
        <div className="mt-auto pt-4">
          <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg">
            View Project Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCarousel;