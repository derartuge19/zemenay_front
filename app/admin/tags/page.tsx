'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with actual API call
const tags = [
  { id: '1', name: 'nextjs', slug: 'nextjs', description: 'Next.js framework', postCount: 24 },
  { id: '2', name: 'react', slug: 'react', description: 'React library', postCount: 42 },
  { id: '3', name: 'typescript', slug: 'typescript', description: 'TypeScript language', postCount: 18 },
  { id: '4', name: 'javascript', slug: 'javascript', description: 'JavaScript language', postCount: 37 },
  { id: '5', name: 'tailwind', slug: 'tailwind', description: 'Tailwind CSS framework', postCount: 15 },
];

export default function TagsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'name',
    direction: 'asc',
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the tag "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      console.log('Deleting tag:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Tag deleted',
        description: `The tag "${name}" has been successfully deleted.`,
      });
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: 'Error',
        description: 'There was an error deleting the tag. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Filter and sort tags
  const filteredTags = tags
    .filter(tag => 
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      
      if (aValue === bValue) return 0;
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-muted-foreground">Manage your blog tags</p>
        </div>
        <Button asChild>
          <Link href="/admin/tags/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Tag
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tags..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:bg-accent"
                onClick={() => handleSort('postCount')}
              >
                <div className="flex items-center justify-end">
                  Posts
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/tags/${tag.id}`} className="hover:underline">
                      {tag.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {tag.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tag.description || 'No description'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {tag.postCount} {tag.postCount === 1 ? 'post' : 'posts'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/tags/${tag.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(tag.id, tag.name)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm ? (
                    <div className="space-y-2">
                      <p>No tags found matching "{searchTerm}"</p>
                      <Button variant="outline" onClick={() => setSearchTerm('')}>
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    'No tags found. Create your first tag.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
