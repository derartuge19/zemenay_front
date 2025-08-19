import { BlogCard } from './BlogCard';

interface BlogGridProps {
  posts: Array<{
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
  }>;
  loading?: boolean;
}

export function BlogGrid({ posts, loading = false }: BlogGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl text-emerald-600">📝</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No posts found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any blog posts matching your criteria. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  const [featuredPost, ...regularPosts] = posts;

  return (
    <div className="space-y-12">
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="flex-1 border-t border-emerald-200"></div>
            <div className="mx-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium">
              Featured Article
            </div>
            <div className="flex-1 border-t border-emerald-200"></div>
          </div>
          
          <BlogCard post={featuredPost} featured />
        </div>
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}