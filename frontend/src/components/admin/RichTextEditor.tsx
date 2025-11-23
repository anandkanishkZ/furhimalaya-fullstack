'use client';

import React, { useMemo, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import MediaPicker from '@/components/admin/MediaPicker';
import { MediaFile } from '@/types/admin';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your content here...',
  height = '400px',
  readOnly = false,
  className = ''
}) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const quillRef = useRef<any>(null);
  
  // Custom image handler - opens MediaPicker
  const imageHandler = useCallback(() => {
    setShowMediaPicker(true);
  }, []);

  // Handle media selection from MediaPicker
  const handleMediaSelect = (file: MediaFile | MediaFile[]) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    
    console.log('🖼️ Image selected:', selectedFile);
    
    if (selectedFile && selectedFile.url) {
      // The quillRef.current now holds the UnprivilegedEditor from React Quill
      // We can use it directly
      if (quillRef.current) {
        try {
          console.log('✅ Quill editor found:', quillRef.current);
          
          // Get current selection or set cursor at end
          const range = quillRef.current.getSelection();
          const index = range ? range.index : quillRef.current.getLength();
          
          console.log('📍 Inserting image at index:', index);
          console.log('🔗 Image URL:', selectedFile.url);
          
          // Insert image at cursor position
          quillRef.current.insertEmbed(index, 'image', selectedFile.url);
          
          // Move cursor after the image
          quillRef.current.setSelection(index + 1);
          
          console.log('🎉 Image inserted successfully!');
        } catch (error) {
          console.error('❌ Error inserting image:', error);
        }
      } else {
        console.error('❌ Quill ref is null - try typing in the editor first');
      }
    }
    setShowMediaPicker(false);
  };

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // Text formatting
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        
        // Text styles
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        
        // Alignment
        [{ 'align': [] }],
        
        // Lists
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        
        // Special formatting
        ['blockquote', 'code-block'],
        
        // Media
        ['link', 'image', 'video'],
        
        // Clear formatting
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), [imageHandler]);

  // Quill formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'align',
    'list',
    'bullet',
    'indent',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video'
  ];

  return (
    <div className={`rich-text-editor-wrapper ${className}`}>
      <style jsx global>{`
        .rich-text-editor-wrapper .quill {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          transition: border-color 0.2s;
        }

        .rich-text-editor-wrapper .quill:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .rich-text-editor-wrapper .ql-toolbar {
          background: #f9fafb;
          border: none !important;
          border-bottom: 2px solid #e5e7eb !important;
          padding: 12px 8px;
        }

        .rich-text-editor-wrapper .ql-container {
          border: none !important;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .rich-text-editor-wrapper .ql-editor {
          min-height: ${height};
          max-height: 600px;
          overflow-y: auto;
          padding: 20px;
          line-height: 1.8;
        }

        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          left: 20px;
        }

        /* Toolbar button styles */
        .rich-text-editor-wrapper .ql-toolbar button {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .rich-text-editor-wrapper .ql-toolbar button:hover {
          background: #e5e7eb;
        }

        .rich-text-editor-wrapper .ql-toolbar button.ql-active {
          background: #dbeafe;
          color: #2563eb;
        }

        .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: #374151;
        }

        .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: #374151;
        }

        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke {
          stroke: #1f2937;
        }

        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill {
          fill: #1f2937;
        }

        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #2563eb;
        }

        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #2563eb;
        }

        /* Dropdown styles */
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label {
          border-radius: 6px;
          transition: all 0.2s;
        }

        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label:hover {
          background: #e5e7eb;
        }

        .rich-text-editor-wrapper .ql-toolbar .ql-picker.ql-expanded .ql-picker-label {
          background: #dbeafe;
          color: #2563eb;
        }

        /* Content styles */
        .rich-text-editor-wrapper .ql-editor h1 {
          font-size: 2.5em;
          font-weight: 700;
          margin: 0.67em 0;
          line-height: 1.2;
        }

        .rich-text-editor-wrapper .ql-editor h2 {
          font-size: 2em;
          font-weight: 700;
          margin: 0.75em 0;
          line-height: 1.3;
        }

        .rich-text-editor-wrapper .ql-editor h3 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.83em 0;
          line-height: 1.4;
        }

        .rich-text-editor-wrapper .ql-editor h4 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 1em 0;
        }

        .rich-text-editor-wrapper .ql-editor h5 {
          font-size: 1.1em;
          font-weight: 600;
          margin: 1.33em 0;
        }

        .rich-text-editor-wrapper .ql-editor h6 {
          font-size: 1em;
          font-weight: 600;
          margin: 1.67em 0;
        }

        .rich-text-editor-wrapper .ql-editor p {
          margin: 1em 0;
        }

        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 16px;
          margin: 1em 0;
          color: #4b5563;
          font-style: italic;
          background: #f3f4f6;
          padding: 12px 16px;
          border-radius: 4px;
        }

        .rich-text-editor-wrapper .ql-editor code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #dc2626;
        }

        .rich-text-editor-wrapper .ql-editor pre {
          background: #1f2937;
          color: #f3f4f6;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }

        .rich-text-editor-wrapper .ql-editor pre code {
          background: transparent;
          color: #f3f4f6;
          padding: 0;
        }

        .rich-text-editor-wrapper .ql-editor a {
          color: #2563eb;
          text-decoration: underline;
        }

        .rich-text-editor-wrapper .ql-editor a:hover {
          color: #1d4ed8;
        }

        .rich-text-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }

        .rich-text-editor-wrapper .ql-editor ul,
        .rich-text-editor-wrapper .ql-editor ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .rich-text-editor-wrapper .ql-editor li {
          margin: 0.5em 0;
        }

        /* Scrollbar styles */
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar {
          width: 8px;
        }

        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }

        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={(content, delta, source, editor) => {
          // Capture editor instance on every change
          if (editor) {
            quillRef.current = editor;
          }
          onChange(content);
        }}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        onChangeSelection={(range, source, editor) => {
          // Also capture on selection change
          if (editor) {
            quillRef.current = editor;
          }
        }}
      />

      {/* Character and Word Count */}
      <div className="flex justify-between items-center mt-3 px-1 text-sm text-gray-500">
        <div className="flex gap-4">
          <span>
            {value.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length} words
          </span>
          <span>
            {value.replace(/<[^>]*>/g, '').length} characters
          </span>
        </div>
        <div className="text-xs text-gray-400">
          💡 Use the toolbar above for rich formatting
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        multiple={false}
        acceptedTypes={['image']}
        title="Select Image for Blog Content"
      />
    </div>
  );
};

export default RichTextEditor;
