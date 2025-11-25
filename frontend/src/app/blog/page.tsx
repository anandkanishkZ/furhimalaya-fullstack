import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import SectionTitle from '@/components/SectionTitle';
import FeaturedBlogBanner from '@/components/FeaturedBlogBanner';
import BlogApiClient, { BlogPost } from '@/utils/blogApiClient';
import { Sparkles, BookOpen, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Journal - Furhimalaya | Stories of Himalayan Craftsmanship',
  description: 'Discover the art, tradition, and stories behind our luxury pashmina creations. Explore the heritage of Himalayan craftsmanship.',
  keywords: 'pashmina blog, himalayan craftsmanship, luxury textiles, artisan stories, traditional weaving',
  openGraph: {
    title: 'Journal - Furhimalaya | Stories of Himalayan Craftsmanship',
    description: 'Discover the art, tradition, and stories behind our luxury pashmina creations. Explore the heritage of Himalayan craftsmanship.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journal - Furhimalaya | Stories of Himalayan Craftsmanship',
    description: 'Discover the art, tradition, and stories behind our luxury pashmina creations. Explore the heritage of Himalayan craftsmanship.',
  }
};

async function getBlogPosts(): Promise<{ featured: BlogPost | null; regular: BlogPost[] }> {
  // During build time, return empty data to prevent errors
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME) {
    return { featured: null, regular: [] };
  }

  try {
    const blogApi = new BlogApiClient();
    const response = await blogApi.getPublishedPosts({ limit: 20 });
    
    if (response.success) {
      const posts = response.data || [];
      const featuredPost = posts.find(post => post.featured) || null;
      const regularPosts = posts.filter(post => !post.featured);
      
      return { featured: featuredPost, regular: regularPosts };
    }
    
    console.error('Failed to fetch blog posts:', response.message);
    return { featured: null, regular: [] };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { featured: null, regular: [] };
  }
}

// Force dynamic rendering for this page to handle API calls properly
// Static generation enabled for export
// export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const { featured, regular } = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-primary-50/30 to-brand-primary-100/50">
      {/* Featured Post Banner */}
      {featured && (
        <FeaturedBlogBanner post={featured} />
      )}

      {/* Hero Section - Luxury Journal */}
      {!featured && (
        <section className="relative py-24 sm:py-32 md:py-40 bg-gradient-to-br from-brand-primary-800 via-brand-primary-700 to-brand-primary-900 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-brand-primary-300 rounded-full filter blur-3xl animate-pulse"></div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
                <Sparkles className="w-5 h-5 text-brand-primary-200" />
                <span className="text-white font-medium">Artisan Stories</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white leading-tight">
                The Furhimalaya<br />Journal
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/90 mb-6 font-light">
                Stories of Heritage & Craftsmanship
              </p>
              
              <p className="text-lg text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
                Discover the rich tapestry of Himalayan traditions, meet our master artisans, and explore the timeless techniques that create each exquisite piece in our collection.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-white text-brand-primary hover:bg-brand-primary-50 px-8 py-4 text-lg font-medium rounded-2xl transition-all duration-300 flex items-center justify-center">
                  <BookOpen className="mr-2 w-5 h-5" />
                  Explore Stories
                </button>
                <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium rounded-2xl transition-all duration-300">
                  View Collection
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Section */}
      <section className={`py-20 sm:py-28 bg-white ${featured ? 'pt-8' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-primary-50 rounded-full px-6 py-3 mb-6">
              <BookOpen className="w-5 h-5 text-brand-primary-600" />
              <span className="text-brand-primary-700 font-medium">
                {featured ? 'More Stories' : 'Latest Stories'}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-brand-primary-800 to-gray-900 bg-clip-text text-transparent">
              {featured ? 'Continue Reading' : 'Artisan Chronicles'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {featured 
                ? 'Explore more stories from our community of master craftspeople and their artistic journeys'
                : 'Dive deep into the world of Himalayan craftsmanship and discover the stories behind each creation'
              }
            </p>
          </div>

          {regular.length === 0 && !featured ? (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="mx-auto h-32 w-32 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="h-16 w-16 text-brand-primary-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Stories Coming Soon</h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We're preparing beautiful stories about our artisans, their craft, and the journey of creating each masterpiece. Check back soon for inspiring tales from the Himalayas.
              </p>
            </div>
          ) : regular.length === 0 && featured ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-brand-primary-50 to-white rounded-3xl p-12 border border-brand-primary-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">More Stories Coming Soon</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Enjoy our featured story above while we prepare more captivating tales from our artisan community.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Articles Grid - Modern Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regular.map((post) => (
                  <BlogCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt || BlogApiClient.getExcerpt(post.content)}
                    image={post.imageUrl || ''}
                    date={post.publishedAt || post.createdAt}
                    author={post.author}
                    slug={post.slug}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {regular.length >= 12 && (
                <div className="text-center mt-16">
                  <button className="group bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 text-white px-10 py-4 rounded-2xl font-medium hover:from-brand-primary-700 hover:to-brand-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <BookOpen className="inline mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Load More Stories
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}