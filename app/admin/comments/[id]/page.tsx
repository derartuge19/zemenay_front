'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Calendar, MessageSquare, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockComment = {
  id: '1',
  author: 'John Doe',
  email: 'john@example.com',
  content: 'This is a great post about Next.js 14 features!',
  status: 'approved',
  postTitle: 'Getting Started with Next.js 14',
  postId: '1',
  createdAt: '2024-01-20T14:30:00Z',
  ipAddress: '192.168.1.1'
};

type CommentStatus = 'approved' | 'pending' | 'spam' | 'trash';

export default function CommentDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment] = useState(mockComment);

  useEffect(() => {
    setEditedContent(comment.content);
  }, [comment.content]);

  const handleStatusUpdate = async (newStatus: CommentStatus) => {
    try {
      setIsSubmitting(true);
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 300));
      toast({ title: 'Comment updated', description: `Status updated to ${newStatus}.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;
    try {
      setIsSubmitting(true);
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsEditing(false);
      toast({ title: 'Success', description: 'Comment updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Save failed', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Move to trash?')) return;
    try {
      setIsSubmitting(true);
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 300));
      toast({ title: 'Moved to trash' });
      router.push('/admin/comments');
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold mt-2">Comment Details</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isSubmitting}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Trash
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{comment.author}</h3>
                <Badge variant={comment.status === 'approved' ? 'default' : 'secondary'}>
                  {comment.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1" />
                {comment.email}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <p>{comment.content}</p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(comment.createdAt)}
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <a href={`/posts/${comment.postId}`} className="text-blue-600 hover:underline">
                  {comment.postTitle}
                </a>
              </span>
              <span>IP: {comment.ipAddress}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
