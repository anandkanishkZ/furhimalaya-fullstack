import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';
import BlogApiClient, { BlogPost } from '@/utils/blogApiClient';
import SocialShareButtons from '@/components/SocialShareButtons';

interface BlogPostPageProps {
  params: { slug: string };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const blogApi = new BlogApiClient();
    const response = await blogApi.getPostBySlug(slug);
    
    if (response.success) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Forever Engineering',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.seoTitle || `${post.title} - Forever Engineering`,
    description: post.seoDescription || post.excerpt || BlogApiClient.getExcerpt(post.content),
    keywords: 'engineering, construction, blog, insights, projects',
    openGraph: {
      title: post.title,
      description: post.excerpt || BlogApiClient.getExcerpt(post.content),
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || BlogApiClient.getExcerpt(post.content),
      images: post.imageUrl ? [post.imageUrl] : undefined,
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Breadcrumb */}
          <div className="py-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Link>
          </div>

          {/* Article Header */}
          <article className="pb-12">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Meta Information and Share */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4 sm:mb-0">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">{BlogApiClient.formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">{readingTime} min read</span>
                </div>
              </div>
              
              {/* Share Buttons */}
              <SocialShareButtons title={post.title} />
            </div>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="mb-12">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                  width={1200}
                  height={600}
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none content-formatting">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-600">
                    Published by <span className="font-medium text-gray-900">{post.author.email.split('@')[0]}</span>
                  </p>
                </div>
                
                {/* Share Again */}
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-3">Share:</span>
                  <SocialShareButtons title={post.title} />
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles CTA */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Explore More Engineering Insights
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover more articles about engineering excellence, project innovations, and industry insights from our team.
            </p>
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              View All Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}