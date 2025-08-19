import { metadata } from './metadata';
import ClientAdminLayout from './client-layout';

export { metadata };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientAdminLayout>{children}</ClientAdminLayout>;
}