'use client';

import { useState, useEffect } from 'react';
import HeroSlider from '@/components/HeroSlider';
import SectionTitle from '@/components/SectionTitle';
import ServicesCarousel from '@/components/ServicesCarousel';
import UniqueProjectsCarousel from '@/components/UniqueProjectsCarousel';
import SimpleTestimonialsCarousel from '@/components/SimpleTestimonialsCarousel';
import ClientCarousel from '@/components/ClientCarousel';
import Button from '@/components/Button';
import { useSetting } from '@/hooks/useSiteSettings';
import { apiClient } from '@/utils/admin/apiClient';
import {
  Sparkles,
  Award,
  Heart,
  Star,
  Mountain,
  Scissors,
  Clock,
  Users,
  Globe,
  ArrowRight,
  Play,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  // Dynamic content from settings
  const companyName = useSetting('company_name', 'Furhimalaya');
  const companyTagline = useSetting('company_tagline', 'Weaving Dreams, Crafting Heritage');
  const companyDescription = useSetting('company_description', 'Discover the timeless artistry of authentic Himalayan Pashmina, where centuries of tradition meet contemporary luxury.');

  // Dynamic statistics from settings
  const pashminasCrafted = useSetting('stats_pashminas_crafted', '500');
  const masterArtisans = useSetting('stats_master_artisans', '12');
  const yearsOfHeritage = useSetting('stats_years_heritage', '25');
  const globalClients = useSetting('stats_global_clients', '150');

  // State for testimonials
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Fetch testimonials on component mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.getPublicTestimonials({ 
          limit: 10  // Fetch ALL testimonials, not just featured
        });
        
        if (response.success) {
          setTestimonials(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Fallback testimonials if none are found
  const fallbackTestimonials = [
    {
      id: 'fallback-1',
      clientName: 'Sarah Chen',
      position: 'Fashion Director',
      company: 'Luxury Collections NYC',
      content: 'The Furhimalaya Pashmina I purchased is absolutely exquisite. The craftsmanship is unparalleled, and you can truly feel the heritage and artistry woven into every fiber. A treasure I will cherish forever.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      status: 'ACTIVE' as const,
      featured: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'fallback-2',
      clientName: 'James Morrison',
      position: 'Collector',
      company: 'Heritage Textiles London',
      content: 'In over 30 years of collecting fine textiles, I have never encountered such authentic and beautifully crafted Pashmina. Furhimalaya represents the pinnacle of Himalayan artistry.',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      status: 'ACTIVE' as const,
      featured: true,
      createdAt: '',
      updatedAt: '',
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <>
      <HeroSlider />

      {/* Luxury Heritage Section */}
      <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-50 via-white to-amber-50"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand-primary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-100 rounded-full border border-brand-primary-200">
                  <Sparkles className="w-4 h-4 text-brand-primary-600" />
                  <span className="text-brand-primary-700 font-semibold text-sm">
                    HIMALAYAN HERITAGE SINCE 1999
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-brand-primary-800 via-brand-primary-600 to-amber-600 bg-clip-text text-transparent">
                    Furhimalaya
                  </span>
                  <br />
                  <span className="text-gray-900">{companyTagline}</span>
                </h1>
                
                <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
                  {companyDescription}
                </p>
              </div>

              {/* Luxury Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-brand-primary-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Authentic Himalayan Craftsmanship
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Each Pashmina is handwoven by master artisans using traditional techniques passed down through generations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-brand-primary-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Ethically Sourced Materials
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Premium cashmere sourced directly from high-altitude goats in the pristine Himalayan regions
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button href="/about" variant="primary" className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold">
                  Discover Our Heritage
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button href="/services" variant="outline" className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold">
                  <Play className="w-5 h-5" />
                  Watch Our Story
                </Button>
              </div>
            </div>

            {/* Right Visual Content */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Master Artisan Weaving Luxury Pashmina - Furhimalaya Heritage"
                  className="w-full h-[600px] object-cover"
                  width={800}
                  height={600}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Heritage Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-full flex items-center justify-center">
                      <Mountain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-primary-700">HIMALAYAN</p>
                      <p className="text-sm font-bold text-gray-900">AUTHENTICITY</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-3xl shadow-2xl p-8 border border-brand-primary-100">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 bg-clip-text text-transparent">
                      {pashminasCrafted}+
                    </div>
                    <div className="text-xs text-gray-600 font-medium mt-1">Luxury Pieces</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                      {yearsOfHeritage}+
                    </div>
                    <div className="text-xs text-gray-600 font-medium mt-1">Years Heritage</div>
                  </div>
                </div>
              </div>
              
              {/* Quality Assurance Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-br from-brand-primary-600 to-brand-primary-700 rounded-2xl p-4 shadow-xl">
                <div className="text-center text-white">
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-bold">100%</p>
                  <p className="text-xs font-medium">AUTHENTIC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Collections Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-brand-primary-50 to-amber-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-brand-primary-200 mb-6">
              <Scissors className="w-4 h-4 text-brand-primary-600" />
              <span className="text-brand-primary-700 font-semibold text-sm">
                LUXURY COLLECTIONS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Uncompromising <span className="bg-gradient-to-r from-brand-primary-600 to-amber-600 bg-clip-text text-transparent">Quality</span>
            </h2>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-4xl mx-auto">
              The Hallmarks of True Pashmina. Every piece we create is a testament to the rich heritage of Himalayan craftsmanship. We are committed to preserving the traditional art of Pashmina making, from ethical sourcing to the final, luxurious touch.
            </p>
          </div>

          <ServicesCarousel 
            showNavigation={true}
            showPagination={true}
            autoplay={true}
            limit={6}
            className="mt-8 sm:mt-12"
          />
        </div>
      </section>

      {/* Master Artisans & Global Reach Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-primary-100 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-100 to-transparent rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-100 rounded-full border border-brand-primary-200 mb-6">
              <Users className="w-4 h-4 text-brand-primary-600" />
              <span className="text-brand-primary-700 font-semibold text-sm">
                MASTER ARTISANS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Global <span className="bg-gradient-to-r from-brand-primary-600 to-amber-600 bg-clip-text text-transparent">Recognition</span>
            </h2>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
              Our heritage pieces are treasured by connoisseurs worldwide, from luxury boutiques in Paris to collectors in Tokyo.
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Scissors className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 bg-clip-text text-transparent mb-2">
                {pashminasCrafted}+
              </div>
              <div className="text-gray-600 font-medium">Luxury Pieces Crafted</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-2">
                {masterArtisans}+
              </div>
              <div className="text-gray-600 font-medium">Master Artisans</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 bg-clip-text text-transparent mb-2">
                {globalClients}+
              </div>
              <div className="text-gray-600 font-medium">Global Clients</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                {yearsOfHeritage}+
              </div>
              <div className="text-gray-600 font-medium">Years of Heritage</div>
            </div>
          </div>
          
          {/* Quality Promise */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-brand-primary-50 to-amber-50 rounded-3xl p-8 sm:p-12 border border-brand-primary-200 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">100% Authentic</h3>
                  <p className="text-gray-600 text-sm">Certified Himalayan origin</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Ethically Made</h3>
                  <p className="text-gray-600 text-sm">Fair trade practices</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Lifetime Quality</h3>
                  <p className="text-gray-600 text-sm">Heirloom craftsmanship</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Masterpieces Gallery Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-brand-primary-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-brand-primary-200 mb-6">
              <Star className="w-4 h-4 text-brand-primary-600" />
              <span className="text-brand-primary-700 font-semibold text-sm">
                LUXURY MASTERPIECES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Exquisite <span className="bg-gradient-to-r from-brand-primary-600 to-amber-600 bg-clip-text text-transparent">Creations</span>
            </h2>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
              Explore our gallery of bespoke Pashmina masterpieces, each telling a unique story of tradition, luxury, and artisanal excellence.
            </p>
          </div>

          <UniqueProjectsCarousel
            limit={8}
            showFilters={true}
            className="mt-6 sm:mt-8"
          />
        </div>
      </section>

      {/* Our Trusted Clients Section - Only show if there are clients */}
      <ClientCarousel 
        title="Our Trusted Clients"
        subtitle="Proud to partner with industry leaders who value authentic craftsmanship"
        backgroundStyle="gradient"
        conditionalRendering={true}
      />

      {/* Luxury Client Stories Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-brand-primary-900 via-gray-900 to-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-brand-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-64 h-64 sm:w-96 sm:h-96 bg-brand-primary-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Heart className="w-4 h-4 text-brand-primary-300" />
              <span className="text-brand-primary-300 font-semibold text-sm">
                CLIENT STORIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Cherished <span className="bg-gradient-to-r from-brand-primary-300 to-amber-300 bg-clip-text text-transparent">Testimonials</span>
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
              Discover why our clients consider their Furhimalaya pieces to be treasured heirlooms, passed down through generations.
            </p>
          </div>

          <div className="max-w-7xl mx-auto mt-8 sm:mt-12">
            <SimpleTestimonialsCarousel
              testimonials={displayTestimonials}
              loading={testimonialsLoading}
            />
          </div>
        </div>
      </section>
      
      {/* Luxury Call-to-Action Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-white via-brand-primary-50 to-amber-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-3xl mb-8 shadow-2xl">
              <Mountain className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Begin Your <span className="bg-gradient-to-r from-brand-primary-600 to-amber-600 bg-clip-text text-transparent">Luxury Journey</span>
            </h2>
            
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
              Experience the pinnacle of Himalayan craftsmanship. Each Furhimalaya piece is a testament to centuries of artisanal heritage, creating luxury that transcends time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button href="/services" variant="primary" className="group px-10 py-4 text-lg font-semibold">
                <span className="flex items-center gap-3">
                  Explore Collections
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button href="/contact" variant="outline" className="group px-10 py-4 text-lg font-semibold">
                <span className="flex items-center gap-3">
                  Visit Our Atelier
                  <Mountain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-70">
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-brand-primary-600" />
                <span className="text-sm font-medium">Free Global Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-brand-primary-600" />
                <span className="text-sm font-medium">Authenticity Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-brand-primary-600" />
                <span className="text-sm font-medium">Lifetime Care Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}