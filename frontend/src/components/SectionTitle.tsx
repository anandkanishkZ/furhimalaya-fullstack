'use client';

import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  center = false,
  className = '',
}) => {
  const titleRef = useScrollReveal();
  const subtitleRef = useScrollReveal({ delay: 200 });
  const lineRef = useScrollReveal({ delay: 400 });

  return (
    <div 
      className={`mb-12 ${center ? 'text-center' : ''} ${className} max-w-3xl ${
        center ? 'mx-auto' : ''
      }`}
    >
      <h2 
        ref={titleRef}
        className="slide-up text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
      >
        {title}
      </h2>
      {subtitle && (
        <p 
          ref={subtitleRef}
          className="slide-up text-lg md:text-xl text-gray-600 leading-relaxed"
        >
          {subtitle}
        </p>
      )}
      <div 
        ref={lineRef}
        className={`scale-up h-1 w-20 bg-yellow-500 mt-6 ${
          center ? 'mx-auto' : ''
        }`}
      ></div>
    </div>
  );
};

export default SectionTitle;