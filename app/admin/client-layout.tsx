'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AuthProvider } from '@/lib/auth-context';

export default function ClientAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide any existing footer in admin panel
  if (typeof window !== 'undefined') {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  }

  return (
    <AuthProvider>
      <div className="flex h-screen bg-black text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader title="Dashboard" />
          <main className="flex-1 overflow-y-auto bg-black pl-48 pt-20">
            <div className="w-full max-w-full px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
