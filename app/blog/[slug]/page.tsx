// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBlogPost, getRelatedPosts } from '@/lib/blog-api';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { FeaturedImage } from '@/components/blog/FeaturedImage';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Comments } from '@/components/blog/comments';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MessageCircle, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ViewTracker } from './view-tracker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found | Zemenay Tech',
        description: 'The requested blog post could not be found.',
      };
    }

    return {
      title: `${post.title} | Zemenay Tech`,
      description: post.excerpt || post.content?.substring(0, 160) + '...',
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content?.substring(0, 160) + '...',
        images: post.featured_image ? [
          {
            url: post.featured_image,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.content?.substring(0, 160) + '...',
        images: post.featured_image ? [post.featured_image] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | Zemenay Tech',
      description: 'An error occurred while loading the post.',
    };
  }
}

async function BlogPostContent({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!params.slug || params.slug === 'avatar-url-or-null' || params.slug.includes('undefined')) {
    notFound();
  }

  let post;
  try {
    post = await getBlogPost(params.slug);
    if (!post) notFound();
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }

  // Format dates
  const publishedDate = post.publishedAt || post.created_at;
  const formattedDate = publishedDate ? new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  // Get related posts (only if the post has a category)
  const relatedPosts = post.category 
    ? await getRelatedPosts(post.id, post.category.id, 3)
    : [];

  // Calculate reading time (fallback to 5 min if not provided)
  const readingTime = post.readingTime || Math.ceil((post.content?.length || 0) / 1000) || 5;

  return (
    <div className="bg-background">
      {/* View Tracker - Client Component */}
      <ViewTracker slug={params.slug} postId={post.id} />
      
      {/* Back button and share */}
      <div className="border-b">
        <div className="container max-w-4xl py-8 px-4 flex justify-between items-center">
          <Link href="/blog" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="container max-w-4xl py-8 px-4">
        <article className="prose dark:prose-invert prose-lg max-w-none">
          {/* Post header */}
          <header className="mb-12">
            {post.category && (
              <Badge variant="outline" className="mb-4">
                {post.category.name}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formattedDate}
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {readingTime} min read
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                {post.commentCount || 0} comments
              </div>
            </div>

            {post.featured_image ? (
              <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-xl overflow-hidden shadow-lg">
                <FeaturedImage
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl mb-8 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-600">No featured image</span>
              </div>
            )}
          </header>

          {/* Post content */}
          <div className="prose dark:prose-invert max-w-none">
            {post.excerpt && (
              <div className="text-xl text-muted-foreground mb-8 italic">
                {post.excerpt}
              </div>
            )}
            
            <div 
              className="prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-sm">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Author info */}
          {post.author && (
            <div className="mt-12 p-6 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-4">
                {post.author.avatar_url ? (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.username}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                    {post.author.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {post.author.username || 'Anonymous'}
                  </h3>
                  {post.author.bio && (
                    <p className="text-muted-foreground text-sm">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">You might also like</h2>
                <Link href="/blog" className="text-sm text-primary hover:underline">
                  View all posts
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                      {relatedPost.featured_image && (
                        <div className="relative h-48">
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">
                          {relatedPost.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {relatedPost.readingTime || 5} min read
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Discussion ({post.commentCount || 0})
              </h2>
            </div>
            <Separator className="mb-8" />
            <Comments postId={post.id} />
          </div>
        </article>
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  return <BlogPostContent params={params} />;
}