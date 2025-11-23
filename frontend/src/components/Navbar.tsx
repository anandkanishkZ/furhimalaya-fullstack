"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    // Scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-xl' 
            : 'bg-white shadow-lg'
        }`}
      >
        {/* Logo Section - Full Width White Background */}
        <div className="w-full bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex justify-center items-center transition-all duration-700 ${
              isScrolled 
                ? 'py-2 border-b border-gray-200' 
                : 'py-3 border-b border-gray-200'
            }`}>
              <Link 
                href="/" 
                className="flex flex-col items-center group"
              >
                <div className="text-center">
                  <div className={`font-bold transition-all duration-300 ${
                    isScrolled ? 'text-2xl' : 'text-3xl'
                  }`}>
                    <span className="text-brand-primary tracking-wide">FUR</span>{' '}
                    <span className="text-brand-primary/90 tracking-wide">HIMALAYA</span>
                  </div>
                  <p className="text-xs text-brand-primary/70 tracking-[0.2em] uppercase font-light mt-0.5">
                    Premium Quality
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Section - Full Width Brand Color Background */}
        <div className="w-full" style={{ backgroundColor: '#7d5932' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className={`flex justify-center items-center transition-all duration-300 ${
              isScrolled ? 'py-1' : 'py-2'
            }`}>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {navLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    href={link.path}
                    className={`relative px-6 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:text-white group ${
                      isActivePath(link.path) 
                        ? 'text-white' 
                        : 'text-white/90'
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {isActivePath(link.path) && (
                      <div className="absolute bottom-1 left-1/2 w-6 h-0.5 bg-white rounded-full transform -translate-x-1/2"></div>
                    )}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm"></div>
                  </Link>
                  {/* Separator */}
                  {index < navLinks.length - 1 && (
                    <div className="w-px h-4 bg-white/30 mx-2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden relative z-50 p-3 rounded-lg bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors duration-300 shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
        style={{
          backdropFilter: 'blur(8px) saturate(120%)',
          WebkitBackdropFilter: 'blur(8px) saturate(120%)',
        }}
      ></div>

      {/* Mobile Centered Menu */}
      <div
        className={`fixed inset-x-0 top-0 z-50 lg:hidden transform transition-all duration-500 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="shadow-2xl min-h-screen" style={{ backgroundColor: '#7d5932' }}>
          {/* Mobile Logo Section */}
          <div className="flex justify-center items-center py-8 bg-white border-b border-gray-200">
            <Link href="/" className="flex flex-col items-center" onClick={handleLinkClick}>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  <span className="text-brand-primary tracking-wide">FUR</span>{' '}
                  <span className="text-brand-primary/90 tracking-wide">HIMALAYA</span>
                </div>
                <p className="text-sm text-brand-primary/70 tracking-[0.2em] uppercase font-light">Premium Quality</p>
              </div>
            </Link>
          </div>

          {/* Mobile Navigation - Centered */}
          <nav className="px-6 py-12">
            <div className="flex flex-col items-center space-y-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={handleLinkClick}
                  className={`text-center py-4 px-8 font-medium tracking-widest uppercase transition-all duration-300 text-lg ${
                    isActivePath(link.path)
                      ? 'text-white border-b-2 border-white'
                      : 'text-white/80 hover:text-white hover:border-b-2 hover:border-white/50'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isOpen ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                  }}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-8">
                <Link
                  href="/contact"
                  onClick={handleLinkClick}
                  className="bg-brand-primary text-white hover:bg-brand-primary-dark px-8 py-4 rounded-sm font-medium uppercase tracking-wide text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    animationDelay: '600ms',
                    animation: isOpen ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                  }}
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </nav>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Enhanced Animation Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Add smooth backdrop blur support */
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-md {
            backdrop-filter: blur(12px);
          }
          .backdrop-blur-lg {
            backdrop-filter: blur(20px);
          }
          .backdrop-blur-sm {
            backdrop-filter: blur(6px);
          }
        }

        /* Custom hover effects for navigation */
        .nav-link-hover {
          position: relative;
          overflow: hidden;
        }
        
        .nav-link-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .nav-link-hover:hover::before {
          left: 100%;
        }

        /* Elegant text selection */
        ::selection {
          background-color: rgba(59, 130, 246, 0.2);
          color: #1d4ed8;
        }
      `}</style>
    </>
  );
};

export default Navbar;