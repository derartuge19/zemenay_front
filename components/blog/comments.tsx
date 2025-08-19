"use client";

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Reply } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author_name: string;
  author_id?: string;
  author_avatar?: string;
  created_at: string;
  updated_at?: string;
  replies?: Comment[];
  post_id: string;
  is_approved?: boolean;
}

interface CommentsProps {
  postId: string;
  isAdmin?: boolean;
}

export function Comments({ postId, isAdmin = false }: CommentsProps) {
  const { user, session, isLoading: isAuthLoading } = useAuth();
  const isAuthenticated = !!session?.access_token;
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch comments for this post
  useEffect(() => {
    if (!postId) return;
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments`);
      url.searchParams.append('postId', postId);
      if (isAdmin) {
        url.searchParams.append('admin', 'true');
      }

      const response = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments`;
      const method = editingComment ? 'PUT' : 'POST';
      const endpoint = editingComment ? `${url}/${editingComment.id}` : url;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newComment,
          post_id: postId,
          author_id: user?.id,
          author_name: user?.name || user?.username || 'Anonymous',
          author_email: user?.email,
          author_avatar: user?.avatar_url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post comment');
      }

      toast({
        title: 'Success',
        description: editingComment ? 'Comment updated successfully' : 'Comment posted successfully',
      });
      
      setNewComment('');
      setEditingComment(null);
      await fetchComments();
      
    } catch (error) {
      console.error('Error posting comment:', error);
      setError(error instanceof Error ? error.message : 'Failed to post comment');
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });

      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const toggleApprove = async (comment: Comment) => {
    if (!isAdmin) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/comments/${comment.id}/approve`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          credentials: 'include',
          body: JSON.stringify({
            is_approved: !comment.is_approved
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update comment status');
      }

      toast({
        title: 'Success',
        description: comment.is_approved ? 'Comment unapproved' : 'Comment approved',
      });

      await fetchComments();
    } catch (error) {
      console.error('Error updating comment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment status',
        variant: 'destructive',
      });
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setNewComment(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
    setNewComment('');
  };

  const renderCommentActions = (comment: Comment) => {
    const isCommentAuthor = user?.id === comment.author_id;
    const canEdit = isCommentAuthor || isAdmin;
    const canDelete = isCommentAuthor || isAdmin;
    const canApprove = isAdmin;

    if (!canEdit && !canDelete && !canApprove) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canEdit && (
            <DropdownMenuItem onClick={() => startEdit(comment)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}
          {canApprove && (
            <DropdownMenuItem onClick={() => toggleApprove(comment)}>
              <span>{comment.is_approved ? 'Unapprove' : 'Approve'}</span>
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => {
                setCommentToDelete(comment.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderComment = (comment: Comment) => (
    <div 
      key={comment.id} 
      className={`p-4 rounded-lg mb-4 ${!comment.is_approved && isAdmin ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-card'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author_avatar} />
            <AvatarFallback>{comment.author_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{comment.author_name}</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              {comment.updated_at && comment.updated_at !== comment.created_at && ' (edited)'}
              {!comment.is_approved && isAdmin && ' • Pending Approval'}
            </div>
          </div>
        </div>
        {isAuthenticated && renderCommentActions(comment)}
      </div>
      <div className="mt-3 pl-11">
        <p className="whitespace-pre-line">{comment.content}</p>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-muted">
          {comment.replies.map(reply => renderComment(reply))}
        </div>
      )}
    </div>
  );

  const renderCommentForm = () => (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={editingComment ? 'Edit your comment...' : 'Share your thoughts...'}
          className="min-h-[100px] mb-4"
          disabled={isSubmitting}
        />
        {!isAuthenticated && (
          <div 
            className="absolute inset-0 bg-background/80 dark:bg-background/90 rounded-md flex items-center justify-center cursor-pointer"
            onClick={() => router.push('/login')}
          >
            <span className="text-muted-foreground">Sign in to comment</span>
          </div>
        )}
      </div>
      {isAuthenticated && (
        <div className="flex justify-end space-x-2">
          {editingComment && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={cancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting 
              ? (editingComment ? 'Updating...' : 'Posting...') 
              : (editingComment ? 'Update Comment' : 'Post Comment')}
          </Button>
        </div>
      )}
    </form>
  );

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
        <div className="h-20 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {renderCommentForm()}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => commentToDelete && handleDelete(commentToDelete)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
