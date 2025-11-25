import { PrismaClient, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const sampleServices = [
  {
    title: 'Premium Pashmina Shawls',
    description: 'Luxurious hand-woven Pashmina shawls crafted from the finest Changthangi goat wool, featuring traditional Himalayan artistry and contemporary designs.',
    features: [
      '100% authentic Changthangi goat wool',
      'Hand-spun fibers from altitudes above 4,000m',
      'Traditional Himalayan weaving techniques',
      'Natural plant-based dyes',
      'Heirloom quality craftsmanship',
      'GI (Geographical Indication) certified'
    ],
    icon: 'scissors',
    status: 'ACTIVE' as const
  },
  {
    title: 'Luxury Pashmina Scarves',
    description: 'Elegant Pashmina scarves that blend timeless tradition with modern sophistication, perfect for any occasion.',
    features: [
      'Ultra-fine 12-15 micron fibers',
      'Lightweight yet incredibly warm',
      'Reversible designs and patterns',
      'Hand-finished edges',
      'Multiple draping styles',
      'Lifetime quality guarantee'
    ],
    icon: 'heart',
    status: 'ACTIVE' as const
  },
  {
    title: 'Bespoke Pashmina Collections',
    description: 'Custom-designed Pashmina pieces tailored to your preferences, featuring personalized patterns, colors, and embellishments.',
    features: [
      'Personalized design consultation',
      'Custom color combinations',
      'Hand-embroidered motifs',
      'Family crest or monogram options',
      'Limited edition pieces',
      'Master artisan craftsmanship'
    ],
    icon: 'star',
    status: 'ACTIVE' as const
  },
  {
    title: 'Cashmere Accessories',
    description: 'Exquisite collection of cashmere accessories including wraps, stoles, and throws, complementing our premium Pashmina range.',
    features: [
      'Pure cashmere material',
      'Diverse accessory range',
      'Contemporary and classic designs',
      'Seasonal collections',
      'Gift packaging available',
      'International shipping'
    ],
    icon: 'gift',
    status: 'ACTIVE' as const
  },
  {
    title: 'Artisan Collaboration Program',
    description: 'Supporting Himalayan artisan communities through fair trade practices, skill development, and preservation of traditional craftsmanship.',
    features: [
      'Direct artisan partnerships',
      'Fair wage guarantee',
      'Skill development workshops',
      'Cultural heritage preservation',
      'Sustainable production practices',
      'Community development initiatives'
    ],
    icon: 'users',
    status: 'ACTIVE' as const
  },
  {
    title: 'Heritage Care Services',
    description: 'Professional care and restoration services for your precious Pashmina pieces, ensuring they remain treasured heirlooms for generations.',
    features: [
      'Professional cleaning services',
      'Restoration and repair',
      'Proper storage guidance',
      'Maintenance consultations',
      'Authentication services',
      'Insurance valuation reports'
    ],
    icon: 'shield',
    status: 'ACTIVE' as const
  }
];

const sampleProjects = [
  {
    title: 'Royal Kashmir Collection - Limited Edition',
    slug: generateSlug('Royal Kashmir Collection - Limited Edition'),
    category: 'Premium Pashmina',
    description: 'An exclusive collection of 50 hand-woven Pashmina shawls featuring traditional Kashmiri motifs and contemporary luxury finishing. Each piece is numbered and comes with authenticity certification.',
    shortDescription: 'Exclusive 50-piece collection with traditional Kashmiri motifs.',
    clientName: 'Private Collector - Switzerland',
    location: 'Ladakh Highlands, India',
    completionDate: new Date('2024-10-15'),
    startDate: new Date('2024-01-01'),
    budget: 125000.00,
    projectArea: null,
    projectType: 'Bespoke Collection',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    technologies: ['Traditional Hand-spinning', 'Natural Indigo Dyeing', 'Heritage Weaving Patterns'],
    teamMembers: ['Master Weaver Tenzin Norbu', 'Artisan Pema Dolkar', 'Designer Karma Lhamo'],
    challenges: ['Sourcing authentic materials', 'Preserving traditional patterns', 'Meeting luxury standards'],
    achievements: ['GI Certification', 'International Recognition', 'Artisan Community Support'],
    metaTitle: 'Royal Kashmir Pashmina Collection - Furhimalaya',
    metaDescription: 'Exclusive hand-woven Pashmina collection featuring traditional Kashmiri motifs',
    metaKeywords: 'Kashmir, Pashmina, luxury, collection, traditional',
    status: 'ACTIVE' as const,
    featured: true,
    priority: 1
  },
  {
    title: 'Himalayan Heritage Scarves',
    slug: generateSlug('Himalayan Heritage Scarves'),
    category: 'Luxury Scarves',
    description: 'Contemporary scarf designs inspired by ancient Himalayan patterns, featuring sustainable production methods and fair trade practices.',
    clientName: 'Boutique Luxury, Paris',
    completionDate: new Date('2024-08-30'),
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    title: 'Bridal Pashmina Ensemble',
    slug: generateSlug('Bridal Pashmina Ensemble'),
    category: 'Wedding Collection',
    description: 'Bespoke bridal Pashmina ensemble featuring hand-embroidered gold threads and traditional Tibetan blessing motifs.',
    clientName: 'Royal Wedding, Bhutan',
    completionDate: new Date('2024-06-20'),
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    title: 'Corporate Gift Collection',
    slug: generateSlug('Corporate Gift Collection'),
    category: 'Corporate Gifts',
    description: 'Premium Pashmina gift sets for international business relations, featuring custom packaging and company branding.',
    clientName: 'Fortune 500 Company',
    completionDate: new Date('2024-11-10'),
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE' as const,
    featured: false
  },
  {
    title: 'Museum Restoration Project',
    slug: generateSlug('Museum Restoration Project'),
    category: 'Heritage Preservation',
    description: 'Restoration and authentication of 18th-century Pashmina textiles for the National Museum of Nepal.',
    clientName: 'National Museum of Nepal',
    completionDate: new Date('2024-03-25'),
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE' as const,
    featured: false
  }
];

const sampleTestimonials = [
  {
    clientName: 'Isabella Rodriguez',
    position: 'Fashion Director',
    company: 'Harrods London',
    content: 'The Furhimalaya Pashmina collection represents the pinnacle of luxury textiles. The craftsmanship is extraordinary, and each piece tells a story of heritage and artistry that our discerning clients truly appreciate.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    clientName: 'Catherine Chen',
    position: 'Luxury Buyer',
    company: 'Bergdorf Goodman',
    content: 'In my 20 years of curating luxury fashion, I have never encountered Pashmina of such exceptional quality. The fiber fineness and traditional weaving techniques create pieces that are truly museum-worthy.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    clientName: 'James Morrison',
    position: 'Textile Collector',
    company: 'Heritage Textiles Society',
    content: 'Furhimalaya has preserved the authentic art of Pashmina making in its purest form. Their commitment to traditional techniques while maintaining contemporary relevance is remarkable.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    clientName: 'Sophia Williams',
    position: 'Creative Director',
    company: 'Luxury Fashion House',
    content: 'The bespoke Pashmina we commissioned for our haute couture collection exceeded all expectations. The attention to detail and cultural authenticity is unparalleled in the industry.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: false
  },
  {
    clientName: 'Prince Rajesh Singh',
    position: 'Royal Family',
    company: 'Rajasthan Royal Collection',
    content: 'As connoisseurs of fine textiles spanning generations, we recognize Furhimalaya as the keeper of authentic Himalayan craftsmanship. Their pieces are treasured heirlooms in our collection.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: false
  },
  {
    clientName: 'Marie Dubois',
    position: 'Museum Curator',
    company: 'Musée des Arts Décoratifs, Paris',
    content: 'The restoration work and authentication services provided by Furhimalaya have been invaluable for our textile collection. Their expertise in traditional Pashmina is unmatched.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: false
  }
];

async function main() {
  console.log('🌱 Seeding database with sample data...');

  try {
    // Clear existing data
    await prisma.blogPost.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.service.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Cleared existing data');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const defaultUser = await prisma.user.create({
      data: {
        email: 'admin@furhimalaya.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    });
    console.log(`✅ Created admin user: ${defaultUser.email}`);

    // Create new services
    for (const service of sampleServices) {
      await prisma.service.create({
        data: service
      });
      console.log(`✅ Created service: ${service.title}`);
    }

    // Create new projects
    for (const project of sampleProjects) {
      await prisma.project.create({
        data: project
      });
      console.log(`✅ Created project: ${project.title}`);
    }

    // Create new testimonials
    for (const testimonial of sampleTestimonials) {
      await prisma.testimonial.create({
        data: testimonial
      });
      console.log(`✅ Created testimonial: ${testimonial.clientName}`);
    }

    // Clear existing hero slides (no new ones will be seeded)
    console.log('🗑️ Clearing hero slides from database...');
    await prisma.heroSlide.deleteMany({});
    console.log('✅ Hero slides cleared - fallback video will be used');

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });