import React from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  description: string;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  category,
  image,
  description,
  onClick,
}) => {
  return (
    <div 
      className="group overflow-hidden rounded-lg shadow-lg cursor-pointer hover-lift"
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-48 md:h-64">
        <Image 
          src={image} 
          alt={title} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-sm opacity-90 mb-2">{description}</p>
          <span className="inline-block px-3 py-1 bg-blue-700 text-white text-xs rounded-full">View Details</span>
        </div>
      </div>
      <div className="p-6 bg-white">
        <span className="text-sm text-blue-700 font-medium">{category}</span>
        <h3 className="text-xl font-bold mt-1 mb-2 text-gray-900 transition-colors duration-300 group-hover:text-blue-700">{title}</h3>
        <p className="text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;