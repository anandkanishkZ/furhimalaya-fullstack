import { MetadataRoute } from 'next';
import publicApiClient from '@/utils/publicApiClient';
import BlogApiClient from '@/utils/blogApiClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://furhimalaya.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Dynamic project pages
  let projectPages: MetadataRoute.Sitemap = [];
  
  try {
    const response = await publicApiClient.getProjects({ limit: 100 });
    
    if (response.success && response.data) {
      projectPages = response.data.map((project) => {
        const slug = project.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        return {
          url: `${baseUrl}/projects/${slug}`,
          lastModified: new Date(project.updatedAt),
          changeFrequency: 'monthly' as const,
          priority: project.featured ? 0.8 : 0.6,
        };
      });
    }
  } catch (error) {
    console.error('Error generating sitemap for projects:', error);
  }

  // Dynamic blog post pages
  let blogPages: MetadataRoute.Sitemap = [];
  
  try {
    const blogApi = new BlogApiClient();
    const response = await blogApi.getPublishedPosts({ limit: 100 });
    
    if (response.success && response.data) {
      blogPages = response.data.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: post.featured ? 0.8 : 0.6,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap for blog posts:', error);
  }

  return [...staticPages, ...projectPages, ...blogPages];
}