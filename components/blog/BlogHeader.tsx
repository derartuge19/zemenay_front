'use client';

import { Search, Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface BlogHeaderProps {
  onSearch?: (query: string) => void;
  categories?: Array<{ id: string; name: string; slug: string; color: string }>;
  onCategoryFilter?: (category: string | null) => void;
  selectedCategory?: string | null;
}

export function BlogHeader({ 
  onSearch, 
  categories = [], 
  onCategoryFilter, 
  selectedCategory 
}: BlogHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                Zemenay Blog
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={!selectedCategory ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryFilter?.(null)}
              className={!selectedCategory ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              All Posts
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onCategoryFilter?.(category.slug)}
                className={selectedCategory === category.slug ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                {category.name}
              </Button>
            ))}
          </nav>

          {/* Search and Theme Toggle */}
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-8"
                />
              </div>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Search
              </Button>
            </form>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t md:hidden">
            <div className="space-y-2 px-2 py-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Search
                </Button>
              </form>

              {/* Mobile Categories */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant={!selectedCategory ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onCategoryFilter?.(null)}
                  className={!selectedCategory ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  All Posts
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.slug ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onCategoryFilter?.(category.slug)}
                    className={selectedCategory === category.slug ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}