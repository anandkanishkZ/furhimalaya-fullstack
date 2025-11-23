'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Scale, Shield, AlertTriangle, Ban, RefreshCw, DollarSign, Briefcase, UserCheck, Bell, Info, Mail, Phone, MapPin, ChevronRight, CheckCircle, Lock } from 'lucide-react';

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'introduction',
        'acceptance',
        'definitions',
        'services',
        'user-obligations',
        'fees-payment',
        'intellectual-property',
        'confidentiality',
        'limitation-liability',
        'termination',
        'modifications',
        'governing-law',
        'contact'
      ];

      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const menuItems = [
    { id: 'introduction', label: 'Introduction', icon: FileText },
    { id: 'acceptance', label: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'definitions', label: 'Definitions', icon: Info },
    { id: 'services', label: 'Our Services', icon: Briefcase },
    { id: 'user-obligations', label: 'User Obligations', icon: UserCheck },
    { id: 'fees-payment', label: 'Fees & Payment', icon: DollarSign },
    { id: 'intellectual-property', label: 'Intellectual Property', icon: Shield },
    { id: 'confidentiality', label: 'Confidentiality', icon: Lock },
    { id: 'limitation-liability', label: 'Limitation of Liability', icon: AlertTriangle },
    { id: 'termination', label: 'Termination', icon: Ban },
    { id: 'modifications', label: 'Modifications', icon: RefreshCw },
    { id: 'governing-law', label: 'Governing Law', icon: Scale },
    { id: 'contact', label: 'Contact Us', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-brand-primary-600 to-brand-primary-800 rounded-2xl p-6 sm:p-8 md:p-12 text-white shadow-xl">
            <div className="flex items-center mb-4">
              <Scale className="w-10 h-10 sm:w-12 sm:h-12 mr-4" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-white/90 text-base sm:text-lg mb-4">
              Please read these luxury service terms carefully before engaging with our heritage Pashmina atelier. By accessing or using our services, 
              you agree to be bound by these terms.
            </p>
            <p className="text-white/80 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Sticky Sidebar */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-brand-primary-600" />
                    Table of Contents
                  </h2>
                  <nav className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center group ${
                            activeSection === item.id
                              ? 'bg-brand-primary-600 text-white shadow-md'
                              : 'text-gray-700 hover:bg-brand-primary-50 hover:text-brand-primary-600'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mr-2.5 flex-shrink-0 ${
                            activeSection === item.id ? 'text-white' : 'text-gray-400 group-hover:text-brand-primary-600'
                          }`} />
                          <span className="text-sm font-medium flex-1">{item.label}</span>
                          {activeSection === item.id && (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200">
                
                {/* Introduction */}
                <section id="introduction" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Introduction</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to Furhimalaya - Your Premier Luxury Pashmina Atelier. These Terms of Service ("Terms") govern your access to and use 
                    of our heritage website, luxury services, and authentic products. These Terms constitute a legally binding agreement between you and 
                    Furhimalaya.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our luxury services include but are not limited to authentic Pashmina craftsmanship, bespoke artisan services, luxury textile consultation, 
                    heritage preservation projects, and premium product curation for discerning clientele across Nepal and internationally.
                  </p>
                  <div className="bg-brand-primary-50 border-l-4 border-brand-primary-600 p-5">
                    <p className="text-sm text-gray-800">
                      <strong>Heritage Notice:</strong> By accessing our luxury atelier or engaging our artisan services, you acknowledge that you 
                      have read, understood, and agree to be bound by these Terms. If you do not agree with these Terms, please do not 
                      engage with our heritage services.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Acceptance of Terms */}
                <section id="acceptance" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Acceptance of Terms</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing or using our services, you represent and warrant that:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <div className="bg-brand-primary-600 rounded-full p-1 mr-3 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">You are at least 18 years of age or have legal authority to enter into binding contracts</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-primary-600 rounded-full p-1 mr-3 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">You have the legal capacity to understand and comply with these Terms</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-primary-600 rounded-full p-1 mr-3 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">You will use our services in compliance with all applicable laws and regulations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-primary-600 rounded-full p-1 mr-3 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">All information you provide is accurate, current, and complete</span>
                    </li>
                  </ul>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Definitions */}
                <section id="definitions" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Info className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Definitions</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    For the purposes of these luxury terms, the following definitions apply:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-brand-primary-600 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">"Atelier," "We," "Us," or "Our"</h4>
                      <p className="text-sm text-gray-700">Refers to Furhimalaya - Luxury Pashmina Atelier, located in Kathmandu, Nepal.</p>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">"Services"</h4>
                      <p className="text-sm text-gray-700">Refers to all luxury artisan services provided by our atelier, including authentic Pashmina craftsmanship, bespoke designs, heritage consultation, and premium product curation.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">"User," "You," or "Your"</h4>
                      <p className="text-sm text-gray-700">Refers to any individual or entity accessing or using our services.</p>
                    </div>
                    <div className="border-l-4 border-gray-400 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">"Client"</h4>
                      <p className="text-sm text-gray-700">Refers to any party who has entered into a service agreement with the Company.</p>
                    </div>
                    <div className="border-l-4 border-purple-600 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">"Website"</h4>
                      <p className="text-sm text-gray-700">Refers to furhimalaya.com and all associated luxury platform domains and subdomains.</p>
                    </div>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Our Services */}
                <section id="services" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Briefcase className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Luxury Services</h2>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Artisan Service Portfolio</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Furhimalaya - Luxury Pashmina Atelier provides the following exclusive heritage services:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-brand-primary-600 mr-2" />
                        Authentic Pashmina Craftsmanship
                      </h4>
                      <p className="text-sm text-gray-700">Premium hand-crafted Pashmina creation using traditional Himalayan techniques and authentic materials.</p>
                    </div>
                    <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-brand-primary-600 mr-2" />
                        Bespoke Design Consultation
                      </h4>
                      <p className="text-sm text-gray-700">Personalized luxury design services for discerning clients seeking unique heritage pieces.</p>
                    </div>
                    <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-brand-primary-600 mr-2" />
                        Heritage Preservation
                      </h4>
                      <p className="text-sm text-gray-700">Traditional craft preservation services and artisan heritage documentation projects.</p>
                    </div>
                    <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-brand-primary-600 mr-2" />
                        Premium Curation
                      </h4>
                      <p className="text-sm text-gray-700">Exclusive luxury textile curation and authentication services for collectors and connoisseurs.</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Artisan Craft Considerations</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <ul className="space-y-2 text-sm text-gray-800">
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Luxury artisan services are provided based on traditional techniques and natural material availability</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Our atelier reserves the right to select clients who appreciate authentic heritage craftsmanship</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Craft completion timelines respect traditional methods and may vary based on artisan availability</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* User Obligations */}
                <section id="user-obligations" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <UserCheck className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Client Expectations</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    As a valued patron of our luxury atelier, you agree to:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white border-l-4 border-brand-primary-600 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Share Your Vision</h4>
                      <p className="text-sm text-gray-700">Provide complete and accurate information about your luxury preferences and design requirements for bespoke creation.</p>
                    </div>
                    <div className="bg-white border-l-4 border-amber-500 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Respect Artisan Time</h4>
                      <p className="text-sm text-gray-700">Respond promptly to our artisan consultations and design approval processes to maintain craft momentum.</p>
                    </div>
                    <div className="bg-white border-l-4 border-emerald-500 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Honor Heritage Standards</h4>
                      <p className="text-sm text-gray-700">Appreciate and comply with traditional craft standards and luxury heritage preservation protocols.</p>
                    </div>
                    <div className="bg-white border-l-4 border-purple-500 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Premium Investment</h4>
                      <p className="text-sm text-gray-700">Honor agreed investment terms for luxury artisan services and heritage craft creation.</p>
                    </div>
                    <div className="bg-white border-l-4 border-rose-500 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Protect Heritage Designs</h4>
                      <p className="text-sm text-gray-700">Respect our traditional patterns, artisan techniques, and heritage intellectual property rights.</p>
                    </div>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Fees and Payment */}
                <section id="fees-payment" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <DollarSign className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Investment & Payment Terms</h2>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Luxury Service Investment</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Investment in our luxury artisan services reflects the complexity of traditional techniques, rare material sourcing, and artisan expertise. All investment details will be 
                    clearly outlined in our bespoke service agreement before craft commencement.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Payment Structure</h3>
                  <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-6 mb-6">
                    <ul className="space-y-3 text-gray-800">
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-brand-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Heritage Deposit:</strong> A portion of the luxury investment may be required to secure artisan time and premium materials</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-brand-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Craft Milestones:</strong> For bespoke projects, payments may be structured based on artisan craft completion stages</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-brand-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Final Investment:</strong> Balance payment is due upon delivery of completed luxury pieces or heritage consultation</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-brand-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Grace Period:</strong> Extended payment terms may incur premium charges to maintain artisan availability</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-gray-800">
                      <strong>Heritage Notice:</strong> Delayed payments may result in temporary suspension of craft services and holding of 
                      luxury pieces until investment obligations are honored.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Intellectual Property */}
                <section id="intellectual-property" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Heritage Craft Rights</h2>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Traditional Pattern Ownership</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    All heritage patterns, artisan techniques, traditional designs, and cultural methodologies remain the 
                    exclusive property of Furhimalaya unless explicitly shared through a written heritage agreement.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">License to Use</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Upon full payment, clients receive a non-exclusive, non-transferable license to use our deliverables solely for the 
                    intended project purpose. This license does not permit:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
                    <li>Reproduction or distribution without written consent</li>
                    <li>Modification or derivative works</li>
                    <li>Commercial exploitation beyond the original project</li>
                    <li>Transfer to third parties without our approval</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Website Content</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All content on our website, including text, graphics, logos, images, and software, is protected by copyright and 
                    trademark laws. Unauthorized use of any content may violate these laws and is strictly prohibited.
                  </p>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Confidentiality */}
                <section id="confidentiality" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Lock className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Heritage Confidentiality</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We understand the exclusive nature of luxury preferences and bespoke design requirements. Both parties agree to maintain 
                    confidentiality of all proprietary heritage patterns and luxury client information exchanged during our artisan engagement.
                  </p>

                  <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Heritage Commitments</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-brand-primary-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Protect all luxury client preferences with atelier-standard security measures</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-brand-primary-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodar" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Not disclose bespoke design details to third parties without written heritage consent</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-brand-primary-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Use client information solely for the purpose of creating luxury artisan services</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-brand-primary-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Maintain confidentiality obligations even after luxury craft completion</span>
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Exceptions</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Confidentiality obligations do not apply to information that: (a) is publicly available, (b) is required to be 
                    disclosed by law or court order, (c) is independently developed without use of confidential information, or (d) is 
                    rightfully obtained from third parties without confidentiality restrictions.
                  </p>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Limitation of Liability */}
                <section id="limitation-liability" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Heritage Craft Considerations</h2>
                  </div>
                  
                  <div className="bg-amber-50 border-l-4 border-amber-600 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Artisan Craft Disclaimer</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Our luxury services are provided "as crafted" based on traditional techniques and natural material availability. 
                      While we exercise artisan excellence and heritage care, we acknowledge natural variations in:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Natural fiber characteristics and seasonal variations</li>
                      <li>Traditional dyeing processes and color depth variations</li>
                      <li>Handcraft variations inherent in authentic artisan work</li>
                      <li>Changes in heritage material sourcing and availability</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Liability Limitations</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To the maximum extent permitted by law:
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700"><strong>1.</strong> Our total liability shall not exceed the fees paid for the specific service in question</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700"><strong>2.</strong> We shall not be liable for indirect, consequential, or punitive damages</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700"><strong>3.</strong> We are not liable for losses arising from client's failure to follow our recommendations</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700"><strong>4.</strong> Force majeure events (natural disasters, civil unrest, etc.) exempt us from liability</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-gray-800">
                      <strong>Legal Notice:</strong> Some jurisdictions do not allow limitations on implied warranties or liability for 
                      incidental damages. These limitations may not apply to you.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Termination */}
                <section id="termination" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Ban className="w-6 h-6 text-brand-red mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Termination</h2>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Termination by Client</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Clients may terminate services by providing written notice. Upon termination:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
                    <li>Payment for all work completed to date is required</li>
                    <li>Non-refundable advance payments will not be returned</li>
                    <li>Work-in-progress will be delivered in its current state</li>
                    <li>Cancellation fees may apply as per service agreement</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Termination by Company</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We reserve the right to terminate services immediately if:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">Client breaches payment terms</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">Client provides false information</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">Client violates these Terms</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">Project involves illegal activities</p>
                    </div>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Modifications */}
                <section id="modifications" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <RefreshCw className="w-6 h-6 text-brand-blue mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Modifications to Terms</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our 
                    website. Your continued use of our services after changes constitutes acceptance of the modified Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We will make reasonable efforts to notify users of significant changes through:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
                    <li>Email notification to registered users</li>
                    <li>Prominent notice on our website</li>
                    <li>Updated "Last modified" date at the top of this page</li>
                  </ul>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-800">
                      <strong>Recommendation:</strong> Please review these Terms periodically. If you do not agree with modified Terms, 
                      you should discontinue use of our services.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Governing Law */}
                <section id="governing-law" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Scale className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Heritage Law & Resolution</h2>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Governing Principles</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    These Terms shall be governed by and construed in accordance with the laws of Nepal and traditional craft heritage principles. Any disputes arising from or 
                    relating to these Terms or our luxury services shall be subject to the exclusive jurisdiction of the courts in Kathmandu, 
                    Nepal.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Heritage Resolution</h3>
                  <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-6 mb-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      In the event of any dispute, controversy, or claim arising from these Terms:
                    </p>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                      <li><strong>Negotiation:</strong> Parties shall first attempt to resolve disputes through good faith negotiation</li>
                      <li><strong>Mediation:</strong> If negotiation fails, parties may agree to mediation by a neutral third party</li>
                      <li><strong>Arbitration:</strong> Unresolved disputes may be submitted to binding arbitration under Nepalese law</li>
                      <li><strong>Litigation:</strong> As a last resort, disputes may be brought before competent courts in Nepal</li>
                    </ol>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Language</h3>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms are written in English. In case of any conflict between English and Nepali versions, the English version 
                    shall prevail for interpretation purposes.
                  </p>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Contact Us */}
                <section id="contact" className="scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Mail className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Our Atelier</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    If you have any questions, concerns, or require clarification regarding these luxury Terms of Service, 
                    please contact our heritage atelier:
                  </p>

                  <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-xl p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Furhimalaya - Luxury Pashmina Atelier</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-brand-primary-600 rounded-full p-2 mr-4">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <a href="mailto:info@furhimalaya.com" className="text-brand-primary-600 hover:text-brand-primary-800 font-medium transition-colors">
                            info@furhimalaya.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-brand-primary-600 rounded-full p-2 mr-4">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Phone</p>
                          <p className="text-gray-900 font-medium">+977 9805996059 / +977 9861053405</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-brand-primary-600 rounded-full p-2 mr-4">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Heritage Atelier</p>
                          <p className="text-gray-900 font-medium">Kathmandu, Nepal</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-brand-primary-200">
                      <p className="text-sm text-gray-700 mb-4">
                        <strong>Atelier Hours:</strong> Sunday - Friday, 10:00 AM - 6:00 PM (Nepal Time)
                      </p>
                      <p className="text-sm text-gray-700">
                        Our luxury atelier will respond to your inquiry within <strong>48 hours</strong> during business days.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Heritage Acknowledgment</h4>
                    <p className="text-sm text-gray-700">
                      By engaging our luxury atelier, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                      These Terms constitute the entire agreement between you and Furhimalaya regarding the use of our heritage artisan services.
                    </p>
                  </div>
                </section>

              </div>
            </main>
          </div>
        </div>

        {/* Back to Privacy */}
        <div className="max-w-7xl mx-auto mt-8 text-center">
          <Link 
            href="/privacy" 
            className="inline-flex items-center text-brand-primary-600 hover:text-brand-primary-800 font-medium transition-colors"
          >
            View Privacy Policy
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}