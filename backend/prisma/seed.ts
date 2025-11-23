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
    title: 'Municipality Drawing & Design',
    description: 'Professional architectural and engineering drawings for municipality approvals, including residential, commercial, and industrial projects.',
    features: [
      'Municipality-approved architectural drawings',
      'Structural engineering designs',
      'MEP (Mechanical, Electrical, Plumbing) layouts',
      'Site development plans',
      'Building permit documentation',
      'Code compliance verification'
    ],
    icon: 'drafting-compass',
    status: 'ACTIVE' as const
  },
  {
    title: '3D Interior Design',
    description: 'Advanced 3D modeling and interior design services for residential and commercial spaces with photorealistic visualizations.',
    features: [
      '3D architectural visualization',
      'Interior space planning and design',
      'Material selection and specification',
      'Lighting design solutions',
      'Furniture layout and selection',
      'Virtual reality walkthroughs'
    ],
    icon: 'cube',
    status: 'ACTIVE' as const
  },
  {
    title: 'Estimation & Costing',
    description: 'Accurate project cost estimation and quantity surveying services for construction projects of all scales.',
    features: [
      'Detailed quantity take-offs',
      'Material cost analysis',
      'Labor cost estimation',
      'Bill of quantities (BOQ) preparation',
      'Value engineering services',
      'Cost control and monitoring'
    ],
    icon: 'calculator',
    status: 'ACTIVE' as const
  },
  {
    title: 'Civil Surveying',
    description: 'Comprehensive land surveying and mapping services using advanced GPS and total station technology.',
    features: [
      'Topographic surveying',
      'Boundary demarcation',
      'Construction layout surveying',
      'GPS coordinate mapping',
      'Digital elevation modeling',
      'Survey data processing and CAD mapping'
    ],
    icon: 'map',
    status: 'ACTIVE' as const
  },
  {
    title: 'Property Valuation',
    description: 'Professional property valuation services for banking institutions, including residential, commercial, and hospitality sector assessments.',
    features: [
      'Bank-grade property valuations',
      'Luxury hotel and apartment assessments',
      'Commercial property appraisals',
      'Construction progress valuations',
      'Investment grade property analysis',
      'Comprehensive valuation reports for institutional lending'
    ],
    icon: 'home',
    status: 'ACTIVE' as const
  },
  {
    title: 'Site Supervision & Running Bill Verification',
    description: 'Comprehensive construction monitoring, quality control, and running bill verification services for banking institutions.',
    features: [
      'Running bill verification for institutional lenders',
      'Construction progress monitoring',
      'Quality assurance and control',
      'Material testing and verification',
      'Safety compliance monitoring',
      'Project milestone reporting for financial institutions'
    ],
    icon: 'clipboard-check',
    status: 'ACTIVE' as const
  }
];

const sampleProjects = [
  {
    title: 'Modern Residential Complex - Lagankhel',
    slug: generateSlug('Modern Residential Complex - Lagankhel'),
    category: 'Residential Building',
    description: 'A state-of-the-art residential complex featuring 24 modern apartments with contemporary design and eco-friendly construction.',
    shortDescription: 'Modern 24-unit residential complex with eco-friendly features.',
    clientName: 'Himalayan Developers Pvt. Ltd.',
    location: 'Lagankhel, Lalitpur',
    completionDate: new Date('2023-12-15'),
    startDate: new Date('2022-03-01'),
    budget: 18500000.00,
    projectArea: 12000.75,
    projectType: 'New Construction',
    imageUrl: '/images/projects/residential-complex-lagankhel.jpg',
    galleryImages: ['/images/projects/residential-lagankhel-1.jpg'],
    technologies: ['Reinforced Concrete', 'Smart Security Systems'],
    teamMembers: ['Eng. Amit Shrestha', 'Arch. Sita Maharjan'],
    challenges: ['Urban space constraints', 'Noise control'],
    achievements: ['Green Building Certification', 'Zero safety incidents'],
    metaTitle: 'Modern Residential Complex Lagankhel',
    metaDescription: 'Modern residential complex in Lagankhel with 24 apartments',
    metaKeywords: 'residential, Lagankhel, apartments',
    status: 'ACTIVE' as const,
    featured: true,
    priority: 1
  },
  {
    title: 'Commercial Plaza - New Baneshwor',
    slug: generateSlug('Commercial Plaza - New Baneshwor'),
    category: 'Commercial Building',
    description: '5-story commercial building with modern office spaces, retail outlets, and underground parking facility.',
    clientName: 'Metro Business Center',
    completionDate: new Date('2023-09-30'),
    imageUrl: '/images/projects/commercial-plaza-baneshwor.jpg',
    status: 'ACTIVE' as const,
    featured: false
  },
  {
    title: 'Industrial Warehouse - Bhaktapur',
    slug: generateSlug('Industrial Warehouse - Bhaktapur'),
    category: 'Industrial Project',
    description: 'Large-scale industrial warehouse with advanced loading facilities and climate control systems.',
    clientName: 'Nepal Industrial Corporation',
    completionDate: new Date('2023-06-20'),
    imageUrl: '/images/projects/industrial-warehouse-bhaktapur.jpg',
    status: 'ACTIVE' as const,
    featured: false
  },
  {
    title: 'Highway Bridge Construction',
    slug: generateSlug('Highway Bridge Construction'),
    category: 'Infrastructure',
    description: 'Construction of a modern concrete bridge over Bagmati River with earthquake-resistant design.',
    clientName: 'Department of Roads, Government of Nepal',
    completionDate: new Date('2023-11-10'),
    imageUrl: '/images/projects/highway-bridge-bagmati.jpg',
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    title: 'Heritage Building Restoration',
    slug: generateSlug('Heritage Building Restoration'),
    category: 'Property Valuation',
    description: 'Complete restoration of a 19th-century heritage building with structural assessment.',
    clientName: 'Patan Heritage Conservation Trust',
    completionDate: new Date('2023-08-25'),
    imageUrl: '/images/projects/heritage-building-patan.jpg',
    status: 'ACTIVE' as const,
    featured: false
  }
];

