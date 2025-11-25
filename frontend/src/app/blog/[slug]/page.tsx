import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, BookOpen, Sparkles, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';
import BlogApiClient, { BlogPost } from '@/utils/blogApiClient';
import SocialShareButtons from '@/components/SocialShareButtons';
import RichTextContent from '@/components/RichTextContent';
import { getValidImageUrl } from '@/utils/media';

// Generate static params for static export
export async function generateStaticParams() {
  // For static export, provide some sample blog posts to pre-generate
  return [
    { slug: 'art-of-traditional-pashmina-weaving' },
    { slug: 'himalayan-heritage-craftsmanship' },
    { slug: 'master-artisan-stories' }
  ];
}

interface BlogPostPageProps {
  params: { slug: string };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // During build time, return null to prevent errors
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME) {
    return null;
  }

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
      title: 'Story Not Found - Furhimalaya',
      description: 'The requested artisan story could not be found.',
    };
  }

  return {
    title: post.seoTitle || `${post.title} - Furhimalaya Journal`,
    description: post.seoDescription || post.excerpt || BlogApiClient.getExcerpt(post.content),
    keywords: 'furhimalaya, pashmina, himalayan craftsmanship, artisan stories, luxury textiles',
    openGraph: {
      title: post.title,
      description: post.excerpt || BlogApiClient.getExcerpt(post.content),
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.imageUrl ? [getValidImageUrl(post.imageUrl)] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || BlogApiClient.getExcerpt(post.content),
      images: post.imageUrl ? [getValidImageUrl(post.imageUrl)] : undefined,
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  
  const getAuthorInitials = (name?: string, email?: string) => {
    if (name) {
      const names = name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return email ? email.substring(0, 2).toUpperCase() : 'FS';
  };

  const getAuthorName = () => {
    return post.author.name || post.author.email.split('@')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-primary-50/30 to-brand-primary-100/50">
      {/* Hero Section with Featured Image */}
      {post.imageUrl && (
        <section className="relative h-[70vh] overflow-hidden">
          <Image 
            src={getValidImageUrl(post.imageUrl)} 
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Navigation Breadcrumb - Floating */}
          <div className="absolute top-8 left-8 z-10">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-white/90 hover:text-white bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 transition-all duration-300 font-medium border border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journal
            </Link>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Artisan Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className={post.imageUrl ? '' : 'pt-24'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Breadcrumb - For posts without images */}
          {!post.imageUrl && (
            <div className="py-8">
              <Link 
                href="/blog" 
                className="inline-flex items-center text-brand-primary-600 hover:text-brand-primary-700 transition-colors font-medium bg-brand-primary-50 hover:bg-brand-primary-100 rounded-full px-6 py-3"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Journal
              </Link>
            </div>
          )}

          {/* Article Header - For posts without images */}
          {!post.imageUrl && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-brand-primary-50 rounded-full px-6 py-3 mb-6">
                <Sparkles className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">Artisan Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
            </div>
          )}

          {/* Article Content */}
          <article className="pb-16">
            {/* Meta Information Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-16 shadow-2xl border border-white/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Author Section - Enhanced */}
                <div className="flex items-center gap-4">
                  {post.author.profilePhoto ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-brand-primary-200 shadow-lg">
                      <Image 
                        src={getValidImageUrl(post.author.profilePhoto)} 
                        alt={getAuthorName()}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 flex items-center justify-center text-white text-lg font-bold border-3 border-brand-primary-200 shadow-lg">
                      {getAuthorInitials(post.author.name, post.author.email)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-brand-primary-600 font-medium mb-1">Written by</p>
                    <h4 className="text-xl font-bold text-gray-900">{getAuthorName()}</h4>
                  </div>
                </div>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-brand-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Published</p>
                      <p className="text-sm font-semibold text-gray-900">{BlogApiClient.formatDate(post.publishedAt || post.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-brand-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Reading Time</p>
                      <p className="text-sm font-semibold text-gray-900">{readingTime} minutes</p>
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary-100 rounded-full flex items-center justify-center">
                      <Share2 className="h-5 w-5 text-brand-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Share Story</p>
                      <div className="mt-2">
                        <SocialShareButtons title={post.title} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.imageUrl && (
              <div className="mb-12 group">
                <div className="overflow-hidden rounded-xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl">
                  <Image 
                    src={getValidImageUrl(post.imageUrl)} 
                    alt={post.title}
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    width={1200}
                    height={600}
                    priority
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg prose-brand max-w-none">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <RichTextContent content={post.content} />
              </div>
            </div>

            {/* Enhanced Article Footer */}
            <div className="mt-16">
              <div className="bg-gradient-to-br from-brand-primary-50 to-amber-50 rounded-2xl p-8 shadow-lg border border-brand-primary-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Enhanced Author Section */}
                  <div className="flex items-center gap-4">
                    {post.author.profilePhoto ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-brand-primary-200 shadow-xl ring-4 ring-white">
                        <Image 
                          src={getValidImageUrl(post.author.profilePhoto)} 
                          alt={getAuthorName()}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 flex items-center justify-center text-white font-bold text-xl border-3 border-brand-primary-200 shadow-xl ring-4 ring-white">
                        {getAuthorInitials(post.author.name, post.author.email)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-brand-primary-600 font-medium mb-1">Master Artisan</p>
                      <p className="font-bold text-xl text-gray-900 mb-1">{getAuthorName()}</p>
                      <p className="text-sm text-gray-600">Crafting stories of luxury and tradition</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Share Section */}
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <p className="text-sm font-semibold text-brand-primary-700">Share this story</p>
                    <SocialShareButtons title={post.title} />
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Luxury Related Articles CTA */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-900 via-brand-primary-800 to-amber-900"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative bg-gradient-to-br from-brand-primary-50/90 to-amber-50/90 backdrop-blur-sm rounded-3xl p-12 text-center border border-brand-primary-200 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-full mb-6 shadow-lg ring-4 ring-brand-primary-100">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-brand-primary-800 to-amber-800 bg-clip-text text-transparent mb-4">
                Discover More Artisan Stories
              </h3>
              <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Immerse yourself in tales of traditional craftsmanship, luxury heritage, and the timeless art of Pashmina weaving from the heart of the Himalayas.
              </p>
              <Link 
                href="/blog" 
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 text-white font-semibold rounded-full hover:from-brand-primary-700 hover:to-brand-primary-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <BookOpen className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Explore All Stories
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering for this page
// Static generation enabled for export
// export const dynamic = 'force-dynamic';