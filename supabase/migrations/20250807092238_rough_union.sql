/*
  # Zemenay Blog System - Database Schema

  1. New Tables
    - `authors` - Author profiles and information
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, author display name)
      - `bio` (text, author biography)
      - `avatar_url` (text, profile image URL)
      - `social_twitter`, `social_linkedin`, `social_github` (text, social links)
      - `created_at`, `updated_at` (timestamptz)
    
    - `categories` - Blog post categories
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `slug` (text, unique, URL-friendly identifier)
      - `description` (text, category description)
      - `color` (text, display color)
      - `created_at`, `updated_at` (timestamptz)
    
    - `tags` - Blog post tags
      - `id` (uuid, primary key)
      - `name` (text, tag name)
      - `slug` (text, unique, URL-friendly identifier)
      - `created_at` (timestamptz)
    
    - `blog_posts` - Main blog posts table
      - `id` (uuid, primary key)
      - `title` (text, post title)
      - `slug` (text, unique, URL-friendly identifier)
      - `content` (text, main post content)
      - `excerpt` (text, post summary)
      - `featured_image` (text, main image URL)
      - `author_id` (uuid, references authors)
      - `category_id` (uuid, references categories)
      - `status` (enum: draft, published, archived)
      - `published_at` (timestamptz)
      - `reading_time` (integer, estimated minutes)
      - `views_count`, `likes_count` (integer, analytics)
      - `seo_title`, `seo_description`, `seo_keywords` (text, SEO fields)
      - `created_at`, `updated_at` (timestamptz)
    
    - `post_tags` - Many-to-many relationship between posts and tags
      - `post_id` (uuid, references blog_posts)
      - `tag_id` (uuid, references tags)
      - `created_at` (timestamptz)
    
    - `comments` - Post comments system
      - `id` (uuid, primary key)
      - `post_id` (uuid, references blog_posts)
      - `author_name`, `author_email` (text, commenter info)
      - `content` (text, comment content)
      - `status` (enum: pending, approved, rejected)
      - `created_at`, `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for published content
    - Author access for managing own content
    - Admin access for all operations
    - Comment moderation system

  3. Indexes
    - Performance indexes on frequently queried columns
    - Full-text search indexes for content
    - Unique constraints on slugs
*/

-- Create custom types
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected');

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  bio text,
  avatar_url text,
  social_twitter text,
  social_linkedin text,
  social_github text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#047857',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text,
  author_id uuid REFERENCES authors(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status post_status DEFAULT 'draft',
  published_at timestamptz,
  reading_time integer,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  status comment_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Authors policies
CREATE POLICY "Authors are viewable by everyone"
  ON authors FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authors can update own profile"
  ON authors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create author profile"
  ON authors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true);

-- Tags policies
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (true);

-- Blog posts policies
CREATE POLICY "Published posts are viewable by everyone"
  ON blog_posts FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authors can view own posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

CREATE POLICY "Authors can create posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

CREATE POLICY "Authors can update own posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

CREATE POLICY "Authors can delete own posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

-- Post tags policies
CREATE POLICY "Post tags are viewable by everyone"
  ON post_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authors can manage post tags"
  ON post_tags FOR ALL
  TO authenticated
  USING (
    post_id IN (
      SELECT id FROM blog_posts 
      WHERE author_id IN (
        SELECT id FROM authors WHERE user_id = auth.uid()
      )
    )
  );

-- Comments policies
CREATE POLICY "Approved comments are viewable by everyone"
  ON comments FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Anyone can submit comments"
  ON comments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authors can manage comments on their posts"
  ON comments FOR UPDATE
  TO authenticated
  USING (
    post_id IN (
      SELECT id FROM blog_posts 
      WHERE author_id IN (
        SELECT id FROM authors WHERE user_id = auth.uid()
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts 
USING gin(to_tsvector('english', title || ' ' || content || ' ' || excerpt));

-- Functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_authors_updated_at 
  BEFORE UPDATE ON authors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON blog_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Technology', 'technology', 'Latest in tech and innovation', '#047857'),
  ('Business', 'business', 'Business insights and strategies', '#065f46'),
  ('Design', 'design', 'Design trends and inspiration', '#064e3b'),
  ('Development', 'development', 'Programming and development topics', '#059669')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug) VALUES
  ('JavaScript', 'javascript'),
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('TypeScript', 'typescript'),
  ('CSS', 'css'),
  ('HTML', 'html'),
  ('Node.js', 'nodejs'),
  ('Web Development', 'web-development'),
  ('Frontend', 'frontend'),
  ('Backend', 'backend')
ON CONFLICT (slug) DO NOTHING;