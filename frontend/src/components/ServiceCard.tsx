'use client';

import Link from 'next/link';
import { ArrowRight, Ruler, Building2, Calculator, MapPin, Home, HardHat, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode; // For backward compatibility
  iconName?: string; // For API-based icon names
  link: string;
  showFeatures?: boolean; // Optional flag to control features display
  showLearnMore?: boolean; // Optional flag to control learn more button
  features?: string[]; // Optional features array from API
}

// Icon mapping for API-based icon names
const getIconComponent = (iconName: string | undefined) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    ruler: Ruler,
    building: Building2,
    building2: Building2,
    calculator: Calculator,
    map: MapPin,
    mappin: MapPin,
    home: Home,
    hardhat: HardHat,
    checkcircle: CheckCircle,
  };
  
  const IconComponent = iconName ? iconMap[iconName.toLowerCase()] || Building2 : Building2;
  return <IconComponent className="w-7 h-7" />;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  iconName,
  features,
  link,
  showFeatures = false,
  showLearnMore = false,
}) => {
  const cardRef = useScrollReveal();
  
  // Use provided icon or generate from iconName
  const iconElement = icon || getIconComponent(iconName);

  const CardContent = (
    <div 
      ref={cardRef}
      className="scale-up card p-6 hover-lift group h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl"
    >
      <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 mb-4 group-hover:bg-blue-700 group-hover:text-white transition-all duration-500 flex-shrink-0">
        {iconElement}
      </div>
      <h3 className={`text-lg md:text-xl font-bold mb-3 text-gray-900 transition-all duration-300 group-hover:text-blue-700`}>
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed flex-grow text-sm md:text-base">{description}</p>
      
      {/* Features List (only if explicitly enabled) */}
      {showFeatures && features && features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Features:</h4>
          <div className="space-y-1">
            {features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-start text-sm">
                <CheckCircle className="text-blue-600 h-3 w-3 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
            {features.length > 3 && (
              <div className="text-xs text-blue-600 font-medium">
                +{features.length - 3} more features
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Learn More Button (only if explicitly enabled) */}
      {showLearnMore && (
        <div className="mt-auto pt-4">
          <div className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 transition-all duration-300 group">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Link href={link} className="block h-full">
      {CardContent}
    </Link>
  );
};

export default ServiceCard;