import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function BlogFooter() {
  return (
    <footer className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <h3 className="text-xl font-bold">Zemenay Tech</h3>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Innovating the future of technology with cutting-edge solutions and expert insights. 
              Building tomorrow's digital experiences today.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" className="text-emerald-100 hover:text-white hover:bg-emerald-800">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-emerald-100 hover:text-white hover:bg-emerald-800">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-emerald-100 hover:text-white hover:bg-emerald-800">
                <Github className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-emerald-100 hover:text-white hover:bg-emerald-800">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-emerald-100 hover:text-white transition-colors">
                  All Posts
                </Link>
              </li>
              <li>
                <Link href="/blog/category/technology" className="text-emerald-100 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/blog/category/business" className="text-emerald-100 hover:text-white transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/blog/category/design" className="text-emerald-100 hover:text-white transition-colors">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-emerald-100 hover:text-white transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-emerald-100 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-emerald-100 hover:text-white transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-emerald-100 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/blog/rss" className="text-emerald-100 hover:text-white transition-colors flex items-center space-x-1">
                  <Rss className="w-3 h-3" />
                  <span>RSS Feed</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-emerald-100 text-sm">
              Subscribe to our newsletter for the latest insights and updates.
            </p>
            <form className="space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-emerald-800 border-emerald-700 text-white placeholder:text-emerald-200 focus:border-emerald-500"
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-emerald-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-emerald-100">
          <p>&copy; 2024 Zemenay Tech Solutions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}