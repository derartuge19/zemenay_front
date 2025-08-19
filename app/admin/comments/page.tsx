'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Trash2, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AdminCommentsPage() {
  const { user, isAdmin, setUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [comments, setComments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin && user !== null) {
      router.push('/admin');
    }
  }, [isAdmin, user, router]);

  // Fetch comments
  useEffect(() => {
    if (!isAdmin) {
      console.log('User is not an admin, skipping comments fetch');
      return;
    }
    
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const queryParams = new URLSearchParams();
        
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Add pagination parameters
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        // Add status filter if not 'all'
        if (statusFilter !== 'all') {
          queryParams.append('status', statusFilter);
        }

        // Add search query if provided
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }

        const url = `${baseUrl}/comments/admin?${queryParams.toString()}`;
        console.log('Fetching comments from:', url);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            url,
            headers: Object.fromEntries(response.headers.entries())
          });
          
          if (response.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('token');
            setUser(null);
            router.push('/login');
            return;
          }
          
          throw new Error(errorData.message || 'Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data.data || []);
        setTotalItems(data.total || 0);
      } catch (error) {
        console.error('Error fetching comments:', error);
        if (error instanceof Error) {
          if (error.message.includes('uuid')) {
            console.error('UUID validation error - possible invalid format in request');
          }
        }
        setError(error.message || 'Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent rapid firing
    const timer = setTimeout(() => {
      fetchComments();
    }, 100);

    return () => clearTimeout(timer);
  }, [isAdmin, page, limit, statusFilter, searchQuery, router, setUser]);

  const toggleCommentSelection = (commentId: string) => {
    const newSelection = new Set(selectedComments);
    if (newSelection.has(commentId)) {
      newSelection.delete(commentId);
    } else {
      newSelection.add(commentId);
    }
    setSelectedComments(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedComments.size === comments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(comments.map((c: any) => c.id)));
    }
  };

  const performBulkAction = async (action: 'approve' | 'delete') => {
    if (selectedComments.size === 0) return;

    try {
      setIsBulkActionLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/comments/bulk`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            commentIds: Array.from(selectedComments),
            action,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} comments`);
      }

      // Refresh comments
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments/admin`);
      const refreshResponse = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setComments(Array.isArray(data?.data) ? data.data : []);
      }

      setSelectedComments(new Set());
      toast({
        title: 'Success',
        description: `Successfully ${action}d ${selectedComments.size} comment(s)`,
      });
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} comments`,
        variant: 'destructive',
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const toggleApproval = async (commentId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments/${commentId}/approve`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            is_approved: !currentStatus,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error('Failed to update comment status');
      }

      // Update local state
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_approved: !currentStatus } 
            : comment
        )
      );

      toast({
        title: 'Success',
        description: `Comment ${currentStatus ? 'unapproved' : 'approved'}`,
      });
    } catch (error) {
      console.error('Error updating comment status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update comment status',
        variant: 'destructive',
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error('Failed to delete comment');
      }

      // Update local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      // Remove from selected comments if present
      setSelectedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });

      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      !searchQuery || 
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'approved' && comment.is_approved) ||
      (statusFilter === 'pending' && !comment.is_approved);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Comments Management</h1>
        <p className="text-muted-foreground">
          Manage and moderate user comments
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search comments..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>

          {selectedComments.size > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => performBulkAction('approve')}
                disabled={isBulkActionLoading}
              >
                {isBulkActionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve ({selectedComments.size})
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => performBulkAction('delete')}
                disabled={isBulkActionLoading}
              >
                {isBulkActionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete ({selectedComments.size})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedComments.size === comments.length && comments.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredComments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No comments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedComments.has(comment.id)}
                      onCheckedChange={() => toggleCommentSelection(comment.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    <div className="line-clamp-2">{comment.content}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Post: {comment.post?.title || 'Unknown Post'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{comment.author_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {comment.author_email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={comment.is_approved ? 'default' : 'outline'}>
                      {comment.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => toggleApproval(comment.id, comment.is_approved)}
                        >
                          {comment.is_approved ? 'Unapprove' : 'Approve'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteComment(comment.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
