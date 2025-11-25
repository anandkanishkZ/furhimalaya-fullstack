/**
 * Fallback Data for API Failures
 * Provides default content when the API is unavailable
 */

export const fallbackSiteSettings = {
  company_name: 'Furhimalaya',
  company_tagline: 'Heritage Pashmina Collection',
  company_description: 'Experience the timeless artistry of authentic Himalayan Pashmina. Our master artisans weave centuries of tradition into luxurious pieces.',
  seo_meta_title: 'Furhimalaya - Authentic Himalayan Pashmina Heritage Collection',
  seo_meta_description: 'Discover exquisite handcrafted Pashmina from the Himalayas. Premium quality, authentic designs, and timeless elegance in every piece.',
  seo_keywords: 'Pashmina, Himalayan, handcrafted, luxury, heritage, authentic, artisan, cashmere',
  company_phone: '+977-1-4XXX-XXXX',
  company_email: 'info@furhimalaya.com',
  company_address: 'Kathmandu, Nepal',
  company_website: 'https://furhimalaya.com',
  social_facebook: 'https://facebook.com/furhimalaya',
  social_instagram: 'https://instagram.com/furhimalaya',
  stats_pashminas_crafted: '500+',
  stats_master_artisans: '12',
  stats_years_heritage: '25',
  stats_global_clients: '150+',
  site_maintenance_mode: false
};

export const fallbackProjects = [
  {
    id: 'heritage-collection-1',
    title: 'Royal Heritage Collection',
    slug: 'royal-heritage-collection',
    category: 'Premium Pashmina',
    description: 'An exquisite collection showcasing the finest Himalayan Pashmina craftsmanship with traditional motifs and royal elegance.',
    shortDescription: 'Premium Pashmina collection with traditional royal motifs',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE' as const,
    featured: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan-showcase-1',
    title: 'Master Artisan Showcase',
    slug: 'master-artisan-showcase',
    category: 'Handwoven Pashmina',
    description: 'Witness the incredible skill of our master weavers as they create intricate patterns using traditional techniques passed down through generations.',
    shortDescription: 'Showcasing traditional weaving techniques and patterns',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE' as const,
    featured: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const fallbackServices = [
  {
    id: 'custom-pashmina',
    title: 'Custom Pashmina Design',
    description: 'Create your own unique Pashmina with personalized designs, colors, and patterns crafted by our master artisans.',
    features: [
      'Personalized design consultation',
      'Premium Himalayan cashmere',
      'Traditional hand-weaving techniques',
      'Custom color combinations',
      'Heritage packaging'
    ],
    icon: 'palette',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'heritage-collection',
    title: 'Heritage Collection',
    description: 'Explore our curated collection of traditional Pashmina designs that have been perfected over centuries.',
    features: [
      'Authentic traditional patterns',
      'Museum-quality craftsmanship',
      'Certificate of authenticity',
      'Historical design documentation',
      'Premium gift packaging'
    ],
    icon: 'star',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan-workshops',
    title: 'Artisan Workshops',
    description: 'Experience the art of Pashmina weaving through immersive workshops with our master craftspeople.',
    features: [
      'Hands-on weaving experience',
      'Traditional technique learning',
      'Cultural heritage education',
      'Master artisan guidance',
      'Certificate of participation'
    ],
    icon: 'academic-cap',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const fallbackTeamMembers = [
  {
    id: 'master-weaver-1',
    name: 'Pemba Sherpa',
    position: 'Master Weaver',
    bio: 'With over 30 years of experience, Pemba is renowned for his exceptional skill in traditional Pashmina weaving techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artisan-designer-1',
    name: 'Sangita Tamang',
    position: 'Heritage Designer',
    bio: 'Sangita specializes in traditional pattern research and authentic design preservation, ensuring cultural authenticity.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b932?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const fallbackTestimonials = [
  {
    id: 'testimonial-1',
    name: 'Eleanor Chen',
    position: 'Art Collector',
    company: 'Private Collection',
    content: 'The craftsmanship is absolutely extraordinary. Each piece tells a story of heritage and tradition that you can feel in the fabric itself.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'testimonial-2',
    name: 'James Morrison',
    position: 'Fashion Curator',
    company: 'Heritage Fashion Institute',
    content: 'Furhimalaya represents the finest tradition of Himalayan textile arts. Their attention to authenticity is unmatched.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const fallbackHeroSlides = [
  {
    id: 'default-video',
    title: 'Furhimalaya',
    subtitle: 'Heritage Collection',
    description: 'Experience the timeless artistry of authentic Himalayan Pashmina. Witness the meticulous craftsmanship of our master artisans as they weave centuries of tradition into luxurious pieces.',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    videoUrl: 'https://youtu.be/ioWJ34PODR0',
    videoType: 'youtube' as const,
    imageAlt: 'Furhimalaya Heritage Pashmina Craftsmanship',
    primaryButtonText: 'Explore Collections',
    primaryButtonUrl: '/services',
    secondaryButtonText: 'Visit Atelier',
    secondaryButtonUrl: '/contact',
    textAlign: 'left' as const,
    textColor: '#ffffff',
    overlayOpacity: 0.5,
    status: 'ACTIVE' as const,
    priority: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const fallbackBlogPosts = [
  {
    id: 'heritage-craft-1',
    title: 'The Art of Traditional Pashmina Weaving',
    slug: 'art-of-traditional-pashmina-weaving',
    excerpt: 'Discover the ancient techniques and cultural significance behind authentic Himalayan Pashmina craftsmanship.',
    content: 'The art of Pashmina weaving is a testament to centuries of cultural heritage and master craftsmanship...',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED' as const,
    featured: true,
    readingTime: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  }
];