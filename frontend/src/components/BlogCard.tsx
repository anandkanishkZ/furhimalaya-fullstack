import React from 'react';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { getValidImageUrl } from '@/utils/media';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: {
    name?: string;
    email: string;
    profilePhoto?: string;
  };
  slug: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  image,
  date,
  author,
  slug,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    return author.name || author.email.split('@')[0];
  };

  return (
    <article className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-brand-primary-200">
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative overflow-hidden h-64">
          {image ? (
            <Image 
              src={getValidImageUrl(image)} 
              alt={title} 
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 flex items-center justify-center">
              <div className="text-brand-primary-600 text-center">
                <svg className="mx-auto h-16 w-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm font-medium">Artisan Story</p>
              </div>
            </div>
          )}
          
          {/* Overlay gradient for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>
      
      <div className="p-8">
        {/* Meta Information - Redesigned */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary-100 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-brand-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">{formatDate(date)}</span>
          </div>
          
          {/* Author with Enhanced Avatar */}
          <div className="flex items-center gap-3">
            {author.profilePhoto ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-brand-primary-200 shadow-sm">
                <Image 
                  src={getValidImageUrl(author.profilePhoto)} 
                  alt={getAuthorName()}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 flex items-center justify-center text-white text-xs font-bold border-2 border-brand-primary-200 shadow-sm">
                {getAuthorInitials(author.name, author.email)}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">{getAuthorName()}</span>
          </div>
        </div>

        {/* Title - Enhanced */}
        <Link href={`/blog/${slug}`} className="block mb-4">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-primary-700 transition-colors duration-300 line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Excerpt - Enhanced */}
        <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed text-lg">
          {excerpt}
        </p>

        {/* Read More Link - Luxury Button */}
        <Link 
          href={`/blog/${slug}`}
          className="group/link inline-flex items-center gap-3 text-brand-primary-600 hover:text-brand-primary-700 font-semibold transition-all duration-300"
        >
          <span className="relative">
            Read Story
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary-600 group-hover/link:w-full transition-all duration-300"></div>
          </span>
          <div className="w-8 h-8 bg-brand-primary-50 rounded-full flex items-center justify-center group-hover/link:bg-brand-primary-100 group-hover/link:scale-110 transition-all duration-300">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Bottom Border Accent - Brand Colors */}
      <div className="h-1 bg-gradient-to-r from-brand-primary-400 via-brand-primary-600 to-brand-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </article>
  );
};

export default BlogCard;