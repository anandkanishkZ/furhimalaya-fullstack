'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  Building, 
  User, 
  MapPin, 
  DollarSign, 
  Ruler, 
  Star, 
  CheckCircle,
  Award,
  Users,
  Target,
  Quote,
  Share2,
  Hash,
  FileText,
  Lightbulb,
  Clock,
  Camera,
  ExternalLink
} from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string;
  clientName?: string;
  location?: string;
  completionDate?: string;
  startDate?: string;
  budget?: number;
  projectArea?: number;
  projectType?: string;
  imageUrl?: string;
  galleryImages?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  priority?: number;
  metaTitle?: string;
  metaDescription?: string;
  technologies?: string[];
  teamMembers?: string[];
  challenges?: string[];
  achievements?: string[];
  testimonial?: string;
  socialImages?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ComprehensiveProjectDisplayProps {
  project: ProjectData;
  showAllDetails?: boolean;
}

const ComprehensiveProjectDisplay: React.FC<ComprehensiveProjectDisplayProps> = ({ 
  project, 
  showAllDetails = true 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatArea = (area?: number) => {
    if (!area) return 'Not specified';
    return `${area.toLocaleString()} sq ft`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active' },
      INACTIVE: { color: 'bg-red-100 text-red-800', label: 'Inactive' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority?: number) => {
    if (priority === undefined) return null;
    
    const priorityConfig = {
      0: { color: 'bg-gray-100 text-gray-800', label: 'Normal' },
      1: { color: 'bg-blue-100 text-blue-800', label: 'Low' },
      2: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      3: { color: 'bg-orange-100 text-orange-800', label: 'High' },
      4: { color: 'bg-red-100 text-red-800', label: 'Critical' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig[0];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="relative">
        {project.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2">
          {project.featured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Star size={16} />
              Featured
            </span>
          )}
          {getStatusBadge(project.status)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6">
        {/* Title and Basic Info */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            {getPriorityBadge(project.priority)}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Building size={16} />
              {project.category}
            </span>
            <span className="flex items-center gap-1">
              <Hash size={16} />
              {project.projectType || 'Not specified'}
            </span>
          </div>

          {project.shortDescription && (
            <p className="text-lg text-gray-700 leading-relaxed">
              {project.shortDescription}
            </p>
          )}
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Client Information */}
          {project.clientName && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User size={18} className="text-brand-primary" />
                <h3 className="font-semibold text-gray-900">Client</h3>
              </div>
              <p className="text-gray-700">{project.clientName}</p>
            </div>
          )}

          {/* Location */}
          {project.location && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-brand-primary" />
                <h3 className="font-semibold text-gray-900">Location</h3>
              </div>
              <p className="text-gray-700">{project.location}</p>
            </div>
          )}

          {/* Budget */}
          {project.budget && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-brand-primary" />
                <h3 className="font-semibold text-gray-900">Budget</h3>
              </div>
              <p className="text-gray-700 font-medium">{formatCurrency(project.budget)}</p>
            </div>
          )}

          {/* Project Area */}
          {project.projectArea && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Ruler size={18} className="text-brand-primary" />
                <h3 className="font-semibold text-gray-900">Area</h3>
              </div>
              <p className="text-gray-700 font-medium">{formatArea(project.projectArea)}</p>
            </div>
          )}

          {/* Start Date */}
          {project.startDate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-brand-primary" />
                <h3 className="font-semibold text-gray-900">Started</h3>
              </div>
              <p className="text-gray-700">{formatDate(project.startDate)}</p>
            </div>
          )}

          {/* Completion Date */}
          {project.completionDate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-brand-primary" />
                <h3 className="font-semibold text-gray-900">Completed</h3>
              </div>
              <p className="text-gray-700">{formatDate(project.completionDate)}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-brand-primary" />
              <h3 className="text-xl font-semibold text-gray-900">Project Description</h3>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-brand-primary" />
              <h3 className="text-xl font-semibold text-gray-900">Technologies Used</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Team Members */}
        {project.teamMembers && project.teamMembers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-brand-primary" />
              <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.teamMembers.map((member, index) => (
                <span 
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Images */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Camera size={18} className="text-brand-primary" />
              <h3 className="text-xl font-semibold text-gray-900">Project Gallery</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.galleryImages.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges */}
        {project.challenges && project.challenges.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-brand-blue" />
              <h3 className="text-xl font-semibold text-gray-900">Challenges Overcome</h3>
            </div>
            <ul className="space-y-2">
              {project.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {project.achievements && project.achievements.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-brand-blue" />
              <h3 className="text-xl font-semibold text-gray-900">Key Achievements</h3>
            </div>
            <ul className="space-y-2">
              {project.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Star size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Client Testimonial */}
        {project.testimonial && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Quote size={18} className="text-brand-blue" />
              <h3 className="text-xl font-semibold text-gray-900">Client Testimonial</h3>
            </div>
            <blockquote className="bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-lg">
              <p className="text-gray-700 italic leading-relaxed">"{project.testimonial}"</p>
              {project.clientName && (
                <footer className="mt-2 text-sm text-gray-600">
                  — {project.clientName}
                </footer>
              )}
            </blockquote>
          </div>
        )}

        {/* Social Images */}
        {project.socialImages && project.socialImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Share2 size={18} className="text-brand-blue" />
              <h3 className="text-xl font-semibold text-gray-900">Social Media Assets</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.socialImages.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={image}
                    alt={`${project.title} - Social ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        {showAllDetails && (
          <div className="space-y-2 text-xs text-gray-500 border-t pt-4">
            <p>Created: {formatDate(project.createdAt)}</p>
            <p>Last Updated: {formatDate(project.updatedAt)}</p>
            <p>Project ID: {project.id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveProjectDisplay;