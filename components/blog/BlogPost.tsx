'use client';

import Image from 'next/image';
import { Clock, Heart, Eye, Calendar, Tag, Share2, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useState } from 'react';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    featured_image?: string | null;
    published_at: string | null;
    reading_time?: number | null;
    views_count: number;
    likes_count: number;
    seo_title?: string | null;
    seo_description?: string | null;
    authors: {
      id: string;
      name: string;
      bio?: string | null;
      avatar_url?: string | null;
      social_twitter?: string | null;
      social_linkedin?: string | null;
      social_github?: string | null;
    };
    categories?: {
      id: string;
      name: string;
      slug: string;
      color?: string | null;
    } | null;
    post_tags?: Array<{
      tags: {
        id: string;
        name: string;
        slug: string;
      };
    }>;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const [likes, setLikes] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    if (hasLiked) return;
    
    try {
      // In a real implementation, this would call the API
      setLikes(likes + 1);
      setHasLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // You could show a toast notification here
        break;
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        {post.featured_image && (
          <div className="relative h-96 w-full mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        <div className="space-y-6">
          {/* Category */}
          {post.categories && (
            <div className="flex justify-center">
              <Badge 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2"
                style={{ backgroundColor: post.categories.color || '#047857' }}
              >
                {post.categories.name}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            {post.published_at && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.published_at), 'MMMM dd, yyyy')}</span>
              </div>
            )}
            {post.reading_time && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{post.views_count} views</span>
            </div>
          </div>

          {/* Author Info */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={post.authors?.avatar_url || ''} 
                    alt={post.authors?.name || 'Author'} 
                  />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                    {post.authors?.name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{post.authors?.name || 'Unknown Author'}</p>
                  {post.authors?.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.authors.bio}
                    </p>
                  )}
                  {/* Social Links */}
                  <div className="flex items-center space-x-2 mt-2">
                    {post.authors?.social_twitter && (
                      <Button size="sm" variant="ghost" asChild>
                        <a 
                          href={`https://twitter.com/${post.authors.social_twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {post.authors?.social_linkedin && (
                      <Button size="sm" variant="ghost" asChild>
                        <a 
                          href={post.authors.social_linkedin.startsWith('http') 
                            ? post.authors.social_linkedin 
                            : `https://linkedin.com/in/${post.authors.social_linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {post.authors?.social_github && (
                      <Button size="sm" variant="ghost" asChild>
                        <a 
                          href={`https://github.com/${post.authors.social_github}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.342-3.369-1.342-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.295 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.147 20.192 22 16.45 22 12.017 22 6.484 17.522 2 12 2z" />
                          </svg>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          className="prose prose-emerald prose-lg max-w-none
            prose-headings:text-foreground prose-p:text-foreground
            prose-strong:text-foreground prose-em:text-foreground
            prose-blockquote:border-emerald-500 prose-blockquote:text-foreground
            prose-code:text-emerald-600 prose-code:bg-emerald-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-white
            prose-a:text-emerald-600 hover:prose-a:text-emerald-700
            prose-img:rounded-lg prose-img:shadow-md
            dark:prose-code:bg-emerald-950 dark:prose-code:text-emerald-400
            dark:prose-pre:bg-gray-800"
        />
      </div>

      {/* Tags */}
      {post.post_tags && post.post_tags.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-6" />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
              <Tag className="w-4 h-4" />
              <span>Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.post_tags.map(({ tags }) => (
                <Badge 
                  key={tags.id} 
                  variant="secondary"
                  className="hover:bg-emerald-100 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  {tags.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-12">
        <Separator className="mb-6" />
        <div className="flex items-center justify-between">
          {/* Like Button */}
          <Button 
            onClick={handleLike} 
            variant={hasLiked ? "default" : "outline"}
            className={hasLiked ? "bg-emerald-600 hover:bg-emerald-700" : "hover:bg-emerald-50"}
          >
            <Heart className={`w-4 h-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
          </Button>

          {/* Share Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground mr-2">Share:</span>
            <Button size="sm" variant="ghost" onClick={() => handleShare('twitter')}>
              <Twitter className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleShare('linkedin')}>
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleShare('copy')}>
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}