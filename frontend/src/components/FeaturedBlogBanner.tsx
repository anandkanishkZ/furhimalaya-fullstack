import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Star, ArrowRight } from 'lucide-react';
import { getValidImageUrl } from '@/utils/media';
import { BlogPost } from '@/utils/blogApiClient';

interface FeaturedBlogBannerProps {
  post: BlogPost;
}

const FeaturedBlogBanner: React.FC<FeaturedBlogBannerProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const excerpt = post.excerpt || post.content.substring(0, 150) + '...';

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
          {/* Featured Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-brand-red text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs font-semibold">Featured</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Image Section - More compact */}
            <div className="relative h-48 lg:h-64 lg:col-span-2">
              {post.imageUrl ? (
                <Image
                  src={getValidImageUrl(post.imageUrl)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📰</div>
                    <p className="text-sm">No image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section - More space */}
            <div className="p-6 lg:p-8 lg:col-span-3 flex flex-col justify-center">
              <div className="space-y-4">
                {/* Meta Information */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
                  </div>
                  
                  {/* Author with Avatar */}
                  <div className="flex items-center gap-2">
                    {post.author.profilePhoto ? (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-blue-100">
                        <Image 
                          src={getValidImageUrl(post.author.profilePhoto)} 
                          alt={getAuthorName()}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold border-2 border-blue-100">
                        {getAuthorInitials(post.author.name, post.author.email)}
                      </div>
                    )}
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{getAuthorName()}</span>
                  </div>
                </div>

                {/* Title - More compact */}
                <h1 className="text-2xl lg:text-3xl font-bold text-brand-dark leading-tight line-clamp-2">
                  {post.title}
                </h1>

                {/* Excerpt - Shorter */}
                <div className="text-gray-700 text-base leading-relaxed line-clamp-3">
                  {excerpt}
                </div>

                {/* Read More Button - Smaller */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center space-x-2 bg-brand-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-primary-dark transition-all duration-200 w-fit text-sm"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogBanner;