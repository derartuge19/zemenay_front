'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Tags, 
  MessageSquare, 
  Users, 
  User,
  Settings,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Posts',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderOpen,
  },
  {
    title: 'Tags',
    href: '/admin/tags',
    icon: Tags,
  },
  {
    title: 'Moderate Comments',
    href: '/admin/comments',
    icon: MessageSquare,
  },
  {
    title: 'Manage Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 h-screen w-48 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-6">
            <Link href="/admin" className="flex items-center">
              <h1 className="text-2xl font-bold text-green-500">
                
              </h1>
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-gray-900 text-green-400'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-green-400',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                  )}
                >
                  <Icon
                    className={cn(
                      isActive
                        ? 'text-green-400'
                        : 'text-gray-400 group-hover:text-green-400',
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200'
                    )}
                    aria-hidden="true"
                  />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-400" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-200">
                  Admin
                </p>
                <Link
                  href="/admin/settings"
                  className="text-xs font-medium text-gray-400 hover:text-green-400 transition-colors duration-200"
                >
                  View settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 px-6 py-4 text-xs text-gray-400">
        <p>Zemenay Blog System v1.0</p>
        <p>© 2024 Zemenay Tech Solutions</p>
      </div>
    </div>
  );
}