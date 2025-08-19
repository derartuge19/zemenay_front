'use client';

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-black border-b border-gray-800 h-16 pl-48">
      {/* Empty header - title removed */}
    </header>
  );
}