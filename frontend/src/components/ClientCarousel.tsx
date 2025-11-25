'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, ExternalLink } from 'lucide-react';
import publicApiClient, { Client } from '@/utils/publicApiClient';

interface ClientCarouselProps {
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  className?: string;
  backgroundStyle?: 'light' | 'dark' | 'gradient';
}

const ClientCarousel: React.FC<ClientCarouselProps> = ({
  title = "Our Trusted Clients",
  subtitle = "Proud to work with industry leaders",
  showTitle = true,
  className = "",
  backgroundStyle = 'light'
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await publicApiClient.getClients({ 
          status: 'ACTIVE',
          limit: 20 // Fetch active clients
        });
        
        if (response.success && response.data) {
          setClients(response.data);
        } else {
          setError('Failed to fetch clients');
        }
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setError('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const getBackgroundClasses = () => {
    switch (backgroundStyle) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'gradient':
        return 'bg-gradient-to-r from-blue-50 to-indigo-100';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <section className={`py-12 sm:py-16 md:py-20 ${getBackgroundClasses()} ${className}`}>
        <div className="container mx-auto px-4 sm:px-6">
          {showTitle && (
            <div className="text-center mb-8 sm:mb-12">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
            </div>
          )}
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !clients.length) {
    return (
      <section className={`py-12 sm:py-16 md:py-20 ${getBackgroundClasses()} ${className}`}>
        <div className="container mx-auto px-4 sm:px-6">
          {showTitle && (
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                {title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>
          )}
          <div className="text-center py-12">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Building Client Partnerships
              </h3>
              <p className="text-gray-600">
                We're actively building relationships with valued clients and partners. 
                Check back soon to see our growing network of trusted collaborations.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 sm:py-16 md:py-20 ${getBackgroundClasses()} ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        {showTitle && (
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        )}
        
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-xl p-6 sm:p-8 md:p-12">
            {/* Seamless looping carousel */}
            <div className="flex items-center justify-center animate-carousel-smooth">
              {/* First set of logos */}
              <div className="flex items-center justify-center space-x-8 sm:space-x-12 md:space-x-16 min-w-full">
                {clients.map((client) => (
                  <ClientLogo key={client.id} client={client} />
                ))}
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex items-center justify-center space-x-8 sm:space-x-12 md:space-x-16 min-w-full">
                {clients.map((client) => (
                  <ClientLogo key={`duplicate-${client.id}`} client={client} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Subtle gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 w-16 sm:w-24 md:w-32 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-600 mb-4">
            Interested in partnering with us?
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Get in Touch
            <ExternalLink className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Reusable client logo component
const ClientLogo: React.FC<{ client: Client }> = ({ client }) => (
  <div
    className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer group"
    title={client.name}
  >
    {client.website ? (
      <a 
        href={client.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full h-full"
      >
        <ClientLogoImage client={client} />
      </a>
    ) : (
      <ClientLogoImage client={client} />
    )}
  </div>
);

// Reusable client logo image component
const ClientLogoImage: React.FC<{ client: Client }> = ({ client }) => (
  client.logoUrl ? (
    <Image
      src={client.logoUrl}
      alt={client.name}
      width={220}
      height={220}
      className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:drop-shadow-xl transition-all"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
      <span className="text-xs font-medium text-gray-600 text-center px-2 group-hover:text-blue-600">
        {client.name}
      </span>
    </div>
  )
);

export default ClientCarousel;