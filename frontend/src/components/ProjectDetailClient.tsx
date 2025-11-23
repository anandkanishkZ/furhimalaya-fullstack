'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import ComprehensiveProjectDisplay from '@/components/ComprehensiveProjectDisplay';
import publicApiClient, { Project } from '@/utils/publicApiClient';
import { generateProjectStructuredData, generateBreadcrumbStructuredData } from '@/utils/structuredData';
import { 
  Calendar, 
  Building, 
  User, 
  MapPin, 
  Clock, 
  Star, 
  ArrowLeft,
  Share2,
  ExternalLink,
  CheckCircle,
  Award,
  Ruler,
  Camera,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Copy
} from 'lucide-react';

interface ProjectDetailClientProps {
  slug: string;
}

const ProjectDetailClient = ({ slug }: ProjectDetailClientProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectBySlug(slug);
  }, [slug]);

  const fetchProjectBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll fetch all projects and find by matching title as slug
      // In a real implementation, you'd want a dedicated API endpoint for slug-based fetching
      const response = await publicApiClient.getProjects({ limit: 100 });
      
      if (response.success && response.data) {
        // Find project by matching the slug generated from title
        const foundProject = response.data.find(p => 
          p.title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() === slug
        );

        if (!foundProject) {
          notFound();
          return;
        }

        setProject(foundProject);

        // Get related projects (same category, excluding current project)
        const related = response.data
          .filter(p => p.category === foundProject.category && p.id !== foundProject.id)
          .slice(0, 3);
        
        setRelatedProjects(related);
      } else {
        setError('Failed to load project');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('An error occurred while loading the project');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  const shareProject = async () => {
    if (navigator.share && project) {
      try {
        await navigator.share({
          title: project.title,
          text: project.shortDescription || project.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Project link copied to clipboard!');
    }
  };

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(project?.title || '');
    const description = encodeURIComponent(project?.shortDescription || project?.description || '');
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=engineering,construction`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
    };

    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Project link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Project</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/projects">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return notFound();
  }

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: project.title, url: `/projects/${slug}` }
  ]);

  const projectStructuredData = generateProjectStructuredData(project);

  return (
    <>
      {/* Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectStructuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Simplified Hero Section - Title Only */}
        <div className="relative h-[60vh] sm:h-[50vh] lg:h-[60vh] min-h-[400px] sm:min-h-[450px] overflow-hidden">
          {/* Background Image */}
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center">
              <Building className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-white/30" />
            </div>
          )}
          
          {/* Clean Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Hero Content - Title Only */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                {/* Navigation - Fixed positioning to avoid navbar overlap */}
                <nav className="mb-6 sm:mb-8 animate-fade-in" style={{ marginTop: '80px' }}>
                  <Link 
                    href="/projects"
                    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-sm sm:text-base text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Back to Projects
                  </Link>
                </nav>
                
                {/* Category Badge */}
                <div className="mb-4 sm:mb-6 animate-slide-up">
                  <span className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600/90 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full border border-blue-400/30 shadow-lg">
                    {project.category}
                  </span>
                </div>
                
                {/* Main Title - Reduced Size */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight animate-slide-up-delay-1">
                  <span className="bg-gradient-to-r from-white via-white to-white/95 bg-clip-text text-transparent">
                    {project.title}
                  </span>
                </h1>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          {/* Project Description with Social Media Share Buttons */}
          {project.shortDescription && (
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8 sm:mb-10 md:mb-12">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Project Summary</h2>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">{project.shortDescription}</p>
                </div>
                
                {/* Social Media Icons - Top Right */}
                <div className="flex-shrink-0">
                  <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                    {/* Facebook */}
                    <button
                      onClick={() => shareToSocial('facebook')}
                      className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                      title="Share on Facebook"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    {/* Twitter */}
                    <button
                      onClick={() => shareToSocial('twitter')}
                      className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#0C85D0] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                      title="Share on Twitter"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    {/* LinkedIn */}
                    <button
                      onClick={() => shareToSocial('linkedin')}
                      className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                      title="Share on LinkedIn"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    {/* WhatsApp */}
                    <button
                      onClick={() => shareToSocial('whatsapp')}
                      className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                      title="Share on WhatsApp"
                      aria-label="Share on WhatsApp"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.69"/>
                      </svg>
                    </button>
                    
                    {/* Copy Link */}
                    <button
                      onClick={copyToClipboard}
                      className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                      title="Copy Link"
                      aria-label="Copy Link"
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    {/* Native Share (Mobile) */}
                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                      <button
                        onClick={shareProject}
                        className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                        title="Share Project"
                        aria-label="Share Project"
                      >
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Project Overview</h2>
                <div className="prose prose-sm sm:prose-lg max-w-none">
                  {project.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {project.galleryImages && project.galleryImages.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                    Project Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {project.galleryImages.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${project.title} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Technologies & Materials</h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {project.achievements && project.achievements.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                    Key Achievements
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {project.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm sm:text-base text-gray-700">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 sticky top-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Project Details</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  {project.projectType && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Project Type</label>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">{project.projectType}</p>
                    </div>
                  )}
                  
                  {project.budget && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Budget</label>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">₹{project.budget.toLocaleString()}</p>
                    </div>
                  )}
                  
                  {project.projectArea && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Project Area</label>
                      <p className="text-sm sm:text-base text-gray-900 font-medium flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {project.projectArea} sq ft
                      </p>
                    </div>
                  )}
                  
                  {project.startDate && project.completionDate && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Duration</label>
                      <p className="text-sm sm:text-base text-gray-900 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {calculateDuration(project.startDate, project.completionDate)}
                      </p>
                    </div>
                  )}
                  
                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">Team Members</label>
                      <div className="space-y-1">
                        {project.teamMembers.map((member, index) => (
                          <p key={index} className="text-gray-900 text-xs sm:text-sm">{member}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 sm:mt-8">
                  <Link href="/contact">
                    <Button variant="primary" className="w-full text-sm sm:text-base">
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      Get Quote for Similar Project
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mt-8 sm:mt-10 md:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Client Testimonial</h2>
              <blockquote className="text-base sm:text-lg text-gray-700 italic border-l-4 border-blue-600 pl-4 sm:pl-6">
                "{project.testimonial}"
                {project.clientName && (
                  <footer className="text-sm sm:text-base text-gray-600 mt-2 not-italic">
                    — {project.clientName}
                  </footer>
                )}
              </blockquote>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-12 sm:mt-14 md:mt-16">
              <SectionTitle
                title="Related Projects"
                subtitle="Explore similar projects in this category"
                center
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10 md:mt-12">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-40 sm:h-48">
                        {relatedProject.imageUrl ? (
                          <Image
                            src={relatedProject.imageUrl}
                            alt={relatedProject.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Building className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-5 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {relatedProject.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{relatedProject.category}</p>
                        {relatedProject.shortDescription && (
                          <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">
                            {relatedProject.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectDetailClient;