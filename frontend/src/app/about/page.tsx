'use client';

import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import {
  CheckCircle,
  Award,
  Users,
  Briefcase,
  Target,
  Lightbulb,
  Heart,
  Linkedin,
  Mail,
  Phone,
  Star,
  Globe,
  Sparkles,
  Shield,
  Leaf,
  ArrowRight,
  Quote,
} from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import SocialMediaLinks from '@/components/SocialMediaLinks';
import BrandColorShowcase from '@/components/BrandColorShowcase';
import ClientCarousel from '@/components/ClientCarousel';
import Image from 'next/image';
import publicApiClient, { TeamMember } from '@/utils/publicApiClient';
import { useSetting } from '@/hooks/useSiteSettings';

// Skeleton loading component for team members
const SkeletonTeamCard = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    {/* Image Skeleton */}
    <div className="relative h-64 sm:h-72 md:h-80 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
    </div>
    
    {/* Content Skeleton */}
    <div className="p-4 sm:p-6">
      {/* Name Skeleton */}
      <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md mb-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
      
      {/* Position Skeleton */}
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md mb-3 sm:mb-4 w-3/4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
      
      {/* Bio Skeleton */}
      <div className="space-y-2 mb-3 sm:mb-4">
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      {/* Social Icons Skeleton */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Dynamic statistics from settings
  const yearsExperience = useSetting('stats_years_experience', '15');
  const projectsCompleted = useSetting('stats_projects_completed', '100');
  const teamMembersCount = useSetting('stats_team_members', '50');

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await publicApiClient.getTeamMembers();
      if (response.success && response.data) {
        setTeamMembers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };



  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchTeamMembers();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description:
        'Fur Himalaya was established with a vision to preserve and celebrate the authentic luxury of Himalayan Pashmina craftsmanship.',
    },
    {
      year: '2012',
      title: 'Expansion of Services',
      description:
        'Added interior design and property valuation to our service offerings to provide more comprehensive solutions.',
    },
    {
      year: '2015',
      title: 'First Major Project',
      description:
        'Completed our first major commercial project, a 20-story office building in the heart of the city.',
    },
    {
      year: '2018',
      title: 'Industry Recognition',
      description:
        'Received the prestigious Engineering Excellence Award for our innovative approach to sustainable construction.',
    },
    {
      year: '2020',
      title: 'International Expansion',
      description:
        'Expanded operations to international markets, taking on projects in neighboring countries.',
    },
    {
      year: '2023',
      title: 'Digital Transformation',
      description:
        'Implemented cutting-edge digital technologies to enhance our design and project management capabilities.',
    },
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-primary-50/30 to-brand-primary-100/50">
      {/* Hero Section - Modern Cinematic Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-900/95 via-brand-primary-800/90 to-brand-primary-700/85 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
            alt="Himalayan Landscape"
            className="w-full h-full object-cover scale-110 animate-slow-zoom"
            width={2400}
            height={1600}
          />
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-brand-primary-300/20 rounded-full animate-float"></div>
          <div className="absolute bottom-32 right-16 w-32 h-32 bg-brand-primary-200/15 rounded-full animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                  <Sparkles className="w-4 h-4 text-brand-primary-200" />
                  <span className="text-brand-primary-100 text-sm font-medium">Luxury Heritage Brand</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                  <span className="block text-white">Our</span>
                  <span className="block bg-gradient-to-r from-brand-primary-200 via-brand-primary-100 to-white bg-clip-text text-transparent">
                    Story
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed font-light">
                  Rooted in Tradition, Woven with Purpose
                </p>
                
                <p className="text-base sm:text-lg text-white/80 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  From the high altitudes of Nepal to your home, discover the heritage behind every Furhimalaya piece.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    href="#story" 
                    variant="primary" 
                    className="group bg-white text-white hover:bg-brand-primary-50 hover:text-[#9c7846] border-0 px-8 py-4 text-lg font-medium"
                  >
                    Discover Our Heritage
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    href="/products" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
                  >
                    View Collection
                  </Button>
                </div>
              </div>

              {/* Right Visual Element */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Main Circle */}
                  <div className="w-96 h-96 rounded-full border-2 border-white/20 flex items-center justify-center relative animate-spin-slow">
                    <div className="w-80 h-80 rounded-full border border-white/10 flex items-center justify-center">
                      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-white mb-2">25+</div>
                          <div className="text-white/80 text-lg font-light">Years of<br />Heritage</div>
                        </div>
                      </div>
                    </div>
                    {/* Orbit Elements */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Our Story Section - Premium Layout */}
      <section id="story" className="py-20 sm:py-28 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('c19d68')}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center gap-2 bg-brand-primary-50 rounded-full px-6 py-3 mb-6">
                <Quote className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">Our Heritage</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-brand-primary-800 to-gray-900 bg-clip-text text-transparent">
                Born in the Heart of<br />the Himalayas
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
                Authentic Heritage, Timeless Craftsmanship
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Content - 7 columns */}
              <div className="lg:col-span-7">
                <div className="space-y-8">
                  {/* Story Paragraphs */}
                  <div className="space-y-6">
                    <div className="group hover:bg-brand-primary-50/50 p-6 rounded-2xl transition-all duration-300">
                      <p className="text-lg text-gray-700 leading-relaxed font-light">
                        <span className="font-semibold text-brand-primary-800">Furhimalaya was founded</span> with a simple yet profound mission: to share the extraordinary beauty and craftsmanship of authentic Himalayan pashmina with the world. Based in Kathmandu, Nepal, we are more than just a textile company—we are <span className="italic text-brand-primary-700">guardians of a centuries-old tradition</span>.
                      </p>
                    </div>

                    <div className="group hover:bg-brand-primary-50/50 p-6 rounded-2xl transition-all duration-300">
                      <p className="text-lg text-gray-700 leading-relaxed font-light">
                        Our story begins in the <span className="font-semibold text-brand-primary-800">remote high-altitude regions of the Himalayas</span>, where the world's finest cashmere goats roam freely. Here, in harsh yet magnificent conditions, these remarkable animals grow the ultra-fine undercoat that becomes the foundation of our luxurious textiles.
                      </p>
                    </div>

                    <div className="group hover:bg-brand-primary-50/50 p-6 rounded-2xl transition-all duration-300">
                      <p className="text-lg text-gray-700 leading-relaxed font-light">
                        Every piece in our collection represents a direct connection to this ancient heritage, <span className="italic text-brand-primary-700">handcrafted by skilled artisans</span> who have inherited their techniques through generations of family tradition.
                      </p>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                    <div className="group bg-gradient-to-br from-brand-primary-600 to-brand-primary-700 p-6 rounded-2xl text-white hover:shadow-2xl hover:shadow-brand-primary-500/25 transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-6 h-6 text-brand-primary-200" />
                        <span className="text-2xl font-bold">25+</span>
                      </div>
                      <p className="text-brand-primary-100 font-medium">Years of Heritage</p>
                    </div>

                    <div className="group bg-gradient-to-br from-brand-primary-700 to-brand-primary-800 p-6 rounded-2xl text-white hover:shadow-2xl hover:shadow-brand-primary-500/25 transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-brand-primary-200" />
                        <span className="text-2xl font-bold">100%</span>
                      </div>
                      <p className="text-brand-primary-100 font-medium">Authentic Craftsmanship</p>
                    </div>

                    <div className="group bg-gradient-to-br from-brand-primary-800 to-brand-primary-900 p-6 rounded-2xl text-white hover:shadow-2xl hover:shadow-brand-primary-500/25 transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-6 h-6 text-brand-primary-200" />
                        <span className="text-2xl font-bold">Global</span>
                      </div>
                      <p className="text-brand-primary-100 font-medium">Recognition</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Visual - 5 columns */}
              <div className="lg:col-span-5">
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                    <Image
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Himalayan Heritage"
                      className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                      width={800}
                      height={500}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-900/60 via-transparent to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-brand-primary-600 fill-current" />
                        <span className="text-sm font-semibold text-gray-800">Premium Quality</span>
                      </div>
                    </div>

                    {/* Bottom Info Card */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Handcrafted in</p>
                          <p className="text-lg font-bold text-brand-primary-800">Kathmandu, Nepal</p>
                        </div>
                        <div className="w-12 h-12 bg-brand-primary-100 rounded-full flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-brand-primary-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-primary-200 rounded-full opacity-20 animate-pulse-slow"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-brand-primary-300 rounded-full opacity-15 animate-float"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section - Modern Card Design */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 via-white to-brand-primary-50/30 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-primary-300 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-primary-200 rounded-full filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
                <Heart className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">What Drives Us</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-brand-primary-800 to-gray-900 bg-clip-text text-transparent">
                Our Core Values
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
                The principles that guide everything we do
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {/* Authenticity */}
              <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-600 to-brand-primary-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-brand-primary-800 transition-colors">Authenticity</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every product is genuinely handcrafted using traditional Himalayan techniques passed down through generations.
                </p>
                <div className="mt-6 h-0.5 bg-gradient-to-r from-brand-primary-400 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              {/* Sustainability */}
              <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-emerald-800 transition-colors">Sustainability</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Committed to environmental responsibility and ethical sourcing practices that protect our planet.
                </p>
                <div className="mt-6 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              {/* Community */}
              <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-slate-800 transition-colors">Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Supporting local artisans and preserving traditional craftsmanship for future generations.
                </p>
                <div className="mt-6 h-0.5 bg-gradient-to-r from-slate-400 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              {/* Global Vision */}
              <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-indigo-800 transition-colors">Global Vision</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bringing authentic Himalayan luxury to discerning customers across the world.
                </p>
                <div className="mt-6 h-0.5 bg-gradient-to-r from-indigo-400 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>

            {/* Vision and Mission Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Vision Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-600 to-brand-primary-800 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                <div className="relative bg-gradient-to-br from-brand-primary-500 to-brand-primary-700 p-10 rounded-3xl shadow-2xl text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-white/95 text-lg leading-relaxed font-light">
                    To be the world's most trusted source of authentic Himalayan pashmina, recognized for our unwavering commitment to quality, authenticity, and sustainable practices. We envision a future where traditional craftsmanship thrives alongside modern global commerce.
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <span className="text-white/80 text-sm">Global Recognition</span>
                  </div>
                </div>
              </div>

              {/* Mission Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 shadow-xl"></div>
                <div className="relative bg-white p-10 rounded-3xl shadow-2xl border-2 border-brand-primary/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-brand-primary-100 rounded-2xl flex items-center justify-center">
                      <Target className="w-8 h-8 text-brand-primary-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="flex items-start gap-4 group/item hover:bg-brand-primary-50 p-4 rounded-xl transition-colors">
                      <div className="w-8 h-8 bg-brand-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Preserve Heritage:</span>
                        <p className="text-gray-600 mt-1">Maintain traditional Himalayan weaving techniques for future generations.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item hover:bg-brand-primary-50 p-4 rounded-xl transition-colors">
                      <div className="w-8 h-8 bg-brand-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Empower Artisans:</span>
                        <p className="text-gray-600 mt-1">Provide fair wages and sustainable livelihoods for skilled craftspeople.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item hover:bg-brand-primary-50 p-4 rounded-xl transition-colors">
                      <div className="w-8 h-8 bg-brand-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Deliver Excellence:</span>
                        <p className="text-gray-600 mt-1">Ensure highest standards of quality and craftsmanship in every piece.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item hover:bg-brand-primary-50 p-4 rounded-xl transition-colors">
                      <div className="w-8 h-8 bg-brand-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Leaf className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Sustainable Future:</span>
                        <p className="text-gray-600 mt-1">Build a business that respects both people and our planet.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients Section - Only show if there are clients */}
      <ClientCarousel 
        title="Our Clients"
        subtitle="Trusted partnerships that drive mutual success"
        backgroundStyle="light"
        conditionalRendering={true}
      />

      {/* Meet Our Team Section - Only show if there are team members */}
      {(loading || teamMembers.length > 0) && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionTitle
              title="Meet Our Team"
              subtitle="The passionate professionals behind our success"
              center={true}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <SkeletonTeamCard key={i} />
                ))}
              </div>
            ) : teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow group">
                    {member.imageUrl && (
                      <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden rounded-t-lg">
                        <Image
                          src={API_CONFIG.getImageUrl(member.imageUrl)}
                          alt={member.name}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600 font-medium mb-2 sm:mb-3 text-sm sm:text-base">{member.position}</p>
                      
                      {member.bio && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="Send Email"
                            >
                              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </a>
                          )}
                          
                          {member.phone && (
                            <a
                              href={`tel:${member.phone}`}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="Call Phone"
                            >
                              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </a>
                          )}
                        </div>
                        
                        {/* Social Media Links */}
                        <SocialMediaLinks
                          linkedin={member.linkedin}
                          facebook={member.facebook}
                          twitter={member.twitter}
                          instagram={member.instagram}
                          tiktok={member.tiktok}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* 
      COMMENTED OUT: Meet Our Team Section
      This section is now conditionally rendered above - it only shows when there are team members in the database
      
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionTitle
            title="Meet Our Team"
            subtitle="The passionate professionals behind our success"
            center={true}
          />
          // ... rest of the team section code
        </div>
      </section>
      */}


    </div>
    </>
  );
};

export default About;