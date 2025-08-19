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
import { createBlogPost, createTag, getTags, getCategories } from '@/lib/blog-api';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  featured_image?: string;
  slug?: string;
  categories?: string[];
  featured?: boolean;
  allowComments?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

// Mock tags - replace with actual API call if needed
const allTags = [
  'nextjs', 'react', 'typescript', 'javascript', 'tailwind', 'nodejs', 'webdev', 'beginners'
];

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    featured: false,
    allowComments: true,
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    categories: []
  });

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategories();
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [toast]);

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      // Update form data with the new category selection
      setFormData(prev => ({
        ...prev,
        categories: newSelection,
      }));
      
      return newSelection;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Check file type
    if (!file.type.match('image.*')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    setFeaturedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setPreviewImage(null);
    // Clear the file input
    const fileInput = document.getElementById('featured-image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !selectedTags.includes(tag) && tag.length <= 20) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = formData.featured_image;
      
      // Handle image upload if a new image is selected
      if (featuredImage) {
        try {
          // Upload the image first
          const uploadResponse = await apiClient.uploadFile(featuredImage, 'blog');
          imageUrl = uploadResponse.url;
          console.log('Image uploaded successfully:', imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: 'Error',
            description: 'Failed to upload featured image. Please try again.',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare post data with the uploaded image URL
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || '',
        status: formData.status || 'draft',
        slug: formData.slug || generateSlug(formData.title),
        featured_image: imageUrl || undefined,
        seo_title: formData.metaTitle || undefined,
        seo_description: formData.metaDescription || undefined,
        seo_keywords: formData.seo_keywords || undefined,
        categories: [...selectedCategoryIds],
        featured: formData.featured || false,
        allow_comments: formData.allowComments !== false,
      };
      
      console.log('Creating post with data:', postData);
      await createBlogPost(postData);
      
      toast({
        title: 'Success!',
        description: 'Your post has been created successfully.',
      });
      
      // Redirect to posts list
      router.push('/admin/posts');
      
    } catch (error) {
      console.error('Error creating post:', error);
      
      let errorMessage = 'Failed to create post';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <h1 className="text-2xl font-bold">New Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a new blog post
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              console.log('🔍 Debug Info:');
              console.log('User:', user);
              console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
              console.log('Form Data:', formData);
              alert(`User: ${user ? 'Logged in' : 'Not logged in'}\nAPI URL: ${process.env.NEXT_PUBLIC_API_URL || 'Not set'}`);
            }}
            variant="outline"
            className="ml-2"
          >
            Debug Info
          </Button>
          <Button 
            type="submit" 
            form="post-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : formData.status === 'draft' ? (
              'Save Draft'
            ) : (
              'Publish Post'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => {
                      handleChange(e);
                      // Auto-generate slug when title changes
                      if (!formData.slug || formData.slug === generateSlug(formData.title)) {
                        setFormData(prev => ({
                          ...prev,
                          slug: generateSlug(e.target.value),
                        }));
                      }
                    }}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="post-url-slug"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    The slug is used in the URL. Only letters, numbers, and hyphens are allowed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="A brief summary of your post"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    A short excerpt that appears on the blog listing page.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your post content here..."
                    rows={10}
                    className="font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports Markdown formatting.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {previewImage ? (
                  <div className="relative group">
                    <img
                      src={previewImage}
                      alt="Featured preview"
                      className="rounded-lg w-full h-64 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="featured-image"
                        className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                      >
                        <span>Upload an image</span>
                        <input
                          id="featured-image"
                          name="featured-image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'draft' }));
                  // Submit the form programmatically
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                disabled={isSubmitting}
                className={formData.status === 'draft' ? 'bg-gray-100 dark:bg-gray-800' : ''}
              >
                {isSubmitting && formData.status === 'draft' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Draft'
                )}
              </Button>
              <Button 
                type="submit" 
                form="post-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : formData.status === 'published' ? (
                  'Publish Now'
                ) : (
                  'Publish'
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, featured: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="allowComments">Allow Comments</Label>
                <Switch
                  id="allowComments"
                  name="allowComments"
                  checked={formData.allowComments}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, allowComments: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {isLoadingCategories ? (
                    <div>Loading categories...</div>
                  ) : availableCategories.length > 0 ? (
                    availableCategories.map(category => (
                      <Button
                        key={category.id}
                        type="button"
                        variant={selectedCategoryIds.includes(category.id) ? 'default' : 'outline'}
                        onClick={() => toggleCategory(category.id)}
                        className="rounded-full"
                      >
                        {category.name}
                      </Button>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No categories found</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-900"
                  onClick={addTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>Popular tags: </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {allTags
                    .filter(tag => !selectedTags.includes(tag))
                    .slice(0, 5)
                    .map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!selectedTags.includes(tag)) {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="Leave empty to use post title"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 50-60 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Leave empty to use post excerpt"
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 150-160 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  name="canonicalUrl"
                  value={formData.canonicalUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/original-post"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  If this content was published elsewhere, include the original URL here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
