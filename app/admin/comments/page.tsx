'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Trash2, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AdminCommentsPage() {
  const { user, isAdmin, setUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [comments, setComments] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'approved' | 'pending'
  >('all');
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
    if (!isAdmin) return;

    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const queryParams = new URLSearchParams();

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        if (statusFilter !== 'all') queryParams.append('status', statusFilter);
        if (searchQuery) queryParams.append('search', searchQuery);

        const url = `${baseUrl}/comments/admin?${queryParams.toString()}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401) {
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
      } catch (err: unknown) {
        console.error('Error fetching comments:', err);
        const message =
          err instanceof Error ? err.message : 'Failed to load comments';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => fetchComments(), 100);
    return () => clearTimeout(timer);
  }, [isAdmin, page, limit, statusFilter, searchQuery, router, setUser]);

  const toggleCommentSelection = (commentId: string) => {
    const newSelection = new Set(selectedComments);
    newSelection.has(commentId)
      ? newSelection.delete(commentId)
      : newSelection.add(commentId);
    setSelectedComments(newSelection);
  };

  const toggleSelectAll = () => {
    selectedComments.size === comments.length
      ? setSelectedComments(new Set())
      : setSelectedComments(new Set(comments.map((c) => c.id)));
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            commentIds: Array.from(selectedComments),
            action,
          }),
        },
      );

      if (!response.ok) throw new Error(`Failed to ${action} comments`);

      // Refresh comments
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments/admin`,
      );
      const refreshResponse = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setComments(Array.isArray(data?.data) ? data.data : []);
      }

      toast({
        title: 'Success',
        description: `Successfully ${action}d ${selectedComments.size} comment(s)`,
      });
      setSelectedComments(new Set());
    } catch (err: unknown) {
      console.error(`Error performing bulk ${action}:`, err);
      const message =
        err instanceof Error ? err.message : `Failed to ${action} comments`;
      toast({
        title: 'Error',
        description: message,
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ is_approved: !currentStatus }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update comment status');
      }

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, is_approved: !currentStatus } : c,
        ),
      );

      toast({
        title: 'Success',
        description: `Comment ${currentStatus ? 'unapproved' : 'approved'}`,
      });
    } catch (err: unknown) {
      console.error('Error updating comment status:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to update comment status';
      toast({
        title: 'Error',
        description: message,
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setSelectedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });

      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });
    } catch (err: unknown) {
      console.error('Error deleting comment:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to delete comment';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  const filteredComments = comments.filter((comment) => {
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
      {/* Filters, Actions, Table */}
      {/* ... keep your existing JSX as-is ... */}
    </div>
  );
}
