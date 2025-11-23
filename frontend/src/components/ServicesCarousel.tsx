'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import ServiceCard from './ServiceCard';
import { useServices } from '@/hooks/useServices';

// Skeleton loading component for carousel
const SkeletonServiceCard = () => (
  <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 animate-pulse">
    {/* Icon Skeleton */}
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full mb-4 sm:mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
    </div>
    
    {/* Title Skeleton */}
    <div className="mb-3 sm:mb-4 space-y-2">
      <div className="h-6 sm:h-7 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
      <div className="h-6 sm:h-7 w-2/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
    </div>
    
    {/* Description Skeleton */}
    <div className="space-y-2">
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
  </div>
);

interface ServicesCarouselProps {
  showNavigation?: boolean;
  showPagination?: boolean;
  autoplay?: boolean;
  className?: string;
  limit?: number;
}

const ServicesCarousel: React.FC<ServicesCarouselProps> = ({
  showNavigation = true,
  showPagination = true,
  autoplay = true,
  className = '',
  limit = 6
}) => {
  const { services, loading, error } = useServices({ 
    activeOnly: true, 
    limit 
  });

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <SkeletonServiceCard key={i} />
        ))}
      </div>
    );
  }

  // If error or no services, show skeleton instead of error message
  if (error || !services || services.length === 0) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <SkeletonServiceCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`services-carousel-container relative ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
          enabled: showNavigation,
        }}
        pagination={{
          clickable: true,
          enabled: showPagination,
          dynamicBullets: true,
        }}
        autoplay={autoplay ? {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        loop={services.length > 2}
        effect="coverflow"
        coverflowEffect={{
          rotate: 8,
          stretch: 0,
          depth: 80,
          modifier: 1,
          slideShadows: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 25,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="services-swiper"
      >
        {services.map((service) => (
          <SwiperSlide key={service.id} className="h-auto">
            <ServiceCard
              title={service.title}
              description={service.description}
              iconName={service.icon}
              link="/services"
              showFeatures={false}
              showLearnMore={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {showNavigation && services.length > 3 && (
        <>
          <button
            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border hover:shadow-xl transition-all duration-300 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border hover:shadow-xl transition-all duration-300 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            aria-label="Next service"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .services-swiper .swiper-pagination {
          position: relative !important;
          margin-top: 1.5rem;
        }
        
        .services-swiper .swiper-pagination-bullet {
          background-color: #e5e7eb;
          opacity: 1;
          width: 10px;
          height: 10px;
        }
        
        .services-swiper .swiper-pagination-bullet-active {
          background-color: #2563eb;
          transform: scale(1.2);
        }
        
        .services-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
        
        .services-carousel-container {
          padding: 0 2rem;
        }
        
        @media (max-width: 768px) {
          .services-carousel-container {
            padding: 0 1rem;
          }
          
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesCarousel;