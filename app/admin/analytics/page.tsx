"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Eye, FileText, BarChart2, Calendar } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Post {
  id: string;
  title: string;
  view_count: number;
  created_at: string;
  published_at: string;
  status: 'draft' | 'published';
}

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log('Fetching posts...');
        
        const response = await apiClient.getPosts({ 
          status: 'published',
          limit: 100
        });
        
        console.log('API Response:', response);
        const postsData = Array.isArray(response) ? response : response?.data || response?.posts || [];
        
        if (!Array.isArray(postsData)) {
          throw new Error('Invalid posts data format received from server');
        }
        
        const processedPosts = postsData.map(post => ({
          ...post,
          view_count: post.view_count || post.views || 0,
          created_at: post.created_at || post.published_at || new Date().toISOString()
        }));
        
        setPosts(processedPosts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
        console.error('Error:', errorMessage, err);
        setError(errorMessage);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
    const averageViews = totalPosts > 0 ? Math.round((totalViews / totalPosts) * 10) / 10 : 0;
    
    // Get top 5 most viewed posts
    const popularPosts = [...posts]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 5);

    // Prepare monthly data for the past 5 months
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Generate last 5 months including current month
    const last5Months = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now);
      date.setMonth(now.getMonth() - (4 - i)); // Get last 5 months
      const month = date.getMonth();
      const year = date.getFullYear();
      return {
        month: month,
        year: year,
        label: `${monthNames[month]} '${year.toString().slice(2)}`,
        views: 0
      };
    });

    // Calculate views for each month
    const monthlyData = posts.reduce((acc, post) => {
      if (!post.created_at) return acc;
      const postDate = new Date(post.created_at);
      const postMonth = postDate.getMonth();
      const postYear = postDate.getFullYear();
      
      // Find if this post is in our last 5 months
      const monthEntry = last5Months.find(m => 
        m.month === postMonth && m.year === postYear
      );
      
      if (monthEntry) {
        monthEntry.views += post.view_count || 0;
      }
      
      return acc;
    }, last5Months);

    // Sort by date and format for chart
    const monthlyStats = monthlyData
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map(month => ({
        month: month.label,
        views: month.views
      }));

    return {
      totalPosts,
      totalViews,
      averageViews,
      popularPosts,
      monthlyStats
    };
  }, [posts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <p className="text-sm text-gray-500 mt-2">Check the browser console for more details.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Views/Post</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageViews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Views Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Views</CardTitle>
            <CardDescription>Views over the past 5 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.monthlyStats}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ddd' }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ddd' }}
                  tickLine={{ stroke: '#ddd' }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#8884d8' }}
                  activeDot={{ r: 6, fill: '#6a5acd' }}
                  name="Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Posts Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Posts by Views</CardTitle>
            <CardDescription>Most viewed content</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats.popularPosts}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="title" 
                  hide 
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ddd' }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Views']}
                  labelFormatter={(label) => `Post: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="view_count" 
                  name="Views" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Posts</CardTitle>
          <CardDescription>Top viewed content with view counts</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.popularPosts.length > 0 ? (
            <div className="space-y-4">
              {stats.popularPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="font-medium truncate mr-4">{post.title}</span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {post.view_count?.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No posts found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
