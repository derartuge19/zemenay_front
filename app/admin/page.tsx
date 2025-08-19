'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { getPosts } from '@/lib/blog-api';

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalUsers: 1
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && (user.role === 'admin' || user.role === 'ADMIN')) {
        try {
          console.log('Fetching dashboard data...');
          const response = await getPosts();
          console.log('API Response:', response);
          
          // The response is an array of posts directly, not wrapped in { data }
          const allPosts = Array.isArray(response) ? response : [];
          console.log('All posts:', allPosts);
          
          // Log all unique status values for debugging
          const statusCounts = allPosts.reduce((acc, post) => {
            const status = String(post?.status || 'unknown').toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          console.log('Post status counts:', statusCounts);
          
          // Count posts by status (case-insensitive)
          const published = allPosts.filter(post => 
            String(post?.status || '').toLowerCase() === 'published'
          );
          
          const drafts = allPosts.filter(post => 
            String(post?.status || '').toLowerCase() === 'draft'
          );
          
          console.log('Published posts:', published.length);
          console.log('Draft posts:', drafts.length);
          
          // Update stats
          const statsData = {
            totalPosts: allPosts.length,
            publishedPosts: published.length,
            draftPosts: drafts.length,
            totalUsers: 1 // TODO: Fetch actual user count
          };
          
          console.log('Setting stats:', statsData);
          setStats(statsData);
          
          // Sort posts by date (newest first) and get top 5
          const sortedPosts = [...allPosts].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          
          console.log('Recent posts:', sortedPosts.slice(0, 5));
          setRecentPosts(sortedPosts.slice(0, 5));
          
        } catch (error) {
          console.error('Error in fetchDashboardData:', error);
          // Set default/empty values on error
          setStats({
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            totalUsers: 0
          });
          setRecentPosts([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const isAdmin = user.role === 'admin' || user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-green-500 mb-2">Dashboard Overview</h1>
            <p className="text-gray-400">
              Welcome back, <span className="text-green-400 font-medium">{user.name || user.email}</span>
            </p>
          </div>
        </div>

        <main className="w-full space-y-10">
          {!isAdmin ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto p-8 bg-gray-900/50 rounded-xl">
                <div className="h-20 w-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
                <p className="text-gray-300 mb-6 text-base">
                  You need administrator privileges to access this dashboard.
                </p>
                <Button 
                  asChild 
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-3">Welcome to Admin Dashboard</h2>
                <p className="text-gray-300 text-lg">
                  Manage your blog content, users, and settings in one place
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Total Posts</p>
                        <p className="text-2xl font-bold text-white">
                          {loading ? '...' : stats.totalPosts}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">All time</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-green-900/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Published</p>
                        <p className="text-2xl font-bold text-white">
                          {loading ? '...' : stats.publishedPosts}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Live posts</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-green-900/30 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Drafts</p>
                        <p className="text-2xl font-bold text-white">
                          {loading ? '...' : stats.draftPosts}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">In progress</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-yellow-900/30 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Users</p>
                        <p className="text-2xl font-bold text-white">
                          {loading ? '...' : stats.totalUsers}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Active accounts</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-blue-900/30 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors cursor-pointer">
                  <Link href="/admin/posts/new">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-green-900/30 flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 text-green-400" />
                      </div>
                      <CardTitle className="text-white">Create New Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">
                        Write and publish a new blog post
                      </p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors cursor-pointer">
                  <Link href="/admin/posts">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <CardTitle className="text-white">Manage Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">
                        View, edit, and manage all blog posts
                      </p>
                    </CardContent>
                  </Link>
                </Card>

                <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors cursor-pointer">
                  <Link href="/admin/users">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <CardTitle className="text-white">Manage Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">
                        Manage user accounts and permissions
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </div>

              {recentPosts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Recent Posts</h3>
                  <div className="grid gap-4">
                    {recentPosts.map((post: any) => (
                      <Card key={post.id} className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{post.title}</h4>
                              <p className="text-sm text-gray-400 mt-1">
                                {post.excerpt?.substring(0, 100)}...
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs">
                                <span className={`px-2 py-1 rounded-full ${
                                  post.status === 'published' 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-yellow-900/30 text-yellow-400'
                                }`}>
                                  {post.status}
                                </span>
                                <span className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                              asChild
                            >
                              <Link href={`/admin/posts/${post.id}`}>Edit</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}