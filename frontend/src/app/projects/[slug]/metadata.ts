import { Metadata } from 'next';
import publicApiClient from '@/utils/publicApiClient';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
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
        return {
          title: `${project.title} | Forever Shine Engineering Projects`,
          description: project.description,
          keywords: [
            project.category.toLowerCase(),
            'engineering project',
            'construction',
            'forever shine engineering',
            project.clientName || '',
          ].filter(Boolean).join(', '),
          openGraph: {
            title: project.title,
            description: project.description,
            url: `/projects/${params.slug}`,
            siteName: 'Forever Shine Engineering',
            images: project.imageUrl ? [
              {
                url: project.imageUrl,
                width: 1200,
                height: 630,
                alt: project.title,
              }
            ] : [],
            locale: 'en_US',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.description,
            images: project.imageUrl ? [project.imageUrl] : [],
          },
          alternates: {
            canonical: `/projects/${params.slug}`,
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
    description: 'The requested project could not be found.',
  };
}

export default function Layout() {
  return null; // This file is only for metadata generation
}