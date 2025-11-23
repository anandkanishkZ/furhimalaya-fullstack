'use client';

import React from 'react';
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';

interface SocialShareButtonsProps {
  title: string;
  url?: string;
}

export default function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-600 mr-2">Share:</span>
      <div className="flex space-x-1">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <button
          onClick={handleCopyLink}
          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          title="Copy Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}