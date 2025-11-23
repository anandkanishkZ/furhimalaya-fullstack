'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface Testimonial {
  id: string;
  clientName: string;
  position?: string;
  company?: string;
  content: string;
  imageUrl?: string;
  rating: number;
  featured: boolean;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
  slidesPerView?: number;
  effect?: 'slide' | 'coverflow' | 'fade';
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  autoplay = true,
  showNavigation = true,
  showPagination = true,
  slidesPerView = 1,
  effect = 'slide'
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Early return if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No testimonials available.</p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    },
    hover: {
      scale: 1.02,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        <Star
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      </motion.div>
    ));
  };

  const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="relative h-full"
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 h-full border border-gray-100 overflow-hidden group">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-12 transition-transform duration-500 group-hover:rotate-45">
          <Quote className="w-full h-full text-blue-600" />
        </div>

        {/* Quote Icon */}
        <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Quote className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-16">
          {/* Rating */}
          <motion.div 
            className="flex items-center gap-1 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {renderStars(testimonial.rating)}
          </motion.div>

          {/* Testimonial Text */}
          <motion.p
            className="text-gray-700 text-lg leading-relaxed mb-6 italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            "{testimonial.content}"
          </motion.p>

          {/* Client Info */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Avatar */}
            <div className="relative">
              {testimonial.imageUrl ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg">
                  <Image
                    src={testimonial.imageUrl}
                    alt={testimonial.clientName}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
              )}
              
              {/* Online indicator for featured testimonials */}
              {testimonial.featured && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* Client Details */}
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                {testimonial.clientName}
              </h4>
              <p className="text-gray-600 text-sm">
                {testimonial.position}
                {testimonial.company && testimonial.position && ', '}
                {testimonial.company && (
                  <span className="font-medium text-blue-600">
                    {testimonial.company}
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Featured Badge */}
        {testimonial.featured && (
          <motion.div
            className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          >
            ⭐ Featured
          </motion.div>
        )}

        {/* Hover Effect Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      </div>
    </motion.div>
  );

  if (!testimonials || testimonials.length === 0) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-gray-500 text-lg">No testimonials available at the moment.</div>
      </motion.div>
    );
  }

  // Handle single testimonial case - no need for carousel
  if (testimonials.length === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <TestimonialCard testimonial={testimonials[0]} index={0} />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style jsx global>{`
        .testimonials-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #e5e7eb;
          opacity: 1;
          margin: 0 6px;
          transition: all 0.3s ease;
        }
        
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          transform: scale(1.2);
        }
        
        .testimonials-swiper .swiper-button-next,
        .testimonials-swiper .swiper-button-prev {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          opacity: 0;
          transform: scale(0.8);
        }
        
        .testimonials-swiper:hover .swiper-button-next,
        .testimonials-swiper:hover .swiper-button-prev {
          opacity: 1;
          transform: scale(1);
        }
        
        .testimonials-swiper .swiper-button-next:hover,
        .testimonials-swiper .swiper-button-prev:hover {
          background: #3b82f6;
          transform: scale(1.1);
        }
        
        .testimonials-swiper .swiper-button-next:after,
        .testimonials-swiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
          color: #3b82f6;
          transition: color 0.3s ease;
        }
        
        .testimonials-swiper .swiper-button-next:hover:after,
        .testimonials-swiper .swiper-button-prev:hover:after {
          color: white;
        }

        .testimonials-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        className="testimonials-swiper"
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides={effect === 'coverflow'}
        loop={testimonials.length >= 3} // Only enable loop if we have enough slides
        loopAdditionalSlides={1}
        autoplay={
          autoplay && testimonials.length > 1
            ? {
                delay: isHovered ? 8000 : 4000, // Slower autoplay to reduce blinking
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                waitForTransition: true, // Wait for transition to complete
              }
            : false
        }
        speed={800} // Smoother transition speed
        navigation={showNavigation}
        pagination={
          showPagination
            ? {
                clickable: true,
                dynamicBullets: true,
                renderBullet: function (index, className) {
                  return '<span class="' + className + '"></span>';
                },
              }
            : false
        }
        effect={effect}
        coverflowEffect={
          effect === 'coverflow'
            ? {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }
            : undefined
        }
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: testimonials.length >= 2, // Adjust loop based on screen size
          },
          768: {
            slidesPerView: Math.min(2, testimonials.length),
            spaceBetween: 30,
            loop: testimonials.length >= 4, // Need more slides for multiple view
          },
          1024: {
            slidesPerView: Math.min(3, testimonials.length),
            spaceBetween: 30,
            loop: testimonials.length >= 6, // Need even more slides for triple view
          },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        watchOverflow={true} // Disable swiper when there are no enough slides
        observer={true} // Update swiper when content changes
        observeParents={true}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={testimonial.id || index}>
            <TestimonialCard testimonial={testimonial} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom indicators for mobile */}
      <motion.div
        className="flex justify-center mt-8 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => {
                // Handle manual navigation if needed
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 rounded-full opacity-40 blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </motion.div>
  );
};

export default TestimonialsCarousel;