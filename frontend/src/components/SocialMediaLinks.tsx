'use client';

import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ExternalLink
} from 'lucide-react';

interface SocialMediaLinksProps {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  linkedin,
  facebook,
  twitter,
  instagram,
  tiktok,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const containerSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const socialLinks = [
    {
      url: linkedin,
      icon: Linkedin,
      label: 'LinkedIn',
      bgColor: 'hover:bg-blue-600',
      textColor: 'text-blue-600 hover:text-white'
    },
    {
      url: facebook,
      icon: Facebook,
      label: 'Facebook',
      bgColor: 'hover:bg-blue-700',
      textColor: 'text-blue-700 hover:text-white'
    },
    {
      url: twitter,
      icon: Twitter,
      label: 'Twitter',
      bgColor: 'hover:bg-sky-500',
      textColor: 'text-sky-500 hover:text-white'
    },
    {
      url: instagram,
      icon: Instagram,
      label: 'Instagram',
      bgColor: 'hover:bg-pink-600',
      textColor: 'text-pink-600 hover:text-white'
    }
  ];

  // Add TikTok with custom icon since Lucide doesn't have it
  if (tiktok) {
    socialLinks.push({
      url: tiktok,
      icon: ExternalLink, // Using external link as placeholder
      label: 'TikTok',
      bgColor: 'hover:bg-black',
      textColor: 'text-gray-800 hover:text-white'
    });
  }

  const visibleLinks = socialLinks.filter(link => link.url && link.url.trim() !== '');

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      {visibleLinks.map(({ url, icon: Icon, label, bgColor, textColor }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            ${containerSizeClasses[size]} 
            ${textColor} 
            ${bgColor}
            rounded-full 
            border 
            border-current 
            transition-all 
            duration-200 
            hover:scale-110
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-offset-2
          `}
          title={`Visit ${label} profile`}
        >
          <Icon className={sizeClasses[size]} />
          <span className="sr-only">{label}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialMediaLinks;