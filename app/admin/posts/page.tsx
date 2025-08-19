'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getPosts, deleteBlogPost } from '@/lib/blog-api';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/lib/api-client';

export default function PostsPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      // Ensure we're setting an array to the posts state
      const postsData = Array.isArray(response) ? response : response?.data || [];
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive',
      });
      // Ensure posts is always an array even on error
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      console.error('Cannot delete post: No ID provided');
      toast({
        title: 'Error',
        description: 'Cannot delete post: No ID provided',
        variant: 'destructive',
      });
      return;
    }
    
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    setDeletingId(id);
    try {
      await deleteBlogPost(id);
      // Update the posts list by filtering out the deleted post
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting post:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete post';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Safe filter that handles potential undefined/null values
  const filteredPosts = (posts || []).filter(post => {
    if (!post) return false;
    const search = searchTerm.toLowerCase();
    return (
      (post.title || '').toLowerCase().includes(search) ||
      (post.excerpt || '').toLowerCase().includes(search) ||
      (post.content || '').toLowerCase().includes(search) ||
      (post.author && typeof post.author === 'object' && 
       'username' in post.author && 
       String(post.author.username || '').toLowerCase().includes(search))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            {/* Add filters here */}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/posts/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.excerpt.substring(0, 100)}...
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === 'published'
                        ? 'default'
                        : post.status === 'draft'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{post.updated_at ? new Date(post.updated_at).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="font-mono text-sm">{post.slug || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                      disabled={deletingId === post.id}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      {deletingId === post.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
