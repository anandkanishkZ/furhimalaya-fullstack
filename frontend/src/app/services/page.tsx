'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  CheckCircle, 
  Star, 
  Award, 
  Users, 
  Clock, 
  Eye, 
  Palette, 
  Scissors, 
  Search,
  Shield,
  Sparkles,
  ArrowRight,
  Globe,
  Heart,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';

// Process steps data
const processSteps = [
  {
    number: "01",
    title: "Cashmere Selection",
    description: "We source the finest cashmere from high-altitude goats in the Himalayan regions, selecting only the softest undercoat fibers.",
    duration: "2-3 days",
    features: [
      "Hand-picked from Himalayan goats",
      "Only the finest undercoat fiber", 
      "Graded by experienced artisans",
      "Quality tested for softness"
    ],
    icon: Search
  },
  {
    number: "02", 
    title: "Hand Spinning",
    description: "Master spinners transform raw cashmere into fine threads using traditional spinning wheels, preserving centuries-old techniques.",
    duration: "5-7 days",
    features: [
      "Traditional charkha spinning wheel",
      "Individual fiber alignment",
      "Consistent thread thickness", 
      "Artisan quality control"
    ],
    icon: Zap
  },
  {
    number: "03",
    title: "Design Planning", 
    description: "Our designers create intricate patterns and color schemes, combining traditional motifs with contemporary aesthetics.",
    duration: "3-4 days",
    features: [
      "Pattern development",
      "Color palette selection",
      "Motif placement planning",
      "Technical specifications"
    ],
    icon: Palette
  },
  {
    number: "04",
    title: "Weaving Mastery",
    description: "Skilled weavers bring designs to life on traditional looms, creating each piece with meticulous attention to detail.", 
    duration: "15-30 days",
    features: [
      "Traditional handloom weaving",
      "Complex pattern execution", 
      "Tension and density control",
      "Real-time quality monitoring"
    ],
    icon: Users
  },
  {
    number: "05",
    title: "Quality Inspection",
    description: "Every finished piece undergoes rigorous quality checks to ensure it meets our exacting standards of excellence.",
    duration: "1-2 days", 
    features: [
      "Detailed visual inspection",
      "Texture and softness testing",
      "Pattern accuracy verification", 
      "Final quality certification"
    ],
    icon: Eye
  },
  {
    number: "06",
    title: "Finishing Touches",
    description: "Final embellishments, trimming, and packaging are done by hand, ensuring each piece is presentation-ready.",
    duration: "2-3 days",
    features: [
      "Hand-finished edges",
      "Fringe alignment", 
      "Final pressing and shaping",
      "Premium packaging preparation"
    ],
    icon: Scissors
  }
];

// Quality metrics data
const qualityMetrics = [
  {
    title: "Thread Count Excellence",
    description: "Minimum 300 threads per square inch",
    icon: Target
  },
  {
    title: "Softness Grade A+", 
    description: "Only the finest grade cashmere passes our standards",
    icon: Star
  },
  {
    title: "Color Fastness",
    description: "Guaranteed fade-resistant dyes and treatments", 
    icon: Shield
  },
  {
    title: "Artisan Certified",
    description: "Each piece signed by the master craftsperson",
    icon: Award
  }
];

// Heritage stats data
const heritageStats = [
  { number: "50+", label: "Master Artisans", icon: Users },
  { number: "200+", label: "Years of Tradition", icon: Clock },  
  { number: "99.8%", label: "Quality Rating", icon: Star },
  { number: "45", label: "Days Average Production", icon: Trophy }
];

