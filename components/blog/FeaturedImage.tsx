'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FeaturedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export function FeaturedImage({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
  width,
  height,
  fill = false,
}: FeaturedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(src || undefined);

  useEffect(() => {
    // Reset error state when src changes
    setHasError(false);
    
    // If src is empty or null, don't try to load an image
    if (!src) {
      console.log('No image source provided');
      setImgSrc(undefined);
      return;
    }

    // Create a full URL if the src is a relative path
    let imageUrl = src;
    if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:')) {
      // If it starts with a slash, it's already an absolute path
      imageUrl = src.startsWith('/') ? 
        `${window.location.origin}${src}` : 
        `${window.location.origin}/${src}`;
    }

    console.log('Loading image:', {
      originalSrc: src,
      processedUrl: imageUrl,
      location: window.location.href
    });
    
    setImgSrc(imageUrl);
  }, [src]);

  if (!imgSrc) {
    return (
      <div 
        className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center`}
        style={fill ? { width: '100%', height: '100%' } : { width, height }}
      >
        <span className="text-gray-400 dark:text-gray-600 text-sm">
          No image available
        </span>
      </div>
    );
  }

  return (
    <>
      {hasError ? (
        <div 
          className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center`}
          style={fill ? { width: '100%', height: '100%' } : { width, height }}
        >
          <span className="text-gray-400 dark:text-gray-600 text-sm">
            Could not load image
          </span>
        </div>
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          className={className}
          priority={priority}
          sizes={sizes}
          onError={(e) => {
            console.error('Failed to load image:', {
              src: imgSrc,
              error: e,
              element: e.target
            });
            setHasError(true);
          }}
          onLoad={() => console.log('Image loaded successfully:', imgSrc)}
        />
      )}
    </>
  );
}
