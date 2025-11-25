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
    <footer className="bg-slate-900">
      {/* Main Footer Content */}
      <div>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Enhanced Company Section */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Identity */}
            <div className="space-y-4">
              <Link href="/" className="inline-block group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors duration-200">
                    <Mountain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Furhimalaya
                    </h3>
                    <p className="text-slate-400 text-sm">{companyTagline}</p>
                  </div>
                </div>
              </Link>
              
              {/* Mission Statement */}
              <div className="max-w-md">
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Discover the timeless artistry of authentic Himalayan Pashmina. Our master artisans weave centuries of tradition into every luxurious fiber.
                </p>
                
                {/* Professional Badges */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md">
                    <Award className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">Authentic</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md">
                    <Heart className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">Handcrafted</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md">
                    <Star className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">Premium</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-white font-medium text-sm">
                Follow Us
              </h4>
              <div className="flex gap-2">
                {facebookUrl && (
                  <a 
                    href={facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-md flex items-center justify-center transition-colors duration-200"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="w-4 h-4 text-slate-400" />
                  </a>
                )}
                {twitterUrl && (
                  <a 
                    href={twitterUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-md flex items-center justify-center transition-colors duration-200"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="w-4 h-4 text-slate-400" />
                  </a>
                )}
                {instagramUrl && (
                  <a 
                    href={instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-md flex items-center justify-center transition-colors duration-200"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-4 h-4 text-slate-400" />
                  </a>
                )}
                {linkedinUrl && (
                  <a 
                    href={linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-md flex items-center justify-center transition-colors duration-200"
                    aria-label="Connect with us on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-medium text-sm">
              Quick Links
            </h4>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                    Our Heritage
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                    Luxury Collections
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                    Masterpieces
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                    Artisan Stories
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">
                    Visit Atelier
                  </Link>
                </li>
              </ul>
            </nav>
          </div>



          {/* Contact Information */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-medium text-sm">
              Get In Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-white text-sm">{companyPhone}</p>
                  <p className="text-slate-400 text-xs">Mon - Fri, 9 AM - 7 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-white text-sm break-all">{companyEmail}</p>
                  <p className="text-slate-400 text-xs">Response within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-white text-sm">{companyAddress}</p>
                  <p className="text-slate-400 text-xs">By appointment only</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-800">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center lg:text-left">
              <p className="text-slate-400 text-sm">
                © {currentYear} <span className="text-white font-medium">{companyName}</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <Link 
                  href="/privacy" 
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>Developed by</span>
              <a 
                href="https://zwickytechnology.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-slate-300 transition-colors font-medium"
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