'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllBlogPosts, getCategories } from '@/lib/blog-api';
import { BlogPosts } from '@/components/blog-posts';
import { BlogCategoryFilter } from '@/components/blog-category-filter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimateInView } from '@/components/animated-wrapper';
import { BlogPost, Category } from '@/lib/api-client';

export default function BlogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tempCategoryId, setTempCategoryId] = useState<string | null>(
    searchParams?.get('category') || null
  );
  const [appliedCategoryId, setAppliedCategoryId] = useState<string | null>(
    searchParams?.get('category') || null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsData, categoriesData] = await Promise.all([
          getAllBlogPosts(appliedCategoryId || undefined),
          getCategories(),
        ]);
        
        setCategories(categoriesData);
        setPosts(postsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [appliedCategoryId]);

  const handleApplyFilter = () => {
    setAppliedCategoryId(tempCategoryId);
    const params = new URLSearchParams(window.location.search);
    if (tempCategoryId) {
      params.set('category', tempCategoryId);
    } else {
      params.delete('category');
    }
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  const filteredPosts = appliedCategoryId
    ? posts.filter(post => 
        post.categories?.some(cat => cat.id === appliedCategoryId)
      )
    : posts;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-red-500/30 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Content</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/5 rounded-full mix-blend-soft-light filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full mix-blend-soft-light filter blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <AnimateInView className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-900/30 border border-green-800/50 text-green-400 text-sm font-medium mb-6 shadow-lg shadow-green-500/5">
            Latest Updates
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
            Our Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore our latest articles, tutorials, and insights on technology, development, and industry trends.
          </p>
        </AnimateInView>

        <AnimateInView className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-200">Categories</h2>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <BlogCategoryFilter
              categories={categories}
              selectedCategoryId={tempCategoryId}
              onCategorySelect={setTempCategoryId}
            />
            <Button
              onClick={handleApplyFilter}
              className="self-end"
              disabled={tempCategoryId === appliedCategoryId}
            >
              Apply Filter
            </Button>
          </div>
        </AnimateInView>

        <AnimateInView className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-200">
              {appliedCategoryId
                ? `Posts in "${(categories as Category[]).find((c: Category) => c.id === appliedCategoryId)?.name || 'Category'}"`
                : 'All Posts'}
            </h2>
            <div className="hidden md:flex items-center text-sm text-gray-400">
              <span>Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}</span>
              <span className="mx-2">•</span>
              <span>Latest first</span>
            </div>
          </div>
          
          {filteredPosts.length > 0 ? (
            <BlogPosts posts={filteredPosts} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-300">No posts found</h3>
              <p className="text-gray-500 mt-2">
                {appliedCategoryId 
                  ? 'No posts available in this category.' 
                  : 'No blog posts available at the moment.'}
              </p>
              {appliedCategoryId && (
                <button
                  onClick={() => handleApplyFilter()}
                  className="mt-4 px-4 py-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  Clear category filter
                </button>
              )}
            </div>
          )}
        </AnimateInView>
      </div>

      <div className="relative z-10">
        <AnimateInView className="bg-gradient-to-r from-green-900/30 via-emerald-900/20 to-green-900/30 rounded-2xl p-8 md:p-12 mb-24 relative overflow-hidden container mx-auto">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-green-300 via-emerald-300 to-green-500 bg-clip-text text-transparent">
              Never Miss an Update
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest posts delivered right to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
              />
              <button 
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </AnimateInView>
      </div>
    </div>
  );
}