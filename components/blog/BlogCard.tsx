import Image from 'next/image';
import Link from 'next/link';
import { Clock, Heart, Eye, User, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string | null;
    published_at: string | null;
    reading_time?: number | null;
    views_count: number;
    likes_count: number;
    authors: {
      id: string;
      name: string;
      avatar_url?: string | null;
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
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cardClass = featured 
    ? "group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background"
    : "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1";

  const imageHeight = featured ? "h-64 sm:h-80" : "h-48";

  return (
    <Card className={cardClass}>
      <Link href={`/blog/${post.slug}`} className="block">
        <CardHeader className="p-0">
          {post.featured_image && (
            <div className={`relative ${imageHeight} w-full overflow-hidden rounded-t-lg`}>
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Category Badge */}
              {post.categories && (
                <div className="absolute top-4 left-4">
                  <Badge 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    style={{ backgroundColor: post.categories.color || '#047857' }}
                  >
                    {post.categories.name}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className={featured ? "p-8" : "p-6"}>
          {/* Title */}
          <h2 className={`font-bold line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200 ${
            featured ? 'text-2xl sm:text-3xl mb-4' : 'text-xl mb-3'
          }`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className={`text-muted-foreground line-clamp-3 ${
            featured ? 'text-lg mb-6' : 'text-base mb-4'
          }`}>
            {post.excerpt}
          </p>

          {/* Author & Meta */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.authors.avatar_url || ''} alt={post.authors.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm">
                  {post.authors.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{post.authors.name}</p>
                {post.published_at && (
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(post.published_at), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center space-x-4">
              {post.reading_time && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.reading_time} min read</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes_count}</span>
              </div>
            </div>

            {/* Tags */}
            {post.post_tags && post.post_tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span className="text-xs">
                  {post.post_tags.slice(0, 2).map(({ tags }) => tags.name).join(', ')}
                  {post.post_tags.length > 2 && ` +${post.post_tags.length - 2}`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}