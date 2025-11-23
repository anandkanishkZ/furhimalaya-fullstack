'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from './Button';
import { API_CONFIG, buildApiUrl } from '@/config/api';

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'direct';
  imageAlt?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  textAlign: string;
  textColor: string;
  overlayOpacity: number;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        console.log('Fetching hero slides...');
        
        const response = await fetch(buildApiUrl('/hero-slides/'), {
          cache: 'no-store' // Ensure fresh data
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Hero slides response:', data);
          
          const activeSlides = data.data || [];
          console.log('Active slides count:', activeSlides.length);
          
          if (activeSlides.length > 0) {
            console.log('Setting dynamic slides:', activeSlides);
            setSlides(activeSlides);
          } else {
            console.log('No active slides found, using default slides');
            // Fallback to default slides if no active slides found
            setSlides(getDefaultSlides());
          }
        } else {
          console.error('Failed to fetch hero slides, using default slides');
          setSlides(getDefaultSlides());
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        setSlides(getDefaultSlides());
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Track slide view
  useEffect(() => {
    if (slides.length > 0 && slides[currentSlide]?.id) {
      // Track view for analytics
      fetch(`/api/hero-slides/${slides[currentSlide].id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(err => console.error('Error tracking view:', err));
    }
  }, [currentSlide, slides]);

  // Default fallback slides - Only video promo
  const getDefaultSlides = (): Slide[] => [
    {
      id: 'default-video',
      title: 'Furhimalaya',
      subtitle: 'Heritage Collection',
      description: 'Experience the timeless artistry of authentic Himalayan Pashmina. Witness the meticulous craftsmanship of our master artisans as they weave centuries of tradition into luxurious pieces.',
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      videoUrl: 'https://youtu.be/ioWJ34PODR0',
      videoType: 'youtube',
      imageAlt: 'Furhimalaya Heritage Pashmina Craftsmanship',
      primaryButtonText: 'Explore Collections',
      primaryButtonUrl: '/services',
      secondaryButtonText: 'Visit Atelier',
      secondaryButtonUrl: '/contact',
      textAlign: 'left',
      textColor: '#ffffff',
      overlayOpacity: 0.5
    }
  ];

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handle button click tracking
  const handleButtonClick = async (slideId: string, url: string) => {
    try {
      // Track click for analytics
      if (slideId && slideId !== 'default-1' && slideId !== 'default-2' && slideId !== 'default-3') {
        await fetch(`/api/hero-slides/${slideId}/track-click`, {
          method: 'POST'
        });
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
    
    // Navigate to URL
    if (url.startsWith('/')) {
      window.location.href = url;
    } else if (url.startsWith('http')) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden -mt-24">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Skeleton Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
          <div className="flex items-center h-full pt-24">
            <div className="max-w-4xl w-full">
              {/* Skeleton Title */}
              <div className="space-y-4 animate-pulse">
                <div className="h-8 sm:h-10 md:h-12 lg:h-16 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg w-3/4 animate-shimmer"></div>
                <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-lg w-2/3 animate-shimmer animation-delay-200"></div>
                
                {/* Skeleton Description */}
                <div className="hidden sm:block space-y-3 pt-4">
                  <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-full animate-shimmer animation-delay-300"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-5/6 animate-shimmer animation-delay-400"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-4/6 animate-shimmer animation-delay-500"></div>
                </div>

                {/* Skeleton Buttons */}
                <div className="hidden sm:flex flex-col sm:flex-row gap-3 sm:gap-4 pt-8">
                  <div className="h-12 sm:h-14 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 rounded-lg w-40 animate-shimmer animation-delay-600"></div>
                  <div className="h-12 sm:h-14 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-lg w-40 animate-shimmer animation-delay-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Navigation Dots */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 animate-pulse">
          <div className="w-8 h-3 bg-blue-500 rounded-full animate-shimmer"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full animate-shimmer animation-delay-100"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full animate-shimmer animation-delay-200"></div>
        </div>

        {/* Loading Text (Optional) */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
          <p className="text-gray-400 text-sm animate-pulse">Loading hero slider...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-brand-primary-900 via-gray-900 to-black flex items-center justify-center -mt-24 pt-24">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-primary-300 to-white bg-clip-text text-transparent">
            Furhimalaya
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-300">
            Weaving Dreams, Crafting Heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/services" variant="primary">Explore Collections</Button>
            <Button href="/contact" variant="outline">Visit Our Atelier</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden -mt-24">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0">
            {/* Video Background (YouTube) */}
            {slide.videoUrl && slide.videoType === 'youtube' && getYouTubeVideoId(slide.videoUrl) ? (
              <div className="relative w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(slide.videoUrl)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeVideoId(slide.videoUrl)}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
                  title={slide.imageAlt || slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    width: '100vw',
                    height: '56.25vw', // 16:9 aspect ratio
                    minHeight: '100vh',
                    minWidth: '177.77vh', // 16:9 aspect ratio
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%'
                  }}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen={false}
                />
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: slide.overlayOpacity }}
                ></div>
              </div>
            ) : (
              <>
                <Image
                  src={API_CONFIG.getImageUrl(slide.imageUrl)}
                  alt={slide.imageAlt || slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized={true}
                  onError={(e) => {
                    const processedUrl = API_CONFIG.getImageUrl(slide.imageUrl);
                    console.error('❌ Failed to load slide image');
                    console.error('  Original path:', slide.imageUrl);
                    console.error('  Processed URL:', processedUrl);
                    console.error('  API Base:', API_CONFIG.API_BASE);
                    console.error('  Server Base:', API_CONFIG.BASE_URL);
                  }}
                  onLoad={() => {
                    const processedUrl = API_CONFIG.getImageUrl(slide.imageUrl);
                    console.log('✅ Successfully loaded slide image');
                    console.log('  Original path:', slide.imageUrl);
                    console.log('  Processed URL:', processedUrl);
                  }}
                />
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: slide.overlayOpacity }}
                ></div>
              </>
            )}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
            <div className="flex items-center h-full pt-24">
              <div 
                className={`max-w-5xl w-full ${
                  slide.textAlign === 'center' ? 'mx-auto text-center' :
                  slide.textAlign === 'right' ? 'ml-auto text-right' :
                  'text-left'
                }`}
                style={{ color: slide.textColor }}
              >
                {/* Enhanced luxury styling for video slide */}
                {slide.videoUrl ? (
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-fade-in">
                      <div className="w-2 h-2 bg-brand-primary-400 rounded-full"></div>
                      <span className="text-brand-primary-300 font-semibold text-sm">HIMALAYAN HERITAGE</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in delay-200">
                      <span className="bg-gradient-to-r from-brand-primary-300 via-white to-brand-primary-200 bg-clip-text text-transparent">
                        {slide.title}
                      </span>
                    </h1>
                    {slide.subtitle && (
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-primary-400 to-amber-400 bg-clip-text text-transparent animate-fade-in delay-300">
                        {slide.subtitle}
                      </h2>
                    )}
                    <p className="max-w-3xl text-lg sm:text-xl text-gray-200 leading-relaxed animate-fade-in delay-400">
                      {slide.description}
                    </p>
                  </div>
                ) : (
                  <>
                    <h1 className="pt-4 sm:pt-6 pb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight animate-fade-in">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <h2 className="inline-block mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-brand-primary-400 to-amber-400 bg-clip-text text-transparent animate-fade-in delay-200">
                        {slide.subtitle}
                      </h2>
                    )}
                    <p className="hidden sm:block max-w-full sm:max-w-3xl pb-8 sm:pb-12 text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed animate-fade-in delay-300">
                      {slide.description}
                    </p>
                  </>
                )}
                <div className="hidden sm:flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in delay-500">
                  {slide.primaryButtonText && slide.primaryButtonUrl && (
                    <Button 
                      href={slide.primaryButtonUrl}
                      variant="primary"
                      className="group px-8 py-4 text-lg font-semibold"
                      onClick={() => handleButtonClick(slide.id, slide.primaryButtonUrl!)}
                    >
                      {slide.primaryButtonText}
                    </Button>
                  )}
                  {slide.secondaryButtonText && slide.secondaryButtonUrl && (
                    <Button 
                      href={slide.secondaryButtonUrl}
                      variant="outline"
                      className="group px-8 py-4 text-lg font-semibold"
                      onClick={() => handleButtonClick(slide.id, slide.secondaryButtonUrl!)}
                    >
                      {slide.secondaryButtonText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-brand-primary w-6 sm:w-8'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}

    </div>
  );
}