'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface BlogCategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  className?: string;
}

export function BlogCategoryFilter({ 
  categories, 
  selectedCategoryId,
  onCategorySelect,
  className 
}: BlogCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    
    // Reset pagination if needed
    params.delete('page');
    
    // Update the URL without causing a full page reload
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Button
        variant={!selectedCategoryId ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategorySelect(null)}
        className="rounded-full"
      >
        All Categories
      </Button>
      
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategorySelect(category.id)}
          className="rounded-full"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
