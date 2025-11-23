import { Metadata } from 'next';
import publicApiClient from '@/utils/publicApiClient';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

// Generate metadata for SEO optimization
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // Fetch project data
    const response = await publicApiClient.getProjects({ limit: 100 });
    
    if (response.success && response.data) {
      const project = response.data.find(p => 
        p.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim() === params.slug
      );

      if (project) {
        const projectDescription = project.description || `Explore ${project.title}, a ${project.category.toLowerCase()} collection by Fur Himalaya. Authentic luxury Pashmina craftsmanship and heritage artisan services.`;
        
        return {
          title: `${project.title} | Fur Himalaya Collections`,
          description: projectDescription,
          keywords: [
            project.category.toLowerCase(),
            'engineering project',
            'construction',
            'fur himalaya',
            project.clientName || '',
            'building construction',
            'infrastructure development'
          ].filter(Boolean).join(', '),
          authors: [{ name: 'Fur Himalaya' }],
          openGraph: {
            title: project.title,
            description: projectDescription,
            url: `/projects/${params.slug}`,
            siteName: 'Fur Himalaya',
            images: project.imageUrl ? [
              {
                url: project.imageUrl,
                width: 1200,
                height: 630,
                alt: `${project.title} - ${project.category} collection by Fur Himalaya`,
              }
            ] : [],
            locale: 'en_US',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: projectDescription,
            images: project.imageUrl ? [project.imageUrl] : [],
            creator: '@FurHimalaya'
          },
          alternates: {
            canonical: `/projects/${params.slug}`,
          },
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Project Not Found | Forever Shine Engineering',
    description: 'The requested project could not be found. Explore our other engineering projects and construction services.',
    openGraph: {
      title: 'Collection Not Found | Fur Himalaya',
      description: 'The requested project could not be found. Explore our other engineering projects and construction services.',
      url: `/projects/${params.slug}`,
      siteName: 'Fur Himalaya',
    },
  };
}

export default function ProjectLayout({ children, params }: ProjectLayoutProps) {
  return children;
}