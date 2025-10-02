'use client';

import { useRef, useState } from 'react';
import { client } from '@/lib/amplify';
import toast from 'react-hot-toast';

interface AttachmentUploaderProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number;
  children: React.ReactNode;
}

export default function AttachmentUploader({
  onUpload,
  accept = 'image/*,.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB default
  children,
}: AttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Validate file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      toast.error('File type not supported');
      return;
    }

    setUploading(true);

    try {
      // Mock file upload for development
      // In production, this would use the actual GraphQL mutation
      const mockDownloadUrl = `https://mock-s3-bucket.s3.amazonaws.com/${file.name}`;
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('File uploaded successfully');
      onUpload(mockDownloadUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div
        onClick={handleClick}
        className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {uploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
}