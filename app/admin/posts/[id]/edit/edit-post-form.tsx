'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPost, updateBlogPost, getTags, createTag } from '@/lib/blog-api';
import { BlogPost, Tag } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

interface EditPostFormProps {
  postId: string;
  initialPost: BlogPost;
  categories: Array<{ id: string; name: string }>;
}

export function EditPostForm({ postId, initialPost, categories }: EditPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Partial<BlogPost>>(initialPost);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialPost.categories?.map(c => c.id) || []
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialPost.tags?.map(t => t.id) || []
  );

  useEffect(() => {
    // Fetch available tags
    const fetchTags = async () => {
      try {
        const tags = await getTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tags',
          variant: 'destructive',
        });
      }
    };

    fetchTags();
  }, [toast]);

  // Update form data when initialPost changes
  useEffect(() => {
    setPost(initialPost);
    setSelectedCategoryIds(initialPost.categories?.map(c => c.id) || []);
    setSelectedTagIds(initialPost.tags?.map(t => t.id) || []);
  }, [initialPost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      return newSelection;
    });
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => {
      const newSelection = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      
      return newSelection;
    });
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      const newTagData = await createTag(newTag.trim());
      setAvailableTags(prev => [...prev, newTagData]);
      setSelectedTagIds(prev => [...prev, newTagData.id]);
      setNewTag('');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new tag',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    setIsLoading(true);
    
    try {
      // Only include the fields that the backend expects
      const updateData = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        status: post.status || 'draft',
        slug: post.slug,
        featured_image: post.featured_image,
        seo_title: post.seo_title || undefined,
        seo_description: post.seo_description || undefined,
        seo_keywords: post.seo_keywords || undefined,
        categories: selectedCategoryIds, // Just send the array of category IDs
        // Tags are excluded until backend supports them
      };

      console.log('Updating post with data:', updateData);
      const updatedPost = await updateBlogPost(postId, updateData);
      
      toast({
        title: 'Success',
        description: 'Post updated successfully',
      });
      
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      let errorMessage = 'Failed to update post';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTagsSection = () => (
    <div>
      <Label>Tags</Label>
      <div className="flex flex-wrap gap-2 mt-2 mb-2">
        {availableTags?.map(tag => (
          <Button
            key={tag.id}
            type="button"
            variant={selectedTagIds.includes(tag.id) ? 'default' : 'outline'}
            onClick={() => handleTagToggle(tag.id)}
            className="rounded-full"
          >
            {tag.name}
          </Button>
        )) || <p className="text-sm text-muted-foreground">Loading tags...</p>}
      </div>
      <div className="flex gap-2 mt-2">
        <Input
          placeholder="New tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTag())}
        />
        <Button 
          type="button" 
          onClick={handleAddNewTag}
          variant="outline"
        >
          Add Tag
        </Button>
      </div>
    </div>
  );

  if (!post) {
    return <div>Loading post data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={post.title || ''}
          onChange={handleChange}
          required
        />
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={post.slug || ''}
          onChange={handleChange}
          required
        />
      </div>

      {/* Excerpt */}
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={post.excerpt || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={post.content || ''}
          onChange={handleChange}
          rows={10}
          className="font-mono"
          required
        />
      </div>

      {/* Categories */}
      <div>
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map(category => (
            <Button
              key={category.id}
              type="button"
              variant={selectedCategoryIds.includes(category.id) ? 'default' : 'outline'}
              onClick={() => handleCategoryToggle(category.id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {renderTagsSection()}

      {/* Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={post.status === 'published'}
          onCheckedChange={(checked) => 
            setPost(prev => ({
              ...prev,
              status: checked ? 'published' : 'draft'
            }))
          }
        />
        <Label htmlFor="status">
          {post.status === 'published' ? 'Published' : 'Draft'}
        </Label>
      </div>

      {/* Featured */}
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={post.featured || false}
          onCheckedChange={(checked) => 
            setPost(prev => ({
              ...prev,
              featured: checked
            }))
          }
        />
        <Label htmlFor="featured">Featured</Label>
      </div>

      {/* Allow Comments */}
      <div className="flex items-center space-x-2">
        <Switch
          id="allowComments"
          checked={post.allowComments !== false}
          onCheckedChange={(checked) => 
            setPost(prev => ({
              ...prev,
              allowComments: checked
            }))
          }
        />
        <Label htmlFor="allowComments">Allow Comments</Label>
      </div>

      {/* Meta Title */}
      <div>
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input
          id="metaTitle"
          name="metaTitle"
          value={post.metaTitle || ''}
          onChange={handleChange}
        />
      </div>

      {/* Meta Description */}
      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          name="metaDescription"
          value={post.metaDescription || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>

      {/* Canonical URL */}
      <div>
        <Label htmlFor="canonicalUrl">Canonical URL</Label>
        <Input
          id="canonicalUrl"
          name="canonicalUrl"
          type="url"
          value={post.canonicalUrl || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
