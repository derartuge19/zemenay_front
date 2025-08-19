export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          featured_image: string | null;
          author_id: string;
          category_id: string | null;
          status: 'draft' | 'published' | 'archived';
          published_at: string | null;
          reading_time: number | null;
          views_count: number;
          likes_count: number;
          created_at: string;
          updated_at: string;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          featured_image?: string | null;
          author_id: string;
          category_id?: string | null;
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          reading_time?: number | null;
          views_count?: number;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          featured_image?: string | null;
          author_id?: string;
          category_id?: string | null;
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          reading_time?: number | null;
          views_count?: number;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
      authors: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          bio: string | null;
          avatar_url: string | null;
          social_twitter: string | null;
          social_linkedin: string | null;
          social_github: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          bio?: string | null;
          avatar_url?: string | null;
          social_twitter?: string | null;
          social_linkedin?: string | null;
          social_github?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          social_twitter?: string | null;
          social_linkedin?: string | null;
          social_github?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_name: string;
          author_email: string;
          content: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_name: string;
          author_email: string;
          content: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_name?: string;
          author_email?: string;
          content?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Author = Database['public']['Tables']['authors']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];