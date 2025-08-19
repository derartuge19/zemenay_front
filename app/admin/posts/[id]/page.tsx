'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function PostDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter();

  useEffect(() => {
    const checkPostAndRedirect = async () => {
      try {
        // Try to fetch the post to ensure it exists
        await apiClient.getPost(params.id);
        // If we get here, the post exists, so redirect to edit
        router.replace(`/admin/posts/${params.id}/edit`);
      } catch (error) {
        console.error('Error fetching post:', error);
        router.replace('/404');
      }
    };

    checkPostAndRedirect();
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p>Redirecting to edit page...</p>
      </div>
    </div>
  );
}

// This tells Next.js this is a dynamic route that shouldn't be statically generated
export const dynamic = 'force-dynamic';
