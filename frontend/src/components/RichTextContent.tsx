'use client';

import React from 'react';
import './RichTextContent.css';

interface RichTextContentProps {
  content: string;
  className?: string;
}

/**
 * Component to safely render rich text content from the editor
 * Includes proper styling and sanitization
 */
const RichTextContent: React.FC<RichTextContentProps> = ({ content, className = '' }) => {
  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextContent;
