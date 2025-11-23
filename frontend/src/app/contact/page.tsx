'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, Globe, Users, Sparkles, ArrowRight } from 'lucide-react';
import SectionTitle from '../../components/SectionTitle';
import ContactForm from '../../components/ContactForm';
import Image from 'next/image';
import { useSetting } from '@/hooks/useSiteSettings';

const Contact = () => {
  // Dynamic content from settings - Updated for Furhimalaya
  const companyAddress = useSetting('company_address', 'Himalayan Artisan District, Kathmandu, Nepal');
  const companyPhone = useSetting('company_phone', '+977 9805996059 / +977 9861053405');
  const companyEmail = useSetting('company_email', 'hello@furhimalaya.com');

  // Single main office for luxury brand
  const mainOffice = {
    name: 'Furhimalaya Atelier',
    address: companyAddress,
    phone: companyPhone,
    email: companyEmail,
    hours: 'Monday - Saturday: 10:00 AM - 7:00 PM',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1057.0732401966675!2d85.32028105790509!3d26.980943907977156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDU4JzUyLjUiTiA4NcKwMTknMTYuMCJF!5e0!3m2!1sen!2snp!4v1762571938939!5m2!1sen!2snp',
  };

  const contactReasons = [
    {
      icon: MessageSquare,
      title: 'General Inquiries',
      description: 'Learn more about our luxury pashmina collection and artisan heritage'
    },
    {
      icon: Users,
      title: 'Custom Commissions',
      description: 'Discuss bespoke pieces crafted to your specific requirements'
    },
    {
      icon: Globe,
      title: 'International Orders',
      description: 'Worldwide shipping for our exclusive pashmina creations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-primary-50/30 to-brand-primary-100/50">
      {/* Hero Section - Luxury Contact */}
      <section className="relative py-24 sm:py-32 md:py-40 bg-gradient-to-br from-brand-primary-800 via-brand-primary-700 to-brand-primary-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-brand-primary-300 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Sparkles className="w-5 h-5 text-brand-primary-200" />
              <span className="text-white font-medium">Connect With Our Artisans</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white leading-tight">
              Let's Create<br />Something Beautiful
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-6 font-light">
              Experience Himalayan Craftsmanship
            </p>
            
            <p className="text-lg text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Whether you're seeking a unique piece from our collection or commissioning a bespoke creation, our master artisans are ready to bring your vision to life with centuries-old techniques and unparalleled attention to detail.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-white text-brand-primary hover:bg-brand-primary-50 px-8 py-4 text-lg font-medium rounded-2xl transition-all duration-300 flex items-center justify-center">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium rounded-2xl transition-all duration-300">
                View Our Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section - Modern Cards */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-brand-primary-50 rounded-full px-6 py-3 mb-6">
                <Mail className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">Get In Touch</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-brand-primary-800 to-gray-900 bg-clip-text text-transparent">
                Multiple Ways to Connect
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the most convenient way to reach our team of artisan specialists.
              </p>
            </div>

            {/* Contact Methods - Horizontal Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <div className="group bg-gradient-to-br from-brand-primary-50 to-white rounded-2xl p-8 border border-brand-primary-100 hover:border-brand-primary-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary-700 transition-colors duration-300">Visit Our Atelier</h3>
                    <p className="text-gray-600 leading-relaxed">{companyAddress}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-brand-primary-50 to-white rounded-2xl p-8 border border-brand-primary-100 hover:border-brand-primary-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary-700 transition-colors duration-300">Call Us Directly</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{companyPhone}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-brand-primary-50 to-white rounded-2xl p-8 border border-brand-primary-100 hover:border-brand-primary-200 hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary-700 transition-colors duration-300">Send an Email</h3>
                    <p className="text-gray-600 leading-relaxed">{companyEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours - Elegant Card */}
            <div className="bg-gradient-to-br from-gray-50 to-brand-primary-50/30 rounded-3xl p-8 lg:p-12 border border-brand-primary-100">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-primary-600 to-brand-primary-700 rounded-2xl flex items-center justify-center">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Atelier Hours</h3>
                    <p className="text-gray-600 text-lg">When our master craftsmen are at work</p>
                  </div>
                </div>
                
                <div className="text-center lg:text-right">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-900">Monday - Saturday: 10:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                    <p className="text-sm text-brand-primary-600 font-medium mt-4">* Appointments recommended for consultations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Luxury Design */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 to-brand-primary-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Contact Reasons */}
              <div>
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
                    <Send className="w-5 h-5 text-brand-primary-600" />
                    <span className="text-brand-primary-700 font-medium">Send us a Message</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                    Start the Conversation
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Whether you're interested in our collection, seeking a custom piece, or have questions about our artisan process, we're here to help.
                  </p>
                </div>

                {/* Contact Reasons - Modern Cards */}
                <div className="space-y-6">
                  {contactReasons.map((reason, index) => (
                    <div 
                      key={index}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:border-brand-primary-200 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <reason.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-primary-700 transition-colors duration-300">
                            {reason.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="bg-white/90 backdrop-blur-sm p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/50">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Send Your Message</h3>
                  <p className="text-gray-600">We'll get back to you within 24 hours</p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single Office Location - Premium Design */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-brand-primary-50 rounded-full px-6 py-3 mb-6">
                <MapPin className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">Visit Our Atelier</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                Experience Our Craftsmanship
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Visit our exclusive atelier where centuries-old traditions come alive in every handcrafted piece.
              </p>
            </div>

            {/* Main Office - Luxury Card */}
            <div className="bg-gradient-to-br from-brand-primary-50 via-white to-brand-primary-50/30 rounded-3xl shadow-2xl overflow-hidden border border-brand-primary-100">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-0">
                {/* Map Section */}
                <div className="relative h-80 lg:h-96 xl:h-full min-h-[500px] w-full">
                  <iframe
                    src={mainOffice.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title={`Map of ${mainOffice.name}`}
                    className="rounded-t-3xl xl:rounded-l-3xl xl:rounded-tr-none"
                  ></iframe>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-brand-primary-100">
                      <span className="text-brand-primary-700 font-bold text-sm">Premium Atelier</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                  <div className="mb-8">
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                      {mainOffice.name}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Step into our world of Himalayan craftsmanship, where each piece tells a story of tradition, artistry, and timeless beauty.
                    </p>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">Location</h4>
                        <p className="text-gray-700">{mainOffice.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">Phone</h4>
                        <p className="text-gray-700">{mainOffice.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">Email</h4>
                        <p className="text-gray-700">{mainOffice.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">Hours</h4>
                        <p className="text-gray-700">{mainOffice.hours}</p>
                        <p className="text-sm text-brand-primary-600 mt-1">Appointments recommended</p>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-8 pt-8 border-t border-brand-primary-100">
                    <button className="group bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 text-white px-8 py-4 rounded-2xl font-medium hover:from-brand-primary-700 hover:to-brand-primary-800 transition-all duration-300 flex items-center">
                      Schedule a Visit
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