const sampleTestimonials = [
  {
    clientName: 'Rajesh Sharma',
    position: 'Managing Director',
    company: 'Nepal Investment Mega Bank',
    content: 'Forever Shine Engineering has been our trusted partner for property valuation services. Their thorough assessments and professional reports have been instrumental in our loan approval processes.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    clientName: 'Sunita Lama',
    position: 'Project Manager',
    company: 'Kathmandu Metropolitan Office',
    content: 'The municipality drawing and design services provided by Forever Shine Engineering are exceptional. They ensure all our projects meet regulatory standards and are completed efficiently.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    clientName: 'Amit Kumar Gupta',
    position: 'CEO',
    company: 'Gupta Construction Pvt. Ltd.',
    content: 'Their 3D interior design and visualization services transformed our residential project. The attention to detail and creative solutions exceeded our expectations.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: true
  },
  {
    clientName: 'Priya Thapa',
    position: 'Branch Manager',
    company: 'Nabil Bank Limited',
    content: 'Forever Shine Engineering\'s property valuation reports are comprehensive and accurate. Their professional approach has made our lending decisions more confident.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    status: 'ACTIVE' as const,
    featured: false
  },
  {
    clientName: 'Binod Maharjan',
    position: 'Owner',
    company: 'Maharjan Residence',
    content: 'The structural design and supervision services for our home construction were outstanding. The team was professional, timely, and delivered quality work.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 4,
    status: 'ACTIVE' as const,
    featured: false
  },
  {
    clientName: 'Dr. Kamala Singh',
    position: 'Director',
    company: 'Singh Medical Center',
    content: 'The estimation and costing services provided were very accurate and helped us plan our medical facility construction within budget. Highly recommended!',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
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
        email: 'info@forevershine.com.np',
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

    // Seed Hero Slides
    console.log('🌱 Seeding hero slides...');
    const heroSlides = [
      {
        title: 'Forever Shine',
        subtitle: 'Engineering Excellence',
        description: 'Professional engineering consultancy and construction services for residential and commercial projects across Nepal. We deliver precision, quality, and innovation in every project.',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        imageAlt: 'Forever Shine Engineering - Professional engineering consultancy',
        primaryButtonText: 'Our Services',
        primaryButtonUrl: '/services',
        secondaryButtonText: 'Get a Quote',
        secondaryButtonUrl: '/contact',
        status: Status.ACTIVE,
        displayOrder: 1,
        textAlign: 'left',
        textColor: '#ffffff',
        overlayOpacity: 0.4,
        seoTitle: 'Forever Shine Engineering - Professional Engineering Consultancy in Nepal',
        seoDescription: 'Leading engineering consultancy providing construction, valuation, and design services across Nepal with precision and excellence.'
      },
      {
        title: 'Property Valuation',
        subtitle: 'Expert Services',
        description: 'Comprehensive property valuation services for institutional lenders, including running bill verification, site supervision, and accurate market assessments with professional expertise.',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        imageAlt: 'Property Valuation Services - Expert assessment and verification',
        primaryButtonText: 'Valuation Services',
        primaryButtonUrl: '/services#valuation',
        secondaryButtonText: 'Contact Us',
        secondaryButtonUrl: '/contact',
        status: Status.ACTIVE,
        displayOrder: 2,
        textAlign: 'left',
        textColor: '#ffffff',
        overlayOpacity: 0.5,
        seoTitle: 'Professional Property Valuation Services in Nepal',
        seoDescription: 'Expert property valuation services for institutional lenders with accurate assessments and comprehensive reporting.'
      },
      {
        title: 'Construction',
        subtitle: 'Innovation & Quality',
        description: 'From municipality drawings to 3D interior design, we deliver comprehensive engineering solutions with precision. Modern construction techniques meet traditional craftsmanship.',
        imageUrl: 'https://images.unsplash.com/photo-1464822759844-d150ad6fbbed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        imageAlt: 'Construction Excellence - Modern building and design solutions',
        primaryButtonText: 'View Projects',
        primaryButtonUrl: '/projects',
        secondaryButtonText: 'Start Project',
        secondaryButtonUrl: '/contact',
        status: Status.ACTIVE,
        displayOrder: 3,
        textAlign: 'left',
        textColor: '#ffffff',
        overlayOpacity: 0.35,
        seoTitle: 'Professional Construction Services and Engineering Solutions',
        seoDescription: 'Complete construction services from municipal drawings to interior design with modern techniques and quality craftsmanship.'
      }
    ];

    // First, clear existing hero slides
    await prisma.heroSlide.deleteMany({});
    console.log('🗑️ Cleared existing hero slides');

    for (const slideData of heroSlides) {
      try {
        const slide = await prisma.heroSlide.create({
          data: slideData
        });
        console.log(`✅ Created hero slide: ${slide.title}`);
      } catch (error) {
        console.error(`❌ Error creating hero slide "${slideData.title}":`, error);
      }
    }

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