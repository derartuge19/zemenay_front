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
  const { user, signOut, isLoading } = useAuth(); // use signOut instead of logout
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalUsers: 1,
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
      if (user?.role?.toLowerCase() === 'admin') {
        // safe optional chaining
        try {
          const response = await getPosts();
          const allPosts = Array.isArray(response) ? response : [];

          const published = allPosts.filter(
            (post) => String(post?.status || '').toLowerCase() === 'published',
          );
          const drafts = allPosts.filter(
            (post) => String(post?.status || '').toLowerCase() === 'draft',
          );

          setStats({
            totalPosts: allPosts.length,
            publishedPosts: published.length,
            draftPosts: drafts.length,
            totalUsers: 1, // TODO: fetch real user count
          });

          const sortedPosts = [...allPosts].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });

          setRecentPosts(sortedPosts.slice(0, 5));
        } catch (error) {
          console.error(error);
          setStats({
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            totalUsers: 0,
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

  if (!user) return null;

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-green-500 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-400">
              Welcome back,{' '}
              <span className="text-green-400 font-medium">
                {user.name || user.email}
              </span>
            </p>
          </div>
          {signOut && (
            <Button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium transition-colors duration-200"
            >
              <LogOut className="inline-block w-4 h-4 mr-2" /> Logout
            </Button>
          )}
        </div>

        <main className="w-full space-y-10">
          {!isAdmin ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto p-8 bg-gray-900/50 rounded-xl">
                <div className="h-20 w-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Access Denied
                </h2>
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
              {/* Your existing admin cards, recent posts, and links go here */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
