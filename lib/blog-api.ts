// blog-api.ts
import { apiClient, BlogPost, Tag } from './api-client';

// Blog Post API
export const createBlogPost = async (postData: Omit<BlogPost, 'id'>) => {
  try {
    console.log('Attempting to create blog post with data:', postData);
    
    // Remove the author_id check since it's handled by the backend
    const data = await apiClient.createPost(postData);
    console.log('Successfully created blog post:', data);
    return data;
  } catch (error) {
    console.error('Error in createBlogPost:', {
      error,
      errorString: String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
  try {
    console.log('Updating blog post with ID:', id);
    console.log('Update data:', JSON.stringify(updates, null, 2));
    
    const data = await apiClient.updatePost(id, updates);
    console.log('Update successful, response:', data);
    return data;
  } catch (error: any) {
    console.error('Error updating blog post:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      // Try to extract more details from the error object
      ...(error.response && {
        response: {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        },
      }),
      // Log the complete error object
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    
    // Re-throw with more context
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update post';
    const statusCode = error.response?.status || 500;
    const apiError = new Error(errorMessage);
    apiError.name = 'BlogPostUpdateError';
    (apiError as any).status = statusCode;
    (apiError as any).originalError = error;
    
    throw apiError;
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    await apiClient.deletePost(id);
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const data = await apiClient.getPosts();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  try {
    console.log('Fetching blog post with slug:', slug);
    const data = await apiClient.getPostBySlug(slug);
    
    console.log('Raw post data:', JSON.stringify(data, null, 2));
    
    // Ensure featured_image URL is properly constructed
    if (data) {
      if (data.featured_image) {
        console.log('Original featured_image:', data.featured_image);
        if (!data.featured_image.startsWith('http')) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          data.featured_image = `${baseUrl}${data.featured_image.startsWith('/') ? '' : '/'}${data.featured_image}`;
          console.log('Processed featured_image URL:', data.featured_image);
        }
      } else {
        console.log('No featured_image found in post data');
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw error;
  }
};

// In lib/blog-api.ts
export const getAllBlogPosts = async (categoryId?: string) => {
  try {
    console.log('Fetching published blog posts...');
    
    // Fetch only published posts, optionally filtered by category
    const response = await apiClient.getPosts({ 
      status: 'published',
      limit: 100, // Get more than enough posts
      categoryId: categoryId // Add category filter if provided
    });

    // The response should be { data: BlogPost[], total: number }
    let posts = response?.data || [];
    
    // If for some reason data is not in response.data, try direct access
    if (!posts.length && Array.isArray(response)) {
      posts = response;
    }

    // Ensure we only return published posts (double check)
    const publishedPosts = posts.filter(post => post.status === 'published');
    
    // Ensure featured_image URLs are properly constructed
    const postsWithFixedUrls = publishedPosts.map(post => ({
      ...post,
      featured_image: post.featured_image 
        ? post.featured_image.startsWith('http')
          ? post.featured_image 
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${post.featured_image.startsWith('/') ? '' : '/'}${post.featured_image}`
        : null
    }));
    
    console.log(`Found ${postsWithFixedUrls.length} published posts`);
    return postsWithFixedUrls;
    
  } catch (error) {
    console.error('Error in getAllBlogPosts:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return []; // Return empty array on error
  }
};

export const getRelatedPosts = async (currentPostId: string, categoryId: string, limit: number = 3): Promise<BlogPost[]> => {
  try {
    // First get all posts in the same category
    const postsInCategory = await apiClient.getPosts({ 
      categoryId,
      status: 'published',
      limit: limit + 1 // Get one extra to account for the current post
    });

    // Filter out the current post and limit the results
    const related = postsInCategory
      .filter((post: BlogPost) => post.id !== currentPostId)
      .slice(0, limit);

    return related;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};

// Tags API
export const getTags = async () => {
  try {
    const data = await apiClient.getTags();
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const createTag = async (name: string) => {
  try {
    const data = await apiClient.createTag(name);
    return data;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

// Post Tags API - This would need to be implemented in the backend
export const addTagToPost = async (postId: string, tagId: string) => {
  try {
    // This endpoint would need to be added to the backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ tagId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding tag to post:', error);
    throw error;
  }
};

// Categories API
export const getCategories = async (): Promise<any[]> => {
  try {
    return await apiClient.getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getPostsByCategory = async (categoryId: string): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?categoryId=${categoryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts by category: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error);
    throw error;
  }
};

// Export all functions
export default {
  // Blog Posts
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPost,
  getPosts,
  getAllBlogPosts,
  getRelatedPosts,
  
  // Tags
  getTags,
  createTag,
  
  // Post Tags
  addTagToPost,
  
  // Categories
  getCategories,
  getPostsByCategory,
};
