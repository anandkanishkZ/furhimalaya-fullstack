import React from 'react';
import Link from 'next/link';

export default function Sitemap() {
  const pages = [
    { name: 'Home', path: '/', description: 'Main landing page showcasing our services' },
    { name: 'About Us', path: '/about', description: 'Learn about Fur Himalaya luxury heritage' },
    { name: 'Services', path: '/services', description: 'Our engineering and construction services' },
    { name: 'Municipality Drawing & Design', path: '/services/municipality-drawing', description: 'Professional architectural drawings and designs' },
    { name: '3D Interior Design', path: '/services/interior-design', description: 'Stunning 3D visualizations of interior spaces' },
    { name: 'Estimation & Costing', path: '/services/estimation', description: 'Accurate cost estimations for construction projects' },
    { name: 'Projects', path: '/projects', description: 'Portfolio of our completed projects' },
    { name: 'Blog', path: '/blog', description: 'Latest insights and updates from our team' },
    { name: 'Contact', path: '/contact', description: 'Get in touch with our team' },
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
          <p className="text-gray-600 mb-8">Navigate through all pages of our website</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pages.map((page, index) => (
              <Link 
                href={page.path} 
                key={index}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{page.name}</h3>
                <p className="text-gray-600 text-sm">{page.description}</p>
                <span className="text-blue-500 text-sm mt-2 inline-block">{page.path}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}