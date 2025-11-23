import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  position: string;
  company: string;
  testimonial: string;
  image: string;
  rating?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  position,
  company,
  testimonial,
  image,
  rating = 5,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover-lift">
      <div className="flex items-center mb-6">
        {image && image !== '/images/placeholder-avatar.jpg' ? (
          <Image 
            src={image} 
            alt={name} 
            width={64} 
            height={64} 
            className="rounded-full object-cover mr-4 transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-gray-600">
            {position}{company && position && ', '}{company}
          </p>
          {rating && (
            <div className="flex items-center mt-1">
              {renderStars(rating)}
            </div>
          )}
        </div>
      </div>
      <div className="relative">
        <svg className="absolute top-0 left-0 w-10 h-10 text-blue-100 -mt-6 -ml-4 transition-all duration-300 opacity-70" fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 8c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 11.5c-2.481 0-4.5-2.019-4.5-4.5s2.019-4.5 4.5-4.5 4.5 2.019 4.5 4.5-2.019 4.5-4.5 4.5zM22 8c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 11.5c-2.481 0-4.5-2.019-4.5-4.5s2.019-4.5 4.5-4.5 4.5 2.019 4.5 4.5-2.019 4.5-4.5 4.5z"></path>
        </svg>
        <p className="text-gray-600 italic pl-6 leading-relaxed">{testimonial}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;