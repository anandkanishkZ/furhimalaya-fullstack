'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Eye, Database, Lock, Users, Globe, Cookie, BarChart3, FileText, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'introduction',
        'information-collection',
        'how-we-use',
        'cookies',
        'analytics',
        'third-party',
        'data-security',
        'your-rights',
        'children',
        'changes',
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
    { id: 'introduction', label: 'Introduction', icon: Shield },
    { id: 'information-collection', label: 'Information We Collect', icon: Database },
    { id: 'how-we-use', label: 'How We Use Your Data', icon: Eye },
    { id: 'cookies', label: 'Cookies & Tracking', icon: Cookie },
    { id: 'analytics', label: 'Google Analytics', icon: BarChart3 },
    { id: 'third-party', label: 'Third-Party Services', icon: Globe },
    { id: 'data-security', label: 'Data Security', icon: Lock },
    { id: 'your-rights', label: 'Your Rights', icon: Users },
    { id: 'children', label: 'Children\'s Privacy', icon: Shield },
    { id: 'changes', label: 'Policy Changes', icon: FileText },
    { id: 'contact', label: 'Contact Us', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-brand-primary-600 to-brand-primary-800 rounded-2xl p-6 sm:p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-500/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-white" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-brand-primary-100 bg-clip-text text-transparent">Privacy Policy</h1>
              </div>
              <p className="text-brand-primary-100 text-base sm:text-lg mb-4 font-light">
                Your privacy is precious to us. This policy explains how we collect, use, and protect your personal information with the utmost care and respect.
              </p>
              <p className="text-brand-primary-200 text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
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
                    <Shield className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Introduction</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to Furhimalaya's Privacy Policy. As artisans of luxury Himalayan Pashmina, we are deeply committed to protecting your personal 
                    information and respecting your privacy with the same care we dedicate to our heritage craft. This Privacy Policy explains what information we collect, how we use it, 
                    and what rights you have in relation to it.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By exploring our atelier and engaging with our services, you agree to the collection and use of information in accordance with this policy. 
                    If you have any questions or concerns about our policy or our practices regarding your personal information, 
                    please contact us using the details provided at the end of this document.
                  </p>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Information Collection */}
                <section id="information-collection" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Database className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Information We Collect</h2>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Personal Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect personal information that you graciously provide to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6 ml-4">
                    <li>Visit our luxury atelier or contact us through our website</li>
                    <li>Inquire about our premium Pashmina collections</li>
                    <li>Request bespoke consultations for custom pieces</li>
                    <li>Subscribe to our exclusive heritage stories and updates</li>
                    <li>Engage with our artisan community on social media</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Types of Data Collected</h3>
                  <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-4 sm:p-6 mb-4">
                    <ul className="space-y-2 text-gray-800">
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-brand-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Contact Information:</strong> Name, email address, phone number, preferred communication method</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-brand-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Luxury Preferences:</strong> Information about your Pashmina preferences, style choices, and custom requirements</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-brand-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Usage Data:</strong> IP address, browser type, device information, pages visited within our atelier</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-5 h-5 text-brand-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Communication Records:</strong> Correspondence and consultations with our master artisans</span>
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you visit our website, we automatically collect certain information about your device and browsing actions. 
                    This includes log data, device data, and location data. We use this information to improve our services and 
                    understand how visitors interact with our website.
                  </p>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* How We Use Information */}
                <section id="how-we-use" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Eye className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How We Use Your Information</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We use your personal information with the utmost care and respect for the following purposes:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 border border-brand-primary-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Luxury Service Delivery</h4>
                      <p className="text-sm text-gray-700">To provide exceptional Pashmina craftsmanship and personalized luxury experiences</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Artisan Communication</h4>
                      <p className="text-sm text-gray-700">To respond to inquiries and provide dedicated customer care with personal attention</p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Heritage Preservation</h4>
                      <p className="text-sm text-gray-700">To improve our atelier experience and preserve traditional craftsmanship</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Exclusive Updates</h4>
                      <p className="text-sm text-gray-700">To share heritage stories and collection updates (with your gracious consent)</p>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    We will only use your personal information for the purposes for which we collected it, unless we reasonably 
                    consider that we need to use it for another reason that is compatible with the original purpose.
                  </p>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Cookies */}
                <section id="cookies" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Cookie className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Cookies & Tracking Technologies</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use cookies and similar tracking technologies to track activity on our website and store certain information. 
                    Cookies are files with a small amount of data that are sent to your browser and stored on your device.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Types of Cookies We Use</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-brand-primary-600 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">Essential Cookies</h4>
                      <p className="text-sm text-gray-700">Required for our atelier website to function properly. Cannot be disabled.</p>
                    </div>
                    <div className="border-l-4 border-emerald-600 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                      <p className="text-sm text-gray-700">Help us understand how visitors explore our luxury collections (Google Analytics).</p>
                    </div>
                    <div className="border-l-4 border-purple-600 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">Functional Cookies</h4>
                      <p className="text-sm text-gray-700">Remember your luxury preferences and settings for a personalized experience.</p>
                    </div>
                    <div className="border-l-4 border-amber-600 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
                      <p className="text-sm text-gray-700">Share relevant heritage stories and collection updates across platforms.</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-gray-800">
                      <strong>Note:</strong> You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                      However, if you do not accept cookies, you may not be able to use some portions of our website.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Google Analytics */}
                <section id="analytics" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Google Analytics & Search Console</h2>
                  </div>
                  
                  <div className="bg-brand-primary-50 border-l-4 border-brand-primary-600 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Google Analytics</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We use Google Analytics, a web analytics service provided by Google LLC. Google Analytics uses cookies to help 
                      us analyze how users interact with our website. The information generated by the cookie about your use of the 
                      website includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Pages visited and time spent on each page</li>
                      <li>How you arrived at our website (referral source)</li>
                      <li>General location information (city/country level)</li>
                      <li>Device and browser information</li>
                      <li>User interactions and behaviors on our site</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Google Search Console</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We use Google Search Console to monitor and maintain our website's presence in Google Search results. 
                      This service helps us understand how Google crawls and indexes our website, and provides insights into 
                      search queries that lead users to our site.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Your Options</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You can opt-out of Google Analytics tracking by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                    <li>Installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google Analytics Opt-out Browser Add-on</a></li>
                    <li>Adjusting your browser settings to block third-party cookies</li>
                    <li>Using browser privacy modes or extensions</li>
                  </ul>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Data Retention:</strong> Google Analytics data is retained for 26 months, after which it is automatically deleted. 
                      We do not share this data with any third parties except as required by law.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Third-Party Services */}
                <section id="third-party" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Globe className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Third-Party Services</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We may employ third-party companies and services to facilitate our website and services. These third parties have 
                    access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose 
                    or use it for any other purpose.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Services We Use</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                      <p className="text-sm text-gray-700">Google Analytics, Search Console</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-gray-900 mb-2">Email Services</h4>
                      <p className="text-sm text-gray-700">Email delivery and newsletter platforms</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-gray-900 mb-2">Hosting</h4>
                      <p className="text-sm text-gray-700">Website hosting and CDN services</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-gray-900 mb-2">Security</h4>
                      <p className="text-sm text-gray-700">SSL certificates and security monitoring</p>
                    </div>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Data Security */}
                <section id="data-security" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Lock className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Security</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    The security of your personal information is as precious to us as our heritage craftsmanship. We implement appropriate technical and organizational 
                    measures to protect your personal information with the same care we dedicate to preserving our authentic Pashmina traditions.
                  </p>

                  <div className="bg-gradient-to-r from-brand-primary-50 to-amber-50 border border-brand-primary-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Measures</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-blue-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">SSL/TLS encryption for data transmission</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Secure database storage with encryption</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Regular security audits and updates</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Access controls and authentication protocols</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-600 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Employee training on data protection</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-gray-800">
                      <strong>Important:</strong> While we strive to protect your personal information, no method of transmission over 
                      the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Your Rights */}
                <section id="your-rights" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Privacy Rights</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You have certain rights regarding your personal information under applicable data protection laws:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white border-l-4 border-brand-primary-600 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Right to Access</h4>
                      <p className="text-sm text-gray-700">You have the right to request copies of your personal information.</p>
                    </div>
                    <div className="bg-white border-l-4 border-emerald-600 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Right to Rectification</h4>
                      <p className="text-sm text-gray-700">You have the right to request correction of inaccurate or incomplete information.</p>
                    </div>
                    <div className="bg-white border-l-4 border-purple-600 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Right to Erasure</h4>
                      <p className="text-sm text-gray-700">You have the right to request deletion of your personal information.</p>
                    </div>
                    <div className="bg-white border-l-4 border-orange-600 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Right to Restrict Processing</h4>
                      <p className="text-sm text-gray-700">You have the right to request restriction of processing your personal information.</p>
                    </div>
                    <div className="bg-white border-l-4 border-red-600 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Right to Object</h4>
                      <p className="text-sm text-gray-700">You have the right to object to processing of your personal information.</p>
                    </div>
                    <div className="bg-white border-l-4 border-pink-600 p-5 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Right to Data Portability</h4>
                      <p className="text-sm text-gray-700">You have the right to request transfer of your data to another organization.</p>
                    </div>
                  </div>

                  <div className="bg-brand-primary-50 border border-brand-primary-200 rounded-lg p-5 mt-6">
                    <p className="text-sm text-gray-800">
                      To exercise any of these rights, please contact our luxury atelier using the contact information provided in the "Contact Us" section below.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Children's Privacy */}
                <section id="children" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Children's Privacy</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information 
                    from children under 18. If you are a parent or guardian and you are aware that your child has provided us with 
                    personal information, please contact us.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    If we become aware that we have collected personal information from children without verification of parental consent, 
                    we take steps to remove that information from our servers.
                  </p>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Changes to Policy */}
                <section id="changes" className="mb-12 scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Changes to This Policy</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                    on this page and updating the "Last updated" date at the top of this policy.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective 
                    when they are posted on this page.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-800">
                      <strong>Notification:</strong> For significant changes, we will provide a more prominent notice, such as an email 
                      notification to registered users or a banner on our website.
                    </p>
                  </div>
                </section>

                <hr className="my-10 border-gray-200" />

                {/* Contact Us */}
                <section id="contact" className="scroll-mt-24">
                  <div className="flex items-center mb-4">
                    <Mail className="w-6 h-6 text-brand-primary-600 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Us</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our heritage data practices, 
                    please don't hesitate to contact our luxury atelier:
                  </p>

                  <div className="bg-gradient-to-br from-brand-primary-50 to-amber-50 border border-brand-primary-200 rounded-xl p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Furhimalaya - Luxury Pashmina Atelier</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-brand-primary-600 rounded-full p-2 mr-4">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <a href="mailto:info@furhimalaya.com" className="text-brand-primary-600 hover:text-brand-primary-800 font-medium">
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
                      <p className="text-sm text-gray-700">
                        Our luxury atelier will respond to your inquiry within <strong>48 hours</strong> during business days.
                      </p>
                    </div>
                  </div>
                </section>

              </div>
            </main>
          </div>
        </div>

        {/* Back to Top */}
        <div className="max-w-7xl mx-auto mt-8 text-center">
          <Link 
            href="/terms" 
            className="inline-flex items-center text-brand-primary-600 hover:text-brand-primary-800 font-medium transition-colors"
          >
            View Terms of Service
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}