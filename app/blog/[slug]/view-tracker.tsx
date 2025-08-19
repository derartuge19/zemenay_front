'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function ViewTracker({ slug, postId }: { slug: string; postId: string }) {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Skip if we're in development to avoid polluting analytics
        if (process.env.NODE_ENV === 'development') {
          console.log('[ViewTracker] Skipping view tracking in development mode');
          return;
        }
        
        // Check if this view has already been tracked in this session
        const hasTracked = sessionStorage.getItem(`viewed_${postId}`);
        if (hasTracked) {
          console.log(`[ViewTracker] View already tracked for post: ${slug}`);
          return;
        }
        
        console.log(`[ViewTracker] Tracking view for post: ${slug}`);
        
        // Increment the view count using the updatePost method
        const response = await apiClient.updatePost(postId, {
          // This tells the backend to increment the view count
          // The actual increment happens on the server side
          increment_views: true
        });
        
        if (response) {
          // Mark this post as viewed in this session
          sessionStorage.setItem(`viewed_${postId}`, 'true');
          console.log(`[ViewTracker] Successfully updated view count for post: ${slug}`);
        }
      } catch (error) {
        console.error('[ViewTracker] Error updating view count:', error);
      }
    };

    trackView();
  }, [slug, postId]);

  // This component doesn't render anything
  return null;
}
