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

  // Auto-slide functionality - only for database slides
  useEffect(() => {
    // Don't auto-slide for fallback video or single slides
    if (slides.length <= 1 || slides[0]?.id === 'fallback-video') return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Track slide view
  useEffect(() => {
    if (slides.length > 0 && slides[currentSlide]?.id) {
      const slideId = slides[currentSlide].id;
      
      // Only track views for real slides, not default/fallback slides
      if (slideId && !slideId.startsWith('default-')) {
        fetch(`/api/hero-slides/${slideId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'view' }),
        }).catch(err => console.error('Error tracking view:', err));
      }
    }
  }, [currentSlide, slides]);

  // Default fallback - Only video when no database data
  const getDefaultSlides = (): Slide[] => [
    {
      id: 'fallback-video',
      title: 'Furhimalaya',
      subtitle: 'Heritage Collection', 
      description: 'Experience authentic Himalayan Pashmina craftsmanship',
      imageUrl: '', // No image needed for video-only
      videoUrl: 'https://youtu.be/ioWJ34PODR0',
      videoType: 'youtube',
      imageAlt: 'Furhimalaya Video',
      textAlign: 'center',
      textColor: '#ffffff',
      overlayOpacity: 0.1, // Minimal overlay for video-only mode
      // No buttons for fallback video
      primaryButtonText: undefined,
      primaryButtonUrl: undefined,
      secondaryButtonText: undefined,
      secondaryButtonUrl: undefined
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
      // Only track clicks for real slides, not default/fallback slides
      if (slideId && !slideId.startsWith('default-')) {
        await fetch(`/api/hero-slides/${slideId}/track-click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            url: url,
            timestamp: new Date().toISOString()
          }),
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

  // Show loading skeleton while fetching data
  if (loading) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden -mt-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10 flex items-center">
          <div className="max-w-4xl w-full space-y-6 animate-pulse">
            <div className="h-12 bg-gray-700 rounded-lg w-3/4"></div>
            <div className="h-8 bg-gray-600 rounded-lg w-2/3"></div>
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
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

          {/* Hide text content for fallback video - show only video */}
          {slide.id !== 'fallback-video' && (
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
          )}
        </div>
      ))}

      {/* Navigation Dots - hidden for fallback video */}
      {slides.length > 1 && slides[0]?.id !== 'fallback-video' && (
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