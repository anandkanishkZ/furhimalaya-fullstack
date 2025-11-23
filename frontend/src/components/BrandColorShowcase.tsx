'use client';

import React from 'react';

const BrandColorShowcase: React.FC = () => {
  const colorVariations = [
    { name: 'Primary 50', class: 'bg-brand-primary-50', hex: '#faf8f4' },
    { name: 'Primary 100', class: 'bg-brand-primary-100', hex: '#f2ede1' },
    { name: 'Primary 200', class: 'bg-brand-primary-200', hex: '#e6d7c2' },
    { name: 'Primary 300', class: 'bg-brand-primary-300', hex: '#d9c1a3' },
    { name: 'Primary 400', class: 'bg-brand-primary-400', hex: '#c19d68' },
    { name: 'Primary 500 (Main)', class: 'bg-brand-primary-500 text-white', hex: '#c19d68' },
    { name: 'Primary 600', class: 'bg-brand-primary-600 text-white', hex: '#a8844e' },
    { name: 'Primary 700', class: 'bg-brand-primary-700 text-white', hex: '#8f6b3e' },
    { name: 'Primary 800', class: 'bg-brand-primary-800 text-white', hex: '#76522e' },
    { name: 'Primary 900', class: 'bg-brand-primary-900 text-white', hex: '#5d391e' },
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Brand Color Palette - Golden Bronze (#c19d68)
      </h2>
      
      {/* Main Brand Color Showcase */}
      <div className="mb-8 text-center">
        <div className="bg-brand-primary text-white rounded-lg p-8 mb-4">
          <h3 className="text-3xl font-bold mb-2">Primary Brand Color</h3>
          <p className="text-lg opacity-90">#c19d68 - Warm Golden Bronze</p>
        </div>
      </div>

      {/* Color Variations Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {colorVariations.map((color, index) => (
          <div
            key={index}
            className={`${color.class} rounded-lg p-4 text-center transition-transform hover:scale-105`}
          >
            <div className="text-sm font-medium">{color.name}</div>
            <div className="text-xs mt-1 opacity-75">{color.hex}</div>
          </div>
        ))}
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Usage Examples</h3>
        
        {/* Buttons */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700">Buttons</h4>
          <div className="flex flex-wrap gap-4">
            <button className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Primary Button
            </button>
            <button className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary-50 px-6 py-3 rounded-lg font-medium transition-colors">
              Outline Button
            </button>
            <button className="bg-brand-primary-100 text-brand-primary-800 hover:bg-brand-primary-200 px-6 py-3 rounded-lg font-medium transition-colors">
              Subtle Button
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700">Cards</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-brand-primary-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h5 className="text-brand-primary-700 font-bold text-lg mb-2">Feature Card</h5>
              <p className="text-gray-600">This card uses the brand color for accents and highlights.</p>
            </div>
            <div className="bg-brand-primary-50 border-l-4 border-brand-primary rounded-lg p-6">
              <h5 className="text-brand-primary-800 font-bold text-lg mb-2">Highlighted Card</h5>
              <p className="text-gray-600">This card uses a subtle background with brand accent.</p>
            </div>
          </div>
        </div>

        {/* Text Elements */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700">Text Elements</h4>
          <div className="space-y-2">
            <p className="text-brand-primary text-lg font-semibold">Primary Brand Text</p>
            <p className="text-brand-primary-600 text-base">Secondary Brand Text</p>
            <p className="text-gray-600">Regular text with <span className="text-brand-primary font-medium">brand highlights</span></p>
          </div>
        </div>

        {/* Tags and Badges */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700">Tags & Badges</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              Primary Tag
            </span>
            <span className="bg-brand-primary-100 text-brand-primary-800 px-3 py-1 rounded-full text-sm font-medium">
              Light Tag
            </span>
            <span className="border border-brand-primary text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
              Outline Tag
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm">
          The golden bronze color (#c19d68) provides warmth and sophistication, 
          perfect for a premium brand like Fur Himalaya.
        </p>
      </div>
    </div>
  );
};

export default BrandColorShowcase;