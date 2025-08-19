# Zemenay Blog System 🚀

A professional, plug-and-play blog system built for Next.js applications. Developed for Zemenay Tech Solutions hackathon.

## ✨ Features

### Core Blog Features
- ✅ Rich text editor with media embedding
- ✅ Image upload and optimization
- ✅ Categories and tags system
- ✅ Advanced search functionality  
- ✅ SEO optimization with meta tags
- ✅ Comment system with moderation
- ✅ Social sharing integration
- ✅ Reading time estimation
- ✅ Author profiles and bios

### Admin Features
- ✅ Complete admin dashboard
- ✅ Content scheduling
- ✅ Draft/publish workflow
- ✅ Analytics and insights
- ✅ User management
- ✅ Content moderation tools

### Technical Features
- ✅ TypeScript for type safety
- ✅ Supabase backend integration
- ✅ Real-time updates
- ✅ RSS feed generation
- ✅ Dark/light mode support
- ✅ Mobile-responsive design
- ✅ Performance optimized

## 🚀 Quick Start

### Installation

```bash
npm install @zemenay/blog-system
# or
yarn add @zemenay/blog-system
```

### Setup

1. **Database Setup**
   - Create a Supabase project
   - Run the provided migrations
   - Configure environment variables

2. **Integration**
   ```jsx
   import { BlogSystem } from '@zemenay/blog-system';
   
   export default function BlogPage() {
     return <BlogSystem />;
   }
   ```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📁 Project Structure

```
├── components/
│   ├── blog/              # Blog components
│   ├── admin/             # Admin dashboard
│   ├── ui/                # Shared UI components
│   └── layout/            # Layout components
├── lib/
│   ├── supabase/          # Database client
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── app/
│   ├── blog/              # Blog pages
│   ├── admin/             # Admin pages
│   └── api/               # API routes
└── database/
    └── migrations/        # Database migrations
```

## 🎨 Customization

### Brand Colors
The system uses Zemenay's deep green brand colors:
- Primary: `#064e3b` (Deep Forest Green)
- Secondary: `#047857` (Emerald Green)
- Accent: `#065f46` (Pine Green)

### Components
All components are fully customizable and built with Tailwind CSS and shadcn/ui.

## 📊 Analytics & SEO

- Built-in analytics dashboard
- Google Analytics integration
- SEO-optimized meta tags
- Open Graph support
- Schema.org structured data
- RSS feed generation

## 🔧 API Reference

### Blog Posts
```typescript
// Get all posts
const posts = await getBlogPosts();

// Get single post
const post = await getBlogPost(slug);

// Create post (admin)
const newPost = await createBlogPost(data);
```

### Categories & Tags
```typescript
// Get categories
const categories = await getCategories();

// Get posts by category
const posts = await getPostsByCategory(categoryId);
```

## 🔐 Authentication & Security

- Supabase Auth integration
- Role-based access control
- Content moderation
- Spam protection
- Rate limiting

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t zemenay-blog .
docker run -p 3000:3000 zemenay-blog
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

For support and questions:
- Email: support@zemenaytech.com
- Issues: [GitHub Issues](https://github.com/zemenaytech/blog-system/issues)
- Docs: [Documentation](https://blog-system.zemenaytech.com/docs)

## 🎯 Hackathon Achievement

Built during the Zemenay Tech Solutions Open Hackathon 2024, solving the key bottleneck in blog system integration for faster website development.

---

**Made with ❤️ by Zemenay Tech Solutions**