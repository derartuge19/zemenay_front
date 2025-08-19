'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FeaturedImage } from './blog/FeaturedImage';
import { formatDate } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  published_at?: string;
  created_at: string;
  author_name?: string;
  author?: {
    name?: string;
    avatar_url?: string;
  };
  categories?: Array<{ name: string }>;
  [key: string]: any; // Allow additional properties
}

interface BlogPostsProps {
  posts: BlogPost[];
}

export function BlogPosts({ posts }: BlogPostsProps) {
  if (!posts || !Array.isArray(posts)) {
    console.error('BlogPosts: Invalid posts prop:', posts);
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-red-600">Error loading posts</h3>
        <p className="text-muted-foreground mt-2">Please try again later.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No posts yet</h3>
        <p className="text-muted-foreground mt-2">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-posts-grid">
      {posts.map((post) => {
        if (!post) {
          console.error('BlogPosts: Invalid post in posts array');
          return null;
        }
        
        console.log('Post data:', {
          id: post.id,
          title: post.title,
          featured_image: post.featured_image,
          allProps: Object.keys(post)
        });
        
        const { id, title, slug, excerpt, featured_image, published_at, created_at, author, categories } = post;
        const authorName = author?.name || post.author_name || 'Admin';
        const authorAvatar = author?.avatar_url || '/images/avatar-placeholder.png';
        const postDate = published_at || created_at;
        
        return (
          <Link key={id} href={`/blog/${slug}`} className="group block h-full">
            <Card className="h-full flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-2xl hover:shadow-green-500/10 bg-gradient-to-b from-gray-900/50 to-gray-900/30 border border-gray-800/80 hover:border-green-500/40 overflow-hidden group/card">
              <div className="relative h-52 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                <div className="absolute inset-0 bg-green-500/0 group-hover/card:bg-green-500/5 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] z-0"></div>
                <FeaturedImage
                  src={featured_image}
                  alt={title || 'Blog post image'}
                  fill
                  className="object-cover w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-105 group-hover/card:brightness-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-500 ease-out translate-y-4 group-hover/card:translate-y-0">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-green-600/90 text-white rounded-full shadow-lg shadow-green-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                    {categories?.[0]?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>
              <CardHeader className="flex-1 p-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <time dateTime={new Date(postDate).toISOString()} className="flex items-center">
                    {new Date(postDate).toLocaleDateString()}
                  </time>
                </div>
                <CardTitle className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {title}
                </CardTitle>
                {excerpt && (
                  <CardDescription className="text-gray-300 line-clamp-3">
                    {excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="mt-auto pt-0 border-t border-gray-800">
                <div className="flex items-center justify-end w-full">
                  <span className="text-sm text-green-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Read more
                    <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
