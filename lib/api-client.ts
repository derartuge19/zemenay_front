// API Client for NestJS Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  status: 'draft' | 'published';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at?: string;
  updated_at?: string;
  author_id: string;
  slug?: string;
  tags?: Tag[];
  author?: User;
  categories?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  posts_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  posts_count?: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

// Renamed from ApiError to IApiError to avoid naming conflict
export interface IApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Error class for API errors
export class ApiError extends Error {
  status: number;
  errors?: any;
  details?: any;
  
  constructor(message: string, status: number, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    
    // Capture the full error details for debugging
    this.details = {
      message,
      status,
      errors,
      timestamp: new Date().toISOString(),
    };
    
    // Ensure the stack trace is captured
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
    
    // Log the error for debugging
    console.error('API Error:', {
      name: this.name,
      message: this.message,
      status: this.status,
      errors: this.errors,
      stack: this.stack,
    });
  }
  
  // Helper to create an ApiError from a fetch response
  static async fromResponse(response: Response): Promise<ApiError> {
    try {
      const data = await response.json();
      return new ApiError(
        data.message || response.statusText || 'An error occurred',
        response.status,
        data.errors || data
      );
    } catch (e) {
      return new ApiError(
        response.statusText || 'An error occurred',
        response.status,
        { message: 'Failed to parse error response' }
      );
    }
  }
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        this.accessToken = token;
        console.log('API Client: Token initialized from localStorage');
      }
    }
  }

  setToken(token: string | null) {
    this.accessToken = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      console.log('API Client: Token set in localStorage');
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      console.log('API Client: Token removed from localStorage');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    });

    // Add authorization header if token exists
    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    try {
      console.log(`Making ${options.method || 'GET'} request to:`, url);
      console.log('Request headers:', Object.fromEntries(headers.entries()));
      console.log('Request body:', options.body);
      
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      console.log('Response status:', response.status, response.statusText);
      
      // Handle 204 No Content
      if (response.status === 204) {
        return null as unknown as T;
      }

      // Try to parse the response as JSON, but handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
          console.log('Response data (JSON):', data);
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          const text = await response.text();
          console.error('Response text:', text);
          throw new ApiError(
            'Invalid JSON response from server',
            response.status,
            { responseText: text }
          );
        }
      } else {
        const text = await response.text();
        console.log('Response text (non-JSON):', text);
        data = { message: text };
      }

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url,
          response: data,
          headers: Object.fromEntries(response.headers.entries()),
        });
        
        throw new ApiError(
          data.message || response.statusText || 'An error occurred',
          response.status,
          data.errors || data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Network error:', error);
      throw new ApiError('Network error', 0);
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    username: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(response.access_token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Posts methods
  async getPosts(params?: {
    page?: number;
    limit?: number;
    status?: 'draft' | 'published';
    author_id?: string;
    categoryId?: string;
  }): Promise<{ data: BlogPost[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.author_id) query.append('author_id', params.author_id);
    if (params?.categoryId) query.append('categoryId', params.categoryId);

    return this.request<{ data: BlogPost[]; total: number }>(
      `/posts?${query.toString()}`
    );
  }

  async getPost(id: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/posts/${id}`);
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/posts/slug/${slug}`);
  }

  async createPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    return this.request<BlogPost>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(
    id: string,
    updates: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<BlogPost> {
    console.log('Original updates:', JSON.stringify(updates, null, 2));
    
    // Transform the updates to match the backend's expected format
    const transformedUpdates: any = { ...updates };
    
    // Handle tags - ensure it's an array of strings (IDs)
    if (updates.tags) {
      transformedUpdates.tags = updates.tags.map(tag => {
        if (typeof tag === 'string') return tag;
        return tag.id;
      });
      console.log('Transformed tags:', transformedUpdates.tags);
    }
    
    // Handle categories - ensure it's an array of strings (IDs)
    if (updates.categories) {
      transformedUpdates.categories = updates.categories.map(cat => {
        if (typeof cat === 'string') return cat;
        return cat.id;
      });
      console.log('Transformed categories:', transformedUpdates.categories);
    }
    
    // Ensure we're not sending undefined or null values
    Object.keys(transformedUpdates).forEach(key => {
      if (transformedUpdates[key] === undefined || transformedUpdates[key] === null) {
        delete transformedUpdates[key];
      }
    });
    
    console.log('Sending transformed update:', JSON.stringify(transformedUpdates, null, 2));
    
    return this.request<BlogPost>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformedUpdates),
    });
  }

  async deletePost(id: string): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(data: any): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Tags methods
  async getTags(): Promise<Tag[]> {
    const response = await this.request<{ data: Tag[] }>('/tags');
    return response.data;
  }

  async createTag(name: string): Promise<Tag> {
    return this.request<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Users methods
  async getUsers(): Promise<User[]> {
    const response = await this.request<User[]>('/users');
    return response;
  }

  async createUser(userData: {
    email: string;
    username: string;
    password: string;
    role: string;
  }): Promise<User> {
    // Transform the data to match backend's expected format
    const requestData = {
      email: userData.email,
      name: userData.username, // Map username to name
      password: userData.password,
      role: userData.role,
    };

    try {
      return await this.request<User>('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw to be handled by the component
    }
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload
  async uploadFile(file: File, folder: string = 'uploads'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Create headers object
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // Add auth token if available
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    // Remove /api from the URL since the backend doesn't use it
    const baseUrl = this.baseURL.replace('/api', '');
    
    // Use fetch directly to avoid the request wrapper which might be causing issues
    const response = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: formData,
      headers,
      credentials: 'include', // Important for sending cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Failed to upload file',
        response.status,
        errorData.errors
      );
    }

    return response.json();
  }

  // Analytics methods
  async getDashboardStats() {
    try {
      console.log('Fetching dashboard stats from:', `${this.baseURL}/analytics/dashboard`);
      
      const response = await fetch(`${this.baseURL}/analytics/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Dashboard stats error:', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`Failed to fetch dashboard stats: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dashboard stats response:', data);
      
      return {
        totalPosts: data.totalPosts || 0,
        totalUsers: data.totalUsers || 0,
        totalViews: data.totalViews || 0,
        averageViews: data.averageViews || 0,
        popularPosts: data.popularPosts || [],
        recentPosts: data.recentPosts || [],
        postsByStatus: data.postsByStatus || [],
        monthlyStats: data.monthlyStats || []
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual functions for convenience
export const {
  login,
  register,
  logout,
  getCurrentUser,
  getPosts,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getTags,
  createTag,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadFile,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getDashboardStats,
} = apiClient as unknown as {
  [key: string]: any;
};
