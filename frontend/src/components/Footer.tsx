'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Star, Award, Sparkles, Mountain, Scissors } from 'lucide-react';
import { useSetting } from '@/hooks/useSiteSettings';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Dynamic content from settings
  const companyName = useSetting('company_name', 'Furhimalaya');
  const companyAddress = useSetting('company_address', 'Heritage Atelier, Kathmandu Valley, Nepal');
  const companyPhone = useSetting('company_phone', '+977 9805996059 / +977 9861053405');
  const companyEmail = useSetting('company_email', 'hello@furhimalaya.com');
  const companyTagline = useSetting('company_tagline', 'Weaving Dreams, Crafting Heritage');
  
  // Dynamic social media links
  const facebookUrl = useSetting('social_facebook', '');
  const twitterUrl = useSetting('social_twitter', '');
  const linkedinUrl = useSetting('social_linkedin', '');
  const instagramUrl = useSetting('social_instagram', '');

  return (
    <footer className="relative overflow-hidden">
      {/* Sophisticated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      {/* Refined decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary-500/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/6 rounded-full blur-3xl"></div>
      
      {/* Main Footer Content */}
      <div className="relative">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Enhanced Company Section */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Identity */}
            <div className="space-y-4">
              <Link href="/" className="inline-block group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-brand-primary-500/25 group-hover:scale-105 transition-all duration-300">
                    <Mountain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-primary-300 via-white to-brand-primary-200 bg-clip-text text-transparent leading-tight">
                      Furhimalaya
                    </h3>
                    <p className="text-brand-primary-400 text-xs font-medium tracking-wide">{companyTagline}</p>
                  </div>
                </div>
              </Link>
              
              {/* Mission Statement */}
              <div className="max-w-md">
                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  Discover the timeless artistry of authentic Himalayan Pashmina. Our master artisans weave centuries of tradition into every luxurious fiber.
                </p>
                
                {/* Professional Badges */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/8 rounded-full border border-white/20">
                    <Award className="w-3 h-3 text-brand-primary-400" />
                    <span className="text-xs font-medium text-gray-300">Authentic</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/8 rounded-full border border-white/20">
                    <Heart className="w-3 h-3 text-red-400" />
                    <span className="text-xs font-medium text-gray-300">Handcrafted</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/8 rounded-full border border-white/20">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-medium text-gray-300">Premium</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Professional Social Media */}
            <div className="space-y-3">
              <h4 className="text-white font-medium text-sm tracking-wide">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {facebookUrl && (
                  <a 
                    href={facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative w-9 h-9 bg-white/10 backdrop-blur-sm hover:bg-blue-600/90 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-blue-400/60"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                  </a>
                )}
                {twitterUrl && (
                  <a 
                    href={twitterUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative w-9 h-9 bg-white/10 backdrop-blur-sm hover:bg-sky-500/90 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-sky-400/60"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                  </a>
                )}
                {instagramUrl && (
                  <a 
                    href={instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative w-9 h-9 bg-white/10 backdrop-blur-sm hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-pink-400/60"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                  </a>
                )}
                {linkedinUrl && (
                  <a 
                    href={linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative w-9 h-9 bg-white/10 backdrop-blur-sm hover:bg-blue-700/90 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-blue-400/60"
                    aria-label="Connect with us on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-medium text-sm tracking-wide">
              Quick Links
            </h4>
            <nav>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="text-sm font-medium group-hover:text-brand-primary-300 transition-colors">Our Heritage</span>
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="text-sm font-medium group-hover:text-brand-primary-300 transition-colors">Luxury Collections</span>
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="text-sm font-medium group-hover:text-brand-primary-300 transition-colors">Masterpieces</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="text-sm font-medium group-hover:text-brand-primary-300 transition-colors">Artisan Stories</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200">
                    <span className="text-sm font-medium group-hover:text-brand-primary-300 transition-colors">Visit Atelier</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>



          {/* Contact Information */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-medium text-sm tracking-wide">
              Get In Touch
            </h4>
            <div className="space-y-4">
              <div className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm mb-0.5">{companyPhone}</p>
                    <p className="text-gray-400 text-xs">Mon - Fri, 9 AM - 7 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm mb-0.5 break-all">{companyEmail}</p>
                    <p className="text-gray-400 text-xs">Response within 24 hours</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm mb-0.5">{companyAddress}</p>
                    <p className="text-gray-400 text-xs">By appointment only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        
      </div>

      {/* Professional Bottom Bar */}
      <div className="border-t border-white/20 bg-black/70 backdrop-blur-sm">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} <span className="text-white font-medium">{companyName}</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-brand-primary-300 transition-colors duration-300 hover:underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-brand-primary-300 transition-colors duration-300 hover:underline underline-offset-4"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>Developed by</span>
              <a 
                href="https://zwickytechnology.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-primary-400 hover:text-brand-primary-300 transition-colors font-semibold hover:underline underline-offset-4"
              >
                Zwicky Technology
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}