// Certifications data
const certifications = [
  "Fair Trade Certified",
  "Artisan Heritage Approved", 
  "Sustainable Sourcing Verified",
  "Quality Excellence Award",
  "Traditional Craft Preservation"
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-primary-50/30 to-brand-primary-100/50">
      {/* Hero Section - Artisanal Excellence */}
      <section className="relative py-20 sm:py-28 md:py-32 bg-gradient-to-br from-brand-primary-800 via-brand-primary-700 to-brand-primary-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-primary-300 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Sparkles className="w-5 h-5 text-brand-primary-200" />
              <span className="text-white font-medium">Premium Craftsmanship</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white leading-tight">
              Artisanal Excellence
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-6 font-light">
              The Art of Himalayan Craftsmanship
            </p>
            
            <p className="text-lg text-white/80 mb-10 max-w-4xl mx-auto leading-relaxed">
              Every Furhimalaya piece is a testament to centuries-old traditions, masterful techniques, and the passionate dedication of our skilled artisans. Discover the meticulous process behind our luxury pashmina collection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                href="#process" 
                variant="primary" 
                className="bg-brand-primary hover:bg-brand-primary-dark text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                <span className="text-white">Discover Our Process</span>
                <ArrowRight className="ml-2 w-5 h-5 text-white" />
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
        </div>
      </section>

      {/* Our Process Section */}
      <section id="process" className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center gap-2 bg-brand-primary-50 rounded-full px-6 py-3 mb-6">
                <Users className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">Our Process</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-brand-primary-800 to-gray-900 bg-clip-text text-transparent">
                From Fiber to Finished<br />Masterpiece
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 font-light max-w-4xl mx-auto leading-relaxed">
                Follow the journey of transformation as raw cashmere becomes a luxurious Furhimalaya creation.
              </p>
            </div>

            {/* Process Steps - Alternating Horizontal Cards */}
            <div className="space-y-8">
              {processSteps.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div 
                    key={step.number} 
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-brand-primary-200"
                  >
                    <div className={`flex flex-col lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                      {/* Icon & Number Section */}
                      <div className="lg:w-80 bg-gradient-to-br from-brand-primary-600 to-brand-primary-800 p-8 lg:p-12 flex flex-col items-center justify-center text-white relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-600/90 to-brand-primary-800/90 opacity-95"></div>
                        <div className="relative z-10 text-center">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <step.icon className="w-10 h-10 text-white" />
                          </div>
                          <div className="text-6xl font-bold mb-2 opacity-90">{step.number}</div>
                          <div className="text-sm font-medium uppercase tracking-wider opacity-80">Step</div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-8 lg:p-12">
                        <div className="max-w-4xl">
                          <div className={`flex items-start justify-between mb-6 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                            <div className={isEven ? '' : 'lg:text-right'}>
                              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary-700 transition-colors duration-300">
                                {step.title}
                              </h3>
                              <div className={`flex items-center gap-2 text-brand-primary-600 ${isEven ? '' : 'lg:justify-end'}`}>
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Duration: {step.duration}</span>
                              </div>
                            </div>
                            <div className="hidden lg:block w-16 h-16 bg-brand-primary-50 rounded-2xl flex-shrink-0 group-hover:bg-brand-primary-100 transition-colors duration-300"></div>
                          </div>
                          
                          <p className={`text-gray-600 text-lg leading-relaxed mb-8 max-w-3xl ${isEven ? '' : 'lg:text-right lg:ml-auto'}`}>
                            {step.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {step.features.map((feature, featureIndex) => (
                              <div 
                                key={featureIndex} 
                                className={`flex items-center gap-3 bg-gray-50 hover:bg-brand-primary-50 p-4 rounded-xl transition-colors duration-300 group/feature ${isEven ? '' : 'lg:flex-row-reverse'}`}
                              >
                                <div className="w-6 h-6 bg-brand-primary-100 rounded-full flex items-center justify-center group-hover/feature:bg-brand-primary-200 transition-colors duration-300 flex-shrink-0">
                                  <CheckCircle className="w-4 h-4 text-brand-primary-600" />
                                </div>
                                <span className="text-gray-700 font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Excellence Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 to-brand-primary-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
                <Shield className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">Quality Excellence</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                Uncompromising Standards
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Every piece meets our rigorous quality benchmarks, ensuring you receive nothing but the finest.
              </p>
            </div>

            {/* Quality Metrics - Horizontal Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {qualityMetrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 hover:border-brand-primary-200"
                >
                  <div className="flex items-center p-8">
                    {/* Icon Section */}
                    <div className="flex-shrink-0 mr-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <metric.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary-700 transition-colors duration-300">
                        {metric.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {metric.description}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <div className="hidden md:block flex-shrink-0 ml-6">
                      <div className="w-2 h-16 bg-gradient-to-b from-brand-primary-200 to-brand-primary-400 rounded-full group-hover:from-brand-primary-400 group-hover:to-brand-primary-600 transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Stats Section */}
      <section className="py-20 sm:py-28 bg-brand-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
                <Heart className="w-5 h-5 text-brand-primary-200" />
                <span className="text-white font-medium">Our Heritage</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                Masters of Their Craft
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
                Meet the numbers behind our commitment to traditional artistry and modern excellence.
              </p>
            </div>

            {/* Heritage Stats - Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heritageStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-white/80 font-medium text-lg">{stat.label}</div>
                      </div>
                    </div>
                    <div className="hidden lg:block w-20 h-20 bg-white/5 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-brand-primary-50 rounded-full px-6 py-3 mb-6">
                <Trophy className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">Recognition</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                Certified Excellence
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Our commitment to quality and tradition is recognized by leading industry organizations.
              </p>
            </div>

            {/* Certifications - Modern Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className="group bg-gradient-to-br from-brand-primary-50 via-white to-brand-primary-50/50 rounded-2xl border border-brand-primary-100 hover:border-brand-primary-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-brand-primary-700 transition-colors duration-300">
                          {cert}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Decorative bottom border */}
                    <div className="mt-6 h-1 w-full bg-gradient-to-r from-brand-primary-200 via-brand-primary-400 to-brand-primary-200 rounded-full group-hover:from-brand-primary-400 group-hover:to-brand-primary-600 transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-brand-primary-600 to-brand-primary-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Experience the Difference
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Own a Piece of Himalayan Heritage. Every Furhimalaya creation tells a story of tradition, craftsmanship, and timeless beauty. Discover our collection and experience the artistry firsthand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                href="/products" 
                variant="primary" 
                className="bg-brand-primary-900 text-white hover:bg-brand-primary-800 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                Explore Our Collection
              </Button>
              <Button 
                href="/about" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
              >
                Meet Our Artisans
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}